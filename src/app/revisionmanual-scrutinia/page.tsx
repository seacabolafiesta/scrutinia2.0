'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, AlertTriangle, CheckCircle, XCircle, Search,
  Eye, X, Download, Save, Trash2, ArrowRight, FileText
} from 'lucide-react';
import { useAdminActasError } from '@/hooks/useAdminActasError';
import { getPartidoHexColor, getPartidoDisplayName } from '@/lib/partido-colors';
import type { MesaSugerida } from '@/hooks/useAdminActasError';

export default function RevisionManualPage() {
  const {
    actasError,
    selectedActa,
    votos,
    mesasSugeridas,
    actaImageUrl,
    isLoading,
    isMigrating,
    message,
    selectActa,
    buscarMesa,
    updateVoto,
    guardarVotos,
    guardarCamposActa,
    migrarActa,
    descartarActa,
    impugnarActa,
    sobrescribirActa,
    fetchExistingActaByKey,
    setMessage,
  } = useAdminActasError();

  const [showVisor, setShowVisor] = useState(false);
  const [searchMesa, setSearchMesa] = useState('');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [confirmMigrate, setConfirmMigrate] = useState(false);
  const [confirmImpugnar, setConfirmImpugnar] = useState(false);
  
  // Conflict / Duplicate State
  const [conflictActa, setConflictActa] = useState<any>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // Editable overrides
  const [editProvincia, setEditProvincia] = useState('');
  const [editMunicipio, setEditMunicipio] = useState('');
  const [editDistrito, setEditDistrito] = useState('');
  const [editSeccion, setEditSeccion] = useState('');
  const [editMesa, setEditMesa] = useState('');
  const [editVotantes, setEditVotantes] = useState(0);
  const [editNulos, setEditNulos] = useState(0);
  const [editBlanco, setEditBlanco] = useState(0);

  // Derived calculations
  const totalVotosPartidos = votos.reduce((acc, v) => acc + v.votos, 0);
  const totalCalculado = totalVotosPartidos + editNulos + editBlanco;
  const isSumCorrect = totalCalculado === editVotantes;

  const handleSelectActa = (acta: typeof actasError[0]) => {
    selectActa(acta);
    setEditProvincia(acta.provincia || '');
    setEditMunicipio(acta.municipio || '');
    setEditDistrito(acta.distrito_censal || '');
    setEditSeccion(acta.seccion || '');
    setEditMesa(acta.mesa || '');
    setEditVotantes(acta.votantes_total || 0);
    setEditNulos(acta.votos_nulos || 0);
    setEditBlanco(acta.votos_blanco || 0);
    setConfirmDiscard(false);
    setConfirmMigrate(false);
    setConfirmImpugnar(false);
    setConflictActa(null);
    setShowConflictModal(false);
    setSearchMesa('');
  };

  const handleSelectMesaSugerida = (mesa: MesaSugerida) => {
    setEditProvincia(mesa.provincia);
    setEditMunicipio(mesa.municipio);
    setEditDistrito(mesa.distrito);
    setEditSeccion(mesa.seccion);
    setEditMesa(mesa.mesa);
    setSearchMesa('');
    setMessage({ type: 'success', text: `Mesa seleccionada: ${mesa.codigo_unico}` });
  };

  const handleMigrar = async () => {
    // 1. Check for duplicate key first
    const targetKey = `${editProvincia}|${editMunicipio}|${editDistrito}|${editSeccion}|${editMesa}`;
    const existing = await fetchExistingActaByKey(targetKey);

    if (existing) {
      setConflictActa(existing);
      setShowConflictModal(true);
      setConfirmMigrate(false);
      return;
    }

    // 2. If no duplicate, proceed with migration
    migrarActa({
      provincia: editProvincia,
      municipio: editMunicipio,
      distrito_censal: editDistrito,
      seccion: editSeccion,
      mesa: editMesa,
      votantes_total: editVotantes,
      votos_nulos: editNulos,
      votos_blanco: editBlanco,
    });
    setConfirmMigrate(false);
  };

  const handleOverwrite = () => {
    if (conflictActa) {
      sobrescribirActa(conflictActa.id);
      setShowConflictModal(false);
      setConflictActa(null);
    }
  };

  const handleDescartar = () => {
    descartarActa();
    setConfirmDiscard(false);
  };

  const handleImpugnar = () => {
    impugnarActa();
    setConfirmImpugnar(false);
  };

  const handleSearchMesa = (q: string) => {
    setSearchMesa(q);
    buscarMesa(q);
  };
  
  const handleAutoFixTotal = () => {
    setEditVotantes(totalCalculado);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/logoscrutinia.png" alt="Logo" width={40} height={40} />
              <span className="font-bold text-xl tracking-tighter text-white">
                SCRUTINIA <span className="text-amber-400 font-light">ADMIN</span>
              </span>
            </Link>
            <Link href="/escrutinio" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Escrutinio
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Revisión Manual de Actas
          </h1>
          <p className="text-slate-400">
            Revisa, corrige y aprueba actas con errores de transcripción.
          </p>
        </div>

        {/* Message banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-900/30 border border-emerald-700 text-emerald-300'
              : 'bg-red-900/30 border border-red-700 text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="text-sm">{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Conflict Modal */}
        {showConflictModal && conflictActa && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Conflicto: Acta Duplicada
              </h3>
              <p className="text-slate-400 mb-6">
                Ya existe un acta registrada para la mesa <strong>{conflictActa.acta_key.replace(/\|/g, ' ')}</strong>.
                ¿Qué deseas hacer?
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Existente en Base de Datos</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p>Votantes: <span className="font-mono text-white">{conflictActa.votantes_total}</span></p>
                    <p>Nulos: <span className="font-mono text-white">{conflictActa.votos_nulos}</span></p>
                    <p>Blancos: <span className="font-mono text-white">{conflictActa.votos_blanco}</span></p>
                    <p className="text-xs text-slate-500 mt-2">Registrada: {new Date(conflictActa.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-emerald-900/10 p-4 rounded-xl border border-emerald-900/30">
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Nueva (Revisión)</h4>
                  <div className="space-y-1 text-sm text-emerald-100">
                    <p>Votantes: <span className="font-mono font-bold">{editVotantes}</span></p>
                    <p>Nulos: <span className="font-mono font-bold">{editNulos}</span></p>
                    <p>Blancos: <span className="font-mono font-bold">{editBlanco}</span></p>
                    <p className="text-xs text-emerald-400/60 mt-2">Ahora mismo</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleOverwrite}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors"
                >
                  Sobrescribir (Usar Nueva)
                </button>
                <button
                  onClick={handleDescartar}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                >
                  Mantener Existente (Descartar Nueva)
                </button>
              </div>
              <button 
                onClick={() => setShowConflictModal(false)}
                className="w-full mt-3 py-2 text-slate-500 hover:text-slate-300 text-sm"
              >
                Cancelar y volver a editar
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && actasError.length === 0 && !selectedActa && (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <p className="text-white text-xl font-bold">No hay actas pendientes de revisión</p>
            <p className="text-slate-400 mt-2">Todas las actas están correctas.</p>
          </div>
        )}

        {/* List view */}
        {!selectedActa && actasError.length > 0 && !isLoading && (
          <div className="space-y-4">
            {actasError.map((acta) => {
              const issues = Array.isArray(acta.issues) ? acta.issues : [];
              const errorCount = issues.filter((i: string) => i.startsWith('ERROR')).length;
              const warnCount = issues.filter((i: string) => i.startsWith('WARN')).length;

              return (
                <button
                  key={acta.id}
                  onClick={() => handleSelectActa(acta)}
                  className="w-full text-left bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <h3 className="text-white font-bold truncate">{acta.acta_key}</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">
                        {acta.provincia} · {acta.municipio} · D{acta.distrito_censal} S{acta.seccion} Mesa {acta.mesa}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {errorCount > 0 && (
                          <span className="px-2 py-0.5 bg-red-900/40 text-red-400 text-xs rounded-full font-medium">
                            {errorCount} error{errorCount > 1 ? 'es' : ''}
                          </span>
                        )}
                        {warnCount > 0 && (
                          <span className="px-2 py-0.5 bg-amber-900/40 text-amber-400 text-xs rounded-full font-medium">
                            {warnCount} aviso{warnCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-mono font-bold">{acta.votantes_total} votantes</p>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(acta.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Detail view */}
        {selectedActa && (
          <div>
            {/* Back button */}
            <button
              onClick={() => { selectActa(null as any); setConfirmDiscard(false); setConfirmMigrate(false); }}
              className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la lista
            </button>

            {/* Issues list */}
            {selectedActa.issues && (selectedActa.issues as string[]).length > 0 && (
              <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-5 mb-6">
                <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Incidencias detectadas
                </h4>
                <ul className="space-y-1">
                  {(selectedActa.issues as string[]).map((issue: string, i: number) => (
                    <li key={i} className={`text-sm flex items-start gap-2 ${
                      issue.startsWith('ERROR') ? 'text-red-400' :
                      issue.startsWith('WARN') ? 'text-amber-300' : 'text-blue-300'
                    }`}>
                      <span className="mt-0.5">•</span>
                      <span className="font-mono text-xs">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI message */}
            {selectedActa.human_message && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 mb-6">
                <h4 className="text-slate-300 font-bold mb-2 text-sm">Mensaje de la IA</h4>
                <p className="text-slate-400 text-sm whitespace-pre-wrap">{selectedActa.human_message}</p>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* LEFT: Image */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <h4 className="text-white font-bold">Imagen del Acta</h4>
                  </div>
                  {actaImageUrl && (
                    <div className="flex gap-2">
                      <button onClick={() => setShowVisor(true)} className="p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <a href={actaImageUrl} download target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {actaImageUrl ? (
                    <img
                      src={actaImageUrl}
                      alt="Acta con error"
                      className="w-full rounded-lg border border-slate-700 cursor-pointer"
                      onClick={() => setShowVisor(true)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Imagen no disponible</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Editable form */}
              <div className="space-y-6">
                {/* Mesa search */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    Buscar mesa correcta
                  </h4>
                  <input
                    type="text"
                    value={searchMesa}
                    onChange={(e) => handleSearchMesa(e.target.value)}
                    placeholder="Escribe nombre de municipio..."
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                  {mesasSugeridas.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                      {mesasSugeridas.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleSelectMesaSugerida(m)}
                          className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                        >
                          <span className="text-white font-medium">{m.municipio}</span>
                          <span className="text-slate-400"> · {m.provincia} · D{m.distrito} S{m.seccion} Mesa {m.mesa}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Editable fields */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-white font-bold mb-4">Datos de la mesa</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Provincia</label>
                      <input value={editProvincia} onChange={(e) => setEditProvincia(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Municipio</label>
                      <input value={editMunicipio} onChange={(e) => setEditMunicipio(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Distrito</label>
                      <input value={editDistrito} onChange={(e) => setEditDistrito(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Sección</label>
                      <input value={editSeccion} onChange={(e) => setEditSeccion(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Mesa</label>
                      <input value={editMesa} onChange={(e) => setEditMesa(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Votantes</label>
                      <input type="number" value={editVotantes} onChange={(e) => setEditVotantes(parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none ${!isSumCorrect ? 'border-red-500' : 'border-slate-700'}`} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nulos</label>
                      <input type="number" value={editNulos} onChange={(e) => setEditNulos(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">En blanco</label>
                      <input type="number" value={editBlanco} onChange={(e) => setEditBlanco(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                    </div>
                  </div>

                  {/* Sum Validation Warning */}
                  {!isSumCorrect && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center justify-between">
                      <div className="text-xs text-red-300">
                        <span className="font-bold">Error de suma:</span> {totalVotosPartidos} (votos) + {editNulos} (nulos) + {editBlanco} (blancos) = <strong>{totalCalculado}</strong>
                      </div>
                      <button 
                        onClick={handleAutoFixTotal}
                        className="text-xs px-2 py-1 bg-red-800 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        Corregir Total
                      </button>
                    </div>
                  )}
                </div>

                {/* Editable votes */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-bold">Votos por partido</h4>
                    <button onClick={guardarVotos} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors">
                      <Save className="w-3 h-3" />
                      Guardar votos
                    </button>
                  </div>
                  <div className="space-y-2">
                    {votos.map((v) => (
                      <div key={v.party_id} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: getPartidoHexColor(v.party_id) }} />
                        <span className="text-sm text-white flex-1 truncate">{getPartidoDisplayName(v.party_id)}</span>
                        <input
                          type="number"
                          value={v.votos}
                          onChange={(e) => updateVoto(v.party_id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm text-right focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                          min={0}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-sm">
                    <span className="text-slate-400">Total votos partidos</span>
                    <span className="text-white font-bold font-mono">
                      {totalVotosPartidos}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {/* Migrate button */}
                  {!confirmMigrate ? (
                    <button
                      onClick={() => setConfirmMigrate(true)}
                      disabled={isMigrating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Aprobar y migrar a tablas buenas
                    </button>
                  ) : (
                    <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-4">
                      <p className="text-emerald-300 text-sm mb-3">
                        ¿Seguro? Se migrará con: <strong>{editProvincia}|{editMunicipio}|{editDistrito}|{editSeccion}|{editMesa}</strong>
                      </p>
                      <div className="flex gap-2">
                        <button onClick={handleMigrar} disabled={isMigrating}
                          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm">
                          {isMigrating ? 'Migrando...' : 'Confirmar migración'}
                        </button>
                        <button onClick={() => setConfirmMigrate(false)}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {/* Discard button */}
                    {!confirmDiscard ? (
                      <button
                        onClick={() => setConfirmDiscard(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium rounded-xl transition-colors border border-slate-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Descartar
                      </button>
                    ) : (
                      <div className="col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-3 flex flex-col gap-2">
                        <p className="text-white text-xs text-center">¿Eliminar permanentemente?</p>
                        <div className="flex gap-2">
                          <button onClick={handleDescartar} className="flex-1 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-500">Sí, eliminar</button>
                          <button onClick={() => setConfirmDiscard(false)} className="flex-1 py-1.5 bg-slate-600 text-white text-xs rounded hover:bg-slate-500">Cancelar</button>
                        </div>
                      </div>
                    )}

                    {/* Impugnar button */}
                    {!confirmImpugnar ? (
                      <button
                        onClick={() => setConfirmImpugnar(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 hover:text-red-400 font-medium rounded-xl transition-colors border border-red-900/50"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Impugnar
                      </button>
                    ) : (
                      <div className="col-span-2 bg-red-900/20 border border-red-900/50 rounded-xl p-3 flex flex-col gap-2">
                        <p className="text-red-300 text-xs text-center">¿Marcar como impugnable?</p>
                        <div className="flex gap-2">
                          <button onClick={handleImpugnar} className="flex-1 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-500">Sí, impugnar</button>
                          <button onClick={() => setConfirmImpugnar(false)} className="flex-1 py-1.5 bg-slate-800 text-white text-xs rounded hover:bg-slate-700">Cancelar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen image visor */}
      {showVisor && actaImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button onClick={() => setShowVisor(false)} className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors z-50">
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img src={actaImageUrl} alt="Acta electoral" className="w-full rounded-lg" />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <a href={actaImageUrl} download target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors">
              <Download className="w-5 h-5" />
              Descargar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
