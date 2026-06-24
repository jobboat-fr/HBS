import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { site, legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader eyebrow="Informations" title="Politique de confidentialité" />
      <section className="pb-[var(--section-padding)] pt-4">
        <div className="container-page mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-ink-soft">
          <Block title="Responsable du traitement">
            <p>
              {legal.raisonSociale}, {legal.siege}. Contact : {site.email}.
            </p>
          </Block>
          <Block title="Données collectées">
            <p>
              Les données transmises via le formulaire de contact (nom, email, téléphone, structure,
              formation et financement envisagés, message) sont utilisées uniquement pour traiter
              votre demande et vous recontacter.
            </p>
          </Block>
          <Block title="Finalité et base légale">
            <p>
              Le traitement repose sur votre consentement et sur l&apos;intérêt légitime de{" "}
              {legal.raisonSociale} à répondre à vos demandes. Les données ne sont jamais cédées à des
              tiers à des fins commerciales.
            </p>
          </Block>
          <Block title="Durée de conservation">
            <p>
              Les demandes sont conservées pour une durée maximale de 3 ans à compter du dernier
              contact, sauf obligation légale contraire.
            </p>
          </Block>
          <Block title="Vos droits">
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement et d&apos;opposition. Pour les exercer, écrivez à {site.email}.
            </p>
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-teal-600">{title}</h2>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}
