"use client";

import { useEffect, useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { DEMO_BRANCHEN } from "@/lib/demo";
import { gewaehlteBranche } from "@/lib/gewaehlteBranche";
import DemoChat from "./DemoChat";
import { ChatPunkte } from "./Icons";

/** Höhe des Bereichs unten am Bildschirm, den der Knopf belegt (inklusive Abstand) */
const KNOPF_ZONE = 96;

/**
 * Eigener Chat-Knopf unten rechts (ersetzt die fonio-Sprechblase).
 * Öffnet den Beispiel-Chat im gleichen Fenster wie im Hero: auf Branchenseiten die passende
 * Beispiel-Firma, sonst die zuletzt gewählte Branche oder die Auswahl.
 * Über Bereichen mit `data-ohne-chatknopf` (Preiskarten, Kontakt, Fusszeile) tritt er zurück,
 * damit er keine Knöpfe verdeckt.
 */
export default function ChatStarter({ branche }: { branche?: BrancheId }) {
  const [offen, setOffen] = useState(false);
  const [versteckt, setVersteckt] = useState(false);
  const [start, setStart] = useState<BrancheId | undefined>(branche);
  const schliessen = useRef(() => setOffen(false)).current;
  const beschriftung = branche ? `Beispiel-Chat ${DEMO_BRANCHEN[branche].firma}` : "Beispiel-Chat";

  useEffect(() => {
    let bild = 0;
    const pruefen = () => {
      bild = 0;
      const unten = window.innerHeight;
      const belegt = Array.from(document.querySelectorAll("[data-ohne-chatknopf]")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < unten && r.bottom > unten - KNOPF_ZONE;
      });
      setVersteckt(belegt);
    };
    const planen = () => {
      if (!bild) bild = requestAnimationFrame(pruefen);
    };
    pruefen();
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("resize", planen);
    return () => {
      cancelAnimationFrame(bild);
      window.removeEventListener("scroll", planen);
      window.removeEventListener("resize", planen);
    };
  }, []);

  return (
    <>
      <button
        className={"chat-starter" + (versteckt ? " zurueck" : "")}
        type="button"
        onClick={() => {
          setStart(branche ?? gewaehlteBranche());
          setOffen(true);
        }}
        aria-label={`${beschriftung} öffnen`}
        tabIndex={versteckt ? -1 : undefined}
        aria-hidden={versteckt || undefined}
      >
        <ChatPunkte strich={2} />
        <span className="chat-starter-text">Beispiel-Chat</span>
      </button>
      {offen && <DemoChat branche={start} schliessen={schliessen} />}
    </>
  );
}
