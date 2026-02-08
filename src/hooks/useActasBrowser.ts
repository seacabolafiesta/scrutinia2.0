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

  // Fetch provincias on mount from mesas table
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('mesas')
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
        .from('mesas')
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
        .from('mesas')
        .select('id, provincia, municipio, distrito_censal, seccion, mesa, votantes_total, censo_total_electores')
        .eq('provincia', provinciaSel)
        .order('municipio')
        .order('distrito_censal')
        .order('seccion')
        .order('mesa');

      if (municipioSel) {
        query = query.eq('municipio', municipioSel);
      }

      const { data } = await query;
      setMesas((data || []).map((m: any) => ({
        ...m,
        acta_key: '',
        votos_nulos: 0,
        votos_blanco: 0,
      })) as ActaResumen[]);
      setIsLoading(false);
    })();
  }, [provinciaSel, municipioSel]);

  // Fetch detalle when mesa is selected
  const selectMesa = useCallback(async (mesaId: string) => {
    setMesaSel(mesaId);
    if (!mesaId) {
      setActaDetalle(null);
      return;
    }

    setIsLoading(true);

    // Fetch mesa info from mesas table
    const { data: mesa } = await supabase
      .from('mesas')
      .select('id, provincia, municipio, distrito_censal, seccion, mesa, votantes_total, censo_total_electores')
      .eq('id', mesaId)
      .single();

    if (!mesa) {
      setIsLoading(false);
      return;
    }

    // Build acta_key from mesa fields
    const actaKey = `${mesa.provincia}|${mesa.municipio}|${mesa.distrito_censal}|${mesa.seccion}|${mesa.mesa}`;

    // Try to find matching acta in scrutinia_actas
    const { data: acta } = await supabase
      .from('scrutinia_actas')
      .select('id, votantes_total, votos_nulos, votos_blanco')
      .eq('acta_key', actaKey)
      .maybeSingle();

    let votos: { party_id: string; votos: number }[] = [];
    let actaUrl: string | null = null;
    let votosNulos = 0;
    let votosBlanco = 0;
    let votantesTotal = mesa.votantes_total || 0;

    if (acta) {
      votosNulos = acta.votos_nulos || 0;
      votosBlanco = acta.votos_blanco || 0;
      votantesTotal = acta.votantes_total || votantesTotal;

      // Fetch votes
      const { data: votosData } = await supabase
        .from('scrutinia_acta_votes')
        .select('party_id, votos')
        .eq('acta_id', acta.id)
        .order('votos', { ascending: false });

      votos = (votosData as { party_id: string; votos: number }[]) || [];

      // Build storage URL
      const fileName = actaKey.replace(/\|/g, '_') + '.jpg';
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);
      actaUrl = urlData?.publicUrl || null;
    }

    setActaDetalle({
      id: mesa.id,
      acta_key: actaKey,
      provincia: mesa.provincia,
      municipio: mesa.municipio,
      distrito_censal: mesa.distrito_censal,
      seccion: mesa.seccion,
      mesa: mesa.mesa,
      votantes_total: votantesTotal,
      censo_total_electores: mesa.censo_total_electores,
      votos_nulos: votosNulos,
      votos_blanco: votosBlanco,
      votos,
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
