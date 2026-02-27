'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type ResultadoPublico = Database['public']['Tables']['resultados_publicos']['Row'];

interface EstadisticasEscrutinio {
  actas_escrutadas: number;
  total_votantes: number;
  total_censo: number;
  participacion: number;
  ultima_actualizacion: string | null;
}

const defaultStats: EstadisticasEscrutinio = {
  actas_escrutadas: 0,
  total_votantes: 0,
  total_censo: 0,
  participacion: 0,
  ultima_actualizacion: null,
};

// Per-province vote breakdown (used for correct D'Hondt when viewing ARAGON)
export interface VotosPorProvincia {
  [provincia: string]: { [candidatura: string]: number };
}

export function useRealtimeScrutiny(provincia?: string) {
  const [resultados, setResultados] = useState<ResultadoPublico[]>([]);
  const [resultadosPorProvincia, setResultadosPorProvincia] = useState<VotosPorProvincia>({});
  const [estadisticas, setEstadisticas] = useState<EstadisticasEscrutinio>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchData = useCallback(async () => {
    const provinciaUpper = provincia?.toUpperCase();

    const filterProvincia = provinciaUpper || 'ARAGON';

    // Run queries in PARALLEL
    const resultadosQuery = supabase
      .from('resultados_escrutinio')
      .select('*')
      .eq('provincia', filterProvincia)
      .order('votos_totales', { ascending: false });

    const statsQuery = supabase
      .from('estadisticas_escrutinio')
      .select('*')
      .eq('provincia', filterProvincia)
      .maybeSingle();

    // When viewing ARAGON, also fetch per-province breakdown for correct D'Hondt
    const perProvQuery = !provinciaUpper
      ? supabase
          .from('resultados_escrutinio')
          .select('provincia, candidatura, votos_totales')
          .in('provincia', ['ZARAGOZA', 'HUESCA', 'TERUEL'])
      : null;

    const [resultadosRes, statsRes, perProvRes] = await Promise.all([
      resultadosQuery,
      statsQuery,
      perProvQuery,
    ]);

    if (resultadosRes.error) {
      console.error('Error fetching resultados:', resultadosRes.error);
    } else {
      setResultados(resultadosRes.data || []);
    }

    // Build per-province vote map
    if (perProvRes?.data) {
      const byProv: VotosPorProvincia = {};
      perProvRes.data.forEach((r: any) => {
        if (!byProv[r.provincia]) byProv[r.provincia] = {};
        byProv[r.provincia][r.candidatura] = r.votos_totales || 0;
      });
      setResultadosPorProvincia(byProv);
    } else if (provinciaUpper) {
      setResultadosPorProvincia({});
    }

    if (statsRes.data) {
      setEstadisticas({
        actas_escrutadas: statsRes.data.actas_escrutadas || 0,
        total_votantes: statsRes.data.total_votantes || 0,
        total_censo: statsRes.data.total_censo || 0,
        participacion: parseFloat(statsRes.data.participacion) || 0,
        ultima_actualizacion: statsRes.data.ultima_actualizacion,
      });
    } else {
      setEstadisticas(defaultStats);
    }
  }, [supabase, provincia]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setIsLoading(true);
      await fetchData();
      if (mounted) setIsLoading(false);
    };

    init();

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channelName = `scrutinia-${provincia || 'all'}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scrutinia_actas_votos' },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scrutinia_actas_2' },
        () => fetchData()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [provincia, fetchData, supabase]);

  return { resultados, resultadosPorProvincia, estadisticas, isLoading };
}
