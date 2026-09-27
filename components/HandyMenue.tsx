"use client";

import { useEffect, useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import { MENUE_PUNKTE } from "@/lib/navigation";
import AnfrageChat from "./AnfrageChat";
import { BrancheIcon } from "./BranchenGrafik";
import DemoChat from "./DemoChat";
import { Chat, Kreuz, Menue } from "./Icons";
import { kopfAnfrage } from "./KopfAktionen";

/**
 * Menü für schmale Bildschirme (bis 1000 px sind die Textlinks in der Kopfzeile ausgeblendet).
 * Öffnet unter der Kopfzeile ein Panel; schliesst bei Klick auf einen Link, Klick daneben, Esc
 * oder wenn der Bildschirm wieder breit genug ist.
 */
export default function HandyMenue({ branche }: { branche?: BrancheId }) {
  const [offen, setOffen] = useState(false);
  // Chat-Fenster ausserhalb des Panels, damit sie beim Schliessen des Menüs offen bleiben
  const [chat, setChat] = useState<"anfrage" | "demo" | null>(null);
  const chatZu = useRef(() => setChat(null)).current;
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
    const breit = window.matchMedia("(min-width: 1001px)");
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
            <div className="menue-aktionen">
              <button
                type="button"
                className="btn btn-primaer"
                onClick={() => {
                  zu();
                  setChat("anfrage");
                }}
              >
                Unverbindlich anfragen
              </button>
              <button
                type="button"
                className="btn btn-linie"
                onClick={() => {
                  zu();
                  setChat("demo");
                }}
              >
                <Chat />
                Im Chat testen
              </button>
            </div>
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

      {chat === "anfrage" && <AnfrageChat kontext={kopfAnfrage(branche)} schliessen={chatZu} />}
      {chat === "demo" && <DemoChat branche={branche} schliessen={chatZu} />}
    </>
  );
}
