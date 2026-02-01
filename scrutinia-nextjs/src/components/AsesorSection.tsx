'use client';

import { ShieldCheck, Bot, User, CheckCircle } from 'lucide-react';

export default function AsesorSection() {
  return (
    <section id="asesor" className="py-24 relative bg-slate-950 border-y border-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="relative bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 border border-slate-800 shadow-2xl">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-none">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                    <p className="text-slate-300">Hola, soy tu Asesor Electoral IA. Estoy conectado a la LOREG y a la Junta Electoral Central.</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-none">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="bg-indigo-600 rounded-2xl rounded-tr-none p-4 max-w-[85%]">
                    <p className="text-white">Me quieren echar del colegio electoral por llevar una camiseta con la bandera de España.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-none">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                    <p className="text-slate-300">
                      <strong className="text-white block mb-2">⚠️ ALERTA: POSIBLE IRREGULARIDAD</strong>
                      Según la Junta Electoral, llevar símbolos nacionales no es motivo de expulsión salvo que incluya propaganda electoral explícita.
                      <br /><br />
                      <span className="text-cyan-400">Estoy notificando al responsable de tu zona para que acuda inmediatamente.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold tracking-widest uppercase mb-4">
              <ShieldCheck className="w-4 h-4" />
              Fase 1: Protección Activa
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Tu abogado electoral en el bolsillo, 24h.</h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Nuestro agente inteligente está entrenado con toda la documentación electoral vigente (LOREG, jurisprudencia, JEC). 
              Resuelve tus dudas al instante y, lo más importante, <strong>detecta emergencias en tiempo real</strong>.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3 text-slate-300">
                <CheckCircle className="w-6 h-6 text-green-500 flex-none" />
                <span>Asesoramiento jurídico inmediato antes y durante la votación.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <CheckCircle className="w-6 h-6 text-green-500 flex-none" />
                <span>Protocolo de emergencia: conexión directa con responsables de zona.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <CheckCircle className="w-6 h-6 text-green-500 flex-none" />
                <span>Protección contra abusos y arbitrariedades en las mesas.</span>
              </li>
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/34711240342" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Consultar en WhatsApp
              </a>
              <a href="https://t.me/agente_scrutinia_bot" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Consultar en Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
