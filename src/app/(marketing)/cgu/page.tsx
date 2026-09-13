import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation du site hbs-formation.fr et de l'assistant Vigil.",
  alternates: { canonical: "/cgu" },
};

export default function CguPage() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Conditions générales d'utilisation"
      version="Version en vigueur au 14 septembre 2026"
      intro={
        <p>
          Les présentes conditions encadrent l&apos;accès et l&apos;utilisation du site{" "}
          {site.url.replace("https://", "")} (le « Site »), édité par {legal.raisonSociale}. En naviguant sur
          le Site, vous les acceptez. La vente des formations relève des{" "}
          <Link href="/cgv" className="text-teal-700 underline">conditions générales de vente</Link>.
        </p>
      }
      articles={[
        {
          id: "objet",
          titre: "Objet du Site",
          contenu: (
            <p>
              Le Site présente l&apos;organisme {legal.raisonSociale} et ses formations, permet de réserver une
              place, de demander un devis ou une prise en charge, de passer un test de positionnement et
              d&apos;échanger avec l&apos;assistant Vigil. Les informations publiées sont données à titre
              indicatif et peuvent évoluer ; seuls la convention, le contrat et les CGV engagent
              contractuellement.
            </p>
          ),
        },
        {
          id: "acces",
          titre: "Accès",
          contenu: (
            <p>
              Le Site est accessible gratuitement, hors coût de connexion. {legal.raisonSociale} s&apos;efforce
              d&apos;en assurer la disponibilité mais peut l&apos;interrompre, notamment pour maintenance, sans que
              sa responsabilité soit engagée.
            </p>
          ),
        },
        {
          id: "vigil",
          titre: "L'assistant Vigil",
          contenu: (
            <>
              <p>
                Vigil est un assistant conversationnel reposant sur un système d&apos;intelligence
                artificielle. Vous échangez avec une machine, non avec un conseiller. Ses réponses sont
                générées automatiquement à partir des informations du Site : elles peuvent être incomplètes
                ou inexactes et ne constituent ni un conseil juridique, ni un engagement contractuel, ni la
                confirmation d&apos;un financement.
              </p>
              <ul>
                <li>Ne communiquez pas de données sensibles (santé, coordonnées bancaires, mots de passe) dans la conversation.</li>
                <li>Les échanges sont enregistrés pour permettre à l&apos;équipe d&apos;y donner suite et d&apos;améliorer l&apos;assistant.</li>
                <li>Pour toute décision, référez-vous aux pages du Site, aux CGV ou à un conseiller via la page <Link href="/contact" className="text-teal-700 underline">Contact</Link>.</li>
              </ul>
            </>
          ),
        },
        {
          id: "formulaires",
          titre: "Formulaires et test de positionnement",
          contenu: (
            <p>
              Vous vous engagez à fournir des informations exactes. Le lien du test de positionnement est
              personnel et à usage unique ; il ne doit pas être transmis. {legal.raisonSociale} peut refuser
              une demande manifestement abusive ou automatisée.
            </p>
          ),
        },
        {
          id: "propriete",
          titre: "Propriété intellectuelle",
          contenu: (
            <p>
              Les textes, visuels, logos, programmes et contenus du Site sont protégés par le droit
              d&apos;auteur et le droit des marques. Toute reproduction ou réutilisation, totale ou partielle,
              sans autorisation écrite de {legal.raisonSociale} est interdite. La citation courte avec lien
              vers la page source est autorisée.
            </p>
          ),
        },
        {
          id: "responsabilite",
          titre: "Responsabilité et liens",
          contenu: (
            <p>
              {legal.raisonSociale} ne saurait être tenue responsable d&apos;un dommage résultant d&apos;une
              utilisation du Site non conforme aux présentes conditions, ni du contenu des sites tiers vers
              lesquels il renvoie.
            </p>
          ),
        },
        {
          id: "donnees",
          titre: "Données personnelles et mesure d'audience",
          contenu: (
            <p>
              Les traitements de données réalisés via le Site sont décrits dans la{" "}
              <Link href="/confidentialite" className="text-teal-700 underline">politique de confidentialité</Link>.
              La mesure d&apos;audience utilisée ne dépose pas de cookie publicitaire et ne permet pas de vous
              identifier personnellement.
            </p>
          ),
        },
        {
          id: "droit",
          titre: "Droit applicable",
          contenu: (
            <p>
              Les présentes conditions sont soumises au droit français. Pour toute question : {site.email}.
              Éditeur et directeur de la publication : {legal.president}, président de {legal.raisonSociale}.
            </p>
          ),
        },
      ]}
    />
  );
}
