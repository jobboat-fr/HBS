import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HubChat } from "@/components/mascot/HubChat";
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
    "formation professionnelle",
    "organisme de formation Rouen",
    "bilan de compétences",
    "VAE",
    "apprentissage CFA",
    "e-learning",
    "formation certifiante",
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
  alternates: { canonical: site.url },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-white font-body text-ink-soft antialiased">
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
        <HubChat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
