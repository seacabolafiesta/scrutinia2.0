'use client';

import { getPartidoHexColor, getPartidoDisplayName } from '@/lib/partido-colors';
import type { SeatsResult } from '@/lib/dhondt';

interface HemicicloProps {
  escaños: SeatsResult;
  totalEscaños: number;
}

export default function Hemiciclo({ escaños, totalEscaños }: HemicicloProps) {
  const partidosOrdenados = Object.entries(escaños)
    .sort(([, a], [, b]) => b - a)
    .filter(([, seats]) => seats > 0);

  const maxEscaños = partidosOrdenados.length > 0 ? partidosOrdenados[0][1] : 1;
  const mayoriaAbsoluta = Math.floor(totalEscaños / 2) + 1;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Reparto de Escaños</h3>
        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Mayoría absoluta</span>
          <p className="text-lg font-bold text-cyan-400">{mayoriaAbsoluta}</p>
        </div>
      </div>

      <div className="space-y-3">
        {partidosOrdenados.map(([partido, count]) => {
          const hexColor = getPartidoHexColor(partido);
          const barWidth = (count / maxEscaños) * 100;

          return (
            <div key={partido} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: hexColor }}
                  />
                  <span className="text-sm font-semibold text-white truncate">
                    {getPartidoDisplayName(partido)}
                  </span>
                </div>
                <span className="text-sm font-bold text-white ml-2 tabular-nums">
                  {count}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.max(barWidth, 4)}%`,
                    backgroundColor: hexColor,
                  }}
                >
                  {count > 1 && (
                    <span className="text-[10px] font-bold text-white/90 drop-shadow-sm">
                      {count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Línea de mayoría absoluta */}
      {partidosOrdenados.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Total asignados: <span className="font-bold text-white">{Object.values(escaños).reduce((sum, s) => sum + s, 0)}</span> / {totalEscaños}
            </span>
            <span className="text-slate-500 text-xs">
              Mayoría: {mayoriaAbsoluta} escaños
            </span>
          </div>
          {/* Barra resumen proporcional */}
          <div className="mt-3 w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
            {partidosOrdenados.map(([partido, count]) => {
              const hexColor = getPartidoHexColor(partido);
              const segmentWidth = (count / totalEscaños) * 100;
              return (
                <div
                  key={partido}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${segmentWidth}%`,
                    backgroundColor: hexColor,
                  }}
                  title={`${getPartidoDisplayName(partido)}: ${count}`}
                />
              );
            })}
          </div>
          {/* Marca de mayoría absoluta */}
          <div className="relative mt-1" style={{ height: '12px' }}>
            <div
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${(mayoriaAbsoluta / totalEscaños) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-px h-2 bg-cyan-400"></div>
              <span className="text-[9px] text-cyan-400 font-mono">{mayoriaAbsoluta}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
