'use client';

import Link from 'next/link';
import { Bot, GraduationCap } from 'lucide-react';
import HemicicloPreview from '@/components/HemicicloPreview';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="mb-8">
          <HemicicloPreview />
        </div>

        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-tight text-white">
            ESCRUTINIO CIUDADANO
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 block mt-1 text-2xl md:text-4xl">
              CORTES DE ARAGÓN 2026
            </span>
          </h1>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-sm md:text-base">
            IA contra el fraude electoral. <strong className="text-white">Asesoramiento legal 24h</strong> y <strong className="text-white">escrutinio ciudadano</strong> verificado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
