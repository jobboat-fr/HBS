"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Mascot, type MascotVariant } from "./Mascot";
import { mascot, faqs } from "@/lib/site";

type CLink = { label: string; href: string };
type Msg = { from: "hub" | "user"; text: string; links?: CLink[] };

/** Tenue + accroche de Hub selon l'univers de la page. */
function contextFor(pathname: string): { outfit: MascotVariant; tip: string } {
  if (pathname.startsWith("/entreprises")) return { outfit: "suit", tip: "Former vos équipes ? Je vous oriente vers la bonne formule." };
  if (pathname.startsWith("/alternance")) return { outfit: "hiphop", tip: "L'alternance vous tente ? On en parle quand vous voulez !" };
  if (pathname.startsWith("/financement")) return { outfit: "casual", tip: "CPF, OPCO, France Travail… je démêle le financement avec vous." };
  if (pathname.startsWith("/formations")) return { outfit: "graduate", tip: "Une question sur un parcours ? Je suis là pour vous aider." };
  if (pathname.startsWith("/contact")) return { outfit: "casual", tip: "Un coup de pouce pour formuler votre demande ?" };
  return { outfit: "graduate", tip: "Besoin d'aide pour choisir votre formation ? Demandez-moi !" };
}

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const QUICK = [
  "Quelles formations proposez-vous ?",
  "Comment financer ma formation ?",
  "Puis-je suivre à distance ?",
  "Parler à un conseiller",
];

function answer(input: string): Msg {
  const t = norm(input);
  const has = (...k: string[]) => k.some((w) => t.includes(w));

  if (has("financ", "cpf", "opco", "prix", "cout", "tarif", "payer", "france travail"))
    return { from: "hub", text: faqs[2].a, links: [{ label: "Voir le financement", href: "/financement" }] };
  if (has("distance", "ligne", "foad", "e-learning", "elearning", "visio"))
    return { from: "hub", text: faqs[1].a, links: [{ label: "Découvrir les formations", href: "/formations" }] };
  if (has("altern", "apprentis", "cfa"))
    return { from: "hub", text: faqs[3].a, links: [{ label: "Tout sur l'alternance", href: "/alternance" }] };
  if (has("bilan"))
    return { from: "hub", text: faqs[4].a, links: [{ label: "Bilan de compétences", href: "/formations#bilan-de-competences" }] };
  if (has("vae", "acquis", "experience"))
    return { from: "hub", text: "La VAE permet de faire reconnaître officiellement les compétences acquises par votre expérience. Nous vous accompagnons de la recevabilité au jury.", links: [{ label: "En savoir plus sur la VAE", href: "/formations#vae" }] };
  if (has("entreprise", "equipe", "salarie", "intra", "collaborateur"))
    return { from: "hub", text: "Nous concevons des formations intra-entreprise sur mesure pour faire monter vos équipes en compétences, du diagnostic au suivi.", links: [{ label: "Offre entreprises", href: "/entreprises" }] };
  if (has("ou ", "adresse", "rouen", "situe", "situé", "localisation"))
    return { from: "hub", text: faqs[5].a, links: [{ label: "Nous contacter", href: "/contact" }] };
  if (has("delai", "combien de temps", "reponse", "recontact", "rappel"))
    return { from: "hub", text: faqs[6].a, links: [{ label: "Faire une demande", href: "/contact" }] };
  if (has("conseiller", "contact", "devis", "rdv", "rendez", "parler", "telephone", "appeler", "humain"))
    return { from: "hub", text: "Avec plaisir ! Laissez-nous vos coordonnées et un conseiller vous recontacte sous 48 heures pour étudier votre projet.", links: [{ label: "Demander un devis", href: "/contact" }] };
  if (has("formation", "cours", "parcours", "certifi", "diplome", "apprendre"))
    return { from: "hub", text: "Nous proposons 6 domaines : formations certifiantes, bilan de compétences, VAE, alternance, e-learning et conseil. Dites-moi votre objectif et je vous oriente.", links: [{ label: "Voir les formations", href: "/formations" }] };

  return {
    from: "hub",
    text: "Bonne question ! Le plus simple est d'en parler avec un conseiller : il étudiera votre projet et vos financements sous 48 heures.",
    links: [{ label: "Parler à un conseiller", href: "/contact" }],
  };
}

export function HubChat() {
  const pathname = usePathname();
  const { outfit, tip } = useMemo(() => contextFor(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Masquer sur le studio Sanity
  const hidden = pathname.startsWith("/studio");

  // Bulle d'accroche (une fois par session, après quelques secondes)
  useEffect(() => {
    if (hidden) return;
    const seen = typeof window !== "undefined" && sessionStorage.getItem("hub_tip_seen");
    if (seen) return;
    const id = setTimeout(() => setShowTip(true), 3500);
    return () => clearTimeout(id);
  }, [hidden]);

  // Message d'accueil à l'ouverture
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "hub", text: mascot.greeting }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function openChat() {
    setShowTip(false);
    sessionStorage.setItem("hub_tip_seen", "1");
    setOpen(true);
  }
  function dismissTip() {
    setShowTip(false);
    sessionStorage.setItem("hub_tip_seen", "1");
  }

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: "user", text: value }, answer(value)]);
    setInput("");
  }

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {/* Bulle d'accroche (style picture-in-picture) */}
      <AnimatePresence>
        {showTip && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="pointer-events-auto relative max-w-[260px] rounded-2xl rounded-br-sm border border-mist bg-white p-4 shadow-card"
          >
            <button
              onClick={dismissTip}
              aria-label="Fermer"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white"
            >
              <X size={13} />
            </button>
            <p className="text-sm text-ink-soft">{tip}</p>
            <button
              onClick={openChat}
              className="mt-3 text-sm font-semibold text-teal-600 hover:underline"
            >
              Discuter avec {mascot.name} →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            role="dialog"
            aria-label={`Chat avec ${mascot.name}`}
            className="pointer-events-auto flex h-[520px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-mist bg-white shadow-card"
          >
            {/* En-tête */}
            <div className="flex items-center gap-3 bg-ink p-4 text-white">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-teal-gradient">
                <Mascot variant={outfit} className="h-12 w-12 translate-y-1" />
              </span>
              <div className="flex-1">
                <p className="font-display text-base font-bold leading-tight">{mascot.name}</p>
                <p className="text-xs text-white/60">{mascot.tagline}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fermer le chat" className="text-white/70 hover:text-white">
                <X size={22} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cloud p-4">
              {messages.map((m, i) => (
                <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.from === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-teal-500 px-4 py-2.5 text-sm text-white"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm border border-mist bg-white px-4 py-2.5 text-sm text-ink-soft"
                    }
                  >
                    <p>{m.text}</p>
                    {m.links?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-mist bg-white px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-teal-300 hover:text-teal-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saisie */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-mist bg-white p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Écrivez à ${mascot.name}…`}
                className="flex-1 rounded-full border border-mist bg-cloud px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-teal-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Envoyer"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white hover:bg-teal-600"
              >
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lanceur (picture-in-picture) */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={openChat}
          aria-label={`Ouvrir le chat avec ${mascot.name}`}
          className="pointer-events-auto relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-teal-gradient shadow-card"
        >
          <Mascot variant={outfit} className="h-16 w-16 translate-y-1.5" />
          <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white bg-coral" />
        </motion.button>
      )}
    </div>
  );
}
