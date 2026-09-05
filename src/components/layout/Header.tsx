"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Phone, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2" aria-label="HBS FORMATION — accueil">
      <LogoMark className="h-9 w-9" />
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">
        HBS<span className="text-teal-500"> FORMATION</span>
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 20));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300",
        scrolled ? "shadow-soft" : "border-b border-mist",
      )}
    >
      <nav className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Logo />

        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-[15px] font-medium transition-colors",
                  isActive(link.href) ? "text-teal-600" : "text-ink-soft hover:text-teal-600",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-teal-600 hover:text-teal-700"
          >
            <Phone size={17} /> {site.phone}
          </a>
          {/* "Se connecter" désactivé temporairement — remplacé par l'entrée du tunnel d'inscription. */}
          <Link
            href="/preinscription"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-soft hover:text-teal-600"
          >
            <ClipboardList size={17} /> Demander une place
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-ink lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[72px] z-40 overflow-y-auto overscroll-contain bg-white lg:hidden"
          >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-5 pb-10 pt-6 sm:px-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-mist py-4 text-lg font-medium",
                    isActive(link.href) ? "text-teal-600" : "text-ink",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-center text-sm font-semibold text-ink-soft">
                  Prêt·e à passer à l&apos;étape suivante ?
                </p>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 py-3 text-[15px] font-semibold text-teal-700"
                >
                  <Phone size={17} /> {site.phone}
                </a>
                <Button href="/preinscription" variant="outline" onClick={() => setOpen(false)}>
                  Demander une place
                </Button>
                <Button href="/contact" onClick={() => setOpen(false)}>
                  Trouver ma formation
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
