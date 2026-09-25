"use client";

import { useRef, useState } from "react";
import { ANFRAGE_CHAT_SEITE } from "@/lib/fonio";
import { Chat, Kreuz, Pfeil } from "./Icons";
import { useFenster } from "./useFenster";

/**
 * Chat-Fenster für «Unverbindlich anfragen».
 * fonio erlaubt nur ein Widget pro Seite. Der Demo-Chat belegt diesen Platz schon,
 * deshalb läuft der Anfrage-Chat in einem eigenen Rahmen (public/anfrage-chat.html).
 */
export default function AnfrageChat({ thema, schliessen }: { thema: string; schliessen: () => void }) {
  const fensterRef = useRef<HTMLDivElement>(null);
  const zuRef = useRef<HTMLButtonElement>(null);
  const [geladen, setGeladen] = useState(false);
  useFenster(fensterRef, zuRef, schliessen);

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
          <p className="plan-fuer">Schreiben Sie uns kurz, worum es geht. Wir melden uns persönlich bei Ihnen.</p>
        </header>

        <div className={"chat-rahmen" + (geladen ? " geladen" : "")}>
          <div className="chat-laden" aria-hidden={geladen}>
            <span className="chat-punkte"><i /><i /><i /></span>
            Chat wird geladen …
          </div>
          <iframe
            src={ANFRAGE_CHAT_SEITE}
            title="Anfrage-Chat von Stücheli IT Consulting"
            onLoad={() => setGeladen(true)}
          />
        </div>

        <footer className="plan-fuss chat-fuss">
          <p>Lieber per E-Mail oder Telefon?</p>
          <a href="#kontakt" onClick={schliessen}>
            Zu den Kontaktmöglichkeiten <Pfeil strich={2} />
          </a>
        </footer>
      </div>
    </div>
  );
}
