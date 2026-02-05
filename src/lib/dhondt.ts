export interface VotesMap {
  [partido: string]: number;
}

export interface SeatsResult {
  [partido: string]: number;
}

export interface DHondtStep {
  partido: string;
  votos: number;
  divisor: number;
  cociente: number;
  escaño: number;
}

/**
 * Implementación del sistema D'Hondt según LOREG Art. 163
 * 
 * @param votes - Votos por candidatura
 * @param totalSeats - Escaños a repartir
 * @param barrera - Barrera electoral (ej: 0.03 = 3%)
 * @param votosBlanco - Votos en blanco (se suman para calcular barrera, Art. 163.1.a)
 */
export function calculateDHondt(
  votes: VotesMap,
  totalSeats: number,
  barrera: number = 0.03,
  votosBlanco: number = 0
): { seats: SeatsResult; steps: DHondtStep[] } {
  // Art. 163.1.a LOREG: votos válidos = votos candidaturas + votos en blanco
  const votosCandidaturas = Object.values(votes).reduce((sum, v) => sum + v, 0);
  const totalVotosValidos = votosCandidaturas + votosBlanco;
  
  if (totalVotosValidos === 0) {
    return { seats: {}, steps: [] };
  }

  // Barrera electoral sobre votos válidos totales
  const minimoVotos = totalVotosValidos * barrera;
  
  const partidosValidos = Object.entries(votes).filter(
    ([_, votos]) => votos >= minimoVotos
  );

  if (partidosValidos.length === 0) {
    return { seats: {}, steps: [] };
  }

  const seats: SeatsResult = {};
  partidosValidos.forEach(([partido]) => {
    seats[partido] = 0;
  });

  const steps: DHondtStep[] = [];
  const cocientes: Array<{ partido: string; votos: number; divisor: number; cociente: number }> = [];

  for (let escaño = 1; escaño <= totalSeats; escaño++) {
    cocientes.length = 0;

    partidosValidos.forEach(([partido, votos]) => {
      const divisor = seats[partido] + 1;
      const cociente = votos / divisor;
      cocientes.push({ partido, votos, divisor, cociente });
    });

    // Art. 163.1.d LOREG: ordenar por cociente, luego por votos totales, luego sorteo
    cocientes.sort((a, b) => {
      // Primero: mayor cociente gana
      if (b.cociente !== a.cociente) {
        return b.cociente - a.cociente;
      }
      // Segundo: si empate en cociente, gana el de más votos totales
      if (b.votos !== a.votos) {
        return b.votos - a.votos;
      }
      // Tercero: si empate también en votos, sorteo (aleatorio)
      // En producción real esto debería ser un sorteo oficial supervisado
      return Math.random() - 0.5;
    });

    const ganador = cocientes[0];
    seats[ganador.partido]++;

    steps.push({
      partido: ganador.partido,
      votos: ganador.votos,
      divisor: ganador.divisor,
      cociente: ganador.cociente,
      escaño,
    });
  }

  return { seats, steps };
}

export function calculatePercentages(votes: VotesMap): { [partido: string]: number } {
  const total = Object.values(votes).reduce((sum, v) => sum + v, 0);
  
  if (total === 0) return {};

  const percentages: { [partido: string]: number } = {};
  
  Object.entries(votes).forEach(([partido, votos]) => {
    percentages[partido] = parseFloat(((votos / total) * 100).toFixed(2));
  });

  return percentages;
}
