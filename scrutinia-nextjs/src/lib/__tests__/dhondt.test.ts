import { calculateDHondt, calculatePercentages } from '../dhondt';

describe('D\'Hondt Algorithm', () => {
  test('Reparto básico con 3 partidos y 5 escaños', () => {
    const votes = {
      'PSOE': 340000,
      'PP': 280000,
      'VOX': 150000,
    };

    const { seats } = calculateDHondt(votes, 5, 0);

    expect(seats['PSOE']).toBe(2);
    expect(seats['PP']).toBe(2);
    expect(seats['VOX']).toBe(1);
  });

  test('Barrera electoral del 3% excluye partidos pequeños', () => {
    const votes = {
      'PSOE': 400000,
      'PP': 350000,
      'Partido Pequeño': 20000,
    };

    const totalVotos = 770000;
    const { seats } = calculateDHondt(votes, 10, 0.03);

    expect(seats['Partido Pequeño']).toBeUndefined();
    expect(seats['PSOE']).toBeGreaterThan(0);
    expect(seats['PP']).toBeGreaterThan(0);
  });

  test('Cálculo de porcentajes', () => {
    const votes = {
      'PSOE': 500,
      'PP': 300,
      'VOX': 200,
    };

    const percentages = calculatePercentages(votes);

    expect(percentages['PSOE']).toBe(50);
    expect(percentages['PP']).toBe(30);
    expect(percentages['VOX']).toBe(20);
  });

  test('Caso Aragón 2026 - Zaragoza (35 escaños)', () => {
    const votes = {
      'PSOE': 180000,
      'PP': 160000,
      'VOX': 90000,
      'PAR': 70000,
      'PODEMOS-AV': 50000,
      'CHA': 40000,
    };

    const { seats } = calculateDHondt(votes, 35, 0.03);

    const totalEscaños = Object.values(seats).reduce((sum, s) => sum + s, 0);
    expect(totalEscaños).toBe(35);
  });
});
