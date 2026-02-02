'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  const getVimeoUrl = (videoId: string) => {
    return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&playsinline=0`;
  };

  const ModuleItem = ({ module }: { module: Module }) => {
    const isComingSoon = module.status === 'coming_soon';
    const isActive = currentModule.id === module.id;

    return (
      <div
        onClick={() => handleModuleClick(module)}
        className={`group flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-slate-800/50 ${
          isActive ? 'active-module' : 'text-slate-400'
        } ${isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold ${
          isActive 
            ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10' 
            : 'border-slate-700 bg-slate-800 text-slate-500'
        }`}>
          {module.id}
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${
            isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'
          }`}>
            {module.title}
          </h4>
          <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            {isComingSoon ? (
              'PRÓXIMAMENTE'
            ) : (
              <>
                <PlayCircle className="w-3 h-3" />
                {module.duration}
              </>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center px-6 justify-between z-20">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <Image src="/logoscrutinia.png" alt="Scrutinia Logo" width={32} height={32} />
          <span className="font-bold text-lg tracking-tight text-white">
            SCRUTINIA <span className="text-cyan-400 font-light">CAMPUS</span>
          </span>
        </Link>
        <Link href="/" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop) */}
        <aside className="w-full md:w-80 flex-none bg-slate-900/50 border-r border-slate-800 overflow-y-auto flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-800/50">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Contenido del curso</h2>
            <h3 className="text-xl font-bold text-white">Formación Electoral</h3>
          </div>
          
          <div className="flex flex-col py-2">
            {modules.map((module) => (
              <ModuleItem key={module.id} module={module} />
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-black relative flex flex-col">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900 flex-none">
            <span className="font-bold text-white text-sm truncate mr-2">
              {currentModule.title}
            </span>
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <span className="text-xs font-medium">Módulos</span>
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Drawer */}
          <div className={`fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm transform transition-transform duration-300 md:hidden flex flex-col ${
            isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white">Módulos</h3>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="text-slate-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 py-2">
              {modules.map((module) => (
                <ModuleItem key={module.id} module={module} />
              ))}
            </div>
          </div>

          {/* Video Container */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-10 overflow-y-auto">
            <div className="w-full max-w-4xl">
              <div className="bg-slate-900 rounded-lg md:rounded-xl shadow-2xl border border-slate-800 relative">
                {currentModule.videoId ? (
                  <div className="vimeo-container">
                    <iframe
                      src={getVimeoUrl(currentModule.videoId)}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={`Video: ${currentModule.title}`}
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                    <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center px-4">Próximamente disponible</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-8 px-1">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                  {currentModule.title}
                </h1>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                  {currentModule.description}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
      
      <style jsx global>{`
        .active-module {
          background: rgba(14, 165, 233, 0.1);
          border-left: 3px solid #0ea5e9;
        }
        
        .vimeo-container {
          padding: 56.25% 0 0 0;
          position: relative;
        }
        
        .vimeo-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
