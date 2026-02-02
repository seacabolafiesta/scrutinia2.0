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

export function calculateDHondt(
  votes: VotesMap,
  totalSeats: number,
  barrera: number = 0.03
): { seats: SeatsResult; steps: DHondtStep[] } {
  const totalVotosValidos = Object.values(votes).reduce((sum, v) => sum + v, 0);
  
  if (totalVotosValidos === 0) {
    return { seats: {}, steps: [] };
  }

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

    cocientes.sort((a, b) => {
      if (b.cociente !== a.cociente) {
        return b.cociente - a.cociente;
      }
      if (b.votos !== a.votos) {
        return b.votos - a.votos;
      }
      return a.partido.localeCompare(b.partido);
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
