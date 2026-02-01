'use client';

import { useState } from 'react';
import { getPartidoColor } from '@/lib/partido-colors';
import type { SeatsResult } from '@/lib/dhondt';
import { Plus, Minus } from 'lucide-react';

interface PactometroProps {
  escaños: SeatsResult;
  mayoriaAbsoluta: number;
}

export default function Pactometro({ escaños, mayoriaAbsoluta }: PactometroProps) {
  const [selectedPartidos, setSelectedPartidos] = useState<Set<string>>(new Set());

  const togglePartido = (partido: string) => {
    const newSet = new Set(selectedPartidos);
    if (newSet.has(partido)) {
      newSet.delete(partido);
    } else {
      newSet.add(partido);
    }
    setSelectedPartidos(newSet);
  };

  const totalEscañosSeleccionados = Array.from(selectedPartidos).reduce(
    (sum, partido) => sum + (escaños[partido] || 0),
    0
  );

  const tieneMayoria = totalEscañosSeleccionados >= mayoriaAbsoluta;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Pactómetro</h3>
      <p className="text-slate-400 text-sm mb-6">
        Selecciona partidos para calcular posibles coaliciones. Mayoría absoluta: <span className="font-bold text-white">{mayoriaAbsoluta}</span> escaños.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {Object.entries(escaños)
          .filter(([, seats]) => seats > 0)
          .sort(([, a], [, b]) => b - a)
          .map(([partido, seats]) => {
            const isSelected = selectedPartidos.has(partido);
            const colors = getPartidoColor(partido);

            return (
              <button
                key={partido}
                onClick={() => togglePartido(partido)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{partido}</span>
                  <span className="font-bold">{seats}</span>
                </div>
                {isSelected && (
                  <div className="mt-1 text-xs opacity-75">✓ Seleccionado</div>
                )}
              </button>
            );
          })}
      </div>

      <div className={`p-4 rounded-lg border-2 ${
        tieneMayoria 
          ? 'bg-green-500/10 border-green-500/50' 
          : 'bg-slate-800/50 border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-semibold">Total Coalición:</span>
          <span className={`text-3xl font-bold ${tieneMayoria ? 'text-green-400' : 'text-white'}`}>
            {totalEscañosSeleccionados}
          </span>
        </div>
        {tieneMayoria && (
          <p className="text-green-400 text-sm mt-2 font-semibold">
            ✓ MAYORÍA ABSOLUTA ALCANZADA
          </p>
        )}
        {!tieneMayoria && selectedPartidos.size > 0 && (
          <p className="text-slate-400 text-sm mt-2">
            Faltan {mayoriaAbsoluta - totalEscañosSeleccionados} escaños para mayoría absoluta
          </p>
        )}
      </div>
    </div>
  );
}
