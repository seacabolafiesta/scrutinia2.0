'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET_ERROR = 'RepoError';
const BUCKET_GOOD = 'Repositorio Actas 8F Aragon';

export interface ActaError {
  id: string;
  submission_id: string;
  acta_key: string;
  provincia: string;
  municipio: string;
  distrito_censal: string;
  seccion: string;
  mesa: string;
  votantes_total: number;
  votos_nulos: number;
  votos_blanco: number;
  censo_total_electores: number;
  censo_electores_listas: number;
  censo_certificaciones_presentadas: number;
  censo_certificaciones_alta: number;
  censo_certificaciones_correccion: number;
  votantes_censados_votaron: number;
  votantes_interventores_no_censados: number;
  human_message: string | null;
  issues: string[] | null;
  source_file_id: string | null;
  renamed_file: string | null;
  created_at: string;
}

export interface VotoError {
  party_id: string;
  votos: number;
}

export interface MesaSugerida {
  id: string;
  provincia: string;
  municipio: string;
  distrito: string;
  seccion: string;
  mesa: string;
  codigo_unico: string;
}

export function useAdminActasError() {
  const supabase = createClient();

  const [actasError, setActasError] = useState<ActaError[]>([]);
  const [actasDefinitivasCount, setActasDefinitivasCount] = useState<number>(0);
  const [selectedActa, setSelectedActa] = useState<ActaError | null>(null);
  const [votos, setVotos] = useState<VotoError[]>([]);
  const [mesasSugeridas, setMesasSugeridas] = useState<MesaSugerida[]>([]);
  const [actaImageUrl, setActaImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch all error actas
  const fetchActasError = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('scrutinia_actas_error_2')
      .select('*')
      .order('created_at', { ascending: false });

    setActasError((data as ActaError[]) || []);
    setIsLoading(false);
  }, [supabase]);

  // Fetch count of definitive actas
  const fetchActasDefinitivasCount = useCallback(async () => {
    const { count } = await supabase
      .from('scrutinia_actas_2')
      .select('*', { count: 'exact', head: true });
    
    setActasDefinitivasCount(count || 0);
  }, [supabase]);

  useEffect(() => {
    fetchActasError();
    fetchActasDefinitivasCount();
  }, []);

  // Select an acta and load its votes + image
  const selectActa = useCallback(async (acta: ActaError) => {
    setSelectedActa(acta);
    setMessage(null);

    // Fetch votes
    const { data: votosData } = await supabase
      .from('scrutinia_actas_votos_error')
      .select('party_id, votos')
      .eq('acta_id', acta.id)
      .order('votos', { ascending: false });

    setVotos((votosData as VotoError[]) || []);

    // Build image URL from acta_key or renamed_file
    // Use renamed_file if available (contains timestamp), otherwise fallback to key construction
    const fileName = acta.renamed_file || acta.acta_key.replace(/\|/g, '_').replace(/ /g, '_') + '.jpg';
    const { data: urlData } = supabase.storage
      .from(BUCKET_ERROR)
      .getPublicUrl(fileName);

    setActaImageUrl(urlData?.publicUrl || null);
  }, [supabase]);

  // Search mesas catalog
  const buscarMesa = useCallback(async (query: string) => {
    if (query.length < 2) {
      setMesasSugeridas([]);
      return;
    }

    const { data } = await supabase
      .from('mesas')
      .select('id, provincia, municipio, distrito, seccion, mesa, codigo_unico')
      .ilike('municipio', `%${query}%`)
      .order('provincia')
      .order('municipio')
      .order('distrito')
      .order('seccion')
      .order('mesa')
      .limit(20);

    setMesasSugeridas((data as MesaSugerida[]) || []);
  }, [supabase]);

  // Update a vote locally
  const updateVoto = useCallback((partyId: string, newVotos: number) => {
    setVotos(prev => prev.map(v =>
      v.party_id === partyId ? { ...v, votos: newVotos } : v
    ));
  }, []);

  // Save vote edits to DB
  const guardarVotos = useCallback(async () => {
    if (!selectedActa) return;

    for (const v of votos) {
      await supabase
        .from('scrutinia_actas_votos_error')
        .update({ votos: v.votos })
        .eq('acta_id', selectedActa.id)
        .eq('party_id', v.party_id);
    }

    setMessage({ type: 'success', text: 'Votos guardados correctamente' });
  }, [selectedActa, votos, supabase]);

  // Update acta fields in error table
  const guardarCamposActa = useCallback(async (campos: Partial<ActaError>) => {
    if (!selectedActa) return;

    await supabase
      .from('scrutinia_actas_error_2')
      .update(campos)
      .eq('id', selectedActa.id);

    setSelectedActa(prev => prev ? { ...prev, ...campos } : null);
    setMessage({ type: 'success', text: 'Datos del acta actualizados' });
  }, [selectedActa, supabase]);

  // Migrate: call the SQL function + move image
  const migrarActa = useCallback(async (overrides?: {
    provincia?: string;
    municipio?: string;
    distrito_censal?: string;
    seccion?: string;
    mesa?: string;
    votantes_total?: number;
    votos_nulos?: number;
    votos_blanco?: number;
    censo_electores_listas?: number;
    censo_certificaciones_presentadas?: number;
    censo_certificaciones_alta?: number;
    censo_certificaciones_correccion?: number;
    censo_total_electores?: number;
    votantes_censados_votaron?: number;
    votantes_interventores_no_censados?: number;
  }) => {
    if (!selectedActa) return;

    setIsMigrating(true);
    setMessage(null);

    try {
      // First save any pending vote edits
      await guardarVotos();

      // Call the migration function
      const { data, error } = await supabase.rpc('migrar_acta_error', {
        p_error_id: selectedActa.id,
        p_provincia: overrides?.provincia || null,
        p_municipio: overrides?.municipio || null,
        p_distrito_censal: overrides?.distrito_censal || null,
        p_seccion: overrides?.seccion || null,
        p_mesa: overrides?.mesa || null,
        p_votantes_total: overrides?.votantes_total || null,
        p_votos_nulos: overrides?.votos_nulos || null,
        p_votos_blanco: overrides?.votos_blanco || null,
      });

      if (error) {
        setMessage({ type: 'error', text: `Error: ${error.message}` });
        setIsMigrating(false);
        return;
      }

      const result = data as { ok: boolean; error?: string; file_to_move?: string; acta_key?: string };

      if (!result.ok) {
        setMessage({ type: 'error', text: result.error || 'Error desconocido' });
        setIsMigrating(false);
        return;
      }

      // Move image from RepoError to good bucket
      const oldFileName = selectedActa.renamed_file || selectedActa.acta_key.replace(/\|/g, '_').replace(/ /g, '_') + '.jpg';
      const newFileName = result.file_to_move || oldFileName;

      // Download from error bucket
      const { data: fileData } = await supabase.storage
        .from(BUCKET_ERROR)
        .download(oldFileName);

      if (fileData) {
        // Upload to good bucket
        await supabase.storage
          .from(BUCKET_GOOD)
          .upload(newFileName, fileData, { upsert: true });

        // Delete from error bucket
        await supabase.storage
          .from(BUCKET_ERROR)
          .remove([oldFileName]);
      }

      setMessage({ type: 'success', text: `Acta migrada correctamente con clave: ${result.acta_key}` });
      setSelectedActa(null);
      setVotos([]);
      await fetchActasError();
      await fetchActasDefinitivasCount();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error inesperado: ${err.message}` });
    }

    setIsMigrating(false);
  }, [selectedActa, votos, supabase, guardarVotos, fetchActasError]);

  // Discard: delete error acta entirely
  const descartarActa = useCallback(async () => {
    if (!selectedActa) return;

    await supabase
      .from('scrutinia_actas_votos_error')
      .delete()
      .eq('acta_id', selectedActa.id);

    await supabase
      .from('scrutinia_actas_error_2')
      .delete()
      .eq('id', selectedActa.id);

    // Delete image from error bucket
    const fileName = selectedActa.renamed_file || selectedActa.acta_key.replace(/\|/g, '_').replace(/ /g, '_') + '.jpg';
    await supabase.storage.from(BUCKET_ERROR).remove([fileName]);

    setSelectedActa(null);
    setVotos([]);
    setMessage({ type: 'success', text: 'Acta descartada' });
    await fetchActasError();
    await fetchActasDefinitivasCount();
  }, [selectedActa, supabase, fetchActasError, fetchActasDefinitivasCount]);

  // Impugnar: move to impugnables table
  const impugnarActa = useCallback(async (motivo: string = '', updates?: Partial<ActaError>) => {
    if (!selectedActa) return;

    try {
      // 1. Save local changes if any
      await guardarVotos();

      if (updates) {
        await supabase
          .from('scrutinia_actas_error_2')
          .update(updates)
          .eq('id', selectedActa.id);
      }

      // 2. Call RPC
      const { data, error } = await supabase.rpc('impugnar_acta_error', {
        p_error_id: selectedActa.id,
        p_motivo: motivo
      });

      if (error) throw error;
      const result = data as { ok: boolean; error?: string };
      if (!result.ok) throw new Error(result.error || 'Error al impugnar');

      setMessage({ type: 'success', text: 'Acta marcada como IMPUGNABLE' });
      setSelectedActa(null);
      setVotos([]);
      await fetchActasError();
      await fetchActasDefinitivasCount();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    }
  }, [selectedActa, supabase, fetchActasError]);

  // Sobrescribir: overwrite existing acta
  const sobrescribirActa = useCallback(async (existingActaId: string, updates?: Partial<ActaError>) => {
    if (!selectedActa) return;
    setIsMigrating(true);
    setMessage(null);

    try {
      // 1. Save local changes (votes and header fields)
      await guardarVotos();
      
      if (updates) {
        await supabase
          .from('scrutinia_actas_error_2')
          .update(updates)
          .eq('id', selectedActa.id);
      }

      // 2. Call RPC
      const { data, error } = await supabase.rpc('sobrescribir_acta_existente', {
        p_error_id: selectedActa.id,
        p_existing_acta_id: existingActaId
      });

      if (error) throw error;
      const result = data as { ok: boolean; message: string; file_name: string };
      
      if (!result.ok) throw new Error('Error al sobrescribir');

      // Move image
      const oldFileName = selectedActa.renamed_file || selectedActa.acta_key.replace(/\|/g, '_').replace(/ /g, '_') + '.jpg';
      const newFileName = result.file_name;

      const { data: fileData } = await supabase.storage
        .from(BUCKET_ERROR)
        .download(oldFileName);

      if (fileData) {
        await supabase.storage
          .from(BUCKET_GOOD)
          .upload(newFileName, fileData, { upsert: true });
          
        await supabase.storage
          .from(BUCKET_ERROR)
          .remove([oldFileName]);
      }

      setMessage({ type: 'success', text: 'Acta sobrescrita correctamente' });
      setSelectedActa(null);
      setVotos([]);
      await fetchActasError();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    }
    setIsMigrating(false);
  }, [selectedActa, supabase, guardarVotos, fetchActasError]);

  // Fetch existing acta details for comparison
  const fetchExistingActaByKey = useCallback(async (actaKey: string) => {
    const { data } = await supabase
      .from('scrutinia_actas_2')
      .select('*, scrutinia_actas_votos(*)')
      .eq('acta_key', actaKey)
      .maybeSingle();
    return data;
  }, [supabase]);

  return {
    actasError,
    actasDefinitivasCount,
    selectedActa,
    votos,
    mesasSugeridas,
    actaImageUrl,
    isLoading,
    isMigrating,
    message,
    selectActa,
    buscarMesa,
    updateVoto,
    guardarVotos,
    guardarCamposActa,
    migrarActa,
    descartarActa,
    impugnarActa,
    sobrescribirActa,
    fetchExistingActaByKey,
    setMessage,
  };
}
