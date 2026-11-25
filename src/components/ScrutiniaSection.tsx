import Link from 'next/link';
import { ArrowUpRight, Camera, ScanLine, ChartNoAxesCombined, GraduationCap } from 'lucide-react';

const steps = [
  { number: '01', icon: Camera, title: 'Fotografía el acta', description: 'Cuando esté disponible, haz una foto legible del acta de escrutinio de tu mesa.' },
  { number: '02', icon: ScanLine, title: 'Envíala en segundos', description: 'Compártela a través de WhatsApp o Telegram para ayudar a contrastar los datos.' },
  { number: '03', icon: ChartNoAxesCombined, title: 'Contrasta el recuento', description: 'Cada acta aportada suma una pieza al escrutinio ciudadano del 29N.' },
];

export default function ScrutiniaSection() {
  return (
    <>
      <section id="como-funciona" className="relative bg-[#f5f1e9] text-[#142637] py-20 md:py-28 scroll-mt-20 overflow-hidden">
        <div className="absolute inset-0 paper-grid pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div>
              <p className="text-[#d94330] text-xs font-extrabold tracking-[.22em] uppercase mb-4">01 / El método</p>
              <h2 className="font-display text-6xl md:text-[90px] font-black uppercase leading-[.85] max-w-2xl">La verdad empieza<br />en tu mesa<span className="text-[#ed513c]">.</span></h2>
            </div>
            <p className="max-w-xs text-[#53616a] leading-relaxed text-sm md:text-base">Un proceso sencillo para hacer visible lo que sucede en cada colegio electoral.</p>
          </div>
          <div className="grid md:grid-cols-3 border-t border-[#142637]/25">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <article key={number} className="py-9 md:py-12 pr-6 md:pr-10 md:pl-8 border-b md:border-b-0 md:border-r border-[#142637]/20 first:pl-0 last:border-r-0">
                <div className="flex justify-between items-start mb-12">
                  <span className="font-display text-6xl font-black text-[#d9d8d0] leading-none">{number}</span>
                  <Icon className="w-7 h-7 text-[#ed513c]" strokeWidth={1.6} />
                </div>
                <h3 className="font-display text-3xl font-bold uppercase mb-3">{title}</h3>
                <p className="text-[#53616a] leading-relaxed text-sm">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 bg-[#142637] text-[#f5f1e9] px-6 py-5">
            <span className="text-sm font-semibold">El 29N, tu acta puede marcar la diferencia.</span>
            <a href="https://wa.me/34711209894" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#ff8b78] font-bold text-sm hover:text-white transition-colors">Participar <ArrowUpRight className="w-4 h-4" /></a>
          </div>
        </div>
      </section>

      <section id="campus" className="bg-[#e9e4da] text-[#142637] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[#d94330] text-xs font-extrabold tracking-[.22em] uppercase mb-4">02 / Prepárate para el 29N</p>
            <h2 className="font-display text-6xl md:text-[84px] font-black uppercase leading-[.87] mb-7">Conocer el<br />proceso es<br /><span className="text-[#ed513c]">protegerlo.</span></h2>
            <p className="text-[#53616a] leading-relaxed max-w-md mb-8">Aprende cómo funciona una mesa electoral, qué observar durante la jornada y cómo documentar el escrutinio. A tu ritmo y gratis.</p>
            <Link href="/campus" className="inline-flex items-center gap-3 bg-[#ed513c] hover:bg-[#d94330] text-white px-6 py-4 font-bold transition-colors"><GraduationCap className="w-5 h-5" /> Entrar al campus <ArrowUpRight className="w-4 h-4" /></Link>
          </div>
          <div className="bg-[#142637] text-[#f5f1e9] p-6 sm:p-10 lg:p-12 shadow-[16px_16px_0_#d1cbbf]">
            <div className="flex justify-between gap-3 border-b border-white/20 pb-5 mb-7 text-[11px] font-bold tracking-[.2em] uppercase text-[#a7b3b9]"><span>Campus Scrutinia</span><span>Acceso libre / 08 módulos</span></div>
            {[
              ['01', 'Estructura electoral'],
              ['02', 'El colegio y la mesa'],
              ['03', 'Votación y garantías'],
              ['04', 'Escrutinio y actas'],
            ].map(([number, title]) => (
              <div key={number} className="flex items-center gap-6 py-4 border-b border-white/15">
                <span className="font-display text-3xl font-bold text-[#ed513c]">{number}</span>
                <span className="font-display text-2xl sm:text-3xl font-semibold uppercase">{title}</span>
                <ArrowUpRight className="w-4 h-4 ml-auto text-[#a7b3b9] shrink-0" />
              </div>
            ))}
            <p className="text-[#a7b3b9] text-xs mt-8 uppercase tracking-[.16em]">Vídeos breves · Sin registro · Gratuito</p>
          </div>
        </div>
      </section>
    </>
  );
}
