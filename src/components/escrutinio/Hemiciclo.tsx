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

  const mayoriaAbsoluta = Math.floor(totalEscaños / 2) + 1;
  const totalAsignados = partidosOrdenados.reduce((sum, [, c]) => sum + c, 0);

  // --- SVG semicircle parameters ---
  const svgW = 500;
  const svgH = 280;
  const cx = svgW / 2;
  const cy = svgH - 20;
  const outerR = 230;
  const innerR = 100;
  const numRows = 4;
  const rowGap = 3;
  const rowThick = (outerR - innerR - rowGap * (numRows - 1)) / numRows;

  // Build arc segments (left → right = π → 0)
  const segGap = 0.015;
  const totalGaps = segGap * Math.max(partidosOrdenados.length - 1, 0);
  const availAngle = Math.PI - totalGaps;

  let cursor = Math.PI;
  const arcs = partidosOrdenados.map(([partido, count]) => {
    const frac = totalAsignados > 0 ? count / totalAsignados : 0;
    const sweep = frac * availAngle;
    const a0 = cursor;
    const a1 = cursor - sweep;
    cursor = a1 - segGap;
    return { partido, count, frac, a0, a1, color: getPartidoHexColor(partido) };
  });

  // Helper: arc‑segment <path>
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

  // Majority line angle (measured from left = π)
  const majAngle = totalAsignados > 0
    ? Math.PI - (mayoriaAbsoluta / totalAsignados) * availAngle
    : Math.PI / 2;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white">Composición del Hemiciclo</h3>
        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Mayoría absoluta</span>
          <p className="text-lg font-bold text-cyan-400">{mayoriaAbsoluta}</p>
        </div>
      </div>

      {/* SVG Semicircle */}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Hemiciclo parlamentario">
        {/* Concentric rows of arc segments */}
        {Array.from({ length: numRows }).map((_, row) => {
          const rOut = outerR - row * (rowThick + rowGap);
          const rIn = rOut - rowThick;
          return arcs.map((seg) => (
            <path
              key={`${seg.partido}-r${row}`}
              d={arcD(seg.a0, seg.a1, rOut, rIn)}
              fill={seg.color}
              stroke="rgba(15,23,42,0.6)"
              strokeWidth="1"
            />
          ));
        })}

        {/* Seat count labels (centered on middle row) */}
        {arcs.map((seg) => {
          if (seg.frac < 0.045) return null;
          const mid = (seg.a0 + seg.a1) / 2;
          const labelR = (outerR + innerR) / 2;
          const lx = cx + labelR * Math.cos(mid);
          const ly = cy - labelR * Math.sin(mid);
          const fs = seg.frac > 0.12 ? 18 : seg.frac > 0.07 ? 15 : 12;
          return (
            <text
              key={`lbl-${seg.partido}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontWeight="bold"
              fontSize={fs}
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
            >
              {seg.count}
            </text>
          );
        })}

        {/* Majority dashed line */}
        <line
          x1={cx + (innerR - 8) * Math.cos(majAngle)}
          y1={cy - (innerR - 8) * Math.sin(majAngle)}
          x2={cx + (outerR + 8) * Math.cos(majAngle)}
          y2={cy - (outerR + 8) * Math.sin(majAngle)}
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.7"
        />

        {/* Center text */}
        <text x={cx} y={cy - 18} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="600">
          Mayoría
        </text>
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#94a3b8" fontSize="11">
          {mayoriaAbsoluta} escaños
        </text>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-4">
        {partidosOrdenados.map(([partido, count]) => (
          <div key={partido} className="flex items-center gap-2 min-w-0">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: getPartidoHexColor(partido) }}
            />
            <span className="text-slate-300 truncate">
              <span className="font-semibold text-white">{getPartidoDisplayName(partido)}</span>
              <span className="text-slate-400 ml-1">{count}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
        <p className="text-slate-400 text-sm">
          Total: <span className="font-bold text-white">{totalAsignados}</span> / {totalEscaños} escaños
        </p>
      </div>
    </div>
  );
}
