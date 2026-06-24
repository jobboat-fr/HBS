import type { Metadata } from "next";
import { Wallet, Building2, Briefcase, UserCheck, MapPin, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Financement — CPF, OPCO, France Travail",
  description:
    "Comment financer votre formation chez HBS FORMATION : CPF, OPCO, France Travail, plan de développement des compétences, Région ou financement personnel.",
};

const dispositifs = [
  { icon: Wallet, title: "CPF", text: "Mobilisez votre Compte Personnel de Formation pour financer tout ou partie de votre parcours, directement depuis moncompteformation.gouv.fr." },
  { icon: Building2, title: "OPCO", text: "Si vous êtes salarié, votre opérateur de compétences peut prendre en charge votre formation dans le cadre du plan de votre employeur." },
  { icon: Briefcase, title: "Plan de développement des compétences", text: "Les entreprises financent la montée en compétences de leurs équipes via leur plan de développement des compétences." },
  { icon: UserCheck, title: "France Travail", text: "Demandeurs d'emploi : selon votre situation, France Travail peut financer une formation inscrite à votre projet (AIF, etc.)." },
  { icon: MapPin, title: "Région Normandie", text: "Des dispositifs régionaux peuvent soutenir certaines formations, notamment dans le cadre de l'insertion et de la reconversion." },
  { icon: CreditCard, title: "Financement personnel", text: "Un règlement personnel, éventuellement échelonné, reste possible. Nous en discutons ensemble selon votre projet." },
];

export default function FinancementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Financement"
        title={
          <>
            Votre formation, <span className="text-teal-600">financée</span>
          </>
        }
        subtitle="Plusieurs dispositifs peuvent prendre en charge tout ou partie de votre formation. Nous vous aidons à identifier le bon."
      />

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dispositifs.map((d) => (
            <Reveal key={d.title}>
              <div className="h-full rounded-2xl border border-mist bg-white p-7 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <d.icon size={24} strokeWidth={1.75} />
                </div>
                <h2 className="mt-5 font-display text-lg font-bold text-ink">{d.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="container-page mt-10">
          <p className="rounded-2xl bg-cloud p-6 text-center text-sm text-ink-soft">
            Vous ne savez pas quel dispositif est fait pour vous ? C&apos;est normal. Contactez-nous :
            nous étudions votre éligibilité et montons le dossier avec vous.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
