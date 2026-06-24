import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
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
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: site.name }],
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
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-black text-[color:var(--color-text-primary)] font-body antialiased">
        <OrganizationJsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
