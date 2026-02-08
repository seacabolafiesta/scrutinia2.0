import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCRUTINIA - Control Electoral Ciudadano - Cortes de Aragón 2026",
  description: "Scrutinia: Inteligencia Artificial contra el fraude electoral. Asesor legal 24h y escrutinio ciudadano en tiempo real para las elecciones de Cortes de Aragón 2026.",
  icons: {
    icon: "/faviconscrutinia.png",
    apple: "/faviconscrutinia.png",
  },
  openGraph: {
    title: "SCRUTINIA - Control Electoral Ciudadano",
    description: "Inteligencia Artificial contra el fraude electoral. Asesor legal 24h y escrutinio ciudadano en tiempo real para las elecciones de Cortes de Aragón 2026.",
    images: [{ url: "/logoscrutinia.png", width: 512, height: 512, alt: "Scrutinia Logo" }],
    type: "website",
    locale: "es_ES",
    siteName: "Scrutinia",
  },
  twitter: {
    card: "summary",
    title: "SCRUTINIA - Control Electoral Ciudadano",
    description: "IA contra el fraude electoral. Asesor legal 24h y escrutinio ciudadano en tiempo real.",
    images: ["/logoscrutinia.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
