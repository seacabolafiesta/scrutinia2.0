import type { Database } from '@/lib/supabase/database.types';

type DetalleVoto = Database['public']['Tables']['detalle_votos']['Row'];
type Acta = Database['public']['Tables']['actas']['Row'];

export interface VotosAgregados {
  [partido: string]: number;
}

export function aggregateVotosByProvincia(
  actas: Acta[],
  detalleVotos: DetalleVoto[]
): VotosAgregados {
  const votosMap: VotosAgregados = {};

  detalleVotos.forEach((detalle) => {
    const partido = detalle.partido_nombre;
    const votos = detalle.votos || 0;

    if (!votosMap[partido]) {
      votosMap[partido] = 0;
    }
    votosMap[partido] += votos;
  });

  return votosMap;
}

export function aggregateVotosByMunicipio(
  mesasIds: string[],
  detalleVotos: DetalleVoto[]
): VotosAgregados {
  const votosMap: VotosAgregados = {};

  detalleVotos.forEach((detalle) => {
    const partido = detalle.partido_nombre;
    const votos = detalle.votos || 0;

    if (!votosMap[partido]) {
      votosMap[partido] = 0;
    }
    votosMap[partido] += votos;
  });

  return votosMap;
}

export interface ParticipacionData {
  totalVotantes: number;
  totalCenso: number;
  porcentaje: number;
  votosBlancos: number;
  votosNulos: number;
  votosCandidaturas: number;
}

export function calculateParticipacion(actas: Acta[]): ParticipacionData {
  const actasVerificadas = actas.filter((a) => a.estado === 'verificada');

  const totalVotantes = actasVerificadas.reduce((sum, a) => sum + (a.total_votantes || 0), 0);
  const totalCenso = actasVerificadas.reduce((sum, a) => sum + (a.total_censo_acta || 0), 0);
  const votosBlancos = actasVerificadas.reduce((sum, a) => sum + (a.votos_blanco || 0), 0);
  const votosNulos = actasVerificadas.reduce((sum, a) => sum + (a.votos_nulos || 0), 0);
  const votosCandidaturas = actasVerificadas.reduce((sum, a) => sum + (a.votos_candidaturas || 0), 0);

  const porcentaje = totalCenso > 0 ? (totalVotantes / totalCenso) * 100 : 0;

  return {
    totalVotantes,
    totalCenso,
    porcentaje: parseFloat(porcentaje.toFixed(2)),
    votosBlancos,
    votosNulos,
    votosCandidaturas,
  };
}

export function normalizePartidoName(nombre: string): string {
  const normalizationMap: { [key: string]: string } = {
    'PARTIDO SOCIALISTA OBRERO ESPAÑOL': 'PSOE',
    'P.S.O.E.': 'PSOE',
    'PARTIDO POPULAR': 'PP',
    'P.P.': 'PP',
    'PARTIDO POPULAR DE ARAGÓN': 'PP',
    'PARTIDO ARAGONÉS': 'PAR',
    'P.A.R.': 'PAR',
    'CHUNTA ARAGONESISTA': 'CHA',
    'PODEMOS – ALIANZA VERDE': 'PODEMOS-AV',
    'PODEMOS-ALIANZA VERDE': 'PODEMOS-AV',
    'IZQUIERDA UNIDA – MOVIMIENTO SUMAR': 'IU-MOVIMIENTO SUMAR',
    'ARAGÓN EXISTE': 'EXISTE',
    'TERUEL EXISTE': 'EXISTE',
    'SE ACABÓ LA FIESTA': 'SALF',
    'PARTIDO ANIMALISTA CON EL MEDIO AMBIENTE': 'PACMA',
  };

  const upperNombre = nombre.trim().toUpperCase();
  
  return normalizationMap[upperNombre] || nombre.trim();
}
