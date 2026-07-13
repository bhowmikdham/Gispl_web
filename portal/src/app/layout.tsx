import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

/* Self-hosted at build — the portal makes no Google Fonts CDN request.
   Weights mirror the parent site; never style italic 500/600 Plex Sans
   (the public site doesn't load those and would faux-render). */
const archivo = Archivo({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-archivo", display: "swap" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: "GISPL Client Portal",
  description: "Secure client portal for GISPL engagements, findings and deliverables.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0A1A30" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
