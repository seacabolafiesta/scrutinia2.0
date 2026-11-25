'use client';

import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, MessageCircle, Send } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#101f2d]">
      <div className="absolute inset-0 campaign-grid pointer-events-none" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#ed513c]/[.07] blur-[130px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="border-b border-white/15 py-4 flex items-center justify-between gap-4 text-[10px] sm:text-xs font-bold tracking-[.18em] uppercase text-[#a7b3b9]">
          <span>Observatorio ciudadano · España</span>
          <span className="text-[#ed513c]">Edición elecciones generales 29N</span>
        </div>
        <div className="grid lg:grid-cols-[1.12fr_.88fr] items-center gap-10 lg:gap-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="reveal relative z-10">
            <div className="flex items-center gap-3 mb-7">
              <span className="w-8 h-px bg-[#ed513c]" />
              <span className="text-[#ed513c] uppercase text-xs font-bold tracking-[.22em]">El recuento nos importa a todos</span>
            </div>
            <h1 className="font-display font-black uppercase leading-[.83] tracking-[-.018em] text-[clamp(4.4rem,9vw,9rem)] text-[#f5f1e9]">
              CADA ACTA<br /><span className="text-[#ed513c]">CUENTA.</span>
            </h1>
            <p className="mt-8 max-w-[540px] text-[#c6ced0] text-base md:text-lg leading-relaxed">
              Elecciones generales 29N. Una foto de tu acta ayuda a contrastar el escrutinio. Transparencia electoral, mesa a mesa, entre todos.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="https://wa.me/34711209894" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#ed513c] hover:bg-[#d94330] text-white px-6 py-4 font-bold transition-colors">
                <MessageCircle className="w-5 h-5" /> Enviar por WhatsApp <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="https://t.me/scrutinia2_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 border border-white/30 hover:border-[#f5f1e9] text-[#f5f1e9] px-6 py-4 font-bold transition-colors">
                <Send className="w-5 h-5" /> Enviar por Telegram
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#a7b3b9] font-semibold tracking-wide">
              <span>01 / FOTOGRAFÍA</span><span className="text-[#ed513c]">→</span>
              <span>02 / VERIFICACIÓN</span><span className="text-[#ed513c]">→</span>
              <span>03 / TRANSPARENCIA</span>
            </div>
          </div>
          <div className="reveal-late relative min-h-[380px] sm:min-h-[510px] lg:min-h-[590px] flex items-center justify-center" aria-label="29 de noviembre, elecciones generales">
            <div className="absolute w-[330px] h-[330px] sm:w-[480px] sm:h-[480px] rounded-full border border-white/15" />
            <div className="absolute w-[250px] h-[250px] sm:w-[370px] sm:h-[370px] rounded-full border border-white/10" />
            <div className="absolute top-[12%] left-[7%] sm:left-[12%] bg-[#f5f1e9] text-[#142637] w-[215px] sm:w-[290px] p-5 sm:p-7 shadow-[20px_24px_0_rgba(0,0,0,.16)] -rotate-[8deg]">
              <div className="flex justify-between border-b border-[#142637]/25 pb-3 text-[10px] font-bold tracking-[.16em] uppercase"><span>Scrutinia / 29N</span><span>Acta 001</span></div>
              <div className="font-display font-black text-4xl sm:text-5xl leading-none mt-5">TU MESA.<br />TU VOZ.</div>
              <div className="mt-8 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="flex items-center gap-3"><span className="w-4 h-4 border border-[#142637]/40" /><span className="h-px flex-1 bg-[#142637]/25" /></div>)}</div>
              <div className="mt-8 flex justify-end"><span className="border-2 border-[#ed513c] text-[#ed513c] uppercase text-[10px] sm:text-xs font-black tracking-widest px-2 py-1 rotate-[-9deg]">Tu acta cuenta</span></div>
            </div>
            <div className="absolute right-[1%] sm:right-[2%] bottom-[8%] sm:bottom-[10%] bg-[#ed513c] text-[#f5f1e9] p-5 sm:p-8 rotate-[6deg] shadow-[0_20px_60px_rgba(0,0,0,.3)]">
              <span className="text-[10px] sm:text-xs font-bold tracking-[.24em] uppercase block border-b border-white/40 pb-2">Generales / España</span>
              <span className="font-display font-black text-[100px] sm:text-[145px] leading-[.85] tracking-[-.06em] block mt-3">29<span className="text-[52px] sm:text-[75px]">N</span></span>
              <span className="text-xs font-bold uppercase tracking-[.22em] block mt-3">Noviembre · 2026</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 flex flex-wrap items-center justify-between gap-4 py-5 text-xs font-bold tracking-[.16em] uppercase text-[#a7b3b9]">
          <span>Una elección. Miles de mesas. Una verdad verificable.</span>
          <Link href="#como-funciona" className="inline-flex items-center gap-2 text-[#f5f1e9] hover:text-[#ed513c] transition-colors">Descubre cómo funciona <ArrowDownRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
}
