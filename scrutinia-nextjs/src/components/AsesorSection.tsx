import { ArrowUpRight, Bot, MessageCircle, Send, ShieldCheck } from 'lucide-react';

export default function AsesorSection() {
  return (
    <section id="asesor" className="relative bg-[#101f2d] text-[#f5f1e9] py-20 md:py-28 scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 campaign-grid pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="text-[#ed513c] text-xs font-extrabold tracking-[.22em] uppercase mb-4">03 / No estás solo</p>
          <h2 className="font-display text-6xl md:text-[86px] font-black uppercase leading-[.87] mb-7">Dudas en la<br />mesa<span className="text-[#ed513c]">?</span><br />Pregunta.</h2>
          <p className="text-[#b8c3c7] leading-relaxed max-w-md mb-8">Nuestro asesor electoral con IA te ayuda a orientarte sobre el proceso y la normativa. Si detectas una incidencia, documenta lo ocurrido y consulta los cauces oficiales.</p>
          <div className="flex flex-wrap gap-3">
            <a href="https://wa.me/34711240342" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#ed513c] hover:bg-[#d94330] px-5 py-4 font-bold text-sm transition-colors"><MessageCircle className="w-5 h-5" /> Consultar por WhatsApp <ArrowUpRight className="w-4 h-4" /></a>
            <a href="https://t.me/agente_scrutinia_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/30 hover:border-white px-5 py-4 font-bold text-sm transition-colors"><Send className="w-5 h-5" /> Telegram</a>
          </div>
          <p className="text-xs text-[#899ba3] mt-6">Orientación automatizada. No sustituye el asesoramiento jurídico profesional.</p>
        </div>
        <div className="relative bg-[#f5f1e9] text-[#142637] p-6 sm:p-9 shadow-[15px_15px_0_#ed513c]">
          <div className="flex items-center justify-between gap-3 border-b border-[#142637]/20 pb-5 mb-8">
            <div className="flex items-center gap-3"><span className="w-10 h-10 bg-[#ed513c] text-white grid place-items-center"><Bot className="w-5 h-5" /></span><div><p className="font-bold text-sm">Asesor electoral IA</p><p className="text-xs text-[#66727a]">Guía para la jornada electoral</p></div></div>
            <ShieldCheck className="w-5 h-5 text-[#ed513c]" />
          </div>
          <div className="space-y-5">
            <div className="bg-[#e8e3d9] p-4 max-w-[88%] text-sm leading-relaxed">¿Qué debo hacer si observo una incidencia durante el recuento?</div>
            <div className="bg-[#142637] text-[#f5f1e9] p-5 ml-auto max-w-[92%] text-sm leading-relaxed">Anota lo sucedido, conserva la documentación disponible y comunícalo a la mesa o a la autoridad electoral correspondiente. Puedo ayudarte a identificar el procedimiento aplicable.</div>
          </div>
          <div className="mt-10 border-t border-[#142637]/20 pt-5 flex items-center justify-between text-[10px] font-bold tracking-[.15em] uppercase text-[#66727a]"><span>Información para actuar mejor</span><span>29N / 2026</span></div>
        </div>
      </div>
    </section>
  );
}
