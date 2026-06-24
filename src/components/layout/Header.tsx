"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, User, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";
import { Button } from "@/components/ui/Button";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2" aria-label="HBS FORMATION — accueil">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-gradient text-white">
        <GraduationCap size={20} />
      </span>
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
      <nav className="container-page flex h-[72px] items-center justify-between gap-4">
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
          <Link
            href="/connexion"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-soft hover:text-teal-600"
          >
            <User size={17} /> Se connecter
          </Link>
          <Button href="/contact" size="sm">
            Trouver ma formation
          </Button>
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
            className="fixed inset-0 top-[72px] z-40 bg-white lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 pt-6">
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
                <Button href="/connexion" variant="outline" onClick={() => setOpen(false)}>
                  Se connecter
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
