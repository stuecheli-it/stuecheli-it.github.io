"use client";

import { useEffect, useRef, useState } from "react";
import { anfrageChatAdresse, type AnfrageKontext } from "@/lib/fonio";
import { Chat, Kreuz, Pfeil } from "./Icons";
import { useFenster } from "./useFenster";

/**
 * Chat-Fenster für «Unverbindlich anfragen».
 * fonio erlaubt nur ein Widget pro Seite. Der Demo-Chat belegt diesen Platz schon,
 * deshalb läuft der Anfrage-Chat in einem eigenen Rahmen (public/anfrage-chat.html).
 * Der Kontext (Plan, Branche) geht über die Adresse an den Rahmen und von dort an fonio.
 */
export default function AnfrageChat({ kontext, schliessen }: { kontext: AnfrageKontext; schliessen: () => void }) {
  const { thema } = kontext;
  const fensterRef = useRef<HTMLDivElement>(null);
  const zuRef = useRef<HTMLButtonElement>(null);
  const [geladen, setGeladen] = useState(false);
  useFenster(fensterRef, zuRef, schliessen);

  // Die Chat-Seite im Rahmen meldet, wann der Chat offen ist und wann er über das fonio-Kreuz geschlossen wurde
  useEffect(() => {
    const nachricht = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const typ = (e.data as { anfrageChat?: string } | null)?.anfrageChat;
      if (typ === "offen") setGeladen(true);
      if (typ === "zu") schliessen();
    };
    window.addEventListener("message", nachricht);
    // Falls die Meldung ausbleibt, den Rahmen trotzdem zeigen
    const notfall = window.setTimeout(() => setGeladen(true), 8000);
    return () => {
      window.removeEventListener("message", nachricht);
      window.clearTimeout(notfall);
    };
  }, [schliessen]);

  return (
    <div className="plan-hintergrund" onClick={(e) => e.target === e.currentTarget && schliessen()}>
      <div
        ref={fensterRef}
        className="plan-fenster chat-fenster"
        role="dialog"
        aria-modal="true"
        aria-labelledby="anfrageTitel"
      >
        <button ref={zuRef} className="plan-zu" type="button" aria-label="Schliessen" onClick={schliessen}>
          <Kreuz />
        </button>

        <header className="plan-kopf chat-kopf">
          <div className="plan-glow" aria-hidden />
          <div className="plan-marken">
            <span className="plan-produkt"><Chat />{thema}</span>
          </div>
          <h3 id="anfrageTitel">Unverbindlich anfragen</h3>
          <p className="plan-fuer">
            Ihre Anfrage zu «{thema}». Schreiben Sie uns kurz, was Sie wissen möchten. Wir melden uns persönlich bei
            Ihnen.
          </p>
        </header>

        <div className={"chat-rahmen" + (geladen ? " geladen" : "")}>
          <div className="chat-laden" aria-hidden={geladen}>
            <span className="chat-punkte"><i /><i /><i /></span>
            Chat wird geladen …
          </div>
          <iframe
            src={anfrageChatAdresse(kontext)}
            title="Anfrage-Chat von Stücheli IT Consulting"
          />
        </div>

        <footer className="plan-fuss chat-fuss">
          <p>
            Lieber per E-Mail oder Telefon? · <a href="/datenschutz/#chat">Datenschutz</a>
          </p>
          <a href="#kontakt" onClick={schliessen}>
            Zu den Kontaktmöglichkeiten <Pfeil strich={2} />
          </a>
        </footer>
      </div>
    </div>
  );
}
