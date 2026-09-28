"use client";

import { useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { Globus, Kreuz } from "./Icons";
import LiveDemoFormular from "./LiveDemoFormular";
import { useFenster } from "./useFenster";

/** Fenster mit dem Live-Demo-Formular, für Kopfzeile und Kontakt (im Hero steht das Formular direkt). */
export function LiveDemoFenster({ branche, schliessen }: { branche?: BrancheId; schliessen: () => void }) {
  const fensterRef = useRef<HTMLDivElement>(null);
  // Fokus gleich ins Eingabefeld statt auf «Schliessen»
  const feldRef = useRef<HTMLElement | null>(null);
  useFenster(fensterRef, feldRef, schliessen);

  return (
    <div className="plan-hintergrund" onClick={(e) => e.target === e.currentTarget && schliessen()}>
      <div
        ref={fensterRef}
        className="plan-fenster live-demo-fenster"
        role="dialog"
        aria-modal="true"
        aria-labelledby="liveDemoTitel"
      >
        <button className="plan-zu" type="button" aria-label="Schliessen" onClick={schliessen}>
          <Kreuz />
        </button>
        <header className="plan-kopf chat-kopf">
          <div className="plan-glow" aria-hidden />
          <div className="plan-marken">
            <span className="plan-produkt"><Globus />Live-Demo</span>
          </div>
          <h3 id="liveDemoTitel">Ihre eigene Demo</h3>
          <p className="plan-fuer">
            Geben Sie die Adresse Ihrer Website ein. Der Assistent liest sie und spricht danach wie Ihr eigener Betrieb.
          </p>
        </header>
        <div
          className="plan-inhalt"
          ref={(el) => {
            feldRef.current = el?.querySelector<HTMLElement>("input:not([type=hidden])") ?? null;
          }}
        >
          <LiveDemoFormular hell branche={branche} gesendet={schliessen} />
        </div>
        <footer className="plan-fuss chat-fuss">
          <p>
            Öffnet sich in einem neuen Tab · <a href="/datenschutz/#live-demo">Datenschutz</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

/** Knopf, der das Live-Demo-Fenster öffnet */
export default function LiveDemoKnopf({
  className,
  branche,
  children,
}: {
  className: string;
  branche?: BrancheId;
  children: React.ReactNode;
}) {
  const [offen, setOffen] = useState(false);
  const schliessen = useRef(() => setOffen(false)).current;
  return (
    <>
      <button className={className} type="button" onClick={() => setOffen(true)}>
        {children}
      </button>
      {offen && <LiveDemoFenster branche={branche} schliessen={schliessen} />}
    </>
  );
}
