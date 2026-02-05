'use client';

import { getPartidoColor, getPartidoDisplayName } from '@/lib/partido-colors';
import type { VotesMap, SeatsResult } from '@/lib/dhondt';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TablaResultadosProps {
  votos: VotesMap;
  porcentajes: { [partido: string]: number };
  escaños: SeatsResult;
  showEscaños?: boolean;
}

export default function TablaResultados({
  votos,
  porcentajes,
  escaños,
  showEscaños = true
}: TablaResultadosProps) {
  const resultados = Object.entries(votos)
    .map(([partido, votosCount]) => ({
      partido,
      votos: votosCount,
      porcentaje: porcentajes[partido] || 0,
      escaños: escaños[partido] || 0
    }))
    .sort((a, b) => b.votos - a.votos);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-xl font-bold text-white">Resultados Detallados</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate-300">#</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-300">Partido</th>
              <th className="text-right p-4 text-sm font-semibold text-slate-300">Votos</th>
              <th className="text-right p-4 text-sm font-semibold text-slate-300">%</th>
              {showEscaños && (
                <th className="text-right p-4 text-sm font-semibold text-slate-300">Escaños</th>
              )}
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado, index) => {
              const colors = getPartidoColor(resultado.partido);
              return (
                <tr 
                  key={resultado.partido}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 text-slate-400 font-mono text-sm">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                      <span className="font-semibold text-white">{getPartidoDisplayName(resultado.partido)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-white">
                    {resultado.votos.toLocaleString('es-ES')}
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-white">{resultado.porcentaje.toFixed(2)}%</span>
                  </td>
                  {showEscaños && (
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-full ${colors.bg} ${colors.text} font-bold`}>
                        {resultado.escaños}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-800/30 border-t border-slate-800">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Total de votos</span>
          <span className="font-bold text-white font-mono">
            {Object.values(votos).reduce((sum, v) => sum + v, 0).toLocaleString('es-ES')}
          </span>
        </div>
        {showEscaños && (
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-slate-400">Total escaños asignados</span>
            <span className="font-bold text-white">
              {Object.values(escaños).reduce((sum, s) => sum + s, 0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
