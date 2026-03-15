// Colores HEX oficiales de cada partido
export const PARTIDO_HEX_COLORS: { [key: string]: string } = {
  'PP':                  '#1D71B8',   // Azul PP oficial
  'PSOE':                '#E30613',   // Rojo PSOE oficial
  'VOX':                 '#63BE21',   // Verde lima VOX oficial
  'SALF':                '#7B3F00',   // Marrón SALF oficial
  'PODEMOS_AV':          '#6B2D6B',   // Morado Podemos oficial
  'IU_MS_VQ':            '#E6005C',   // Magenta IU-Sumar-Verdes Equo
  'PACMA':               '#00A651',   // Verde PACMA oficial
  'PCAS_TC':             '#8B0045',   // Granate PCAS-TC
  'UPL':                 '#7B2D8E',   // Púrpura UPL
  'SORIA_YA':            '#00857C',   // Verde teal Soria Ya
  'POR_AVILA':           '#D4A017',   // Dorado Por Ávila
  'CS':                  '#EB6109',   // Naranja Ciudadanos
  'ESCANOS_EN_BLANCO':   '#94A3B8',   // Gris slate
};

// Colores Tailwind (legacy, para componentes que aún los usen)
export const PARTIDO_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  'PP':                  { bg: 'bg-blue-600',    text: 'text-white', border: 'border-blue-600' },
  'PSOE':                { bg: 'bg-red-600',     text: 'text-white', border: 'border-red-600' },
  'VOX':                 { bg: 'bg-lime-500',    text: 'text-white', border: 'border-lime-500' },
  'SALF':                { bg: 'bg-amber-900',   text: 'text-white', border: 'border-amber-900' },
  'PODEMOS_AV':          { bg: 'bg-purple-700',  text: 'text-white', border: 'border-purple-700' },
  'IU_MS_VQ':            { bg: 'bg-pink-600',    text: 'text-white', border: 'border-pink-600' },
  'PACMA':               { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-500' },
  'PCAS_TC':             { bg: 'bg-rose-900',    text: 'text-white', border: 'border-rose-900' },
  'UPL':                 { bg: 'bg-purple-800',  text: 'text-white', border: 'border-purple-800' },
  'SORIA_YA':            { bg: 'bg-teal-600',    text: 'text-white', border: 'border-teal-600' },
  'POR_AVILA':           { bg: 'bg-yellow-600',  text: 'text-white', border: 'border-yellow-600' },
  'CS':                  { bg: 'bg-orange-500',  text: 'text-white', border: 'border-orange-500' },
  'ESCANOS_EN_BLANCO':   { bg: 'bg-slate-400',   text: 'text-black', border: 'border-slate-400' },
};

// Mapeo de IDs a nombres bonitos para mostrar
export const PARTIDO_DISPLAY_NAMES: { [key: string]: string } = {
  'PP': 'PP',
  'PSOE': 'PSOE',
  'VOX': 'VOX',
  'PODEMOS_AV': 'Podemos-AV',
  'IU_MS_VQ': 'IU-Sumar-VQ',
  'SALF': 'SALF',
  'PACMA': 'PACMA',
  'PCAS_TC': 'PCAS-TC',
  'UPL': 'UPL',
  'SORIA_YA': 'Soria Ya',
  'POR_AVILA': 'Por Ávila',
  'CS': 'Ciudadanos',
  'ESCANOS_EN_BLANCO': 'Esc. Blanco',
};

export function getPartidoColor(partido: string): { bg: string; text: string; border: string } {
  return PARTIDO_COLORS[partido] || {
    bg: 'bg-gray-500',
    text: 'text-white',
    border: 'border-gray-500'
  };
}

export function getPartidoHexColor(partido: string): string {
  return PARTIDO_HEX_COLORS[partido] || '#64748B';
}

export function getPartidoDisplayName(partidoId: string): string {
  return PARTIDO_DISPLAY_NAMES[partidoId] || partidoId.replace(/_/g, ' ');
}

// Orden oficial del acta de escrutinio
export const PARTIDO_ORDER: string[] = [
  'PP',
  'PSOE',
  'VOX',
  'PODEMOS_AV',
  'IU_MS_VQ',
  'SALF',
  'PACMA',
  'PCAS_TC',
  'ESCANOS_EN_BLANCO',
  'UPL',
  'SORIA_YA',
  'POR_AVILA',
  'CS',
];

export function sortByPartidoOrder<T extends { party_id: string }>(votos: T[]): T[] {
  return [...votos].sort((a, b) => {
    const ia = PARTIDO_ORDER.indexOf(a.party_id);
    const ib = PARTIDO_ORDER.indexOf(b.party_id);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}
