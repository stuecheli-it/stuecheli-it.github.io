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

/** So läuft die Anruf-Demo bei fonio, in drei kurzen Schritten unter dem Feld */
const SCHRITTE = ["Website eingeben", "In rund 30 Sekunden bereit", "fonio ruft Sie an, Sie hören Ihren Assistenten"];

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
  /** «leer»: nichts eingegeben, «ungueltig»: Eingabe ist keine Website-Adresse */
  const [fehler, setFehler] = useState<"leer" | "ungueltig" | null>(null);
  const beispiel = branche ? LIVE_DEMO_PLATZHALTER[branche] : "garage-muster.ch";

  const fertig = () => {
    if (gesendet) window.setTimeout(gesendet, 0);
  };

  const absenden = (e: React.FormEvent<HTMLFormElement>) => {
    const website = websiteAusEingabe(eingabeRef.current?.value ?? "");
    if (!website || !eingabeRef.current) {
      e.preventDefault();
      setFehler(eingabeRef.current?.value.trim() ? "ungueltig" : "leer");
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
            placeholder={branche ? LIVE_DEMO_PLATZHALTER[branche] : "ihre-website.ch"}
            aria-invalid={fehler !== null}
            aria-describedby={fehler ? `${id}-fehler` : `${id}-hinweis`}
            onChange={() => fehler && setFehler(null)}
          />
          <button type="submit" className="btn btn-primaer">
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
      <ol className="live-demo-schritte" aria-label="So läuft die Anruf-Demo">
        {SCHRITTE.map((s, i) => (
          <li key={s}>
            <span className="live-demo-nr" aria-hidden="true">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <p id={`${id}-hinweis`} className="live-demo-hinweis">
        Kostenlos bei fonio.ai, dem Anbieter der Technik. Die Seite öffnet sich in einem neuen Tab und fragt nach Ihrer
        Telefonnummer für den Demo-Anruf.{" "}
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
