"use client";

import { useEffect, useRef, useState } from "react";
import { BRANCHEN, type BrancheId } from "@/lib/branchen";
import { pfadFuer, BRANCHENSEITEN } from "@/lib/branchenseiten";
import { BrancheIcon, Illustration } from "./BranchenGrafik";
import { Haken, Pfeil } from "./Icons";

/** So lange bleibt ein Beispiel stehen, bevor die nächste Branche kommt */
const DAUER_MS = 7000;

/**
 * Branchen-Abschnitt der Startseite.
 * Die Beispiele wechseln automatisch; ein Klick auf eine Branche öffnet ihre Seite.
 * Mit der Maus über dem Abschnitt hält der Wechsel an (Vorschau der Branche unter dem Zeiger),
 * ausserhalb des Bildschirms und bei «weniger Bewegung» läuft er nicht.
 */
export default function Branchen() {
  const abschnittRef = useRef<HTMLElement>(null);
  const [aktiv, setAktiv] = useState<BrancheId>("garage");
  const [pausiert, setPausiert] = useState(false);
  const [sichtbar, setSichtbar] = useState(false);
  const [bewegt, setBewegt] = useState(false);
  /** Startet Fortschrittsbalken und Wartezeit neu, z.B. nach dem Wegfahren mit der Maus */
  const [runde, setRunde] = useState(0);
  const b = BRANCHEN.find((x) => x.id === aktiv) ?? BRANCHEN[0];

  // Vorschau beim Darüberfahren, leicht verzögert, damit sie beim Überstreichen nicht flackert
  const vorschauTimer = useRef(0);
  const vorschau = (id: BrancheId) => {
    window.clearTimeout(vorschauTimer.current);
    vorschauTimer.current = window.setTimeout(() => setAktiv(id), 120);
  };

  useEffect(() => {
    setBewegt(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = abschnittRef.current;
    if (!el) return;
    const beobachter = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { threshold: 0.25 });
    beobachter.observe(el);
    return () => {
      beobachter.disconnect();
      window.clearTimeout(vorschauTimer.current);
    };
  }, []);

  const laeuft = bewegt && sichtbar && !pausiert;

  // Automatischer Wechsel zur nächsten Branche
  useEffect(() => {
    if (!laeuft) return;
    const t = window.setTimeout(() => {
      setAktiv((a) => BRANCHEN[(BRANCHEN.findIndex((x) => x.id === a) + 1) % BRANCHEN.length].id);
    }, DAUER_MS);
    return () => window.clearTimeout(t);
  }, [laeuft, aktiv, runde]);

  return (
    <section className="abschnitt" id="branchen" ref={abschnittRef}>
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Für Ihren Betrieb</div>
          <h2>So klingt er in Ihrer Branche.</h2>
          <p className="sub">
            Der Assistent kennt Ihr Angebot, Ihre Zeiten und Ihre Abläufe. Wählen Sie Ihre Branche und sehen Sie, was er
            dort für Sie übernimmt.
          </p>
        </div>

        <div
          onMouseEnter={() => setPausiert(true)}
          onMouseLeave={() => {
            window.clearTimeout(vorschauTimer.current);
            setPausiert(false);
            setRunde((r) => r + 1);
          }}
        >
          {/* Jede Branche öffnet ihre eigene Seite */}
          <nav className="tabs reveal" aria-label="Branchenseiten">
            {BRANCHEN.map((x) => (
              <a
                key={x.id}
                href={pfadFuer(x.id)}
                className={"tab" + (x.id === aktiv ? " aktiv" : "")}
                onMouseEnter={() => vorschau(x.id)}
                onFocus={() => {
                  setAktiv(x.id);
                  setPausiert(true);
                }}
                onBlur={() => setPausiert(false)}
              >
                <BrancheIcon id={x.id} />
                {x.tab}
                {x.id === aktiv && laeuft && (
                  <span
                    key={aktiv + runde}
                    className="tab-fortschritt"
                    style={{ animationDuration: DAUER_MS + "ms" }}
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="branche" key={b.id} id="branchen-panel">
            <div className="dialog">
              <div className="wer">Beispielgespräch · {b.titel}</div>
              {b.gespraech.map((z, i) => (
                <div key={i} className={"blase " + z.wer}>{z.text}</div>
              ))}
            </div>
            <div className="vorteile">
              <Illustration b={b} />
              {b.vorteile.map((v) => (
                <div key={v.fett} className="vorteil">
                  <div className="hak"><Haken strich={3} farbe="#06121f" /></div>
                  <p><b>{v.fett}</b>{v.rest}</p>
                </div>
              ))}
              <a className="branche-mehr" href={pfadFuer(b.id)}>
                Mehr für {BRANCHENSEITEN.find((s) => s.id === b.id)?.mehrzahl ?? b.titel} <Pfeil strich={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
