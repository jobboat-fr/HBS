import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { navLinks, site, legal, social } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-dark">
      <div className="container-luxury py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div className="lg:col-span-1">
            <div className="font-display text-2xl font-semibold text-gold">
              HBS <span className="text-white">FORMATION</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {site.baseline}. Organisme de formation basé à {site.city}.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">Navigation</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>{legal.siege}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-gold" />
                <a href={`mailto:${site.email}`} className="hover:text-gold">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-gold" />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">Informations légales</h3>
            <ul className="mt-5 space-y-2 text-xs leading-relaxed text-white/40">
              <li>{legal.formeJuridique}</li>
              <li>Capital social : {legal.capital}</li>
              <li>RCS {legal.rcs}</li>
              <li>SIREN {legal.siren}</li>
              <li>Déclaration d&apos;activité : {legal.numeroDeclarationActivite}</li>
            </ul>
            <div className="mt-5 flex gap-4">
              <a href={social.linkedin} className="text-white/50 hover:text-gold" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href={social.instagram} className="text-white/50 hover:text-gold" aria-label="Instagram">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} {legal.raisonSociale}. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-gold">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-gold">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
