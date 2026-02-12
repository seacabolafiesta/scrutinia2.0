// Colores HEX oficiales de cada partido
export const PARTIDO_HEX_COLORS: { [key: string]: string } = {
  'PP':                  '#1D71B8',   // Azul PP oficial
  'PSOE':                '#E30613',   // Rojo PSOE oficial
  'VOX':                 '#63BE21',   // Verde lima VOX oficial
  'SALF':                '#7B3F00',   // Marrón SALF oficial
  'CHA':                 '#008A29',   // Verde CHA oficial
  'PAR':                 '#003DA5',   // Azul PAR oficial
  'PODEMOS_AV':          '#6B2D6B',   // Morado Podemos oficial
  'IU_MOV_SUMAR':        '#E6005C',   // Magenta Sumar oficial
  'EXISTE':              '#00857C',   // Verde teal Aragón Existe
  'PACMA':               '#00A651',   // Verde PACMA oficial
  'COALICION_ARAGONESA': '#D4A017',   // Dorado Coalición Aragonesa
  'PCTE':                '#8B0000',   // Rojo oscuro PCTE
  'ETXSBC':              '#2E8B57',   // Verde ETXSBC
  'MUNDO_MAS_JUSTO':     '#4B0082',   // Índigo
  'ESCANOS_EN_BLANCO':   '#94A3B8',   // Gris slate
};

// Colores Tailwind (legacy, para componentes que aún los usen)
export const PARTIDO_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  'PP':                  { bg: 'bg-blue-600',    text: 'text-white', border: 'border-blue-600' },
  'PSOE':                { bg: 'bg-red-600',     text: 'text-white', border: 'border-red-600' },
  'VOX':                 { bg: 'bg-lime-500',    text: 'text-white', border: 'border-lime-500' },
  'SALF':                { bg: 'bg-amber-900',   text: 'text-white', border: 'border-amber-900' },
  'CHA':                 { bg: 'bg-green-600',   text: 'text-white', border: 'border-green-600' },
  'PAR':                 { bg: 'bg-blue-800',    text: 'text-white', border: 'border-blue-800' },
  'PODEMOS_AV':          { bg: 'bg-purple-700',  text: 'text-white', border: 'border-purple-700' },
  'IU_MOV_SUMAR':        { bg: 'bg-pink-600',    text: 'text-white', border: 'border-pink-600' },
  'EXISTE':              { bg: 'bg-teal-600',    text: 'text-white', border: 'border-teal-600' },
  'PACMA':               { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-500' },
  'COALICION_ARAGONESA': { bg: 'bg-yellow-600',  text: 'text-white', border: 'border-yellow-600' },
  'PCTE':                { bg: 'bg-red-900',     text: 'text-white', border: 'border-red-900' },
  'ETXSBC':              { bg: 'bg-green-700',   text: 'text-white', border: 'border-green-700' },
  'MUNDO_MAS_JUSTO':     { bg: 'bg-indigo-700',  text: 'text-white', border: 'border-indigo-700' },
  'ESCANOS_EN_BLANCO':   { bg: 'bg-slate-400',   text: 'text-black', border: 'border-slate-400' },
};

// Mapeo de IDs a nombres bonitos para mostrar
export const PARTIDO_DISPLAY_NAMES: { [key: string]: string } = {
  'PSOE': 'PSOE',
  'PP': 'PP',
  'VOX': 'VOX',
  'PODEMOS_AV': 'Podemos-AV',
  'IU_MOV_SUMAR': 'IU-Sumar',
  'PAR': 'PAR',
  'CHA': 'CHA',
  'EXISTE': 'Existe',
  'SALF': 'SALF',
  'PACMA': 'PACMA',
  'COALICION_ARAGONESA': 'C. Aragonesa',
  'PCTE': 'PCTE',
  'ETXSBC': 'ETXSBC',
  'MUNDO_MAS_JUSTO': 'Mundo+Justo',
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
  'PSOE',
  'COALICION_ARAGONESA',
  'ESCANOS_EN_BLANCO',
  'PAR',
  'PODEMOS_AV',
  'CHA',
  'VOX',
  'PP',
  'PCTE',
  'IU_MOV_SUMAR',
  'EXISTE',
  'SALF',
  'PACMA',
  'MUNDO_MAS_JUSTO',
  'ETXSBC',
];

export function sortByPartidoOrder<T extends { party_id: string }>(votos: T[]): T[] {
  return [...votos].sort((a, b) => {
    const ia = PARTIDO_ORDER.indexOf(a.party_id);
    const ib = PARTIDO_ORDER.indexOf(b.party_id);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}
