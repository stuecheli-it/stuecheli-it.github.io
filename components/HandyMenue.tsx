"use client";

import { useEffect, useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import { gewaehlteBranche } from "@/lib/gewaehlteBranche";
import { MENUE_PUNKTE } from "@/lib/navigation";
import { BrancheIcon } from "./BranchenGrafik";
import DemoChat from "./DemoChat";
import { Chat, Globus, Kreuz, Menue, Pfeil } from "./Icons";
import { LiveDemoFenster } from "./LiveDemoFenster";

/**
 * Menü für schmale Bildschirme (bis 940 px sind die Textlinks in der Kopfzeile ausgeblendet).
 * Öffnet unter der Kopfzeile ein Panel; schliesst bei Klick auf einen Link, Klick daneben, Esc
 * oder wenn der Bildschirm wieder breit genug ist.
 */
export default function HandyMenue({ branche }: { branche?: BrancheId }) {
  const [offen, setOffen] = useState(false);
  // Chat-Fenster ausserhalb des Panels, damit sie beim Schliessen des Menüs offen bleiben
  const [chat, setChat] = useState<"demo" | "live" | null>(null);
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
    const breit = window.matchMedia("(min-width: 941px)");
    const wechsel = () => breit.matches && setOffen(false);
    document.addEventListener("keydown", taste);
    document.addEventListener("click", klick);
    breit.addEventListener("change", wechsel);
    // Das Panel füllt den Bildschirm; die Seite dahinter scrollt solange nicht
    document.body.classList.add("menue-offen");
    return () => {
      document.removeEventListener("keydown", taste);
      document.removeEventListener("click", klick);
      breit.removeEventListener("change", wechsel);
      document.body.classList.remove("menue-offen");
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
            {/* Selbst erleben vor Anfragen: die Anfrage steht schon in der Kopfzeile, hier zuerst die Demos */}
            <div className="menue-aktionen">
              <button
                type="button"
                className="btn btn-primaer"
                onClick={() => {
                  zu();
                  setChat("live");
                }}
              >
                <Globus />
                Anruf-Demo mit Ihrer Website
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
                Beispiel-Chat
              </button>
            </div>
            {/* Die Branchen zuerst: danach suchen die meisten Besucher */}
            <div className="menue-titel">Ihre Branche</div>
            <div className="menue-branchen">
              {BRANCHENSEITEN.map((b) => (
                <a
                  key={b.slug}
                  href={`/branchen/${b.slug}/`}
                  className={b.id === branche ? "aktiv" : undefined}
                  aria-current={b.id === branche ? "page" : undefined}
                  onClick={zu}
                >
                  <BrancheIcon id={b.id} />
                  {b.kurz}
                </a>
              ))}
            </div>
            <a className="menue-alle" href="/#branchen" onClick={zu}>
              Alle Branchen im Überblick <Pfeil strich={2} />
            </a>
            <ul className="menue-liste">
              {MENUE_PUNKTE.filter((p) => p.href !== "/#branchen").map((p) => (
                <li key={p.href}>
                  <a href={p.href} onClick={zu}>{p.text}</a>
                </li>
              ))}
            </ul>
            <div className="menue-recht">
              <a href="/impressum/" onClick={zu}>Impressum</a>
              <a href="/datenschutz/" onClick={zu}>Datenschutz</a>
            </div>
          </nav>
        </div>
      )}
      {chat === "demo" && <DemoChat branche={branche ?? gewaehlteBranche()} schliessen={chatZu} />}
      {chat === "live" && <LiveDemoFenster branche={branche} schliessen={chatZu} />}
    </>
  );
}
