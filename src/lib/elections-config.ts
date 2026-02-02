export const ARAGON_2026_CONFIG = {
  provincias: {
    Zaragoza: {
      escaños: 35,
      nombre: 'Zaragoza',
    },
    Huesca: {
      escaños: 18,
      nombre: 'Huesca',
    },
    Teruel: {
      escaños: 14,
      nombre: 'Teruel',
    },
  },
  barreraElectoral: 0.03,
  totalEscaños: 67,
} as const;

export type Provincia = keyof typeof ARAGON_2026_CONFIG.provincias;

export const PROVINCIAS = Object.keys(ARAGON_2026_CONFIG.provincias) as Provincia[];

export function getEscañosProvincia(provincia: Provincia): number {
  return ARAGON_2026_CONFIG.provincias[provincia].escaños;
}

export function getBarreraElectoral(): number {
  return ARAGON_2026_CONFIG.barreraElectoral;
}
