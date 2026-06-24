import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
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
            Parlons de <span className="text-gold-gradient">votre projet</span>
          </>
        }
        subtitle="Un conseiller vous recontacte sous 48 heures ouvrées pour étudier votre besoin et vos possibilités de financement."
      />

      <section className="pb-[var(--section-padding)] pt-8">
        <div className="container-luxury grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          {/* Coordonnées */}
          <div className="space-y-4">
            <GlassCard className="p-8">
              <h2 className="font-display text-xl font-semibold">Nous joindre</h2>
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span className="text-white/70">{legal.siege}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-gold" />
                  <a href={`mailto:${site.email}`} className="text-white/70 hover:text-gold">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-gold" />
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="text-white/70 hover:text-gold"
                  >
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span className="text-white/70">Du lundi au vendredi, 9h – 18h</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="font-display text-lg font-semibold text-gold">Financements</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Nos formations peuvent être prises en charge via le CPF, votre OPCO, France Travail,
                le plan de développement des compétences de votre entreprise ou un financement
                personnel. Nous vous guidons vers le bon dispositif.
              </p>
            </GlassCard>
          </div>

          {/* Formulaire */}
          <GlassCard className="p-8 md:p-10">
            <ContactForm />
          </GlassCard>
        </div>
      </section>
    </>
  );
}
