"use client";

import { useId, useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import {
  LIVE_DEMO_ADRESSE,
  LIVE_DEMO_PARAMETER,
  LIVE_DEMO_PLATZHALTER,
  liveDemoLink,
  liveDemoMerken,
  websiteAusEingabe,
} from "@/lib/livedemo";
import { Globus, Pfeil } from "./Icons";

/** Was man vor dem Klick wissen muss, als eine ruhige Zeile unter dem Feld */
const FAKTEN = ["Kostenlos bei fonio.ai", "in rund 30 Sekunden bereit", "neuer Tab, fragt nach Ihrer Nummer"];

/**
 * Feld «Ihre Website» plus «Eigene Demo erstellen»: leitet die Adresse an unseren fonio-Partner-Link weiter.
 * Ein echtes Formular mit target="_blank", damit der Browser den neuen Tab nicht als Popup blockiert.
 * Die gestartete Demo wird gemerkt, damit die Website beim Zurückkommen die Einrichtung anbieten kann.
 * `gesendet` meldet das Absenden, z.B. um ein Fenster zu schliessen.
 */
export default function LiveDemoFormular({
  hell = false,
  branche,
  gesendet,
  zusatz,
}: {
  /** Auf hellem Grund (im Fenster) statt im dunklen Hero */
  hell?: boolean;
  /** Auf Branchenseiten: passende Beispiel-Adresse im Feld */
  branche?: BrancheId;
  gesendet?: () => void;
  /** Weiterer Weg in derselben Zeile wie «Demo ohne Website», z.B. der Beispiel-Chat im Hero */
  zusatz?: React.ReactNode;
}) {
  const id = useId();
  const eingabeRef = useRef<HTMLInputElement>(null);
  /** «leer»: nichts eingegeben, «ungueltig»: Eingabe ist keine Website-Adresse */
  const [fehler, setFehler] = useState<"leer" | "ungueltig" | null>(null);
  // Beispiel in der Fehlermeldung = Platzhalter im Feld, damit beides zusammenpasst
  const beispiel = branche ? LIVE_DEMO_PLATZHALTER[branche] : "ihre-website.ch";

  const fertig = () => {
    if (gesendet) window.setTimeout(gesendet, 0);
  };

  const absenden = (e: React.FormEvent<HTMLFormElement>) => {
    const website = websiteAusEingabe(eingabeRef.current?.value ?? "");
    if (!website || !eingabeRef.current) {
      e.preventDefault();
      setFehler(eingabeRef.current?.value.trim() ? "ungueltig" : "leer");
      // Zurück ins Feld, damit man die Adresse gleich korrigieren kann
      eingabeRef.current?.focus();
      return;
    }
    setFehler(null);
    // Bereinigt senden, z.B. «https://www.Garage.ch/kontakt» als «www.garage.ch». Ohne JavaScript geht die Eingabe
    // unverändert an fonio, das sie selbst prüft.
    eingabeRef.current.value = website;
    liveDemoMerken({ website, branche });
    fertig();
  };

  return (
    <div className={"live-demo" + (hell ? " hell" : "")}>
      <form action={LIVE_DEMO_ADRESSE} method="get" target="_blank" noValidate onSubmit={absenden}>
        {Object.entries(LIVE_DEMO_PARAMETER).map(([name, wert]) => (
          <input key={name} type="hidden" name={name} value={wert} />
        ))}
        <label className="sr-only" htmlFor={id}>
          Ihre Website
        </label>
        <div className="live-demo-feld">
          <span className="live-demo-ico">
            <Globus />
          </span>
          <input
            ref={eingabeRef}
            id={id}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={beispiel}
            aria-invalid={fehler !== null}
            aria-describedby={fehler ? `${id}-fehler` : `${id}-hinweis`}
            onChange={() => fehler && setFehler(null)}
          />
          <button type="submit" className="btn btn-primaer magnet">
            Anruf-Demo starten <Pfeil strich={2} />
          </button>
        </div>
      </form>
      {fehler && (
        <p id={`${id}-fehler`} className="live-demo-fehler" role="alert">
          {fehler === "leer"
            ? `Bitte geben Sie die Adresse Ihrer Website ein, zum Beispiel ${beispiel}.`
            : `Das sieht nicht nach einer Website-Adresse aus. Bitte so eingeben: ${beispiel}.`}
        </p>
      )}
      {/* Eine Zeile statt Schritte und Hinweis: kostenlos, schnell, neuer Tab mit Telefonnummer */}
      <ul id={`${id}-hinweis`} className="live-demo-fakten" aria-label="Zur Anruf-Demo">
        {FAKTEN.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      {/* Die anderen Wege in einer Zeile, jeder mit genug Fläche zum Tippen */}
      <div className="live-demo-wege">
        <a
          className="live-demo-ohne"
          href={liveDemoLink()}
          target="_blank"
          rel="noopener"
          onClick={() => {
            liveDemoMerken({ branche });
            fertig();
          }}
        >
          Ohne Website starten <Pfeil strich={2} />
        </a>
        {zusatz}
      </div>
    </div>
  );
}
