import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader eyebrow="Informations" title="Mentions légales" />
      <section className="pb-[var(--section-padding)] pt-4">
        <div className="container-page mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-ink-soft">
          <Block title="Éditeur du site">
            <p>{legal.raisonSociale}</p>
            <p>{legal.formeJuridique} au capital de {legal.capital}</p>
            <p>Siège social : {legal.siege}</p>
            <p>RCS {legal.rcs} — SIREN {legal.siren}</p>
            <p>SIRET : {legal.siret} — Code NAF : {legal.naf}</p>
            <p>Identifiant européen (EUID) : {legal.euid}</p>
            <p>Président : {legal.president}</p>
            <p>Email : {site.email}</p>
          </Block>
          <Block title="Activité de formation">
            <p>
              Organisme de formation professionnelle. Déclaration d&apos;activité enregistrée sous le
              numéro {legal.numeroDeclarationActivite} auprès du {legal.declarationAutorite} (le{" "}
              {legal.declarationDate}). Cet enregistrement ne vaut pas agrément de l&apos;État.
            </p>
          </Block>
          <Block title="Hébergement">
            <p>
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
              États-Unis.
            </p>
          </Block>
          <Block title="Propriété intellectuelle">
            <p>
              L&apos;ensemble des contenus de ce site (textes, images, identité visuelle) est la
              propriété de {legal.raisonSociale}, sauf mention contraire, et est protégé par le droit
              d&apos;auteur.
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
