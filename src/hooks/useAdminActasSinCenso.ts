'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET_GOOD = 'Repositorio Actas 8F Aragon';
const BUCKET_ERROR = 'RepoError';

export interface ActaSinCenso {
  id: string;
  acta_key: string;
  provincia: string;
  municipio: string;
  distrito_censal: string;
  seccion: string;
  mesa: string;
  votantes_total: number;
  votos_nulos: number;
  votos_blanco: number;
  censo_total_electores: number | null;
  renamed_file: string | null;
  action: string;
}

export function useAdminActasSinCenso() {
  const supabase = createClient();

  const [actas, setActas] = useState<ActaSinCenso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchActas = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('scrutinia_actas_2')
      .select('id, acta_key, provincia, municipio, distrito_censal, seccion, mesa, votantes_total, votos_nulos, votos_blanco, censo_total_electores, renamed_file, action')
      .or('censo_total_electores.is.null,censo_total_electores.eq.0')
      .order('municipio', { ascending: true });

    setActas((data as ActaSinCenso[]) || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchActas();
  }, []);

  const getImageUrl = useCallback((acta: ActaSinCenso) => {
    const fileName = acta.acta_key.replace(/\|/g, '_') + '.jpg';
    const bucket = acta.action === 'guardar' ? BUCKET_GOOD : BUCKET_ERROR;
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  }, [supabase]);

  const saveCenso = useCallback(async (actaId: string, censoValue: number) => {
    setSaving(actaId);
    setMessage(null);

    const { error } = await supabase
      .from('scrutinia_actas_2')
      .update({ censo_total_electores: censoValue })
      .eq('id', actaId);

    if (error) {
      setMessage({ type: 'error', text: `Error al guardar: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Censo guardado correctamente' });
      // Remove from list
      setActas((prev) => prev.filter((a) => a.id !== actaId));
    }
    setSaving(null);
  }, [supabase]);

  return {
    actas,
    isLoading,
    saving,
    message,
    setMessage,
    getImageUrl,
    saveCenso,
    fetchActas,
  };
}
