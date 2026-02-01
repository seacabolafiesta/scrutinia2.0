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
        .from('resultados_publicos')
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
      .channel('resultados-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resultados_publicos',
          filter: provincia ? `provincia=eq.${provincia}` : undefined
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setResultados((prev) => [...prev, payload.new as ResultadoPublico]);
          } else if (payload.eventType === 'UPDATE') {
            setResultados((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new as ResultadoPublico : r))
            );
          } else if (payload.eventType === 'DELETE') {
            setResultados((prev) => prev.filter((r) => r.id !== payload.old.id));
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
