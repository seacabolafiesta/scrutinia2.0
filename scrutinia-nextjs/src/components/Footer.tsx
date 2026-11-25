import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-slate-900 bg-black text-center">
      <div className="flex items-center justify-center gap-3 mb-8 opacity-50 hover:opacity-100 transition-opacity">
        <Image src="/logoscrutinia.png" alt="Logo" width={32} height={32} className="grayscale" />
        <span className="font-bold text-white">SCRUTINIA</span>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        Plataforma independiente de verificación electoral.
      </p>
      <a href="mailto:info@scrutinia.com" className="text-slate-500 hover:text-white transition-colors text-sm">
        info@scrutinia.com
      </a>
    </footer>
  );
}
