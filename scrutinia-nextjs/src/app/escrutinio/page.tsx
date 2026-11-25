import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarDays, FileCheck2 } from 'lucide-react';

export default function EscrutinioPage() {
  return (
    <div className="min-h-screen bg-[#101f2d] text-[#f5f1e9] relative overflow-hidden">
      <div className="absolute inset-0 campaign-grid pointer-events-none" />
      <header className="relative border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex justify-between items-center gap-4">
          <Link href="/" className="font-display text-2xl sm:text-3xl font-bold tracking-wide">SCRUTINIA<span className="text-[#ed513c]">.</span> <span className="text-[#a7b3b9] font-medium">/ ESCRUTINIO</span></Link>
          <Link href="/" className="text-sm font-bold flex items-center gap-2 hover:text-[#ed513c] transition-colors"><ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver al inicio</span></Link>
        </div>
      </header>
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
        <p className="text-[#ed513c] text-xs font-extrabold tracking-[.22em] uppercase mb-6">Elecciones generales / 29N</p>
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 lg:gap-20 items-center">
          <div>
            <h1 className="font-display font-black uppercase leading-[.85] text-[clamp(4.4rem,9vw,9rem)]">EL RECUENTO<br /><span className="text-[#ed513c]">EMPIEZA</span><br />CONTIGO.</h1>
            <p className="mt-9 max-w-lg text-[#b8c3c7] leading-relaxed text-lg">Estamos preparando el espacio de verificación ciudadana para las elecciones generales del 29N. Los resultados se mostrarán cuando existan actas de esta convocatoria verificadas.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="https://wa.me/34711209894" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#ed513c] hover:bg-[#d94330] text-white px-6 py-4 font-bold transition-colors">Enviar un acta <ArrowUpRight className="w-4 h-4" /></a>
              <Link href="/campus" className="inline-flex items-center gap-2 border border-white/30 hover:border-white px-6 py-4 font-bold transition-colors">Prepararme para el 29N</Link>
            </div>
            <Link href="/escrutinio/actas" className="inline-block mt-7 text-sm text-[#a7b3b9] underline underline-offset-4 hover:text-white transition-colors">Consultar archivo histórico de actas</Link>
          </div>
          <div className="bg-[#f5f1e9] text-[#142637] p-7 sm:p-10 shadow-[16px_16px_0_#ed513c]">
            <div className="flex items-start justify-between gap-4 border-b border-[#142637]/20 pb-6"><span className="text-xs font-bold tracking-[.2em] uppercase">Panel de escrutinio</span><CalendarDays className="text-[#ed513c] w-6 h-6" /></div>
            <div className="py-14 sm:py-20 text-center"><div className="font-display font-black text-[110px] sm:text-[150px] text-[#ed513c] leading-none">29N</div><p className="font-display font-bold text-3xl sm:text-4xl uppercase mt-4">En preparación</p></div>
            <div className="flex items-start gap-4 border-t border-[#142637]/20 pt-6 text-sm text-[#53616a] leading-relaxed"><FileCheck2 className="w-5 h-5 shrink-0 text-[#ed513c]" /><p>Sin cifras provisionales de esta convocatoria. No mostramos resultados de elecciones anteriores como si fueran del 29N.</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}
