import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

type ResultadoPublico = Database['public']['Tables']['resultados_publicos']['Row'];
type Acta = Database['public']['Tables']['actas']['Row'];

export async function getResultadosByProvincia(provincia: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('resultados_publicos')
    .select('*')
    .eq('provincia', provincia)
    .order('votos_totales', { ascending: false });

  if (error) {
    console.error('Error fetching resultados:', error);
    return [];
  }

  return data as ResultadoPublico[];
}

export async function getAllResultados() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('resultados_publicos')
    .select('*')
    .order('provincia', { ascending: true })
    .order('votos_totales', { ascending: false });

  if (error) {
    console.error('Error fetching all resultados:', error);
    return [];
  }

  return data as ResultadoPublico[];
}

export async function getActasVerificadas() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('actas')
    .select('*, mesas(*)')
    .eq('estado', 'verificada')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching actas verificadas:', error);
    return [];
  }

  return data;
}

export async function getParticipacionStats() {
  const supabase = await createClient();
  
  const { data: actas, error } = await supabase
    .from('actas')
    .select('total_votantes, total_censo_acta, estado')
    .eq('estado', 'verificada');

  if (error || !actas) {
    console.error('Error fetching participacion:', error);
    return {
      totalVotantes: 0,
      totalCenso: 0,
      porcentajeParticipacion: 0,
      actasEscrutadas: 0
    };
  }

  const totalVotantes = actas.reduce((sum, acta) => sum + (acta.total_votantes || 0), 0);
  const totalCenso = actas.reduce((sum, acta) => sum + (acta.total_censo_acta || 0), 0);
  const porcentajeParticipacion = totalCenso > 0 ? (totalVotantes / totalCenso) * 100 : 0;

  return {
    totalVotantes,
    totalCenso,
    porcentajeParticipacion: parseFloat(porcentajeParticipacion.toFixed(2)),
    actasEscrutadas: actas.length
  };
}
