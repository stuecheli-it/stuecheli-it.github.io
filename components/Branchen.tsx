"use client";

import { useEffect, useRef, useState } from "react";
import { BRANCHEN, type BrancheId } from "@/lib/branchen";
import { pfadFuer, BRANCHENSEITEN } from "@/lib/branchenseiten";
import { brancheBeobachten, brancheWaehlen } from "@/lib/gewaehlteBranche";
import { BrancheIcon, Illustration } from "./BranchenGrafik";
import { Haken, Pfeil } from "./Icons";

/**
 * Branchen-Abschnitt der Startseite: echte Tabs, die das Beispiel an Ort und Stelle wechseln.
 * Kein automatischer Wechsel: Der Besucher wählt selbst, Bewegung gehört dem Hero.
 * Wählt der Besucher im Hero einen Ort, zeigt dieser Abschnitt dieselbe Branche.
 * Zur Branchenseite führt der Link «Mehr für …» unter dem Beispiel.
 */
export default function Branchen() {
  const tabRefs = useRef<Partial<Record<BrancheId, HTMLButtonElement | null>>>({});
  const [aktiv, setAktiv] = useState<BrancheId>("garage");
  const b = BRANCHEN.find((x) => x.id === aktiv) ?? BRANCHEN[0];
  const mehrzahl = BRANCHENSEITEN.find((s) => s.id === b.id)?.mehrzahl ?? b.titel;

  useEffect(() => brancheBeobachten((id) => setAktiv(id)), []);

  const waehlen = (id: BrancheId, fokus = false) => {
    setAktiv(id);
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
    <section className="abschnitt" id="branchen">
      <div className="wrap">
        <div className="reveal">
          <h2>Das übernimmt er in Ihrer Branche.</h2>
          <p className="sub">
            Der Assistent kennt Ihr Angebot, Ihre Zeiten und Ihre Abläufe. Wählen Sie Ihre Branche und lesen Sie ein
            Beispielgespräch.
          </p>
        </div>

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
              >
                <BrancheIcon id={x.id} />
                {x.tab}
              </button>
            ))}
          </div>
        </div>

        <div className="branche" key={b.id} id="branchen-panel" role="tabpanel" aria-labelledby={`tab-${b.id}`}>
          <div className="dialog spot">
            <div className="wer">Beispielgespräch · {b.titel} · erfundene Firma</div>
            {b.gespraech.map((z, i) => (
              <div key={i} className={"blase " + z.wer} style={{ "--i": i } as React.CSSProperties}>{z.text}</div>
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
                <div className="hak"><Haken strich={3} farbe="#ffffff" /></div>
                <p><b>{v.fett}</b>{v.rest}</p>
              </div>
            ))}
            <a className="branche-mehr" href={pfadFuer(b.id)}>
              Mehr für {mehrzahl} <Pfeil strich={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
