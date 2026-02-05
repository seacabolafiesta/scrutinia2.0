export const PARTIDO_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  'PSOE': {
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-600'
  },
  'PP': {
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-600'
  },
  'VOX': {
    bg: 'bg-green-700',
    text: 'text-white',
    border: 'border-green-700'
  },
  'PODEMOS_AV': {
    bg: 'bg-purple-600',
    text: 'text-white',
    border: 'border-purple-600'
  },
  'IU_MOV_SUMAR': {
    bg: 'bg-pink-600',
    text: 'text-white',
    border: 'border-pink-600'
  },
  'PAR': {
    bg: 'bg-yellow-500',
    text: 'text-black',
    border: 'border-yellow-500'
  },
  'CHA': {
    bg: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-500'
  },
  'EXISTE': {
    bg: 'bg-emerald-500',
    text: 'text-white',
    border: 'border-emerald-500'
  },
  'SALF': {
    bg: 'bg-cyan-500',
    text: 'text-white',
    border: 'border-cyan-500'
  },
  'PACMA': {
    bg: 'bg-lime-500',
    text: 'text-black',
    border: 'border-lime-500'
  },
  'COALICION_ARAGONESA': {
    bg: 'bg-amber-500',
    text: 'text-black',
    border: 'border-amber-500'
  },
  'PCTE': {
    bg: 'bg-rose-700',
    text: 'text-white',
    border: 'border-rose-700'
  },
  'ETXSBC': {
    bg: 'bg-teal-500',
    text: 'text-white',
    border: 'border-teal-500'
  },
  'MUNDO_MAS_JUSTO': {
    bg: 'bg-indigo-500',
    text: 'text-white',
    border: 'border-indigo-500'
  },
  'ESCANOS_EN_BLANCO': {
    bg: 'bg-slate-400',
    text: 'text-black',
    border: 'border-slate-400'
  },
};

// Mapeo de IDs a nombres bonitos para mostrar
export const PARTIDO_DISPLAY_NAMES: { [key: string]: string } = {
  'PSOE': 'PSOE',
  'PP': 'PP',
  'VOX': 'VOX',
  'PODEMOS_AV': 'Podemos',
  'IU_MOV_SUMAR': 'IU-Sumar',
  'PAR': 'PAR',
  'CHA': 'CHA',
  'EXISTE': 'Existe',
  'SALF': 'SALF',
  'PACMA': 'PACMA',
  'COALICION_ARAGONESA': 'Coalición Aragonesa',
  'PCTE': 'PCTE',
  'ETXSBC': 'ETXSBC',
  'MUNDO_MAS_JUSTO': 'Mundo Más Justo',
  'ESCANOS_EN_BLANCO': 'Escaños en Blanco',
};

export function getPartidoColor(partido: string): { bg: string; text: string; border: string } {
  return PARTIDO_COLORS[partido] || {
    bg: 'bg-gray-500',
    text: 'text-white',
    border: 'border-gray-500'
  };
}

export function getPartidoDisplayName(partidoId: string): string {
  return PARTIDO_DISPLAY_NAMES[partidoId] || partidoId.replace(/_/g, ' ');
}
