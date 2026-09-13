"use client";

import { useEffect, useRef } from "react";

/**
 * Un réseau de neurones qui respire derrière le héros.
 *
 * Des nœuds dérivent lentement ; deux nœuds proches se relient, et la liaison s'éclaire
 * d'autant plus qu'ils sont près. Le pointeur agit comme un neurone de plus : il attire
 * les liaisons autour de lui. C'est la seule animation « de décor » du site, et elle est
 * tenue sous trois contraintes :
 *
 *   * **arrêt hors champ** — un `IntersectionObserver` coupe la boucle dès que le héros
 *     sort de l'écran, et l'onglet caché la suspend aussi : aucune batterie brûlée pour
 *     une image que personne ne regarde ;
 *   * **densité proportionnelle à la surface**, plafonnée — un téléphone reçoit une
 *     quarantaine de nœuds, pas cent ;
 *   * **mouvement réduit respecté** — sous `prefers-reduced-motion`, une seule image fixe
 *     est dessinée, puis plus rien ne bouge.
 */
export function ChampNeuronal({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = true;
    const souris = { x: -9999, y: -9999 };
    type Noeud = { x: number; y: number; vx: number; vy: number; r: number };
    let noeuds: Noeud[] = [];

    function dimensionner() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.max(28, Math.round((w * h) / 15000)));
      noeuds = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function dessiner() {
      ctx!.clearRect(0, 0, w, h);
      const portee = Math.min(150, Math.max(90, w / 9));
      for (let i = 0; i < noeuds.length; i++) {
        const a = noeuds[i];
        for (let j = i + 1; j < noeuds.length; j++) {
          const b = noeuds[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < portee) {
            ctx!.strokeStyle = `rgba(120,170,255,${(1 - d / portee) * 0.32})`;
            ctx!.lineWidth = 0.7;
            ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
          }
        }
        const ds = Math.hypot(a.x - souris.x, a.y - souris.y);
        if (ds < portee * 1.3) {
          ctx!.strokeStyle = `rgba(103,232,249,${(1 - ds / (portee * 1.3)) * 0.55})`;
          ctx!.lineWidth = 0.9;
          ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(souris.x, souris.y); ctx!.stroke();
        }
      }
      for (const n of noeuds) {
        ctx!.fillStyle = "rgba(190,215,255,0.9)";
        ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx!.fill();
      }
    }

    function avancer() {
      for (const n of noeuds) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      dessiner();
      if (visible && !document.hidden) raf = requestAnimationFrame(avancer);
    }

    function relancer() {
      cancelAnimationFrame(raf);
      if (!reduit && visible && !document.hidden) raf = requestAnimationFrame(avancer);
    }

    dimensionner();
    dessiner();

    const ro = new ResizeObserver(() => { dimensionner(); dessiner(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; relancer(); });
    io.observe(canvas);
    const surPointeur = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      souris.x = e.clientX - r.left; souris.y = e.clientY - r.top;
      if (reduit) dessiner();
    };
    const horsPointeur = () => { souris.x = -9999; souris.y = -9999; };
    window.addEventListener("pointermove", surPointeur, { passive: true });
    window.addEventListener("pointerleave", horsPointeur);
    document.addEventListener("visibilitychange", relancer);
    relancer();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", surPointeur);
      window.removeEventListener("pointerleave", horsPointeur);
      document.removeEventListener("visibilitychange", relancer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
