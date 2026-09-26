"use client";

import { useRef, useState } from "react";
import { BRANCHEN, type BrancheId } from "@/lib/branchen";
import { pfadFuer, BRANCHENSEITEN } from "@/lib/branchenseiten";
import { BrancheIcon, Illustration } from "./BranchenGrafik";
import { Haken, Pfeil } from "./Icons";

export default function Branchen() {
  const [aktiv, setAktiv] = useState<BrancheId>("garage");
  const b = BRANCHEN.find((x) => x.id === aktiv) ?? BRANCHEN[0];
  // Vorschau beim Darüberfahren, leicht verzögert, damit sie beim Überstreichen nicht flackert
  const vorschauTimer = useRef(0);
  const vorschau = (id: BrancheId) => {
    window.clearTimeout(vorschauTimer.current);
    vorschauTimer.current = window.setTimeout(() => setAktiv(id), 120);
  };

  return (
    <section className="abschnitt" id="branchen">
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Für Ihren Betrieb</div>
          <h2>So klingt er in Ihrer Branche.</h2>
          <p className="sub">
            Der Assistent kennt Ihr Angebot, Ihre Zeiten und Ihre Abläufe. Wählen Sie Ihre Branche und sehen Sie, was er dort für Sie übernimmt.
          </p>
        </div>

        {/* Jede Branche öffnet ihre eigene Seite; darüberfahren zeigt unten ein Beispiel */}
        <nav className="tabs reveal" aria-label="Branchenseiten">
          {BRANCHEN.map((x) => (
            <a
              key={x.id}
              href={pfadFuer(x.id)}
              className={"tab" + (x.id === aktiv ? " aktiv" : "")}
              onMouseEnter={() => vorschau(x.id)}
              onMouseLeave={() => window.clearTimeout(vorschauTimer.current)}
              onFocus={() => setAktiv(x.id)}
            >
              <BrancheIcon id={x.id} />
              {x.tab}
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
    </section>
  );
}
