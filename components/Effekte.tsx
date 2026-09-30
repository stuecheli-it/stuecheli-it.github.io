"use client";

import { useEffect } from "react";

/**
 * Kleine Effekte für die ganze Seite, mit einem einzigen Zeiger-Listener:
 * - `.spot`: ein Lichtkegel folgt der Maus über der Fläche (CSS-Variablen --mx / --my)
 * - `.kipp`: die Fläche neigt sich in 3D zur Maus
 * - `.magnet`: Knöpfe ziehen sich leicht zur Maus
 * Dazu der Lesefortschritt oben am Bildschirm. Auf Touch-Geräten und mit «Bewegung reduzieren» nur der Fortschritt.
 */
export default function Effekte() {
  useEffect(() => {
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fein = window.matchMedia("(pointer: fine)").matches;
    let gekippt: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const zuruecksetzen = (el: HTMLElement | null, eigenschaft: "kipp" | "magnet") => {
      if (!el) return;
      if (eigenschaft === "kipp") el.style.transform = "";
      else el.style.translate = "";
    };

    const bewegen = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const spot = t?.closest<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (ruhig || !fein) return;
      const kipp = t?.closest<HTMLElement>(".kipp") ?? null;
      if (kipp !== gekippt) {
        zuruecksetzen(gekippt, "kipp");
        gekippt = kipp;
      }
      if (kipp) {
        const r = kipp.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        kipp.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateZ(0)`;
      }
      const m = t?.closest<HTMLElement>(".magnet") ?? null;
      if (m !== magnet) {
        zuruecksetzen(magnet, "magnet");
        magnet = m;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        m.style.translate = `${(x * 0.18).toFixed(1)}px ${(y * 0.28).toFixed(1)}px`;
      }
    };
    const raus = () => {
      zuruecksetzen(gekippt, "kipp");
      zuruecksetzen(magnet, "magnet");
      gekippt = magnet = null;
    };

    // Lesefortschritt; in Browsern mit scroll-getriebenen Animationen übernimmt CSS
    const balken = document.querySelector<HTMLElement>(".lesefortschritt");
    const css = CSS.supports("animation-timeline: scroll()");
    const fortschritt = () => {
      if (!balken || css) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      balken.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };

    window.addEventListener("pointermove", bewegen, { passive: true });
    document.documentElement.addEventListener("pointerleave", raus);
    window.addEventListener("scroll", fortschritt, { passive: true });
    fortschritt();
    return () => {
      window.removeEventListener("pointermove", bewegen);
      document.documentElement.removeEventListener("pointerleave", raus);
      window.removeEventListener("scroll", fortschritt);
    };
  }, []);

  return <div className="lesefortschritt" aria-hidden="true" />;
}
