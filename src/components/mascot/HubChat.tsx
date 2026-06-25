"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Mascot, type MascotVariant } from "./Mascot";
import { mascot } from "@/lib/site";
import { localAnswer } from "@/lib/assistant";

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

const QUICK = [
  "Quelles formations proposez-vous ?",
  "Comment financer ma formation ?",
  "Puis-je suivre à distance ?",
  "Parler à un conseiller",
];

function makeSessionId() {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem("hub_sid");
  if (!id) {
    id = (window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    sessionStorage.setItem("hub_sid", id);
  }
  return id;
}

export function HubChat() {
  const pathname = usePathname();
  const { outfit, tip } = useMemo(() => contextFor(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [sessionId] = useState(makeSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hidden = pathname.startsWith("/studio");

  useEffect(() => {
    if (hidden) return;
    if (sessionStorage.getItem("hub_tip_seen")) return;
    const id = setTimeout(() => setShowTip(true), 3500);
    return () => clearTimeout(id);
  }, [hidden]);

  useEffect(() => {
    if (open && messages.length === 0) setMessages([{ from: "hub", text: mascot.greeting }]);
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, pending]);

  function openChat() {
    setShowTip(false);
    sessionStorage.setItem("hub_tip_seen", "1");
    setOpen(true);
  }
  function dismissTip() {
    setShowTip(false);
    sessionStorage.setItem("hub_tip_seen", "1");
  }

  async function send(text: string) {
    const value = text.trim();
    if (!value || pending) return;
    setMessages((m) => [...m, { from: "user", text: value }]);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: value, page: pathname }),
      });
      const data = (await res.json()) as { text: string; links?: CLink[] };
      setMessages((m) => [...m, { from: "hub", text: data.text, links: data.links }]);
    } catch {
      const a = localAnswer(value);
      setMessages((m) => [...m, { from: "hub", text: a.text, links: a.links }]);
    } finally {
      setPending(false);
    }
  }

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {/* Bulle d'accroche (picture-in-picture) */}
      <AnimatePresence>
        {showTip && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="pointer-events-auto relative max-w-[260px] rounded-2xl rounded-br-sm border border-mist bg-white p-4 shadow-card"
          >
            <button onClick={dismissTip} aria-label="Fermer" className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white">
              <X size={13} />
            </button>
            <p className="text-sm text-ink-soft">{tip}</p>
            <button onClick={openChat} className="mt-3 text-sm font-semibold text-teal-600 hover:underline">
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

              {pending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-mist bg-white px-4 py-3">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" />
                    </span>
                  </div>
                </div>
              )}

              {messages.length <= 1 && !pending && (
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
              <button type="submit" aria-label="Envoyer" disabled={pending} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50">
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lanceur */}
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
