"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="font-display text-2xl font-semibold tracking-wide text-gold"
      aria-label={`${site.name} — accueil`}
    >
      HBS<span className="text-[color:var(--color-text-primary)]"> FORMATION</span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 80));

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.08] bg-black/60 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-luxury flex h-20 items-center justify-between">
        <Logo />

        {/* Navigation bureau */}
        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "group relative text-[13px] uppercase tracking-[0.16em] transition-colors",
                  isActive(link.href)
                    ? "text-gold"
                    : "text-white/70 hover:text-white",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300",
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact" size="sm">
            Demander un devis
          </Button>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-gold lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Menu mobile plein écran */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-20 z-40 bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <motion.ul
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
              className="container-luxury flex flex-col gap-2 pt-10"
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block border-b border-white/[0.06] py-5 font-display text-3xl",
                      isActive(link.href) ? "text-gold" : "text-white/80",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-8">
                <Button href="/contact" className="w-full" onClick={() => setOpen(false)}>
                  Demander un devis
                </Button>
              </li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
