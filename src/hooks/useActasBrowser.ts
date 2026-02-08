'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'Repositorio Actas 8F Aragon';

export interface ActaResumen {
  id: string;
  acta_key: string;
  provincia: string;
  municipio: string;
  distrito_censal: string;
  seccion: string;
  mesa: string;
  votantes_total: number;
  censo_total_electores: number;
  votos_nulos: number;
  votos_blanco: number;
}

export interface ActaDetalle extends ActaResumen {
  votos: { party_id: string; votos: number }[];
  actaUrl: string | null;
}

export function useActasBrowser() {
  const supabase = createClient();

  const [provincias, setProvincias] = useState<string[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [mesas, setMesas] = useState<ActaResumen[]>([]);
  const [actaDetalle, setActaDetalle] = useState<ActaDetalle | null>(null);

  const [provinciaSel, setProvinciaSel] = useState<string>('');
  const [municipioSel, setMunicipioSel] = useState<string>('');
  const [mesaSel, setMesaSel] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);

  // Fetch provincias on mount
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('scrutinia_actas')
        .select('provincia')
        .not('provincia', 'is', null)
        .order('provincia');

      if (data) {
        const unique = [...new Set(data.map((d: { provincia: string }) => d.provincia))];
        setProvincias(unique);
      }
    })();
  }, []);

  // Fetch municipios when provincia changes
  useEffect(() => {
    setMunicipioSel('');
    setMesaSel('');
    setMesas([]);
    setActaDetalle(null);

    if (!provinciaSel) {
      setMunicipios([]);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from('scrutinia_actas')
        .select('municipio')
        .eq('provincia', provinciaSel)
        .not('municipio', 'is', null)
        .order('municipio');

      if (data) {
        const unique = [...new Set(data.map((d: { municipio: string }) => d.municipio))];
        setMunicipios(unique);
      }
    })();
  }, [provinciaSel]);

  // Fetch mesas when municipio changes (or just provincia)
  useEffect(() => {
    setMesaSel('');
    setActaDetalle(null);

    if (!provinciaSel) {
      setMesas([]);
      return;
    }

    (async () => {
      setIsLoading(true);
      let query = supabase
        .from('scrutinia_actas')
        .select('id, acta_key, provincia, municipio, distrito_censal, seccion, mesa, votantes_total, censo_total_electores, votos_nulos, votos_blanco')
        .eq('provincia', provinciaSel)
        .order('municipio')
        .order('distrito_censal')
        .order('seccion')
        .order('mesa');

      if (municipioSel) {
        query = query.eq('municipio', municipioSel);
      }

      const { data } = await query;
      setMesas((data as ActaResumen[]) || []);
      setIsLoading(false);
    })();
  }, [provinciaSel, municipioSel]);

  // Fetch detalle when mesa is selected
  const selectMesa = useCallback(async (actaId: string) => {
    setMesaSel(actaId);
    if (!actaId) {
      setActaDetalle(null);
      return;
    }

    setIsLoading(true);

    // Fetch acta info
    const { data: acta } = await supabase
      .from('scrutinia_actas')
      .select('id, acta_key, provincia, municipio, distrito_censal, seccion, mesa, votantes_total, censo_total_electores, votos_nulos, votos_blanco')
      .eq('id', actaId)
      .single();

    if (!acta) {
      setIsLoading(false);
      return;
    }

    // Fetch votes
    const { data: votos } = await supabase
      .from('scrutinia_acta_votes')
      .select('party_id, votos')
      .eq('acta_id', actaId)
      .order('votos', { ascending: false });

    // Build storage URL from acta_key
    const fileName = acta.acta_key.replace(/\|/g, '_') + '.jpg';
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    // Check if file actually exists by trying a HEAD-like call
    let actaUrl: string | null = urlData?.publicUrl || null;

    setActaDetalle({
      ...(acta as ActaResumen),
      votos: (votos as { party_id: string; votos: number }[]) || [],
      actaUrl,
    });

    setIsLoading(false);
  }, [supabase]);

  return {
    provincias,
    municipios,
    mesas,
    actaDetalle,
    provinciaSel,
    municipioSel,
    mesaSel,
    isLoading,
    setProvinciaSel,
    setMunicipioSel,
    selectMesa,
  };
}
