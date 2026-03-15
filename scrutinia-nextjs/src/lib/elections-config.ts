export const CYL_2026_CONFIG = {
  provincias: {
    Valladolid: { escaños: 15, nombre: 'Valladolid' },
    León: { escaños: 13, nombre: 'León' },
    Burgos: { escaños: 11, nombre: 'Burgos' },
    Salamanca: { escaños: 10, nombre: 'Salamanca' },
    Ávila: { escaños: 7, nombre: 'Ávila' },
    Palencia: { escaños: 7, nombre: 'Palencia' },
    Segovia: { escaños: 7, nombre: 'Segovia' },
    Zamora: { escaños: 7, nombre: 'Zamora' },
    Soria: { escaños: 5, nombre: 'Soria' },
  },
  barreraElectoral: 0.03,
  totalEscaños: 82,
} as const;

export type Provincia = keyof typeof CYL_2026_CONFIG.provincias;

export const PROVINCIAS = Object.keys(CYL_2026_CONFIG.provincias) as Provincia[];

export function getEscañosProvincia(provincia: Provincia): number {
  return CYL_2026_CONFIG.provincias[provincia].escaños;
}

export function getBarreraElectoral(): number {
  return CYL_2026_CONFIG.barreraElectoral;
}

// Mapping from uppercase DB province names to seats
export const ESCANOS_POR_PROVINCIA: Record<string, number> = {
  VALLADOLID: 15,
  LEON: 13,
  BURGOS: 11,
  SALAMANCA: 10,
  AVILA: 7,
  PALENCIA: 7,
  SEGOVIA: 7,
  ZAMORA: 7,
  SORIA: 5,
};
