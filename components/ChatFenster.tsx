"use client";

import { useEffect, useRef, useState } from "react";
import { Chat, Kreuz, Pfeil } from "./Icons";
import { useFenster } from "./useFenster";

/**
 * Gemeinsames Chat-Fenster für den Anfrage-Chat und die Demo-Chats.
 * Der fonio-Chat läuft in einem eigenen Rahmen (public/chat.html), weil fonio nur ein Widget pro Seite erlaubt.
 * Die Seite im Rahmen meldet, wann der Chat offen ist und wann er über das fonio-Kreuz geschlossen wurde.
 * Ohne `adresse` zeigt das Fenster statt des Chats den `inhalt`, z.B. die Auswahl der Branche.
 */
export default function ChatFenster({
  chip,
  titel,
  text,
  beispiele,
  hinweis,
  adresse,
  inhalt,
  zusatz,
  rahmenTitel,
  schliessen,
}: {
  chip: string;
  titel: string;
  text: React.ReactNode;
  /** Anstösse für die ersten Fragen; ein Klick kopiert die Frage */
  beispiele?: string[];
  /** Kurzer Text im Fuss links, z.B. «Lieber per E-Mail oder Telefon?» */
  hinweis: string;
  /** Chat-Seite im Rahmen; fehlt sie, erscheint `inhalt` */
  adresse?: string;
  inhalt?: React.ReactNode;
  /** Zusätzliches Element neben dem Chip, z.B. «Andere Branche» */
  zusatz?: React.ReactNode;
  rahmenTitel?: string;
  schliessen: () => void;
}) {
  const fensterRef = useRef<HTMLDivElement>(null);
  const zuRef = useRef<HTMLButtonElement>(null);
  const [geladen, setGeladen] = useState(false);
  const [kopiert, setKopiert] = useState<string | null>(null);
  useFenster(fensterRef, zuRef, schliessen);

  useEffect(() => {
    setGeladen(false);
    if (!adresse) return;
    const nachricht = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const typ = (e.data as { chatFenster?: string } | null)?.chatFenster;
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
  }, [schliessen, adresse]);

  // In den fonio-Chat (fremde Seite im Rahmen) lässt sich kein Text setzen, darum kopieren
  const kopieren = async (frage: string) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(frage);
      ok = true;
    } catch {
      // Zweiter Weg für Browser ohne Zwischenablage-Schnittstelle
      const feld = document.createElement("textarea");
      feld.value = frage;
      feld.setAttribute("readonly", "");
      feld.style.position = "fixed";
      feld.style.opacity = "0";
      document.body.appendChild(feld);
      feld.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      feld.remove();
    }
    // Ohne Zwischenablage bleibt die Frage einfach als Anstoss sichtbar
    if (!ok) return;
    setKopiert(frage);
    window.setTimeout(() => setKopiert((k) => (k === frage ? null : k)), 2500);
  };

  return (
    <div className="plan-hintergrund" onClick={(e) => e.target === e.currentTarget && schliessen()}>
      <div
        ref={fensterRef}
        className="plan-fenster chat-fenster"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatTitel"
      >
        <button ref={zuRef} className="plan-zu" type="button" aria-label="Schliessen" onClick={schliessen}>
          <Kreuz />
        </button>

        <header className="plan-kopf chat-kopf">
          <div className="plan-glow" aria-hidden />
          <div className="plan-marken">
            <span className="plan-produkt"><Chat />{chip}</span>
            {zusatz}
          </div>
          <h3 id="chatTitel">{titel}</h3>
          <p className="plan-fuer">{text}</p>
          {beispiele && beispiele.length > 0 && (
            <div className="chat-beispiele" aria-label="Beispielfragen zum Kopieren">
              {beispiele.map((b) => (
                <button key={b} type="button" onClick={() => kopieren(b)} title="Frage kopieren und im Chat einfügen">
                  {kopiert === b ? "Kopiert, im Chat einfügen" : `«${b}»`}
                </button>
              ))}
            </div>
          )}
        </header>

        {adresse ? (
          <div className={"chat-rahmen" + (geladen ? " geladen" : "")}>
            <div className="chat-laden" aria-hidden={geladen}>
              <span className="chat-punkte"><i /><i /><i /></span>
              Chat wird geladen …
            </div>
            <iframe key={adresse} src={adresse} title={rahmenTitel} />
          </div>
        ) : (
          <div className="chat-auswahl">{inhalt}</div>
        )}

        <footer className="plan-fuss chat-fuss">
          <p>
            {hinweis} · <a href="/datenschutz/#chat">Datenschutz</a>
          </p>
          <a href="/#kontakt" onClick={schliessen}>
            Zu den Kontaktmöglichkeiten <Pfeil strich={2} />
          </a>
        </footer>
      </div>
    </div>
  );
}
