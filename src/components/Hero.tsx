'use client';

import Link from 'next/link';
import { Bot, GraduationCap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          
          <div className="mb-12">
            <div className="inline-flex flex-col md:flex-row items-center gap-6 px-8 py-6 rounded-2xl bg-slate-900/80 border border-red-500/30 shadow-2xl shadow-red-900/20 backdrop-blur-md hover:border-red-500/50 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
                </span>
                <span className="text-red-400 font-mono font-bold tracking-[0.2em] uppercase text-sm md:text-base">OBJETIVO ACTIVO</span>
              </div>
              <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                  CORTES DE ARAGÓN
                </h2>
                <p className="text-slate-300 text-sm md:text-base font-mono tracking-[0.3em] uppercase">8 DE FEBRERO DE 2026</p>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight">
            INTELIGENCIA ARTIFICIAL
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-glow block mt-2">
              CONTRA EL FRAUDE
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            La tecnología al servicio de la democracia. Un sistema integral de <strong className="text-white">asesoramiento legal 24h</strong> y <strong className="text-white">escrutinio ciudadano</strong> verificado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#asesor" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              <Bot className="w-5 h-5" />
              Hablar con Asesor IA
            </a>
            <Link href="/campus" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Formación Ciudadana
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
