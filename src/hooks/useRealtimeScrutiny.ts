'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type ResultadoPublico = Database['public']['Tables']['resultados_publicos']['Row'];

export function useRealtimeScrutiny(provincia?: string) {
  const [resultados, setResultados] = useState<ResultadoPublico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
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
      setIsLoading(false);
    };

    fetchInitialData();

    const channel = supabase
      .channel('scrutinia-votes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scrutinia_acta_votes'
        },
        async () => {
          console.log('Realtime update: refetching resultados_escrutinio');
          // Refetch desde la vista cuando hay cambios en votos
          let query = supabase
            .from('resultados_escrutinio')
            .select('*')
            .order('votos_totales', { ascending: false });
          
          if (provincia) {
            query = query.eq('provincia', provincia);
          }
          
          const { data } = await query;
          if (data) {
            setResultados(data as ResultadoPublico[]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [provincia, supabase]);

  return { resultados, isLoading };
}
