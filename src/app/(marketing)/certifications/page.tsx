import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";

/**
 * Les parcours certifiants arriveront plus tard.
 *
 * Cette page listait six titres professionnels du RNCP avec leurs codes. HBS FORMATION n'en
 * détient aucun : les afficher comme une offre revenait à annoncer des certifications
 * d'État que l'organisme ne peut pas délivrer — la même erreur que le code RNCP retiré de la
 * plateforme en septembre. La route reste en place pour ne pas casser les liens existants,
 * mais elle dit la vérité : bientôt, et pas encore.
 */
export const metadata: Metadata = {
  title: "Parcours certifiants — bientôt disponibles",
  description: "Les parcours certifiants de HBS FORMATION arrivent bientôt. Aujourd'hui, découvrez la Formation IA 360.",
  robots: { index: false },
  alternates: { canonical: "/certifications" },
};

export default function CertificationsPage() {
  return (
    <>
      <header className="fond-espace relative overflow-hidden pt-[var(--entete)]">
        <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
        <div className="container-page relative py-20 text-center md:py-28">
          <div>
            <span className="verre inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/85">
              <Clock size={14} aria-hidden /> Bientôt disponible
            </span>
            <h1 className="mt-5 font-display text-display-lg font-extrabold text-white text-balance">
              Les parcours certifiants <span className="texte-lumiere">arrivent bientôt</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
              En attendant, notre formation phare est ouverte : la Formation IA 360, outils IA inclus.
            </p>
            <Link href="/formations" className="bouton-neon mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold">
              Découvrir la Formation IA 360 <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </header>
      <CTASection />
    </>
  );
}
