import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { ComplementSection, PackCycles } from "@/components/sections/PackSection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { FORMATIONS, ORDRE, PACK, duree, euros } from "@/lib/commande";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Pack 360 — les 4 formations pour ${euros(PACK.prix)}`,
  description: `Analyse de données, Création de contenu, Marketing et IA 360 dans un seul forfait : ${PACK.heures} heures en ${PACK.jours} jours sur un mois, en direct. ${euros(PACK.prix)}.`,
  alternates: { canonical: PACK.href },
};

export const revalidate = 3600;

export default function Pack360Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Pack 360", url: `${site.url}${PACK.href}` },
        ]}
      />
      <PageHeader
        eyebrow={`Pack 360 · ${euros(PACK.prix)}`}
        title={<>Lire, créer, vendre, automatiser. <span className="texte-lumiere">En un mois.</span></>}
        subtitle={`Les 4 formations d'un même mois, ${PACK.heures} heures en ${PACK.jours} jours, en un seul forfait. Le parcours complet pour lancer votre projet.`}
      />

      <ComplementSection />

      <section className="bg-cloud py-14 lg:py-20">
        <div className="container-page mx-auto max-w-4xl">
          <PackCycles />
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-page mx-auto max-w-4xl">
          <h2 className="font-display text-display-md font-extrabold text-ink">Le détail de chaque formation</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {ORDRE.map((c) => {
              const f = FORMATIONS[c];
              return (
                <li key={c} className="verre-clair rounded-2xl border border-mist p-5">
                  <p className={`font-display text-lg font-extrabold ${f.couleur.texte}`}>{f.nom}</p>
                  <p className="text-sm font-semibold text-ink">{duree(f)}</p>
                  <p className="mt-2 text-sm text-ink-soft">{f.resume}</p>
                  <Link href={f.href} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:underline">
                    Voir le programme <ArrowRight size={14} aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  );
}
