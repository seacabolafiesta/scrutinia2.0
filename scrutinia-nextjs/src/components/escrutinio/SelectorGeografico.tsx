'use client';

import { PROVINCIAS, type Provincia } from '@/lib/elections-config';
import { MapPin } from 'lucide-react';

interface SelectorGeograficoProps {
  provinciaSeleccionada: Provincia | 'ARAGON';
  onProvinciaChange: (provincia: Provincia | 'ARAGON') => void;
  municipios?: string[];
  municipioSeleccionado?: string;
  onMunicipioChange?: (municipio: string) => void;
}

export default function SelectorGeografico({
  provinciaSeleccionada,
  onProvinciaChange,
  municipios = [],
  municipioSeleccionado,
  onMunicipioChange
}: SelectorGeograficoProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">Filtros Geográficos</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Provincia / Aragón
          </label>
          <select
            value={provinciaSeleccionada}
            onChange={(e) => onProvinciaChange(e.target.value as Provincia | 'ARAGON')}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ARAGON">Aragón (Global)</option>
            {PROVINCIAS.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {municipios.length > 0 && onMunicipioChange && (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Municipio
            </label>
            <select
              value={municipioSeleccionado || ''}
              onChange={(e) => onMunicipioChange(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todos los municipios</option>
              {municipios.map((mun) => (
                <option key={mun} value={mun}>
                  {mun}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
