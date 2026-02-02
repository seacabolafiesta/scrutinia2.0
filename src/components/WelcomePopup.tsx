'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-900/50 rounded-2xl p-8 md:p-10 max-w-lg mx-4 text-center shadow-2xl shadow-cyan-900/20">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-50"></div>
        <div className="relative">
          <Image src="/logoscrutinia.png" alt="Scrutinia" width={96} height={96} className="mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
            Bienvenido a <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Scrutinia 2.0</span>
          </h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Miles de ciudadanos están verificando el recuento de actas electorales directamente desde su teléfono móvil.
          </p>
          <div className="flex flex-col gap-2 text-left bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
            <p className="text-slate-200">📱 Sin partidos</p>
            <p className="text-slate-200">📄 Sin discursos</p>
            <p className="text-slate-200">👁️ Sin intermediarios</p>
          </div>
          <p className="text-slate-400 text-sm mb-4">Solo datos reales, actas oficiales y verificación ciudadana.</p>
          <div className="border-t border-slate-700/50 pt-6">
            <button 
              onClick={handleClose}
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 uppercase tracking-wider text-sm shadow-lg shadow-cyan-900/30"
            >
              Entendido, quiero participar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
