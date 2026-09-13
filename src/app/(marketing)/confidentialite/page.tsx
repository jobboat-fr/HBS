import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { site, legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader eyebrow="Informations" title="Politique de confidentialité" subtitle="Version en vigueur au 14 septembre 2026" />
      <section className="pb-[var(--section-padding)] pt-4">
        <div className="container-page mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-ink-soft">
          <Block title="Responsable du traitement">
            <p>
              {legal.raisonSociale}, {legal.siege}. Contact : {site.email}.
            </p>
          </Block>
          <Block title="Données et finalités">
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <b>Formulaire de contact et demande de place</b> (nom, email, téléphone, structure, message) : répondre à
                votre demande et vous recontacter — intérêt légitime et mesures précontractuelles.
              </li>
              <li>
                <b>Réservation et paiement</b> (identité, adresse de facturation, n° de TVA, historique des échéances) :
                exécution du contrat ou de la convention, facturation, obligations comptables. Les données de carte sont
                collectées et conservées par Stripe ; {legal.raisonSociale} n&apos;y a jamais accès.
              </li>
              <li>
                <b>Test de positionnement</b> (réponses, niveau) : adapter la formation à votre niveau et à votre projet, et
                conserver la preuve de cette analyse exigée des organismes certifiés Qualiopi.
              </li>
              <li>
                <b>Assistant Vigil</b> (messages échangés, page consultée) : répondre à vos questions et permettre à
                l&apos;équipe d&apos;y donner suite. N&apos;y saisissez pas de données sensibles.
              </li>
              <li>
                <b>Mesure d&apos;audience</b> : statistiques de fréquentation agrégées, sans cookie publicitaire.
              </li>
            </ul>
          </Block>
          <Block title="Destinataires et sous-traitants">
            <p>
              Vos données sont traitées par l&apos;équipe de {legal.raisonSociale} et, pour les besoins techniques, par ses
              prestataires : Vercel (hébergement du site), Supabase (base de données, hébergée dans l&apos;Union
              européenne), Stripe (paiement), Resend (envoi des courriels) et un fournisseur de modèle d&apos;IA pour
              l&apos;assistant Vigil. Lorsqu&apos;un prestataire traite des données hors de l&apos;Union européenne, le transfert
              est encadré par les clauses contractuelles types de la Commission européenne. En cas de prise en charge, les
              pièces nécessaires sont transmises à votre financeur (OPCO, France Travail). Aucune donnée n&apos;est cédée à
              des fins commerciales.
            </p>
          </Block>
          <Block title="Durées de conservation">
            <ul className="ml-5 list-disc space-y-2">
              <li>Demandes sans suite : 3 ans à compter du dernier contact.</li>
              <li>Dossier de formation (positionnement, émargements, évaluations) : 5 ans après la formation.</li>
              <li>Factures et pièces comptables : 10 ans (Code de commerce).</li>
              <li>Conversations avec l&apos;assistant : 12 mois.</li>
            </ul>
          </Block>
          <Block title="Vos droits">
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition
              et de portabilité. Pour les exercer, écrivez à {site.email}. Vous pouvez aussi introduire une réclamation
              auprès de la CNIL (cnil.fr).
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
