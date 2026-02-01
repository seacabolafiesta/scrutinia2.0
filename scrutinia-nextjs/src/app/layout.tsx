import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCRUTINIA - Control Electoral Ciudadano - Cortes de Aragón 2026",
  description: "Scrutinia: Inteligencia Artificial contra el fraude electoral. Asesor legal 24h y escrutinio ciudadano en tiempo real para las elecciones de Cortes de Aragón 2026.",
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
