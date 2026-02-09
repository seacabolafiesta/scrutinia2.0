'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRealtimeScrutiny } from '@/hooks/useRealtimeScrutiny';
import { calculateDHondt } from '@/lib/dhondt';
import { getPartidoHexColor, getPartidoDisplayName } from '@/lib/partido-colors';
import Hemiciclo from '@/components/escrutinio/Hemiciclo';

function GrayHemiciclo() {
  const svgW = 500;
  const svgH = 280;
  const cx = svgW / 2;
  const cy = svgH - 20;
  const outerR = 230;
  const innerR = 100;
  const numRows = 4;
  const rowGap = 3;
  const rowThick = (outerR - innerR - rowGap * (numRows - 1)) / numRows;

  const arcD = (a0: number, a1: number, rOut: number, rIn: number) => {
    const x1 = cx + rOut * Math.cos(a0);
    const y1 = cy - rOut * Math.sin(a0);
    const x2 = cx + rOut * Math.cos(a1);
    const y2 = cy - rOut * Math.sin(a1);
    const x3 = cx + rIn * Math.cos(a1);
    const y3 = cy - rIn * Math.sin(a1);
    const x4 = cx + rIn * Math.cos(a0);
    const y4 = cy - rIn * Math.sin(a0);
    const large = a0 - a1 > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${rOut},${rOut} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 ${large} 0 ${x4},${y4}Z`;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white">Composición del Hemiciclo</h3>
        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Mayoría absoluta</span>
          <p className="text-lg font-bold text-cyan-400">34</p>
        </div>
      </div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto opacity-30">
        {Array.from({ length: numRows }).map((_, row) => {
          const rOut = outerR - row * (rowThick + rowGap);
          const rIn = rOut - rowThick;
          return (
            <path
              key={`gray-r${row}`}
              d={arcD(Math.PI, 0, rOut, rIn)}
              fill="#334155"
              stroke="rgba(15,23,42,0.6)"
              strokeWidth="1"
            />
          );
        })}
        <text x={cx} y={cy - 18} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">
          Mayoría
        </text>
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#64748b" fontSize="11">
          34 escaños
        </text>
      </svg>
      <p className="text-center text-slate-500 text-sm mt-4 animate-pulse">
        Esperando primeras actas...
      </p>
    </div>
  );
}

export default function HemicicloPreview() {
  const { resultados, isLoading } = useRealtimeScrutiny();

  const votosMap: { [partido: string]: number } = {};
  resultados.forEach((r) => {
    votosMap[r.candidatura] = r.votos_totales || 0;
  });

  const totalEscaños = 67;
  const { seats } = calculateDHondt(votosMap, totalEscaños, 0.03);
  const hasData = Object.values(seats).some((s) => s > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ⚠️ TOGGLE: cambiar a false para mostrar resultados completos
  const SHOW_AUDIT_MODE = true;

  return (
    <div>
      {SHOW_AUDIT_MODE ? (
        <GrayHemiciclo />
      ) : hasData ? (
        <Hemiciclo escaños={seats} totalEscaños={totalEscaños} />
      ) : (
        <GrayHemiciclo />
      )}
      <div className="text-center mt-6">
        <Link
          href="/escrutinio"
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 text-lg group"
        >
          Ver resultados completos
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
