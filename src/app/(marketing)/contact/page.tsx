import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { site, legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez HBS FORMATION à Rouen pour construire votre projet de formation et identifier les financements mobilisables (CPF, OPCO, France Travail).",
};

export default function ContactPage() {
  return (
    <>
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

            <div className="rounded-2xl border border-mist bg-cloud p-8">
              <h3 className="font-display text-lg font-bold text-teal-600">Financements</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Nos formations peuvent être prises en charge via le CPF, votre OPCO, France Travail,
                le plan de développement des compétences de votre entreprise ou un financement
                personnel. Nous vous guidons vers le bon dispositif.
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
