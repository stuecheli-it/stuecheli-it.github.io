"use client";

import { useEffect, useRef, useState } from "react";
import { FIRMA } from "@/lib/firma";
import { Chat, Kreuz, Mail, Pfeil } from "./Icons";
import { useFenster } from "./useFenster";

/** So lange darf der fonio-Chat laden, bevor das Fenster den Ausweg per E-Mail anbietet */
const WARTEZEIT_MS = 12000;

type Zustand = "laden" | "offen" | "fehler";

/**
 * Gemeinsames Chat-Fenster für den Anfrage-Chat und die Beispiel-Chats.
 * Der fonio-Chat läuft in einem eigenen Rahmen (public/chat.html), weil fonio nur ein Widget pro Seite erlaubt.
 * Die Seite im Rahmen meldet, wann der Chat offen ist, wann er über das fonio-Kreuz oder Esc geschlossen wurde
 * und wenn er nicht laden konnte. Bis dahin zeigt das Fenster eine Sprechblase statt einer leeren Fläche;
 * lädt der Chat nicht (Werbeblocker, Firmen-Firewall, offline), bietet es E-Mail und «Nochmals versuchen» an.
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
  ladeText = "Einen Moment, der Assistent startet …",
  betreff,
  schliessen,
}: {
  chip: string;
  titel: string;
  text: React.ReactNode;
  /** Anstösse für die ersten Fragen; ein Klick kopiert die Frage */
  beispiele?: string[];
  /** Kurzer Text im Fuss links, z.B. ein Link «Lieber per E-Mail?» */
  hinweis: React.ReactNode;
  /** Chat-Seite im Rahmen; fehlt sie, erscheint `inhalt` */
  adresse?: string;
  inhalt?: React.ReactNode;
  /** Zusätzliches Element neben dem Chip, z.B. «Andere Branche» */
  zusatz?: React.ReactNode;
  rahmenTitel?: string;
  /** Sprechblase, solange der Chat lädt */
  ladeText?: string;
  /** Betreff der E-Mail, falls der Chat nicht lädt */
  betreff?: string;
  schliessen: () => void;
}) {
  const fensterRef = useRef<HTMLDivElement>(null);
  const zuRef = useRef<HTMLButtonElement>(null);
  const [zustand, setZustand] = useState<Zustand>("laden");
  /** Zählt Ladeversuche; ein neuer Wert lädt den Rahmen neu */
  const [versuch, setVersuch] = useState(0);
  const [kopiert, setKopiert] = useState<string | null>(null);
  useFenster(fensterRef, zuRef, schliessen);

  useEffect(() => {
    setZustand("laden");
    if (!adresse) return;
    const nachricht = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const typ = (e.data as { chatFenster?: string } | null)?.chatFenster;
      if (typ === "offen") setZustand("offen");
      if (typ === "fehler") setZustand((z) => (z === "offen" ? z : "fehler"));
      if (typ === "zu" || typ === "esc") {
        schliessen();
      }
    };
    window.addEventListener("message", nachricht);
    // Kommt keine Meldung, den Ausweg anbieten; meldet sich der Chat später doch, erscheint er noch
    const wartezeit = window.setTimeout(() => setZustand((z) => (z === "laden" ? "fehler" : z)), WARTEZEIT_MS);
    return () => {
      window.removeEventListener("message", nachricht);
      window.clearTimeout(wartezeit);
    };
  }, [schliessen, adresse, versuch]);

  // Lädt der Chat nicht, den Fokus direkt auf den Ausweg per E-Mail setzen
  useEffect(() => {
    if (zustand === "fehler") fensterRef.current?.querySelector<HTMLElement>(".chat-ersatz a")?.focus();
  }, [zustand]);

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

  const mail = `mailto:${FIRMA.email}${betreff ? `?subject=${encodeURIComponent(betreff)}` : ""}`;

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
          <div className={"chat-rahmen" + (zustand === "offen" ? " geladen" : "")}>
            {zustand === "laden" && (
              <div className="chat-laden" role="status">
                <p className="blase ki chat-laden-blase">
                  {ladeText}
                  <span className="chat-punkte" aria-hidden="true"><i /><i /><i /></span>
                </p>
              </div>
            )}
            {zustand === "fehler" && (
              <div className="chat-ersatz" role="alert">
                <b>Der Chat lädt gerade nicht.</b>
                <p>
                  Das liegt oft an einem Werbeblocker oder an der Firewall im Firmennetz. Schreiben Sie uns einfach per
                  E-Mail, wir antworten innert eines Arbeitstages.
                </p>
                <a className="btn btn-primaer" href={mail}>
                  <Mail /> E-Mail an {FIRMA.email}
                </a>
                <button type="button" className="chat-nochmals" onClick={() => setVersuch((v) => v + 1)}>
                  Chat nochmals laden
                </button>
              </div>
            )}
            <iframe key={adresse + versuch} src={adresse} title={rahmenTitel} />
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
