"use client";

import { useEffect, useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import { DEMO_BRANCHEN } from "@/lib/demo";
import { FIRMA } from "@/lib/firma";
import type { AnfrageKontext } from "@/lib/fonio";
import AnfrageChat from "./AnfrageChat";
import DemoChat from "./DemoChat";
import { Chat, Telefon } from "./Icons";

/** Kontext für «Unverbindlich anfragen» aus der Kopfzeile, auf Branchenseiten mit Branche */
export function kopfAnfrage(branche?: BrancheId): AnfrageKontext {
  const s = branche ? BRANCHENSEITEN.find((x) => x.id === branche) : undefined;
  return s
    ? { thema: `Telefon KI für ${s.mehrzahl}`, branche: s.mehrzahl, quelle: `Kopfzeile, Branchenseite ${s.kurz}` }
    : { thema: "Allgemeine Anfrage", quelle: "Kopfzeile" };
}

/**
 * Knöpfe rechts in der Kopfzeile (Desktop und Tablet):
 * «Demo» mit Auswahl Anrufen oder Chat und «Unverbindlich anfragen» als Hauptknopf.
 */
export default function KopfAktionen({ branche }: { branche?: BrancheId }) {
  const [demoOffen, setDemoOffen] = useState(false);
  const [chat, setChat] = useState<"anfrage" | "demo" | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const schliessen = useRef(() => setChat(null)).current;

  useEffect(() => {
    if (!demoOffen) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDemoOffen(false);
        knopfRef.current?.focus();
      }
    };
    const klick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setDemoOffen(false);
    };
    document.addEventListener("keydown", taste);
    document.addEventListener("click", klick);
    return () => {
      document.removeEventListener("keydown", taste);
      document.removeEventListener("click", klick);
    };
  }, [demoOffen]);

  return (
    <div className="kopf-aktionen">
      <div ref={boxRef} className={"demo-menue" + (demoOffen ? " offen" : "")}>
        <button
          ref={knopfRef}
          type="button"
          className="btn btn-linie btn-klein demo-menue-knopf"
          aria-expanded={demoOffen}
          aria-haspopup="true"
          onClick={() => setDemoOffen((o) => !o)}
        >
          Demo
          <svg className="nav-pfeil" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {demoOffen && (
          <div className="nav-dropdown demo-dropdown">
            <a className="demo-option" href={FIRMA.demoTelefonLink} onClick={() => setDemoOffen(false)}>
              <span className="nav-dropdown-ico"><Telefon /></span>
              <span>
                <b>Anrufen</b>
                <small>{FIRMA.demoTelefon}, rund um die Uhr</small>
              </span>
            </a>
            <button
              type="button"
              className="demo-option"
              onClick={() => {
                setDemoOffen(false);
                setChat("demo");
              }}
            >
              <span className="nav-dropdown-ico"><Chat /></span>
              <span>
                <b>Im Chat testen</b>
                <small>{branche ? `Beispiel-Firma: ${DEMO_BRANCHEN[branche].firma}` : "Beispiel-Firma Ihrer Branche wählen"}</small>
              </span>
            </button>
          </div>
        )}
      </div>
      <button type="button" className="btn btn-dunkel btn-klein" onClick={() => setChat("anfrage")}>
        Unverbindlich anfragen
      </button>

      {chat === "anfrage" && <AnfrageChat kontext={kopfAnfrage(branche)} schliessen={schliessen} />}
      {chat === "demo" && <DemoChat branche={branche} schliessen={schliessen} />}
    </div>
  );
}
