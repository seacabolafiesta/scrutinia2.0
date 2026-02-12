'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText } from 'lucide-react';
import HeaderEstado from '@/components/escrutinio/HeaderEstado';
import Hemiciclo from '@/components/escrutinio/Hemiciclo';
import TablaResultados from '@/components/escrutinio/TablaResultados';
import Pactometro from '@/components/escrutinio/Pactometro';
import SelectorGeografico from '@/components/escrutinio/SelectorGeografico';
import { useRealtimeScrutiny } from '@/hooks/useRealtimeScrutiny';
import { calculateDHondt, calculatePercentages } from '@/lib/dhondt';
import { getEscañosProvincia, type Provincia } from '@/lib/elections-config';

// ⚠️ TOGGLE: cambiar a false para mostrar resultados completos
const SHOW_AUDIT_MODE = false;

const CENSO_TOTAL: Record<string, number> = {
  ARAGON: 991893,
  HUESCA: 165992,
  TERUEL: 100430,
  ZARAGOZA: 725471,
};

export default function EscrutinioPage() {
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Provincia | 'ARAGON'>('ARAGON');
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());

  const { resultados, estadisticas, isLoading } = useRealtimeScrutiny(
    provinciaSeleccionada !== 'ARAGON' ? provinciaSeleccionada : undefined
  );

  useEffect(() => {
    if (estadisticas.ultima_actualizacion) {
      setUltimaActualizacion(new Date(estadisticas.ultima_actualizacion));
    } else if (resultados.length > 0) {
      setUltimaActualizacion(new Date());
    }
  }, [resultados, estadisticas.ultima_actualizacion]);

  const votosMap: { [partido: string]: number } = {};
  resultados.forEach((r) => {
    votosMap[r.candidatura] = r.votos_totales || 0;
  });

  const totalEscaños = provinciaSeleccionada !== 'ARAGON' 
    ? getEscañosProvincia(provinciaSeleccionada)
    : 67;

  const { seats } = calculateDHondt(votosMap, totalEscaños, 0.03);
  const porcentajes = calculatePercentages(votosMap);

  const totalVotos = Object.values(votosMap).reduce((sum, v) => sum + v, 0);
  const totalMesas = 2213;
  const actasEscrutadas = estadisticas.actas_escrutadas;
  const censoKey = provinciaSeleccionada === 'ARAGON' ? 'ARAGON' : provinciaSeleccionada;
  const censoTotal = CENSO_TOTAL[censoKey] || CENSO_TOTAL.ARAGON;
  const censoEscrutado = estadisticas.total_censo || 0;
  const porcentajeEscrutado = censoTotal > 0 ? (censoEscrutado / censoTotal) * 100 : 0;
  const participacion = estadisticas.participacion;

  const mayoriaAbsoluta = Math.floor(totalEscaños / 2) + 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando datos del escrutinio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/logoscrutinia.png" alt="Logo" width={40} height={40} />
              <span className="font-bold text-xl tracking-tighter text-white">
                SCRUTINIA <span className="text-cyan-400 font-light">ESCRUTINIO</span>
              </span>
            </Link>
            <Link href="/" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Escrutinio en Tiempo Real
          </h1>
          <p className="text-slate-400">
            Cortes de Aragón 2026 - Resultados provisionales
          </p>
        </div>

        {SHOW_AUDIT_MODE ? (
          <>
            <div className="mb-8 bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-2 text-center">Composición del Hemiciclo</h3>
              <svg viewBox="0 0 500 280" className="w-full max-w-xl mx-auto opacity-30">
                {[0, 1, 2, 3].map((row) => {
                  const outerR = 230;
                  const innerR = 100;
                  const rowThick = (outerR - innerR - 3 * 3) / 4;
                  const rOut = outerR - row * (rowThick + 3);
                  const rIn = rOut - rowThick;
                  const cx = 250, cy = 260;
                  const x1 = cx + rOut * Math.cos(Math.PI);
                  const y1 = cy - rOut * Math.sin(Math.PI);
                  const x2 = cx + rOut * Math.cos(0);
                  const y2 = cy - rOut * Math.sin(0);
                  const x3 = cx + rIn * Math.cos(0);
                  const y3 = cy - rIn * Math.sin(0);
                  const x4 = cx + rIn * Math.cos(Math.PI);
                  const y4 = cy - rIn * Math.sin(Math.PI);
                  return (
                    <path
                      key={`gray-r${row}`}
                      d={`M${x1},${y1} A${rOut},${rOut} 0 0 1 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 0 0 ${x4},${y4}Z`}
                      fill="#334155"
                      stroke="rgba(15,23,42,0.6)"
                      strokeWidth="1"
                    />
                  );
                })}
                <text x={250} y={242} textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Mayoría</text>
                <text x={250} y={258} textAnchor="middle" fill="#64748b" fontSize="11">34 escaños</text>
              </svg>
            </div>
            <div className="p-10 bg-slate-900/50 border border-cyan-500/30 rounded-xl text-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-3">
                SCRUTINIA 2.0 está auditando las actas
              </p>
              <p className="text-slate-400 text-lg">
                Pronto verás los resultados
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <SelectorGeografico
              provinciaSeleccionada={provinciaSeleccionada}
              onProvinciaChange={setProvinciaSeleccionada}
            />

            <HeaderEstado
              porcentajeEscrutado={porcentajeEscrutado}
              participacion={participacion}
              actasEscrutadas={actasEscrutadas}
              totalMesas={totalMesas}
              censoEscrutado={censoEscrutado}
              censoTotal={censoTotal}
              ultimaActualizacion={ultimaActualizacion}
            />

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Hemiciclo escaños={seats} totalEscaños={totalEscaños} />
              <Pactometro escaños={seats} mayoriaAbsoluta={mayoriaAbsoluta} />
            </div>

            <TablaResultados
              votos={votosMap}
              porcentajes={porcentajes}
              escaños={seats}
              showEscaños={provinciaSeleccionada !== 'ARAGON'}
            />

            <Link
              href="/escrutinio/actas"
              className="mt-8 flex items-center justify-center gap-3 p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors group"
            >
              <FileText className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-white font-bold">Repositorio de Actas</p>
                <p className="text-slate-400 text-sm">Consulta votos por mesa y descarga las actas escaneadas</p>
              </div>
            </Link>

            {totalVotos === 0 && (
              <div className="mt-8 p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                <p className="text-slate-400 text-lg">
                  Esperando datos del escrutinio...
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Los resultados aparecerán automáticamente cuando se procesen las primeras actas.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
