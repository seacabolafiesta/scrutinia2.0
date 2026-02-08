'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Search, Download, Eye, FileText, MapPin, X } from 'lucide-react';
import { useActasBrowser } from '@/hooks/useActasBrowser';
import { getPartidoHexColor, getPartidoDisplayName } from '@/lib/partido-colors';

export default function ActasPage() {
  const {
    provincias,
    municipios,
    mesas,
    actaDetalle,
    provinciaSel,
    municipioSel,
    mesaSel,
    isLoading,
    setProvinciaSel,
    setMunicipioSel,
    selectMesa,
  } = useActasBrowser();

  const [showVisor, setShowVisor] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/logoscrutinia.png" alt="Logo" width={40} height={40} />
              <span className="font-bold text-xl tracking-tighter text-white">
                SCRUTINIA <span className="text-cyan-400 font-light">ACTAS</span>
              </span>
            </Link>
            <Link href="/escrutinio" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Volver al escrutinio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Repositorio de Actas
          </h1>
          <p className="text-slate-400">
            Consulta los votos por mesa electoral y visualiza las actas escaneadas.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Filtrar por ubicación</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Provincia */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Provincia</label>
              <select
                value={provinciaSel}
                onChange={(e) => setProvinciaSel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Selecciona provincia</option>
                {provincias.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Municipio */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Municipio</label>
              <select
                value={municipioSel}
                onChange={(e) => setMunicipioSel(e.target.value)}
                disabled={!provinciaSel}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-40"
              >
                <option value="">Todos los municipios</option>
                {municipios.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Mesa selector */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Mesa</label>
              <select
                value={mesaSel}
                onChange={(e) => selectMesa(e.target.value)}
                disabled={mesas.length === 0}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-40"
              >
                <option value="">Todas las mesas</option>
                {mesas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.municipio} — D{m.distrito_censal} S{m.seccion} Mesa {m.mesa}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Mesa detail */}
        {actaDetalle && !isLoading && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Votes card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white mb-1">
                  Mesa {actaDetalle.mesa} — {actaDetalle.municipio}
                </h3>
                <p className="text-slate-400 text-sm">
                  Distrito {actaDetalle.distrito_censal} · Sección {actaDetalle.seccion} · {actaDetalle.provincia}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-px bg-slate-800">
                <div className="bg-slate-900 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{actaDetalle.votantes_total}</p>
                  <p className="text-xs text-slate-400">Votantes</p>
                </div>
                <div className="bg-slate-900 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{actaDetalle.votos_nulos}</p>
                  <p className="text-xs text-slate-400">Nulos</p>
                </div>
                <div className="bg-slate-900 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{actaDetalle.votos_blanco}</p>
                  <p className="text-xs text-slate-400">En blanco</p>
                </div>
              </div>

              {/* Party votes */}
              <div className="divide-y divide-slate-800">
                {actaDetalle.votos
                  .filter((v) => v.votos > 0)
                  .map((v) => {
                    const hex = getPartidoHexColor(v.party_id);
                    const totalVotos = actaDetalle.votos.reduce((s, x) => s + x.votos, 0);
                    const pct = totalVotos > 0 ? (v.votos / totalVotos) * 100 : 0;
                    return (
                      <div key={v.party_id} className="px-6 py-3 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: hex }} />
                        <span className="text-sm font-semibold text-white flex-1 truncate">
                          {getPartidoDisplayName(v.party_id)}
                        </span>
                        <span className="text-sm text-slate-400 tabular-nums mr-3">
                          {pct.toFixed(1)}%
                        </span>
                        <span className="text-sm font-bold text-white tabular-nums w-10 text-right">
                          {v.votos}
                        </span>
                      </div>
                    );
                  })}
                {actaDetalle.votos.filter((v) => v.votos === 0).length > 0 && (
                  <div className="px-6 py-3">
                    <p className="text-xs text-slate-500">
                      Sin votos: {actaDetalle.votos.filter((v) => v.votos === 0).map((v) => getPartidoDisplayName(v.party_id)).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Acta image card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Acta Electoral</h3>
                </div>
                {actaDetalle.actaUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowVisor(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                    <a
                      href={actaDetalle.actaUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </a>
                  </div>
                )}
              </div>

              <div className="p-6">
                {actaDetalle.actaUrl ? (
                  <div className="relative group cursor-pointer" onClick={() => setShowVisor(true)}>
                    <img
                      src={actaDetalle.actaUrl}
                      alt={`Acta electoral ${actaDetalle.acta_key}`}
                      className="w-full rounded-lg border border-slate-700 shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML =
                          '<div class="text-center py-12"><p class="text-slate-400">Imagen no disponible para esta mesa.</p></div>';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Eye className="w-10 h-10 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No se ha encontrado imagen de acta para esta mesa.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mesa list (when no specific mesa selected) */}
        {!mesaSel && mesas.length > 0 && !isLoading && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Mesas disponibles <span className="text-slate-400 font-normal">({mesas.length})</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Municipio</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Distrito</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Sección</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Mesa</th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-300">Votantes</th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-300">Censo</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((m) => (
                    <tr key={m.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-white font-medium">{m.municipio}</td>
                      <td className="p-4 text-slate-300 font-mono text-sm">{m.distrito_censal}</td>
                      <td className="p-4 text-slate-300 font-mono text-sm">{m.seccion}</td>
                      <td className="p-4 text-white font-bold">{m.mesa}</td>
                      <td className="p-4 text-right text-white font-mono">{m.votantes_total}</td>
                      <td className="p-4 text-right text-slate-400 font-mono">{m.censo_total_electores}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => selectMesa(m.id)}
                          className="px-4 py-1.5 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 text-sm rounded-lg transition-colors font-medium"
                        >
                          <Search className="w-4 h-4 inline mr-1" />
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty states */}
        {!provinciaSel && !isLoading && (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Selecciona una provincia para explorar las actas</p>
          </div>
        )}

        {provinciaSel && mesas.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No hay actas registradas para esta selección</p>
          </div>
        )}
      </main>

      {/* Fullscreen image visor */}
      {showVisor && actaDetalle?.actaUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setShowVisor(false)}
            className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={actaDetalle.actaUrl}
              alt={`Acta electoral ${actaDetalle.acta_key}`}
              className="w-full rounded-lg"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <a
              href={actaDetalle.actaUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Descargar acta
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
