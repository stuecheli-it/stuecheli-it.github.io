"use client";

import { useEffect, useRef, useState } from "react";
import {
  PREISSTAND,
  PRODUKTE,
  chf,
  ersparnisProJahr,
  proMonatImJahresabo,
  rabattLabel,
  type Plan,
  type Produkt,
  type ProduktId,
} from "@/lib/preise";
import { Haken, Kreislauf, Stern } from "./Icons";

type Abrechnung = "monat" | "jahr";

function Betrag({ plan, abrechnung }: { plan: Plan; abrechnung: Abrechnung }) {
  return abrechnung === "monat" ? (
    <>{chf(plan.monat)} <small>/ Monat</small></>
  ) : (
    <>{chf(plan.jahr)} <small>/ Jahr</small></>
  );
}

function JahresInfo({ plan }: { plan: Plan }) {
  return (
    <p className="spare">
      Entspricht {proMonatImJahresabo(plan)} pro Monat · Sie sparen {chf(ersparnisProJahr(plan))} pro Jahr
    </p>
  );
}

function DetailFenster({
  produkt,
  plan,
  abrechnung,
  schliessen,
}: {
  produkt: Produkt;
  plan: Plan;
  abrechnung: Abrechnung;
  schliessen: () => void;
}) {
  const zuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    zuRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && schliessen();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [schliessen]);

  return (
    <div className="modal-hintergrund" onClick={(e) => e.target === e.currentTarget && schliessen()}>
      <div className="modal-kasten" role="dialog" aria-modal="true" aria-labelledby="modalTitel">
        <button ref={zuRef} className="modal-zu" type="button" aria-label="Schliessen" onClick={schliessen}>
          ×
        </button>
        <h3 id="modalTitel">{produkt.label} {plan.name}</h3>
        <div className="betrag"><Betrag plan={plan} abrechnung={abrechnung} /></div>
        {abrechnung === "jahr" && <JahresInfo plan={plan} />}
        <p className="setup">{plan.setup}</p>
        {plan.details.map((d) => (
          <div key={d.titel}>
            <h4>{d.titel}</h4>
            <ul>
              {d.punkte.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
        <a className="btn btn-primaer fonio-link" href="#kontakt" onClick={schliessen}>
          Unverbindlich anfragen
        </a>
      </div>
    </div>
  );
}

export default function Preise() {
  const [produktId, setProduktId] = useState<ProduktId>("telefon");
  const [abrechnung, setAbrechnung] = useState<Abrechnung>("monat");
  const [offen, setOffen] = useState<Plan | null>(null);
  const produkt = PRODUKTE.find((p) => p.id === produktId) ?? PRODUKTE[0];
  const schliessen = useRef(() => setOffen(null)).current;

  return (
    <section className="abschnitt weiss" id="preise">
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Preise</div>
          <h2>Transparent und ohne Umwege.</h2>
          <p className="sub">
            Das Abo schliessen Sie direkt beim Anbieter fonio.ai ab, das Jahresabo ist günstiger. Einrichtung, Schulung
            und Betreuung übernehmen wir, separat verrechnet.
          </p>
        </div>

        <div className="schalter reveal">
          <div className="gruppe produkt-tabs" role="tablist" aria-label="Produkt">
            {PRODUKTE.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === produktId}
                className={p.id === produktId ? "aktiv" : ""}
                onClick={() => setProduktId(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="gruppe abrechnung" role="tablist" aria-label="Abrechnung">
            <button
              type="button"
              role="tab"
              aria-selected={abrechnung === "monat"}
              className={abrechnung === "monat" ? "aktiv" : ""}
              onClick={() => setAbrechnung("monat")}
            >
              Monatlich
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={abrechnung === "jahr"}
              className={abrechnung === "jahr" ? "aktiv" : ""}
              onClick={() => setAbrechnung("jahr")}
            >
              Jährlich <span className="rabatt">{rabattLabel(produkt)}</span>
            </button>
          </div>
        </div>

        <div className="preise" key={produkt.id + abrechnung}>
          {produkt.plaene.map((plan) => (
            <div key={plan.name} className={"preis" + (plan.beliebt ? " mitte" : "")}>
              {plan.beliebt && <span className="beliebt">Beliebt</span>}
              <h3>{plan.name}</h3>
              <p className="fuer">{plan.fuer}</p>
              <div className="betrag"><Betrag plan={plan} abrechnung={abrechnung} /></div>
              {abrechnung === "jahr" && <JahresInfo plan={plan} />}
              <p className="setup">{plan.setup}</p>
              <ul>
                {plan.punkte.map((p) => (
                  <li key={p}><Haken />{p}</li>
                ))}
              </ul>
              <button
                className={"btn " + (plan.beliebt ? "btn-primaer" : "btn-linie")}
                type="button"
                onClick={() => setOffen(plan)}
              >
                Alle Details
              </button>
            </div>
          ))}
        </div>
        <p className="steuer">
          fonio-Listenpreise in CHF, Stand {PREISSTAND}, exkl. MWST. Abrechnung direkt durch fonio.ai. Für grössere
          Volumen stellen wir Ihnen ein passendes Paket zusammen.
        </p>

        <div className="hinweise">
          <div className="hinweis pilot reveal">
            <div className="ico24"><Stern /></div>
            <div>
              <b>Pilotangebot für die ersten zehn Betriebe</b>
              <p>
                Einrichtung des KI-Telefonassistenten für CHF 690 statt CHF 1&apos;290, weil wir Referenzen aus der
                Region aufbauen. Im Gegenzug dürfen wir Sie namentlich als Referenz nennen.
              </p>
            </div>
          </div>
          <div className="hinweis reveal verzoegert-1">
            <div className="ico24"><Kreislauf /></div>
            <div>
              <b>Nach dem Livegang</b>
              <p>
                Anpassungen und Erweiterungen übernehmen wir laufend, nach Aufwand und transparent offeriert. Den
                technischen Support für das Produkt selbst leistet fonio.ai direkt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {offen && <DetailFenster produkt={produkt} plan={offen} abrechnung={abrechnung} schliessen={schliessen} />}
    </section>
  );
}
