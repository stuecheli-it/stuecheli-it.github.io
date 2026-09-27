"use client";

import { useEffect, useRef, useState } from "react";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import { MENUE_PUNKTE } from "@/lib/navigation";
import { BrancheIcon } from "./BranchenGrafik";
import { Kreuz, Menue } from "./Icons";

/**
 * Menü für schmale Bildschirme (unter 860 px sind die Menüpunkte in der Kopfzeile ausgeblendet).
 * Öffnet unter der Kopfzeile ein Panel; schliesst bei Klick auf einen Link, Klick daneben, Esc
 * oder wenn der Bildschirm wieder breit genug ist.
 */
export default function HandyMenue() {
  const [offen, setOffen] = useState(false);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!offen) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOffen(false);
        knopfRef.current?.focus();
      }
    };
    const klick = (e: MouseEvent) => {
      const ziel = e.target as Node;
      if (!panelRef.current?.contains(ziel) && !knopfRef.current?.contains(ziel)) setOffen(false);
    };
    const breit = window.matchMedia("(min-width: 861px)");
    const wechsel = () => breit.matches && setOffen(false);
    document.addEventListener("keydown", taste);
    document.addEventListener("click", klick);
    breit.addEventListener("change", wechsel);
    return () => {
      document.removeEventListener("keydown", taste);
      document.removeEventListener("click", klick);
      breit.removeEventListener("change", wechsel);
    };
  }, [offen]);

  const zu = () => setOffen(false);

  return (
    <>
      <button
        ref={knopfRef}
        type="button"
        className={"menue-knopf" + (offen ? " offen" : "")}
        aria-expanded={offen}
        aria-controls="handy-menue"
        aria-label={offen ? "Menü schliessen" : "Menü öffnen"}
        onClick={() => setOffen((o) => !o)}
      >
        {offen ? <Kreuz /> : <Menue />}
      </button>

      {offen && (
        <div ref={panelRef} id="handy-menue" className="menue-panel">
          <nav aria-label="Menü">
            <ul className="menue-liste">
              {MENUE_PUNKTE.map((p) => (
                <li key={p.href}>
                  <a href={p.href} onClick={zu}>{p.text}</a>
                </li>
              ))}
            </ul>
            <div className="menue-titel">Ihre Branche</div>
            <div className="menue-branchen">
              {BRANCHENSEITEN.map((b) => (
                <a key={b.slug} href={`/branchen/${b.slug}/`} onClick={zu}>
                  <BrancheIcon id={b.id} />
                  {b.kurz}
                </a>
              ))}
            </div>
            <div className="menue-recht">
              <a href="/impressum/" onClick={zu}>Impressum</a>
              <a href="/datenschutz/" onClick={zu}>Datenschutz</a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
