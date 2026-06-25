import { site, legal, social, faqs, formations } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: legal.raisonSociale,
    legalName: `${legal.raisonSociale} (${legal.formeJuridique})`,
    description: site.description,
    url: site.url,
    logo: `${site.url}/logo.png`,
    email: site.email,
    telephone: site.phone,
    foundingDate: "2026-03-23",
    founder: { "@type": "Person", name: legal.president },
    address: {
      "@type": "PostalAddress",
      streetAddress: "50 Passage Saint-Étienne des Tonneliers",
      addressLocality: "Rouen",
      postalCode: "76000",
      addressCountry: "FR",
    },
    areaServed: "FR",
    identifier: { "@type": "PropertyValue", name: "SIREN", value: legal.siren },
    sameAs: [social.linkedin, social.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function CoursesJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: formations.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: f.title,
        description: f.description,
        url: `${site.url}/formations#${f.slug}`,
        provider: {
          "@type": "EducationalOrganization",
          name: legal.raisonSociale,
          sameAs: site.url,
        },
      },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
