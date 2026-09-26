"use client";

import { useState } from "react";
import { BRANCHEN, type BrancheId } from "@/lib/branchen";
import { pfadFuer, BRANCHENSEITEN } from "@/lib/branchenseiten";
import { BrancheIcon, Illustration } from "./BranchenGrafik";
import { Haken, Pfeil } from "./Icons";

export default function Branchen() {
  const [aktiv, setAktiv] = useState<BrancheId>("garage");
  const b = BRANCHEN.find((x) => x.id === aktiv) ?? BRANCHEN[0];

  return (
    <section className="abschnitt" id="branchen">
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Für Ihren Betrieb</div>
          <h2>So klingt er in Ihrer Branche.</h2>
          <p className="sub">
            Der Assistent kennt Ihr Angebot, Ihre Zeiten und Ihre Abläufe. Wählen Sie Ihre Branche und hören Sie zu.
          </p>
        </div>

        <div className="tabs reveal" role="tablist" aria-label="Branche wählen">
          {BRANCHEN.map((x) => (
            <button
              key={x.id}
              id={`tab-${x.id}`}
              className={"tab" + (x.id === aktiv ? " aktiv" : "")}
              type="button"
              role="tab"
              aria-selected={x.id === aktiv}
              aria-controls="branchen-panel"
              onClick={() => setAktiv(x.id)}
            >
              <BrancheIcon id={x.id} />
              {x.tab}
            </button>
          ))}
        </div>

        <div className="branche" key={b.id} id="branchen-panel" role="tabpanel" aria-labelledby={`tab-${b.id}`}>
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
