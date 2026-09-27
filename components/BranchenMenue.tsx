"use client";

import { useEffect, useRef, useState } from "react";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import { BrancheIcon } from "./BranchenGrafik";
import { Pfeil } from "./Icons";

/**
 * Menüpunkt «Branchen» in der Kopfzeile (Desktop): öffnet beim Darüberfahren oder per Tastatur
 * eine Liste der sechs Branchenseiten. Ein Klick auf «Branchen» selbst führt wie bisher zum Abschnitt.
 */
export default function BranchenMenue() {
  const [offen, setOffen] = useState(false);
  const zuTimer = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const oeffnen = () => {
    window.clearTimeout(zuTimer.current);
    setOffen(true);
  };
  // Kurz verzögert schliessen, damit der Weg von «Branchen» ins Menü nicht abreisst
  const spaeterZu = () => {
    window.clearTimeout(zuTimer.current);
    zuTimer.current = window.setTimeout(() => setOffen(false), 180);
  };

  useEffect(() => {
    if (!offen) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOffen(false);
        boxRef.current?.querySelector<HTMLElement>(".nav-branchen-link")?.focus();
      }
    };
    document.addEventListener("keydown", taste);
    return () => document.removeEventListener("keydown", taste);
  }, [offen]);

  useEffect(() => () => window.clearTimeout(zuTimer.current), []);

  return (
    <div
      ref={boxRef}
      className={"nav-branchen" + (offen ? " offen" : "")}
      onMouseEnter={oeffnen}
      onMouseLeave={spaeterZu}
      onFocus={oeffnen}
      onBlur={(e) => {
        if (!boxRef.current?.contains(e.relatedTarget as Node)) setOffen(false);
      }}
    >
      <a className="nav-branchen-link" href="/#branchen" aria-haspopup="true" aria-expanded={offen}>
        Branchen
        <svg className="nav-pfeil" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
      <div className="nav-dropdown" hidden={!offen}>
        <ul>
          {BRANCHENSEITEN.map((s) => (
            <li key={s.slug}>
              <a href={`/branchen/${s.slug}/`} onClick={() => setOffen(false)}>
                <span className="nav-dropdown-ico"><BrancheIcon id={s.id} /></span>
                {s.mehrzahl}
              </a>
            </li>
          ))}
        </ul>
        <a className="nav-dropdown-alle" href="/#branchen" onClick={() => setOffen(false)}>
          Alle Branchen im Überblick <Pfeil strich={2} />
        </a>
      </div>
    </div>
  );
}
