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

/** So läuft die Demo bei fonio, in drei kurzen Schritten unter dem Feld */
const SCHRITTE = ["Website eingeben", "In rund 30 Sekunden bereit", "Er ruft Sie an"];

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
}: {
  /** Auf hellem Grund (im Fenster) statt im dunklen Hero */
  hell?: boolean;
  /** Auf Branchenseiten: passende Beispiel-Adresse im Feld */
  branche?: BrancheId;
  gesendet?: () => void;
}) {
  const id = useId();
  const eingabeRef = useRef<HTMLInputElement>(null);
  const [fehler, setFehler] = useState(false);

  const fertig = () => {
    if (gesendet) window.setTimeout(gesendet, 0);
  };

  const absenden = (e: React.FormEvent<HTMLFormElement>) => {
    const website = websiteAusEingabe(eingabeRef.current?.value ?? "");
    if (!website || !eingabeRef.current) {
      e.preventDefault();
      setFehler(true);
      return;
    }
    setFehler(false);
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
            placeholder={branche ? LIVE_DEMO_PLATZHALTER[branche] : "ihre-website.ch"}
            aria-invalid={fehler}
            aria-describedby={fehler ? `${id}-fehler` : undefined}
            onChange={() => fehler && setFehler(false)}
          />
          <button type="submit" className="btn btn-primaer">
            Eigene Demo erstellen <Pfeil strich={2} />
          </button>
        </div>
      </form>
      {fehler && (
        <p id={`${id}-fehler`} className="live-demo-fehler" role="alert">
          Bitte geben Sie eine Website-Adresse ein, zum Beispiel {branche ? LIVE_DEMO_PLATZHALTER[branche] : "garage-muster.ch"}.
        </p>
      )}
      <ol className="live-demo-schritte" aria-label="So läuft die Demo">
        {SCHRITTE.map((s, i) => (
          <li key={s}>
            <span className="live-demo-nr" aria-hidden="true">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <p className="live-demo-hinweis">
        Kostenlos und ohne Anmeldung, bei unserem Partner fonio.{" "}
        <a
          href={liveDemoLink()}
          target="_blank"
          rel="noopener"
          onClick={() => {
            liveDemoMerken({ branche });
            fertig();
          }}
        >
          Keine Website? Ohne Website starten
        </a>
      </p>
    </div>
  );
}
