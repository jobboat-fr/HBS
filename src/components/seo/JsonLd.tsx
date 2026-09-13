import { site, legal, social, faqs, formations, certificat } from "@/lib/site";
import { PRODUIT } from "@/lib/commande";

const Ld = ({ data }: { data: unknown }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

const adresse = {
  "@type": "PostalAddress",
  streetAddress: "50 Passage Saint-Étienne des Tonneliers",
  addressLocality: "Rouen",
  postalCode: "76000",
  addressRegion: "Normandie",
  addressCountry: "FR",
};

const organisme = {
  "@type": "EducationalOrganization",
  "@id": `${site.url}/#organisme`,
  name: legal.raisonSociale,
  url: site.url,
};

export function OrganizationJsonLd() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        ...organisme,
        legalName: `${legal.raisonSociale} (${legal.formeJuridique})`,
        description: site.description,
        logo: `${site.url}/icon.svg`,
        image: `${site.url}/opengraph-image`,
        email: site.email,
        telephone: site.phone,
        foundingDate: "2026-03-23",
        founder: { "@type": "Person", name: legal.president },
        address: adresse,
        geo: { "@type": "GeoCoordinates", latitude: 49.4406, longitude: 1.0914 },
        areaServed: [{ "@type": "Country", name: "France" }, { "@type": "AdministrativeArea", name: "Normandie" }],
        identifier: [
          { "@type": "PropertyValue", name: "SIREN", value: legal.siren },
          { "@type": "PropertyValue", name: "Numéro de déclaration d'activité", value: legal.numeroDeclarationActivite },
        ],
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: `Certification Qualiopi — ${legal.qualiopiCategorie}`,
          credentialCategory: "Certification qualité des prestataires d'actions concourant au développement des compétences",
        },
        knowsAbout: [
          "Intelligence artificielle", "IA générative", "Agents IA", "Automatisation",
          "Règlement européen sur l'intelligence artificielle", "RGPD", "Formation professionnelle",
        ],
        sameAs: [social.linkedin, social.instagram],
      }}
    />
  );
}

export function FaqJsonLd({ questions = faqs }: { questions?: readonly { q: string; a: string }[] }) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

/** La Formation IA 360 décrite complètement : cours, session, offre, certificat. */
export function CourseJsonLd() {
  const f = formations.find((x) => x.disponible);
  if (!f) return null;
  const offre = {
    "@type": "Offer",
    price: String(PRODUIT.prixUnitaire / 100),
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${site.url}/reserver`,
    category: "Place de formation",
    validFrom: "2026-09-01",
  };
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${site.url}/formations#ia-360`,
        name: PRODUIT.nom,
        description: f.description,
        url: `${site.url}/formations`,
        inLanguage: "fr",
        provider: organisme,
        educationalLevel: "Débutant à intermédiaire",
        coursePrerequisites: "Aucun prérequis technique",
        timeRequired: "PT21H",
        teaches: [
          "Comprendre le fonctionnement et les limites de l'IA",
          "Vérifier et fiabiliser les résultats d'une IA",
          "Protéger les données et respecter le RGPD et l'AI Act",
          "Déployer des agents IA et des automatisations sur un cas réel",
        ],
        educationalCredentialAwarded: {
          "@type": "EducationalOccupationalCredential",
          name: certificat.nom,
          credentialCategory: "Certificat délivré par l'organisme (non enregistré au RNCP)",
        },
        offers: offre,
        hasCourseInstance: {
          "@type": "CourseInstance",
          name: `${PRODUIT.nom} — ${PRODUIT.session.libelle}`,
          courseMode: "online",
          courseWorkload: "PT21H",
          startDate: PRODUIT.session.debut,
          endDate: PRODUIT.session.fin,
          location: { "@type": "VirtualLocation", url: `${site.url}/formations` },
          maximumAttendeeCapacity: PRODUIT.placesMax,
          offers: offre,
        },
      }}
    />
  );
}

/** Conservé pour l'accueil : même cours, sous forme de liste. */
export function CoursesJsonLd() {
  return <CourseJsonLd />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
