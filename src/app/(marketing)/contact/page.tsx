import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site, legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez HBS FORMATION à Rouen : une question sur la Formation IA 360, une réservation pour votre entreprise ou pour vous-même. Réponse sous 48 heures ouvrées.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Contact", url: `${site.url}/contact` },
        ]}
      />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Parlons de <span className="text-teal-600">votre projet</span>
          </>
        }
        subtitle="Un conseiller vous recontacte sous 48 heures ouvrées pour étudier votre besoin et vos possibilités de financement."
      />

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-mist bg-white p-8 shadow-card">
              <h2 className="font-display text-xl font-bold text-ink">Nous joindre</h2>
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-teal-500" />
                  <span className="text-ink-soft">{legal.siege}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-teal-500" />
                  <a href={`mailto:${site.email}`} className="text-ink-soft hover:text-teal-600">{site.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-teal-500" />
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-ink-soft hover:text-teal-600">{site.phone}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-teal-500" />
                  <span className="text-ink-soft">Du lundi au vendredi, 9h – 18h</span>
                </li>
              </ul>
            </div>

            <div className="verre-clair rounded-2xl p-8">
              <h3 className="font-display text-lg font-bold text-teal-600">Formation IA 360</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                1 300 € par place, formation de 21 heures et outils IA inclus. La place peut être
                réglée par votre entreprise ou à titre personnel. Prochaine session le 26 octobre 2026.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-mist bg-white p-8 shadow-card md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
