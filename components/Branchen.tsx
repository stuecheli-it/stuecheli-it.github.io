"use client";

import { useEffect, useRef, useState } from "react";
import { BRANCHEN, type BrancheId } from "@/lib/branchen";
import { pfadFuer, BRANCHENSEITEN } from "@/lib/branchenseiten";
import { brancheWaehlen } from "@/lib/gewaehlteBranche";
import { BrancheIcon, Illustration } from "./BranchenGrafik";
import { Haken, Pfeil } from "./Icons";

/** So lange bleibt ein Beispiel stehen, bevor die nächste Branche kommt */
const DAUER_MS = 7000;

/**
 * Branchen-Abschnitt der Startseite: echte Tabs, die das Beispiel an Ort und Stelle wechseln.
 * Zur Branchenseite führt der Link «Mehr für …» unter dem Beispiel.
 * Die Beispiele wechseln automatisch, bis der Besucher selbst eine Branche wählt oder den Wechsel anhält.
 * Mit der Maus über dem Abschnitt, mit dem Fokus in den Tabs, ausserhalb des Bildschirms
 * und bei «weniger Bewegung» läuft der Wechsel nicht.
 */
export default function Branchen() {
  const abschnittRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Partial<Record<BrancheId, HTMLButtonElement | null>>>({});
  const [aktiv, setAktiv] = useState<BrancheId>("garage");
  /** Vorübergehend angehalten (Maus darüber, Fokus in den Tabs) */
  const [pausiert, setPausiert] = useState(false);
  /** Dauerhaft angehalten: Besucher hat gewählt oder «Anhalten» gedrückt */
  const [gestoppt, setGestoppt] = useState(false);
  const [sichtbar, setSichtbar] = useState(false);
  const [bewegt, setBewegt] = useState(false);
  /** Startet Fortschrittsbalken und Wartezeit neu, z.B. nach dem Wegfahren mit der Maus */
  const [runde, setRunde] = useState(0);
  const b = BRANCHEN.find((x) => x.id === aktiv) ?? BRANCHEN[0];
  const mehrzahl = BRANCHENSEITEN.find((s) => s.id === b.id)?.mehrzahl ?? b.titel;

  useEffect(() => {
    setBewegt(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = abschnittRef.current;
    if (!el) return;
    const beobachter = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { threshold: 0.25 });
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);

  const laeuft = bewegt && sichtbar && !pausiert && !gestoppt;

  // Automatischer Wechsel zur nächsten Branche
  useEffect(() => {
    if (!laeuft) return;
    const t = window.setTimeout(() => {
      setAktiv((a) => BRANCHEN[(BRANCHEN.findIndex((x) => x.id === a) + 1) % BRANCHEN.length].id);
    }, DAUER_MS);
    return () => window.clearTimeout(t);
  }, [laeuft, aktiv, runde]);

  const waehlen = (id: BrancheId, fokus = false) => {
    setAktiv(id);
    setGestoppt(true);
    brancheWaehlen(id);
    if (fokus) tabRefs.current[id]?.focus();
  };

  // Pfeiltasten, Pos1 und Ende wie bei Tabs üblich
  const taste = (e: React.KeyboardEvent) => {
    const i = BRANCHEN.findIndex((x) => x.id === aktiv);
    const ziel =
      e.key === "ArrowRight" ? (i + 1) % BRANCHEN.length
      : e.key === "ArrowLeft" ? (i - 1 + BRANCHEN.length) % BRANCHEN.length
      : e.key === "Home" ? 0
      : e.key === "End" ? BRANCHEN.length - 1
      : -1;
    if (ziel < 0) return;
    e.preventDefault();
    waehlen(BRANCHEN[ziel].id, true);
  };

  return (
    <section className="abschnitt" id="branchen" ref={abschnittRef}>
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Für Ihren Betrieb</div>
          <h2>Das übernimmt er in Ihrer Branche.</h2>
          <p className="sub">
            Der Assistent kennt Ihr Angebot, Ihre Zeiten und Ihre Abläufe. Wählen Sie Ihre Branche und lesen Sie ein
            Beispielgespräch.
          </p>
        </div>

        <div
          onMouseEnter={() => setPausiert(true)}
          onMouseLeave={() => {
            setPausiert(false);
            setRunde((r) => r + 1);
          }}
        >
          <div className="tabs-zeile reveal">
            <div className="tabs" role="tablist" aria-label="Branche wählen" onKeyDown={taste}>
              {BRANCHEN.map((x) => (
                <button
                  key={x.id}
                  ref={(el) => {
                    tabRefs.current[x.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-selected={x.id === aktiv}
                  aria-controls="branchen-panel"
                  tabIndex={x.id === aktiv ? 0 : -1}
                  className={"tab" + (x.id === aktiv ? " aktiv" : "")}
                  onClick={() => waehlen(x.id)}
                  onFocus={() => setPausiert(true)}
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
                </button>
              ))}
            </div>
            {bewegt && (
              <button
                type="button"
                className="tabs-pause"
                onClick={() => setGestoppt((g) => !g)}
                aria-label={gestoppt ? "Automatischen Wechsel fortsetzen" : "Automatischen Wechsel anhalten"}
                title={gestoppt ? "Automatischen Wechsel fortsetzen" : "Automatischen Wechsel anhalten"}
              >
                {gestoppt ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
                )}
              </button>
            )}
          </div>

          <div className="branche" key={b.id} id="branchen-panel" role="tabpanel" aria-labelledby={`tab-${b.id}`}>
            <div className="dialog">
              <div className="wer">Beispielgespräch · {b.titel}</div>
              {b.gespraech.map((z, i) => (
                <div key={i} className={"blase " + z.wer}>{z.text}</div>
              ))}
            </div>
            {/* Handy: Link direkt unter dem Gespräch, der untere kommt erst nach den Vorteilen */}
            <a className="btn btn-linie branche-mehr-handy" href={pfadFuer(b.id)}>
              Mehr für {mehrzahl} <Pfeil strich={2} />
            </a>
            <div className="vorteile">
              <Illustration b={b} />
              {b.vorteile.map((v) => (
                <div key={v.fett} className="vorteil">
                  <div className="hak"><Haken strich={3} farbe="#06121f" /></div>
                  <p><b>{v.fett}</b>{v.rest}</p>
                </div>
              ))}
              <a className="branche-mehr" href={pfadFuer(b.id)}>
                Mehr für {mehrzahl} <Pfeil strich={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
