import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { RncpBadge } from "@/components/ui/RncpBadge";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Certifications RNCP",
  description:
    "Préparez un titre professionnel reconnu par l'État (RNCP) avec HBS FORMATION : développeur web, gestionnaire de paie, négociateur technico-commercial, RH, vente, secrétariat.",
};

export const revalidate = 300;

type RncpCourse = {
  slug: string;
  title: string;
  summary?: string;
  cover_url?: string;
  rncp_code: string;
  rncp_level?: string;
  certificateur?: string;
  rncp_url?: string;
};

export default async function CertificationsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("hbs_courses")
    .select("slug, title, summary, cover_url, rncp_code, rncp_level, certificateur, rncp_url")
    .not("rncp_code", "is", null)
    .order("position");
  const certs = (data ?? []) as RncpCourse[];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Certifications", url: `${site.url}/certifications` },
        ]}
      />
      <PageHeader
        eyebrow="Certifications RNCP"
        title={
          <>
            Des titres <span className="text-teal-600">reconnus par l&apos;État</span>
          </>
        }
        subtitle="Nos parcours préparent à des certifications inscrites au Répertoire National des Certifications Professionnelles (RNCP)."
      />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          {certs.length === 0 ? (
            <p className="text-center text-ink-soft">Nos certifications seront publiées ici très prochainement.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c) => (
                <Reveal key={c.slug}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-card">
                    {c.cover_url && (
                      <div className="relative aspect-[16/9]">
                        <Image src={c.cover_url} alt={c.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
                        <div className="absolute left-3 top-3">
                          <RncpBadge code={c.rncp_code} level={c.rncp_level} />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-lg font-bold text-ink">{c.title}</h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{c.summary}</p>
                      {c.certificateur && <p className="mt-3 text-xs text-ink-muted">Certificateur : {c.certificateur}</p>}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Button href="/contact" size="sm">Demander des infos</Button>
                        {c.rncp_url && (
                          <a href={c.rncp_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-teal-600">
                            Fiche officielle <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
          <p className="mt-10 text-center text-xs text-ink-muted">
            Les certifications proposées sont susceptibles d&apos;évoluer. Codes RNCP vérifiables sur francecompetences.fr.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
