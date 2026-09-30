"use client";

import { useEffect, useRef } from "react";
import type { Klangkoerper } from "@/lib/auftrag/Klangkoerper";
import { stimmeHoeren } from "@/lib/stimme";

/**
 * Feste 3D-Bühne hinter der Seite: der Sternenhimmel über die ganze Seite, die sprechende Kugel nur im Hero.
 * Die Kugel sitzt in der Demo-Spalte des Heros und scrollt mit ihm weg; sie folgt dem Besucher nicht.
 * Ohne WebGL leuchtet eine CSS-Kugel im Hero, mit «Bewegung reduzieren» bleibt ein ruhiges Standbild.
 */
export default function Klangbuehne() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 720;
    let weg = false;
    let aufraeumen = () => {};

    import("@/lib/auftrag/Klangkoerper")
      .then(({ Klangkoerper }) => {
        if (weg) return;
        let k: Klangkoerper;
        try {
          k = new Klangkoerper(canvas, { motion, lowPower });
        } catch {
          return;
        }
        document.documentElement.classList.add("mit-3d");

        const hero = document.querySelector<HTMLElement>(".hero");
        const demo = document.querySelector<HTMLElement>(".hero .demo");
        const buehne = document.querySelector<HTMLElement>(".hero .stimme-buehne");

        // Kugel an die Demo-Spalte heften; auf dem Handy in den freien Raum über der Meldung
        const platzieren = () => {
          const h = window.innerHeight;
          if (!hero || !demo) {
            k.setKugel(-9999, -9999, 0.1);
            k.setScroll(window.scrollY, false);
            return;
          }
          const d = demo.getBoundingClientRect();
          if (window.innerWidth > 960) {
            const groesse = Math.min(h * 0.62, d.height * 0.85, d.width * 1.05);
            k.setKugel(d.left + d.width / 2, d.top + d.height * 0.47, groesse / h);
          } else {
            // Freier Raum zwischen den Branchen-Knöpfen (oben, rund 48 px) und dem Untertitel
            const oben = buehne ? parseFloat(getComputedStyle(buehne).paddingTop) || 300 : 300;
            const frei = oben - 48;
            const groesse = Math.min(frei * 0.92, window.innerWidth * 0.78);
            k.setKugel(window.innerWidth / 2, d.top + 48 + frei / 2, groesse / h);
          }
          k.setScroll(window.scrollY, hero.getBoundingClientRect().bottom > h * 0.5);
        };
        platzieren();

        let geplant = false;
        const scroll = () => {
          if (geplant) return;
          geplant = true;
          requestAnimationFrame(() => {
            geplant = false;
            platzieren();
          });
        };
        const zeiger = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          k.setMaus((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
        };
        const raus = () => k.mausWeg();
        // Klick auf freie Fläche: Druckwelle (nicht bei Knöpfen, Links und Feldern)
        const klick = (e: MouseEvent) => {
          const t = e.target as Element | null;
          if (t?.closest("a, button, input, textarea, select, summary, label, iframe, [role=dialog]")) return;
          k.knall((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
        };
        const groesse = () => {
          k.resize();
          platzieren();
        };
        const steuern = () => (document.hidden || !motion ? k.stop() : k.start());
        // Die Höhe des Heros ändert sich, wenn Schriften laden oder die Meldung wächst
        const beobachter = new ResizeObserver(platzieren);
        if (demo) beobachter.observe(demo);

        window.addEventListener("scroll", scroll, { passive: true });
        window.addEventListener("pointermove", zeiger, { passive: true });
        document.documentElement.addEventListener("pointerleave", raus);
        window.addEventListener("click", klick);
        window.addEventListener("resize", groesse);
        document.addEventListener("visibilitychange", steuern);
        const abmelden = stimmeHoeren(({ wer, branche }) => {
          k.setSprecher(wer);
          if (branche) k.setBranche(branche);
        });
        steuern();

        aufraeumen = () => {
          beobachter.disconnect();
          window.removeEventListener("scroll", scroll);
          window.removeEventListener("pointermove", zeiger);
          document.documentElement.removeEventListener("pointerleave", raus);
          window.removeEventListener("click", klick);
          window.removeEventListener("resize", groesse);
          document.removeEventListener("visibilitychange", steuern);
          abmelden();
          k.dispose();
          document.documentElement.classList.remove("mit-3d");
        };
      })
      .catch(() => {});

    return () => {
      weg = true;
      aufraeumen();
    };
  }, []);

  return (
    <div className="klangbuehne" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
