'use client';

import { getPartidoColor } from '@/lib/partido-colors';
import type { SeatsResult } from '@/lib/dhondt';

interface HemicicloProps {
  escaños: SeatsResult;
  totalEscaños: number;
}

export default function Hemiciclo({ escaños, totalEscaños }: HemicicloProps) {
  const partidosOrdenados = Object.entries(escaños)
    .sort(([, a], [, b]) => b - a)
    .filter(([, seats]) => seats > 0);

  const seats: Array<{ partido: string; index: number }> = [];
  partidosOrdenados.forEach(([partido, count]) => {
    for (let i = 0; i < count; i++) {
      seats.push({ partido, index: seats.length });
    }
  });

  const rows = 5;
  const seatsPerRow = Math.ceil(totalEscaños / rows);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Composición del Hemiciclo</h3>
      
      <div className="flex flex-col gap-2 items-center mb-8">
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const startIndex = rowIndex * seatsPerRow;
          const endIndex = Math.min(startIndex + seatsPerRow, totalEscaños);
          const seatsInRow = seats.slice(startIndex, endIndex);
          
          const rowWidth = 100 - (rowIndex * 15);
          
          return (
            <div 
              key={rowIndex} 
              className="flex gap-1 justify-center"
              style={{ width: `${rowWidth}%` }}
            >
              {seatsInRow.map((seat, idx) => {
                const colors = getPartidoColor(seat.partido);
                return (
                  <div
                    key={`${seat.partido}-${idx}`}
                    className={`w-3 h-3 rounded-full ${colors.bg} hover:scale-150 transition-transform cursor-pointer`}
                    title={`${seat.partido} - Escaño ${seat.index + 1}`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {partidosOrdenados.map(([partido, count]) => {
          const colors = getPartidoColor(partido);
          return (
            <div key={partido} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${colors.bg}`} />
              <span className="text-sm text-slate-300">
                <span className="font-bold text-white">{partido}</span>: {count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700 text-center">
        <p className="text-slate-400 text-sm">
          Total: <span className="font-bold text-white">{Object.values(escaños).reduce((sum, s) => sum + s, 0)}</span> / {totalEscaños} escaños
        </p>
      </div>
    </div>
  );
}
