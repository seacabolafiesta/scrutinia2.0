'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET_ERROR = 'RepoError';

export interface ActaImpugnada {
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
  motivo_impugnacion: string;
  votes_snapshot: { party_id: string; votos: number }[] | null;
  created_at: string;
}

export function useAdminActasImpugnadas() {
  const supabase = createClient();

  const [actasImpugnadas, setActasImpugnadas] = useState<ActaImpugnada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActa, setSelectedActa] = useState<ActaImpugnada | null>(null);
  const [actaImageUrl, setActaImageUrl] = useState<string | null>(null);

  const fetchActasImpugnadas = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('scrutinia_actas_impugnables')
      .select('*')
      .order('created_at', { ascending: false });

    setActasImpugnadas((data as ActaImpugnada[]) || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchActasImpugnadas();
  }, []);

  const selectActa = useCallback((acta: ActaImpugnada | null) => {
    setSelectedActa(acta);
    if (acta) {
      const fileName = acta.acta_key.replace(/\|/g, '_') + '.jpg';
      const { data: urlData } = supabase.storage
        .from(BUCKET_ERROR)
        .getPublicUrl(fileName);
      setActaImageUrl(urlData?.publicUrl || null);
    } else {
      setActaImageUrl(null);
    }
  }, [supabase]);

  const getImageUrl = useCallback((acta: ActaImpugnada) => {
    const fileName = acta.acta_key.replace(/\|/g, '_') + '.jpg';
    const { data: urlData } = supabase.storage
      .from(BUCKET_ERROR)
      .getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  }, [supabase]);

  return {
    actasImpugnadas,
    isLoading,
    selectedActa,
    actaImageUrl,
    selectActa,
    getImageUrl,
    fetchActasImpugnadas,
  };
}
