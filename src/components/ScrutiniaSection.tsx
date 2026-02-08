'use client';

import Link from 'next/link';
import { ScanLine, Camera, Cpu, Globe, GraduationCap, ArrowRight } from 'lucide-react';
import HemicicloPreview from '@/components/HemicicloPreview';

export default function ScrutiniaSection() {
  return (
    <>
      <section id="scrutinia2" className="py-24 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-blue-900/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-blue-400 font-mono text-sm font-bold tracking-widest uppercase mb-4">
              <ScanLine className="w-4 h-4" />
              Fase 2: Verificación Total
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">SCRUTINIA <span className="text-blue-500">2.0</span></h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              El primer sistema de escrutinio paralelo, descentralizado y verificable.
              <br />
              <strong>Solo necesitamos una foto. La IA hace el resto.</strong>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden mb-16">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">Escrutinio Ciudadano en Directo</h3>
              <p className="text-slate-400 mb-8 text-center">
                Composición del hemiciclo según las actas procesadas por IA.
              </p>
              <HemicicloPreview />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center group hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Fotografía</h3>
              <p className="text-slate-400">Haz una foto al acta electoral oficial con tu móvil. Envíala por WhatsApp o Telegram.</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center group hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Procesamiento IA</h3>
              <p className="text-slate-400">Nuestro algoritmo extrae los datos, verifica firmas y cuadra los números automáticamente.</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center group hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Resultados en Directo</h3>
              <p className="text-slate-400">Publicación inmediata en scrutinia.com. Código abierto y repositorio público de actas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 border-t border-slate-900 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Campus Virtual Scrutinia</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              La única forma de evitar el fraude es conociendo la ley.
              <br />
              Hemos preparado un <strong className="text-indigo-400">curso intensivo gratuito</strong> dividido en módulos clave.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { id: 0, title: 'Introducción', desc: 'Bienvenida y objetivos. Por qué la verificación ciudadana es vital.' },
              { id: 1, title: 'Estructura en Elecciones', desc: 'Comprendiendo el sistema electoral y los roles clave.' },
              { id: 2, title: 'El Colegio Electoral', desc: 'Requisitos físicos, cabinas, urnas y material electoral.' },
              { id: 3, title: 'Guía para Apoderados', desc: 'Tus derechos, obligaciones y cómo actuar ante irregularidades.' },
              { id: 4, title: 'Constitución y Votación', desc: 'Protocolo de mesa, acreditación y resolución de incidencias.' },
              { id: 5, title: 'Escrutinio', desc: 'Apertura de urnas, conteo de votos y redacción de actas.' },
              { id: 6, title: 'Especial Atención', desc: 'Puntos críticos y errores frecuentes a vigilar.' },
              { id: 7, title: 'Uso de Scrutinia', desc: 'Tutorial para enviar actas y verificar datos con IA.' }
            ].map((module) => (
              <div key={module.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/50 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  {module.id}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{module.title}</h3>
                <p className="text-slate-400 text-sm">{module.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/campus" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20 text-lg group">
              <GraduationCap className="w-6 h-6" />
              Acceder al Curso Completo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-4 text-slate-500 text-sm">Sin registro • Acceso inmediato • 100% Gratuito</p>
          </div>
        </div>
      </section>
    </>
  );
}
