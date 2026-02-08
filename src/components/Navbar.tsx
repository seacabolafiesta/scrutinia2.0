'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-40 top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logoscrutinia.png" alt="Logo" width={40} height={40} />
            <span className="font-bold text-xl tracking-tighter text-white">SCRUTINIA</span>
          </Link>
          
          <div className="md:hidden">
            <Link href="/campus" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              Campus
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#asesor" className="hover:text-cyan-400 transition-colors px-3 py-2 text-sm font-medium">Asesor IA</a>
              <span className="text-slate-600 cursor-not-allowed px-3 py-2 text-sm font-medium select-none" title="Disponible durante la jornada electoral">Escrutinio</span>
              <Link href="/campus" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-900/20">
                Campus Virtual
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
