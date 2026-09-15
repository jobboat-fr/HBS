import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site, annonce } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VigilChat } from "@/components/mascot/VigilChat";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.baseline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "formation intelligence artificielle",
    "formation IA",
    "formation IA entreprise",
    "formation IA en ligne",
    "formation IA à distance",
    "formation IA Rouen",
    "formation IA Normandie",
    "formation IA générative",
    "formation ChatGPT",
    "formation agents IA",
    "formation automatisation IA",
    "formation prompt",
    "formation AI Act",
    "obligation formation IA article 4",
    "maîtrise de l'IA salariés",
    "formation IA OPCO",
    "formation IA France Travail",
    "formation IA demandeur d'emploi",
    "formation IA Qualiopi",
    "formation IA particulier",
    "organisme de formation Rouen",
    "formation professionnelle IA",
    "CPF",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.baseline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Pas de `alternates.canonical` ici : hérité par toutes les pages, il désignait l'accueil
  // comme version canonique de chacune — Google les traitait comme des doublons de « / ».
  // Chaque page déclare la sienne.
  ...(process.env.GOOGLE_SITE_VERIFICATION || process.env.BING_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
          other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
        },
      }
    : {}),
  category: "education",
};

// Le bandeau calcule la prochaine session : aucune page ne garde une date plus d'une heure.
export const revalidate = 3600;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body
        className="bg-white font-body text-ink-soft antialiased"
        style={{ "--entete": annonce.actif ? "112px" : "72px" } as React.CSSProperties}
      >
        <OrganizationJsonLd />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <VigilChat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
