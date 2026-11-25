'use client';

import Link from 'next/link';
import { ArrowUpRight, GraduationCap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky w-full z-40 top-0 bg-[#101f2d]/95 backdrop-blur-md border-b border-white/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          <Link href="/" className="flex items-center gap-3" aria-label="Scrutinia, inicio">
            <span className="w-9 h-9 border-2 border-[#ed513c] rounded-full flex items-center justify-center text-[#ed513c] text-xl font-display font-black leading-none">S</span>
            <span className="font-display font-bold text-[27px] tracking-wide text-[#f5f1e9] leading-none">SCRUTINIA<span className="text-[#ed513c]">.</span></span>
          </Link>
          <div className="flex items-center gap-5 lg:gap-8">
            <span className="hidden lg:inline text-[11px] tracking-[.2em] font-bold text-[#a7b3b9] uppercase">Generales · 29N</span>
            <a href="#como-funciona" className="hidden md:inline text-sm font-semibold hover:text-[#ed513c] transition-colors">Cómo funciona</a>
            <a href="#asesor" className="hidden md:inline text-sm font-semibold hover:text-[#ed513c] transition-colors">Asesor IA</a>
            <Link href="/escrutinio" className="hidden lg:inline text-sm font-semibold hover:text-[#ed513c] transition-colors">Escrutinio</Link>
            <Link href="/campus" className="hidden sm:flex items-center gap-2 text-sm font-semibold hover:text-[#ed513c] transition-colors"><GraduationCap className="w-4 h-4" /> Campus</Link>
            <a href="https://wa.me/34711209894" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#ed513c] hover:bg-[#d94330] text-white px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold transition-colors">
              Enviar acta <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
