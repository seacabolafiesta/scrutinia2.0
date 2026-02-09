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
      .from('scrutinia_actas_error')
      .select('*')
      .order('created_at', { ascending: false });

    setActasError((data as ActaError[]) || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchActasError();
  }, []);

  // Select an acta and load its votes + image
  const selectActa = useCallback(async (acta: ActaError) => {
    setSelectedActa(acta);
    setMessage(null);

    // Fetch votes
    const { data: votosData } = await supabase
      .from('scrutinia_acta_votes_error')
      .select('party_id, votos')
      .eq('acta_id', acta.id)
      .order('votos', { ascending: false });

    setVotos((votosData as VotoError[]) || []);

    // Build image URL from acta_key
    // Sanitize: replace pipes AND spaces with underscores
    const fileName = acta.acta_key.replace(/\|/g, '_').replace(/ /g, '_') + '.jpg';
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
        .from('scrutinia_acta_votes_error')
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
      .from('scrutinia_actas_error')
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
      const oldFileName = selectedActa.acta_key.replace(/\|/g, '_') + '.jpg';
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
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error inesperado: ${err.message}` });
    }

    setIsMigrating(false);
  }, [selectedActa, votos, supabase, guardarVotos, fetchActasError]);

  // Discard: delete error acta entirely
  const descartarActa = useCallback(async () => {
    if (!selectedActa) return;

    await supabase
      .from('scrutinia_acta_votes_error')
      .delete()
      .eq('acta_id', selectedActa.id);

    await supabase
      .from('scrutinia_actas_error')
      .delete()
      .eq('id', selectedActa.id);

    // Delete image from error bucket
    const fileName = selectedActa.acta_key.replace(/\|/g, '_') + '.jpg';
    await supabase.storage.from(BUCKET_ERROR).remove([fileName]);

    setSelectedActa(null);
    setVotos([]);
    setMessage({ type: 'success', text: 'Acta descartada' });
    await fetchActasError();
  }, [selectedActa, supabase, fetchActasError]);

  // Impugnar: move to impugnables table
  const impugnarActa = useCallback(async () => {
    if (!selectedActa) return;

    try {
      const { data, error } = await supabase.rpc('impugnar_acta_error', {
        p_error_id: selectedActa.id
      });

      if (error) throw error;
      const result = data as { ok: boolean; error?: string };
      if (!result.ok) throw new Error(result.error || 'Error al impugnar');

      // Move image if needed (though impugnables might stay in same bucket or not? 
      // The RPC doesn't move the file, it just references it. 
      // But we probably want to keep it in RepoError or move to a Quarantine bucket?
      // For now, we leave the file where it is (RepoError) but referenced in the new table.
      // Ideally we should probably rename it to ensure it persists if we clear RepoError.
      // But let's stick to the RPC logic which deleted from error table. 
      // Wait, the RPC deleted from error table. The file is still in RepoError.
      // We should probably NOT delete the file if we want to keep it. 
      // The current RPC implementation deleted the row but didn't touch the file.
      // That is fine, the file remains in RepoError bucket (which is not auto-cleaned).

      setMessage({ type: 'success', text: 'Acta marcada como IMPUGNABLE' });
      setSelectedActa(null);
      setVotos([]);
      await fetchActasError();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    }
  }, [selectedActa, supabase, fetchActasError]);

  // Sobrescribir: overwrite existing acta
  const sobrescribirActa = useCallback(async (existingActaId: string) => {
    if (!selectedActa) return;
    setIsMigrating(true);
    setMessage(null);

    try {
      await guardarVotos();

      const { data, error } = await supabase.rpc('sobrescribir_acta_existente', {
        p_error_id: selectedActa.id,
        p_existing_acta_id: existingActaId
      });

      if (error) throw error;
      const result = data as { ok: boolean; message: string; file_name: string };
      
      if (!result.ok) throw new Error('Error al sobrescribir');

      // Move image
      const oldFileName = selectedActa.acta_key.replace(/\|/g, '_').replace(/ /g, '_') + '.jpg';
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
      .from('scrutinia_actas')
      .select('*, scrutinia_acta_votes(*)')
      .eq('acta_key', actaKey)
      .maybeSingle();
    return data;
  }, [supabase]);

  return {
    actasError,
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
