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
  const totalMesas = 1487;
  const actasEscrutadas = estadisticas.actas_escrutadas;
  const porcentajeEscrutado = (actasEscrutadas / totalMesas) * 100;
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

        <SelectorGeografico
          provinciaSeleccionada={provinciaSeleccionada}
          onProvinciaChange={setProvinciaSeleccionada}
        />

        <HeaderEstado
          porcentajeEscrutado={porcentajeEscrutado}
          participacion={participacion}
          actasEscrutadas={actasEscrutadas}
          totalMesas={totalMesas}
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
              📊 Esperando datos del escrutinio...
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Los resultados aparecerán automáticamente cuando se procesen las primeras actas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
