"use client";

import { useEffect, useRef } from "react";
import type { Klangkoerper } from "@/lib/auftrag/Klangkoerper";
import { stimmeHoeren } from "@/lib/stimme";

/**
 * 3D-Bühne im Hero (seit 01.10.2026 nur noch dort, die übrige Seite ist hell): Sternenhimmel und die sprechende Kugel.
 * Das Canvas liegt hinter dem Inhalt des Heros und scrollt mit ihm weg; ausserhalb des Bildes steht die Schleife still.
 * Auf dem Handy (gestapeltes Layout bis 960 px) spricht statt der Kugel die Schallwelle aus Website 2.2.
 * Ohne WebGL leuchtet am Desktop eine CSS-Kugel im Hero, mit «Bewegung reduzieren» bleibt ein ruhiges Standbild.
 */
export default function Klangbuehne() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !hero) return;
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

        const demo = hero.querySelector<HTMLElement>(".demo");
        const buehne = hero.querySelector<HTMLElement>(".stimme-buehne");

        // Kugel an die Demo-Spalte heften; auf dem Handy die Welle in den freien Raum über der Meldung.
        // Lagen relativ zum Canvas, das so gross ist wie der Hero.
        const platzieren = () => {
          if (!demo) {
            k.setKugel(-9999, -9999, 0.1);
            k.setWelle(null);
            return;
          }
          const c = canvas.getBoundingClientRect();
          const r = demo.getBoundingClientRect();
          const d = { left: r.left - c.left, top: r.top - c.top, width: r.width, height: r.height };
          if (window.innerWidth > 960) {
            const groesse = Math.min(window.innerHeight * 0.62, d.height * 0.85, d.width * 1.05);
            k.setKugel(d.left + d.width / 2, d.top + d.height * 0.47, groesse / Math.max(1, c.height));
            k.setWelle(null);
          } else {
            // Freier Raum zwischen den Branchen-Knöpfen (oben, rund 48 px) und dem Untertitel
            const oben = buehne ? parseFloat(getComputedStyle(buehne).paddingTop) || 300 : 300;
            const frei = oben - 48;
            k.setKugel(-9999, -9999, 0.1);
            k.setWelle({ links: d.left, oben: d.top + 48 + frei * 0.1, breite: d.width, hoehe: frei * 0.8 });
          }
        };
        const groesse = () => {
          k.resize();
          platzieren();
        };
        groesse();

        let geplant = false;
        const scroll = () => {
          if (geplant) return;
          geplant = true;
          requestAnimationFrame(() => {
            geplant = false;
            k.setScroll(window.scrollY);
          });
        };
        const zeiger = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          const c = canvas.getBoundingClientRect();
          k.setMaus(((e.clientX - c.left) / c.width) * 2 - 1, -(((e.clientY - c.top) / c.height) * 2 - 1));
        };
        const raus = () => k.mausWeg();

        // Nur zeichnen, solange der Hero im Bild und der Tab sichtbar ist
        let imBild = true;
        const steuern = () => (document.hidden || !motion || !imBild ? k.stop() : k.start());
        const sicht = new IntersectionObserver(([e]) => {
          imBild = e.isIntersecting;
          steuern();
        });
        sicht.observe(hero);
        // Die Höhe des Heros ändert sich, wenn Schriften laden oder die Meldung wächst
        const beobachter = new ResizeObserver(groesse);
        beobachter.observe(hero);
        if (demo) beobachter.observe(demo);

        window.addEventListener("scroll", scroll, { passive: true });
        hero.addEventListener("pointermove", zeiger, { passive: true });
        hero.addEventListener("pointerleave", raus);
        document.addEventListener("visibilitychange", steuern);
        const abmelden = stimmeHoeren(({ wer, branche }) => {
          k.setSprecher(wer);
          if (branche) k.setBranche(branche);
        });
        steuern();

        aufraeumen = () => {
          sicht.disconnect();
          beobachter.disconnect();
          window.removeEventListener("scroll", scroll);
          hero.removeEventListener("pointermove", zeiger);
          hero.removeEventListener("pointerleave", raus);
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
