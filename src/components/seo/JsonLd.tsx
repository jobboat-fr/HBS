import { site, legal, social, faqs, certificat } from "@/lib/site";
import { FORMATIONS, PLACES_MAX, libelleSemaine, planning, type CodeFormation } from "@/lib/commande";

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

/** Une formation 360 décrite complètement : cours, sessions ouvertes, offre. */
export function CourseJsonLd({ code = "IA360" }: { code?: CodeFormation }) {
  const f = FORMATIONS[code];
  const sessions = planning(new Date(), 4).filter((x) => x.formation === code && x.statut === "ouvert").slice(0, 3);
  const offre = (url: string) => ({
    "@type": "Offer",
    price: String(f.prix / 100),
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url,
    category: "Place de formation",
  });
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${site.url}${f.href}#cours`,
        name: f.nom,
        alternateName: `${f.nom} — ${f.accroche}`,
        description: f.resume,
        url: `${site.url}${f.href}`,
        inLanguage: "fr",
        provider: organisme,
        coursePrerequisites: f.prerequis,
        timeRequired: "PT21H",
        teaches: f.objectifs,
        educationalCredentialAwarded:
          code === "IA360"
            ? {
                "@type": "EducationalOccupationalCredential",
                name: certificat.nom,
                credentialCategory: "Certificat délivré par l'organisme (non enregistré au RNCP)",
              }
            : undefined,
        offers: offre(`${site.url}/reserver?formation=${code}`),
        hasCourseInstance: sessions.map((x) => ({
          "@type": "CourseInstance",
          name: `${f.nom} — semaine ${libelleSemaine(x)}`,
          courseMode: "online",
          courseWorkload: "PT21H",
          startDate: x.debut,
          endDate: x.fin,
          location: { "@type": "VirtualLocation", url: `${site.url}${f.href}` },
          maximumAttendeeCapacity: PLACES_MAX,
          offers: offre(`${site.url}/reserver?formation=${code}&session=${x.code}`),
        })),
      }}
    />
  );
}

/** Conservé pour l'accueil : même cours, sous forme de liste. */
export function CoursesJsonLd() {
  return (
    <>
      {(["DATA360", "CONTENT360", "MKT360", "IA360"] as const).map((c) => <CourseJsonLd key={c} code={c} />)}
    </>
  );
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
