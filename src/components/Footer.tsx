import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-slate-900 bg-black text-center">
      <div className="flex items-center justify-center gap-3 mb-8 opacity-50 hover:opacity-100 transition-opacity">
        <Image src="/logoscrutinia.png" alt="Logo" width={32} height={32} className="grayscale" />
        <span className="font-bold text-white">SCRUTINIA</span>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Plataforma independiente de verificación electoral.
      </p>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 text-sm">
        <Link href="/aviso-legal" className="text-slate-500 hover:text-cyan-400 transition-colors">
          Aviso Legal
        </Link>
        <Link href="/politica-privacidad" className="text-slate-500 hover:text-cyan-400 transition-colors">
          Política de Privacidad
        </Link>
        <a href="mailto:info@scrutinia.com" className="text-slate-500 hover:text-cyan-400 transition-colors">
          Contacto
        </a>
      </div>

      <div className="text-xs text-slate-600">
        © {new Date().getFullYear()} Scrutinia - Software Libre
      </div>
    </footer>
  );
}
