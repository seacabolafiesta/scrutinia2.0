import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

type Mesa = Database['public']['Tables']['mesas']['Row'];

export async function getMesas() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .order('provincia', { ascending: true })
    .order('municipio', { ascending: true })
    .order('distrito', { ascending: true })
    .order('seccion', { ascending: true })
    .order('mesa', { ascending: true });

  if (error) {
    console.error('Error fetching mesas:', error);
    return [];
  }

  return data as Mesa[];
}

export async function getMesasByProvincia(provincia: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .eq('provincia', provincia)
    .order('municipio', { ascending: true });

  if (error) {
    console.error('Error fetching mesas by provincia:', error);
    return [];
  }

  return data as Mesa[];
}

export async function getMesasByMunicipio(provincia: string, municipio: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .eq('provincia', provincia)
    .eq('municipio', municipio)
    .order('distrito', { ascending: true })
    .order('seccion', { ascending: true })
    .order('mesa', { ascending: true });

  if (error) {
    console.error('Error fetching mesas by municipio:', error);
    return [];
  }

  return data as Mesa[];
}
