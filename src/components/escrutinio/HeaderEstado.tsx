'use client';

import { Clock, Users, TrendingUp } from 'lucide-react';

interface HeaderEstadoProps {
  porcentajeEscrutado: number;
  participacion: number;
  actasEscrutadas: number;
  totalMesas: number;
  censoEscrutado?: number;
  censoTotal?: number;
  ultimaActualizacion?: Date;
}

export default function HeaderEstado({
  porcentajeEscrutado,
  participacion,
  actasEscrutadas,
  totalMesas,
  censoEscrutado,
  censoTotal,
  ultimaActualizacion
}: HeaderEstadoProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Escrutado</p>
            <p className="text-2xl font-bold text-white">
              {porcentajeEscrutado.toFixed(2)}%
            </p>
            <p className="text-xs text-slate-500">
              {censoEscrutado && censoTotal
                ? `${censoEscrutado.toLocaleString('es-ES')} / ${censoTotal.toLocaleString('es-ES')} electores`
                : `${actasEscrutadas.toLocaleString()} / ${totalMesas.toLocaleString()} mesas`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Participación</p>
            <p className="text-2xl font-bold text-white">
              {participacion.toFixed(2)}%
            </p>
            <p className="text-xs text-slate-500">Datos provisionales</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Última actualización</p>
            <p className="text-lg font-bold text-white">
              {ultimaActualizacion 
                ? ultimaActualizacion.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                : 'En espera'}
            </p>
            <p className="text-xs text-slate-500">Actualización automática</p>
          </div>
        </div>
      </div>
    </div>
  );
}
