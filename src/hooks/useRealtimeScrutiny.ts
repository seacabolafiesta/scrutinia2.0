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

export function useRealtimeScrutiny(provincia?: string) {
  const [resultados, setResultados] = useState<ResultadoPublico[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEscrutinio>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchData = useCallback(async () => {
    const provinciaUpper = provincia?.toUpperCase();

    // Run both queries in PARALLEL
    const resultadosQuery = supabase
      .from('resultados_escrutinio')
      .select('*')
      .order('votos_totales', { ascending: false });

    if (provinciaUpper) {
      resultadosQuery.eq('provincia', provinciaUpper);
    }

    const statsQuery = supabase
      .from('estadisticas_escrutinio')
      .select('*')
      .eq('provincia', provinciaUpper || 'ARAGON')
      .maybeSingle();

    const [resultadosRes, statsRes] = await Promise.all([resultadosQuery, statsQuery]);

    if (resultadosRes.error) {
      console.error('Error fetching resultados:', resultadosRes.error);
    } else {
      setResultados(resultadosRes.data || []);
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
        { event: '*', schema: 'public', table: 'scrutinia_acta_votes' },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scrutinia_actas' },
        () => fetchData()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [provincia, fetchData, supabase]);

  return { resultados, estadisticas, isLoading };
}
