import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b1823] text-[#f5f1e9] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:justify-between gap-10 border-b border-white/15 pb-12">
          <div><Link href="/" className="font-display text-4xl font-black tracking-wide">SCRUTINIA<span className="text-[#ed513c]">.</span></Link><p className="text-[#a7b3b9] text-sm mt-3 max-w-sm">Plataforma independiente de verificación electoral. Elecciones generales 29N.</p></div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold">
            <Link href="/campus" className="hover:text-[#ed513c] transition-colors">Campus</Link>
            <Link href="/escrutinio" className="hover:text-[#ed513c] transition-colors">Escrutinio 29N</Link>
            <Link href="/aviso-legal" className="hover:text-[#ed513c] transition-colors">Aviso legal</Link>
            <Link href="/politica-privacidad" className="hover:text-[#ed513c] transition-colors">Privacidad</Link>
            <a href="mailto:info@scrutinia.com" className="hover:text-[#ed513c] transition-colors">Contacto</a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 pt-6 text-[11px] font-semibold tracking-[.14em] uppercase text-[#7d8e98]"><span>© {new Date().getFullYear()} Scrutinia · Software libre</span><span>El recuento también es tuyo / 29N</span></div>
      </div>
    </footer>
  );
}
