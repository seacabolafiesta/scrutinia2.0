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
  'PODEMOS-AV': {
    bg: 'bg-purple-600',
    text: 'text-white',
    border: 'border-purple-600'
  },
  'IU-MOVIMIENTO SUMAR': {
    bg: 'bg-pink-600',
    text: 'text-white',
    border: 'border-pink-600'
  },
  'PAR': {
    bg: 'bg-yellow-600',
    text: 'text-white',
    border: 'border-yellow-600'
  },
  'CHA': {
    bg: 'bg-orange-600',
    text: 'text-white',
    border: 'border-orange-600'
  },
  'EXISTE': {
    bg: 'bg-emerald-600',
    text: 'text-white',
    border: 'border-emerald-600'
  },
  'SALF': {
    bg: 'bg-cyan-600',
    text: 'text-white',
    border: 'border-cyan-600'
  },
  'PACMA': {
    bg: 'bg-lime-600',
    text: 'text-white',
    border: 'border-lime-600'
  },
  'COALICIÓN ARAGONESA': {
    bg: 'bg-amber-600',
    text: 'text-white',
    border: 'border-amber-600'
  },
  'PCTE': {
    bg: 'bg-rose-700',
    text: 'text-white',
    border: 'border-rose-700'
  },
  'ETXSBC': {
    bg: 'bg-teal-600',
    text: 'text-white',
    border: 'border-teal-600'
  },
  'MUNDO+JUSTO': {
    bg: 'bg-indigo-600',
    text: 'text-white',
    border: 'border-indigo-600'
  },
  'ESCAÑOS EN BLANCO': {
    bg: 'bg-slate-500',
    text: 'text-white',
    border: 'border-slate-500'
  },
};

export function getPartidoColor(partido: string): { bg: string; text: string; border: string } {
  return PARTIDO_COLORS[partido] || {
    bg: 'bg-gray-600',
    text: 'text-white',
    border: 'border-gray-600'
  };
}
