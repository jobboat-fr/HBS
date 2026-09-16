import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Scale, ShieldCheck, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd, CourseJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import { FORMATIONS, dateCourte, duree, euros, prochaineSession } from "@/lib/commande";

export const metadata: Metadata = {
  title: "Formation AI Act : l'obligation de maîtrise de l'IA (article 4) pour vos salariés",
  description:
    "Depuis le 2 février 2025, l'article 4 du règlement européen sur l'IA impose aux entreprises de former leurs équipes à l'IA. IA 360 y répond : 21 heures en 3 jours, conformité RGPD et AI Act, outils IA inclus dans votre forfait, 1 300 €.",
  alternates: { canonical: "/formation-ia-ai-act" },
};

const questions = [
  {
    q: "Quelles entreprises sont concernées par l'article 4 de l'AI Act ?",
    a: "Toutes celles qui fournissent ou utilisent des systèmes d'IA dans le cadre de leur activité — y compris l'usage d'un assistant conversationnel grand public par des salariés. La taille de l'entreprise ne l'exonère pas.",
  },
  {
    q: "L'article 4 impose-t-il une formation certifiante ?",
    a: "Non. Il impose des mesures pour garantir, dans toute la mesure du possible, un niveau suffisant de maîtrise de l'IA, adapté aux connaissances, à l'expérience et au contexte d'utilisation. Former les personnes concernées et pouvoir le documenter en est la mesure la plus directe.",
  },
  {
    q: "Comment prouver que l'entreprise a agi ?",
    a: "En conservant la trace des actions menées : programme, émargements, évaluations, attestations, et un registre des usages d'IA. IA 360 fait produire à chaque participant un dossier IA daté qui sert précisément à cela.",
  },
];

export const revalidate = 3600;

export default function AiActPage() {
  const ia = FORMATIONS.IA360;
  const s = prochaineSession("IA360");
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Formation AI Act", url: `${site.url}/formation-ia-ai-act` },
        ]}
      />
      <CourseJsonLd />
      <FaqJsonLd questions={questions} />

      <PageHeader
        eyebrow="Règlement européen sur l'IA"
        title={<>Former vos équipes à l&apos;IA <span className="texte-lumiere">n&apos;est plus une option</span></>}
        subtitle="Article 4 de l'AI Act : depuis le 2 février 2025, les entreprises qui utilisent l'IA doivent assurer la maîtrise de l'IA de leur personnel."
      />

      <section className="py-14 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-[15px] leading-relaxed text-ink-soft">
            <h2 className="font-display text-display-md font-extrabold text-ink">Ce que dit le texte</h2>
            <p>
              Le règlement (UE) 2024/1689 sur l&apos;intelligence artificielle est entré en vigueur par étapes. Son{" "}
              <b>article 4, applicable depuis le 2 février 2025</b>, demande aux fournisseurs et aux utilisateurs
              de systèmes d&apos;IA de prendre des mesures pour garantir un niveau suffisant de maîtrise de l&apos;IA
              chez les personnes qui les utilisent pour leur compte.
            </p>
            <p>
              Concrètement : un salarié qui rédige avec un assistant IA, résume des contrats ou trie des
              candidatures doit savoir ce que fait l&apos;outil, où il se trompe, et ce qu&apos;il ne faut jamais lui
              confier. C&apos;est une <b>obligation de moyens</b> — l&apos;entreprise doit pouvoir montrer qu&apos;elle a agi.
            </p>
            <p>
              Elle s&apos;ajoute au RGPD, qui encadre déjà les données personnelles traitées avec ces outils, et aux
              règles du dialogue social : un déploiement d&apos;IA qui modifie les conditions de travail peut
              nécessiter la consultation du CSE.
            </p>

            <h2 className="pt-4 font-display text-display-md font-extrabold text-ink">Ce que IA 360 apporte</h2>
            <ul className="space-y-3">
              {[
                "Une journée entière consacrée à la conformité : vérification des résultats, confidentialité, RGPD, AI Act.",
                "Des ateliers sur les documents réels de vos équipes, anonymisés — pas des cas d'école.",
                "Un dossier IA daté pour chaque participant : registre des usages, vérifications, décisions.",
                "Émargements, évaluations et attestation de fin de formation : la trace que l'entreprise a agi.",
                "Un organisme certifié Qualiopi au titre des actions de formation : financement OPCO possible.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-teal-600" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4">
            <div className="cadre-neon">
              <div className="p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600">{ia.nom}</p>
                <p className="mt-2 font-display text-5xl font-extrabold text-ink">{euros(ia.prix)}</p>
                <p className="text-sm text-ink-soft">TTC · {duree(ia)} · outils IA inclus dans votre forfait</p>
                {s ? <p className="mt-3 text-sm font-semibold text-ink">Prochaine session le {dateCourte(s.debut)}.</p> : null}
                <Link href={s ? `/reserver?formation=IA360&session=${s.code}` : "/reserver?formation=IA360"} className="bouton-neon mt-5 flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 font-bold">
                  Réserver pour mon équipe <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/entreprises" className="mt-3 block text-center text-sm font-semibold text-teal-700 underline">
                  Session dédiée pour 8 à 12 personnes
                </Link>
              </div>
            </div>
            {[
              { i: Scale, t: "Obligation de moyens", d: "Montrer que l'entreprise a formé les personnes concernées." },
              { i: ShieldCheck, t: "RGPD et confidentialité", d: "Ce qu'on peut confier à une IA, et ce qu'on ne lui confie jamais." },
              { i: FileText, t: "Traçabilité", d: "Dossier IA, émargements, évaluations, attestation." },
            ].map(({ i: I, t, d }) => (
              <div key={t} className="verre-clair flex gap-4 rounded-2xl border border-mist p-5">
                <I size={22} className="shrink-0 text-teal-600" aria-hidden />
                <div>
                  <p className="font-display font-bold text-ink">{t}</p>
                  <p className="text-sm text-ink-soft">{d}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="bg-cloud py-14">
        <div className="container-page mx-auto max-w-3xl">
          <h2 className="font-display text-display-md font-extrabold text-ink">Questions fréquentes</h2>
          <div className="mt-6 divide-y divide-mist rounded-2xl border border-mist bg-white">
            {questions.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center px-5 py-4 font-display font-bold text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-muted">
            Cette page présente le cadre général et ne constitue pas un conseil juridique adapté à votre situation.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
