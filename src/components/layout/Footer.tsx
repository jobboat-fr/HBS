import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { navLinks, site, legal, social, formations } from "@/lib/site";
import { LogoMark } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-lg font-extrabold text-white">
                HBS<span className="text-teal-400"> FORMATION</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {site.baseline}. Organisme de formation basé à {site.city}.
            </p>
            <div className="mt-5 flex gap-4 text-sm">
              <a href={social.linkedin} className="text-white/60 hover:text-teal-400">LinkedIn</a>
              <a href={social.instagram} className="text-white/60 hover:text-teal-400">Instagram</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Formations</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {formations.slice(0, 5).map((f) => (
                <li key={f.slug}>
                  <Link href={`/formations#${f.slug}`} className="text-white/60 hover:text-teal-400">
                    {f.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-teal-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-teal-400" />
                <span className="text-white/60">{legal.siege}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-teal-400" />
                <a href={`mailto:${site.email}`} className="text-white/60 hover:text-teal-400">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-teal-400" />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-white/60 hover:text-teal-400">
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-3 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {legal.raisonSociale} — {legal.formeJuridique} au capital de{" "}
              {legal.capital} · RCS {legal.rcs} · Déclaration d&apos;activité n°{" "}
              {legal.numeroDeclarationActivite}
            </p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="hover:text-teal-400">Mentions légales</Link>
              <Link href="/confidentialite" className="hover:text-teal-400">Confidentialité</Link>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-white/35">
            Enregistré sous le n° {legal.numeroDeclarationActivite} auprès du {legal.declarationAutorite}.
            Cet enregistrement ne vaut pas agrément de l&apos;État.
          </p>
        </div>
      </div>
    </footer>
  );
}
