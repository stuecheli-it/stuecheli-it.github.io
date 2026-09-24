"use client";

import { useState } from "react";
import { BRANCHEN, type Branche, type BrancheId, type Motiv } from "@/lib/branchen";
import { Auto, Besteck, Haken, Haus, Hut, Schere, Werkzeug } from "./Icons";

const TAB_ICONS: Record<BrancheId, React.ReactNode> = {
  garage: <Auto />,
  handwerk: <Werkzeug />,
  coiffeur: <Schere />,
  fahrschule: <Hut />,
  gastro: <Besteck />,
  immo: <Haus />,
};

function MotivForm({ m }: { m: Motiv }) {
  if (m.art === "kreis") return <circle className="motiv" cx={m.cx} cy={m.cy} r={m.r} />;
  if (m.art === "rechteck") return <rect className="motiv" x={m.x} y={m.y} width={m.w} height={m.h} rx={m.rx} />;
  return <path className="motiv" d={m.d} />;
}

/** Branchen-Illustration im Orb-Stil: Verlaufsscheibe mit weissem Linienmotiv. */
function Illustration({ b }: { b: Branche }) {
  return (
    <div className="illu">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <radialGradient id={`ig-${b.id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.72" stopColor="#3fc8ff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#3fa0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`ib-${b.id}`} x1="0.1" y1="0.05" x2="0.9" y2="0.95">
            <stop offset="0" stopColor="#3ff0c9" />
            <stop offset="0.48" stopColor="#3a8cff" />
            <stop offset="1" stopColor="#6b45ff" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="60" fill={`url(#ig-${b.id})`} />
        <circle cx="60" cy="60" r="46" fill={`url(#ib-${b.id})`} />
        {b.motiv.map((m, i) => (
          <MotivForm key={i} m={m} />
        ))}
      </svg>
    </div>
  );
}

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
              {TAB_ICONS[x.id]}
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
          </div>
        </div>
      </div>
    </section>
  );
}
