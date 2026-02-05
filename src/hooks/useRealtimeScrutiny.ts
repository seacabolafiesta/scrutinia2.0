'use client';

import { useEffect, useState } from 'react';
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

export function useRealtimeScrutiny(provincia?: string) {
  const [resultados, setResultados] = useState<ResultadoPublico[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEscrutinio>({
    actas_escrutadas: 0,
    total_votantes: 0,
    total_censo: 0,
    participacion: 0,
    ultima_actualizacion: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    // Fetch resultados
    let query = supabase
      .from('resultados_escrutinio')
      .select('*')
      .order('votos_totales', { ascending: false });

    if (provincia) {
      query = query.eq('provincia', provincia);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching resultados:', error);
    } else {
      setResultados(data || []);
    }

    // Fetch estadisticas
    const provinciaQuery = provincia || 'ARAGON';
    const { data: stats } = await supabase
      .from('estadisticas_escrutinio')
      .select('*')
      .eq('provincia', provinciaQuery)
      .single();

    if (stats) {
      setEstadisticas({
        actas_escrutadas: stats.actas_escrutadas || 0,
        total_votantes: stats.total_votantes || 0,
        total_censo: stats.total_censo || 0,
        participacion: parseFloat(stats.participacion) || 0,
        ultima_actualizacion: stats.ultima_actualizacion
      });
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData();
      setIsLoading(false);
    };

    fetchInitialData();

    const channel = supabase
      .channel('scrutinia-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scrutinia_acta_votes' },
        () => {
          console.log('Realtime: votes changed');
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scrutinia_actas' },
        () => {
          console.log('Realtime: actas changed');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [provincia, supabase]);

  return { resultados, estadisticas, isLoading };
}
