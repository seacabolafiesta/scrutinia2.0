'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, List, X, PlayCircle } from 'lucide-react';
import { modules, type Module } from '@/lib/modules-data';

export default function CampusPage() {
  const [currentModule, setCurrentModule] = useState<Module>(modules[0]);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleModuleClick = (module: Module) => {
    if (module.status === 'coming_soon') return;
    setCurrentModule(module);
    setIsMobileDrawerOpen(false);
  };

  const ModuleItem = ({ module }: { module: Module }) => {
    const isComingSoon = module.status === 'coming_soon';
    const isActive = currentModule.id === module.id;
    return (
      <button
        type="button"
        disabled={isComingSoon}
        onClick={() => handleModuleClick(module)}
        aria-current={isActive ? 'true' : undefined}
        className={`w-full text-left flex items-center gap-4 p-4 border-b border-[#142637]/10 transition-colors hover:bg-[#e9e4da] ${isActive ? 'bg-[#e9e4da] border-l-4 border-l-[#ed513c]' : 'border-l-4 border-l-transparent'} disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <span className={`font-display text-2xl font-bold ${isActive ? 'text-[#ed513c]' : 'text-[#7e898b]'}`}>{String(module.id + 1).padStart(2, '0')}</span>
        <span className="flex-1 min-w-0"><span className="font-bold text-xs sm:text-sm text-[#142637] block truncate">{module.title}</span><span className="text-xs text-[#6a767a] mt-1 flex items-center gap-1">{isComingSoon ? 'PRÓXIMAMENTE' : <><PlayCircle className="w-3 h-3" /> {module.duration}</>}</span></span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-[#f5f1e9] text-[#142637]">
      <header className="flex-none h-[76px] border-b border-white/15 bg-[#101f2d] text-[#f5f1e9] flex items-center px-4 sm:px-6 justify-between z-20 gap-4">
        <Link href="/" className="font-display text-2xl sm:text-3xl font-bold tracking-wide">SCRUTINIA<span className="text-[#ed513c]">.</span> <span className="font-medium text-[#a7b3b9]">/ CAMPUS</span></Link>
        <Link href="/" className="text-sm font-bold flex items-center gap-2 hover:text-[#ed513c] transition-colors"><ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Volver al inicio</span></Link>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-80 lg:w-96 flex-none bg-[#f5f1e9] border-r border-[#142637]/20 overflow-y-auto flex-col hidden md:flex">
          <div className="p-6 border-b border-[#142637]/20"><p className="text-[#d94330] text-[11px] font-extrabold tracking-[.2em] uppercase mb-2">29N / Formación ciudadana</p><h2 className="font-display text-4xl font-bold uppercase leading-none">Conoce el proceso.</h2></div>
          <div className="flex flex-col">{modules.map((module) => <ModuleItem key={module.id} module={module} />)}</div>
        </aside>

        <main className="flex-1 min-w-0 bg-[#e9e4da] relative flex flex-col">
          <div className="md:hidden p-3 border-b border-[#142637]/20 flex justify-between items-center bg-[#f5f1e9] flex-none gap-2">
            <span className="font-bold text-[#142637] text-sm truncate">{currentModule.title}</span>
            <button type="button" onClick={() => setIsMobileDrawerOpen(true)} aria-label="Abrir módulos" className="flex items-center gap-2 bg-[#142637] text-white px-3 py-2 shrink-0"><span className="text-xs font-bold">Módulos</span><List className="w-4 h-4" /></button>
          </div>
          {isMobileDrawerOpen && <div className="fixed inset-0 z-50 bg-[#f5f1e9] md:hidden flex flex-col"><div className="p-4 border-b border-[#142637]/20 flex justify-between items-center"><h3 className="font-display text-3xl font-bold uppercase">Módulos / 29N</h3><button type="button" onClick={() => setIsMobileDrawerOpen(false)} aria-label="Cerrar módulos"><X className="w-6 h-6" /></button></div><div className="overflow-y-auto flex-1">{modules.map((module) => <ModuleItem key={module.id} module={module} />)}</div></div>}
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8 lg:p-12">
            <div className="w-full max-w-4xl">
              <p className="text-[#d94330] text-[11px] font-extrabold tracking-[.2em] uppercase mb-4">Campus Scrutinia / Módulo {String(currentModule.id + 1).padStart(2, '0')}</p>
              <div className="bg-[#101f2d] shadow-[10px_10px_0_#d1cbbf]">
                {currentModule.videoId ? <div className="relative aspect-video"><iframe src={`https://player.vimeo.com/video/${currentModule.videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&playsinline=0`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={`Vídeo: ${currentModule.title}`} className="absolute inset-0 w-full h-full" /></div> : <div className="aspect-video flex flex-col items-center justify-center text-[#a7b3b9]"><PlayCircle className="w-16 h-16 mb-4 opacity-50" /><p>Próximamente disponible</p></div>}
              </div>
              <div className="mt-8 border-t border-[#142637]/25 pt-6"><h1 className="font-display text-4xl sm:text-5xl font-bold uppercase mb-3">{currentModule.title}</h1><p className="text-[#53616a] leading-relaxed max-w-2xl">{currentModule.description}</p></div>
            </div>
          </div>
        </main>
      </div>
      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
    </div>
  );
}
