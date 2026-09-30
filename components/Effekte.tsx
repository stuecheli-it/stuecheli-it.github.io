"use client";

import { useEffect } from "react";

/**
 * Lesefortschritt oben am Bildschirm. In Browsern mit scroll-getriebenen Animationen übernimmt CSS.
 * Lichtkegel, 3D-Neigung und magnetische Knöpfe sind seit dem 30.09.2026 entfernt (ruhiger, Wunsch des Inhabers).
 */
export default function Effekte() {
  useEffect(() => {
    const balken = document.querySelector<HTMLElement>(".lesefortschritt");
    if (!balken || CSS.supports("animation-timeline: scroll()")) return;
    const fortschritt = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      balken.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener("scroll", fortschritt, { passive: true });
    fortschritt();
    return () => window.removeEventListener("scroll", fortschritt);
  }, []);

  return <div className="lesefortschritt" aria-hidden="true" />;
}
