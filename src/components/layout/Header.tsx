"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { AnnonceBanner } from "@/components/layout/AnnonceBanner";

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
    // Le lanceur du chat (z-80) passait par-dessus le bas du menu plein écran.
    document.body.toggleAttribute("data-menu-ouvert", open);
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-menu-ouvert");
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
      <AnnonceBanner />

      <nav className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Logo />

        <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navLinks.map((link) => (
            // « Contact » est retiré entre lg et xl pour que le menu et le bouton de réservation
            // tiennent sur une ligne ; il reste dans le pied de page.
            <li key={link.href} className={link.href === "/contact" ? "hidden xl:block" : undefined}>
              <Link
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-[15px] font-medium transition-colors",
                  isActive(link.href) ? "text-teal-600" : "text-ink-soft hover:text-teal-600",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {/* Le numéro de téléphone a été retiré de l'en-tête. Il reste joignable dans le
              pied de page, sur la page Contact et dans les mentions légales — un visiteur
              qui cherche à appeler le trouve, sans que l'appel soit l'action mise en avant
              sur chaque page. */}
          {/* "Se connecter" désactivé temporairement — remplacé par l'entrée du tunnel d'inscription. */}
          <Link
            href="/planning"
            className="bouton-neon inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[15px] font-bold"
          >
            <ClipboardList size={17} /> Je réserve
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          aria-expanded={open}
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
            className="fixed inset-0 top-[var(--entete)] z-40 overflow-y-auto overscroll-contain bg-white lg:hidden"
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
                <Button href="/planning" onClick={() => setOpen(false)}>
                  Voir les dates
                </Button>
                <Button href="/faq" variant="outline" onClick={() => setOpen(false)}>
                  Questions fréquentes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
