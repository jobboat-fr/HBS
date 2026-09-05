import type { Metadata } from "next";
import { ClipboardList, ShieldCheck, UserCheck, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { InscriptionForm } from "@/components/forms/InscriptionForm";
import { Button } from "@/components/ui/Button";
import { catalogue, configured, type Catalogue } from "@/lib/learn";
import { site } from "@/lib/site";

/**
 * Le pont entre la vitrine et la plateforme.
 *
 * La liste des formations et les indicateurs publiés viennent de LEARN, pas d'un contenu
 * saisi ici : un taux de satisfaction recopié à la main est un taux que personne ne peut
 * rattacher aux réponses qui l'ont produit, et l'indicateur 1 demande exactement ce
 * rattachement. Si la plateforme est injoignable, la page reste utile — le formulaire cède
 * la place au parcours de contact plutôt que d'afficher une erreur.
 */

export const metadata: Metadata = {
  title: "Demander une place",
  description:
    "Demandez une place en formation chez HBS FORMATION : un test de positionnement établit votre niveau, puis l'organisme confirme votre inscription.",
};

export const revalidate = 300;

const ETAPES = [
  {
    icon: ClipboardList,
    title: "Votre demande",
    body: "Quelques informations sur votre projet. Aucun compte n'est créé à cette étape.",
  },
  {
    icon: UserCheck,
    title: "Le test de positionnement",
    body: "Une dizaine de minutes pour établir votre niveau de départ et vous orienter.",
  },
  {
    icon: CalendarCheck,
    title: "La confirmation",
    body: "L'organisme revient vers vous avec une session, une convention et un financement.",
  },
];

export default async function InscriptionPage() {
  let data: Catalogue | null = null;
  if (configured()) {
    try {
      data = await catalogue();
    } catch {
      // Plateforme injoignable : on dégrade vers le parcours de contact plus bas plutôt que
      // de casser une page publique.
      data = null;
    }
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Demander une place", url: `${site.url}/preinscription` },
        ]}
      />
      <PageHeader
        eyebrow="Inscription"
        title={
          <>
            Demandez votre place <span className="text-teal-600">en trois étapes</span>
          </>
        }
        subtitle="Une demande, un test de positionnement, une confirmation. Rien n'est engagé tant que l'organisme n'a pas validé votre dossier."
      />

      <section className="py-14 lg:py-20">
        <div className="container-page">
          <Reveal>
            <ol className="grid gap-6 md:grid-cols-3">
              {ETAPES.map((e, i) => (
                <li key={e.title} className="rounded-3xl border border-mist bg-white p-6 shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    <e.icon size={22} />
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Étape {i + 1}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold text-ink">{e.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{e.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          {data?.indicateurs ? (
            <Reveal>
              <div className="mt-10 rounded-3xl border border-mist bg-cloud p-6">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  {data.indicateurs.satisfaction !== null ? (
                    <p className="text-sm text-ink-soft">
                      <span className="font-display text-2xl font-bold text-ink">
                        {data.indicateurs.satisfaction}/5
                      </span>{" "}
                      satisfaction
                    </p>
                  ) : null}
                  {data.indicateurs.learners !== null ? (
                    <p className="text-sm text-ink-soft">
                      <span className="font-display text-2xl font-bold text-ink">
                        {data.indicateurs.learners}
                      </span>{" "}
                      apprenants ({data.indicateurs.year})
                    </p>
                  ) : null}
                  {data.indicateurs.responses !== null ? (
                    <p className="text-sm text-ink-soft">
                      sur{" "}
                      <span className="font-semibold text-ink">{data.indicateurs.responses}</span>{" "}
                      réponses
                      {data.indicateurs.response_rate !== null
                        ? ` (${data.indicateurs.response_rate} % de retour)`
                        : ""}
                    </p>
                  ) : null}
                </div>
                {/* La mention vient de la plateforme : le taux et sa population voyagent
                    ensemble, sinon publier le premier sans le second ne prouve rien. */}
                <p className="mt-3 text-xs text-ink-muted">{data.mention}</p>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-3xl border border-mist bg-white p-6 shadow-card md:p-10">
            {data ? (
              <InscriptionForm
                programmes={data.programmes.map((p) => ({ id: p.id, title: p.title }))}
                consentText={data.consent_text}
              />
            ) : (
              <div className="py-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <ShieldCheck size={24} />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-ink">
                  Les inscriptions en ligne ouvrent bientôt
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                  En attendant, un conseiller fait le point avec vous et enregistre votre
                  demande directement.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button href="/contact" size="md">
                    Parler à un conseiller
                  </Button>
                  <Button href="/formations" variant="outline" size="md">
                    Découvrir les formations
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
