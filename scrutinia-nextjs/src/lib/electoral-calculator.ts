import { calculateDHondt, calculatePercentages, type VotesMap, type SeatsResult } from './dhondt';
import { aggregateVotosByProvincia, calculateParticipacion, normalizePartidoName } from './aggregation';
import { getEscañosProvincia, getBarreraElectoral, type Provincia } from './elections-config';
import type { Database } from './supabase/database.types';

type Acta = Database['public']['Tables']['actas']['Row'];
type DetalleVoto = Database['public']['Tables']['detalle_votos']['Row'];

export interface ResultadoElectoral {
  provincia: Provincia;
  votos: VotesMap;
  porcentajes: { [partido: string]: number };
  escaños: SeatsResult;
  totalEscaños: number;
  participacion: {
    totalVotantes: number;
    totalCenso: number;
    porcentaje: number;
    votosBlancos: number;
    votosNulos: number;
  };
  actasEscrutadas: number;
  totalMesas: number;
  porcentajeEscrutado: number;
}

export function calculateResultadosProvincia(
  provincia: Provincia,
  actas: Acta[],
  detalleVotos: DetalleVoto[],
  totalMesas: number
): ResultadoElectoral {
  const actasVerificadas = actas.filter((a) => a.estado === 'verificada');
  
  const votosAgregados = aggregateVotosByProvincia(actasVerificadas, detalleVotos);
  
  const votosNormalizados: VotesMap = {};
  Object.entries(votosAgregados).forEach(([partido, votos]) => {
    const partidoNormalizado = normalizePartidoName(partido);
    if (!votosNormalizados[partidoNormalizado]) {
      votosNormalizados[partidoNormalizado] = 0;
    }
    votosNormalizados[partidoNormalizado] += votos;
  });

  const totalEscaños = getEscañosProvincia(provincia);
  const barrera = getBarreraElectoral();
  
  const { seats } = calculateDHondt(votosNormalizados, totalEscaños, barrera);
  const porcentajes = calculatePercentages(votosNormalizados);
  const participacion = calculateParticipacion(actasVerificadas);

  const porcentajeEscrutado = totalMesas > 0 
    ? parseFloat(((actasVerificadas.length / totalMesas) * 100).toFixed(2))
    : 0;

  return {
    provincia,
    votos: votosNormalizados,
    porcentajes,
    escaños: seats,
    totalEscaños,
    participacion: {
      totalVotantes: participacion.totalVotantes,
      totalCenso: participacion.totalCenso,
      porcentaje: participacion.porcentaje,
      votosBlancos: participacion.votosBlancos,
      votosNulos: participacion.votosNulos,
    },
    actasEscrutadas: actasVerificadas.length,
    totalMesas,
    porcentajeEscrutado,
  };
}

export interface ResultadoGlobal {
  aragon: {
    escañosTotales: SeatsResult;
    votosTotales: VotesMap;
  };
  provincias: {
    [key in Provincia]: ResultadoElectoral;
  };
}

export function calculateResultadosGlobales(
  resultadosPorProvincia: { [key in Provincia]: ResultadoElectoral }
): ResultadoGlobal {
  const escañosTotales: SeatsResult = {};
  const votosTotales: VotesMap = {};

  Object.values(resultadosPorProvincia).forEach((resultado) => {
    Object.entries(resultado.escaños).forEach(([partido, escaños]) => {
      if (!escañosTotales[partido]) {
        escañosTotales[partido] = 0;
      }
      escañosTotales[partido] += escaños;
    });

    Object.entries(resultado.votos).forEach(([partido, votos]) => {
      if (!votosTotales[partido]) {
        votosTotales[partido] = 0;
      }
      votosTotales[partido] += votos;
    });
  });

  return {
    aragon: {
      escañosTotales,
      votosTotales,
    },
    provincias: resultadosPorProvincia,
  };
}
