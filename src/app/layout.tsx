import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { Navbar } from "@/components/navigation/Navbar";
import { SmoothScroll } from "@/components/animation/SmoothScroll";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", axes: ["wdth"] });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces", axes: ["opsz"] });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex" });
const kufi = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-kufi" });

export const metadata: Metadata = {
  metadataBase: new URL("https://wajjeha.cloud"),
  title: { default: "Wajjeha — Software Studio", template: "%s — Wajjeha" },
  description: "Wajjeha is a software studio building modern software for web, mobile and desktop — one ecosystem, every platform. Laravel, Inertia, React, Next.js, Vite, React Native, Electron, Tailwind CSS, shadcn/ui.",
  openGraph: { title: "Wajjeha — Software Studio", description: "One ecosystem. Every platform. Web, mobile and desktop software, designed and engineered together.", url: "https://wajjeha.cloud", siteName: "Wajjeha", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${fraunces.variable} ${plex.variable} ${kufi.variable} font-sans`}>
        <script dangerouslySetInnerHTML={{ __html: `try{if("scrollRestoration"in history)history.scrollRestoration="manual"}catch(e){}` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Wajjeha", alternateName: "واجهة", url: "https://wajjeha.cloud", logo: "https://wajjeha.cloud/brand/wajjeha-icon.png" }) }} />
        <SmoothScroll><Navbar />{children}</SmoothScroll>
      </body>
    </html>
  );
}
