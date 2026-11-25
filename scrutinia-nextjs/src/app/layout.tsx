import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scrutinia | Elecciones generales 29N · Cada acta cuenta",
  description: "Elecciones generales 29N: participa en la verificación ciudadana del escrutinio. Envía tu acta, aprende sobre el proceso electoral y consulta al asesor IA de Scrutinia.",
  icons: {
    icon: "/faviconscrutinia.png",
    apple: "/faviconscrutinia.png",
  },
  openGraph: {
    title: "Scrutinia | Elecciones generales 29N",
    description: "Cada acta cuenta. Participa en la verificación ciudadana del escrutinio del 29N.",
    images: [{ url: "/logoscrutinia.png", width: 512, height: 512, alt: "Scrutinia Logo" }],
    type: "website",
    locale: "es_ES",
    siteName: "Scrutinia",
  },
  twitter: {
    card: "summary",
    title: "Scrutinia | Elecciones generales 29N",
    description: "Cada acta cuenta. Verificación ciudadana del escrutinio del 29N.",
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
