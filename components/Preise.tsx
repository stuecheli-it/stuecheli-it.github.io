"use client";

import { type ReactElement, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PREISSTAND,
  PRODUKTE,
  chf,
  ersparnisProMonat,
  proMonatImJahresabo,
  rabattLabel,
  rabattProzent,
  type Plan,
  type Produkt,
  type ProduktId,
} from "@/lib/preise";
import {
  Auszeichnung,
  Balken,
  Chat,
  ChatPunkte,
  ChatStrich,
  Funken,
  Haken,
  Info,
  Kreuz,
  Pfeil,
  Plus,
  Schall,
  Stern,
  Telefon,
  Werkzeug,
} from "./Icons";
import type { AnfrageKontext } from "@/lib/fonio";
import AnfrageChat from "./AnfrageChat";
import { useFenster } from "./useFenster";

type Abrechnung = "monat" | "jahr";

/** Wie auf fonio.ai: im Jahresabo gross der Monatsbetrag mit «Spare CHF …» daneben */
/** «CHF 119» mit kleiner Währung, damit die Zahl trägt und nicht das Kürzel */
function Zahl({ text }: { text: string }) {
  const [waehrung, ...rest] = text.split(" ");
  return (
    <>
      <span className="waehrung">{waehrung}</span>
      {rest.join(" ")}
    </>
  );
}

function Betrag({ plan, abrechnung }: { plan: Plan; abrechnung: Abrechnung }) {
  return abrechnung === "monat" ? (
    <>
      <Zahl text={chf(plan.monat)} /> <small>/ Monat</small>
    </>
  ) : (
    <>
      <Zahl text={proMonatImJahresabo(plan)} /> <span className="spare-marke">Spare {ersparnisProMonat(plan)}</span>
    </>
  );
}

/** Kontext für den Anfrage-Chat: welcher Plan, wie abgerechnet, von wo aus angefragt */
function planAnfrage(produkt: Produkt, plan: Plan, abrechnung: Abrechnung, quelle: string): AnfrageKontext {
  return {
    thema: `${produkt.label} ${plan.name}`,
    produkt: produkt.label,
    plan: plan.name,
    abrechnung: abrechnung === "jahr" ? "jährlich" : "monatlich",
    preis:
      abrechnung === "jahr"
        ? `${proMonatImJahresabo(plan)} pro Monat, jährlich abgerechnet (${chf(plan.jahr)} pro Jahr)`
        : `${chf(plan.monat)} pro Monat`,
    quelle,
  };
}

/** Umschalter als Knopfgruppe (aria-pressed), gleich wie im Plan-Fenster */
function Umschalter<T extends string>({
  label,
  wert,
  setWert,
  optionen,
  className,
}: {
  label: string;
  wert: T;
  setWert: (w: T) => void;
  optionen: Array<{ id: T; text: React.ReactNode }>;
  className?: string;
}) {
  return (
    <div className={"gruppe" + (className ? " " + className : "")} role="group" aria-label={label}>
      {optionen.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={o.id === wert}
          className={o.id === wert ? "aktiv" : ""}
          onClick={() => setWert(o.id)}
        >
          {o.text}
        </button>
      ))}
    </div>
  );
}

function JahresInfo({ plan }: { plan: Plan }) {
  return <p className="spare">Pro Monat, jährlich abgerechnet ({chf(plan.jahr)} pro Jahr)</p>;
}

const PRODUKT_ICON: Record<ProduktId, () => ReactElement> = {
  telefon: () => <Telefon />,
  whatsapp: () => <ChatPunkte />,
  webchat: () => <Chat />,
};

/** Hinweis-Gruppen erscheinen zurückhaltend als Infozeile statt als Kachel. */
const LEISE = ["Zusatzkosten", "Paketumfang"];

function GruppenIcon({ titel }: { titel: string }) {
  if (titel === "Nutzung") return <Balken />;
  if (titel.startsWith("Stimme")) return <Schall />;
  if (titel === "Fähigkeiten" || titel === "Funktionen") return <Funken />;
  if (titel.startsWith("Plattform")) return <ChatStrich />;
  if (titel.startsWith("Zusätzlich")) return <Plus />;
  if (titel === "Unsere Leistung") return <Auszeichnung />;
  return <Haken />;
}

function DetailFenster({
  produkt,
  plan,
  abrechnung,
  setAbrechnung,
  schliessen,
  anfragen,
}: {
  produkt: Produkt;
  plan: Plan;
  abrechnung: Abrechnung;
  setAbrechnung: (a: Abrechnung) => void;
  schliessen: () => void;
  anfragen: () => void;
}) {
  const fensterRef = useRef<HTMLDivElement>(null);
  const zuRef = useRef<HTMLButtonElement>(null);

  useFenster(fensterRef, zuRef, schliessen);

  const kacheln = plan.details.filter((d) => !LEISE.includes(d.titel));
  const hinweise = plan.details.filter((d) => LEISE.includes(d.titel));

  // Direkt an body: sonst rechnet position:fixed ab einem Elternteil mit transform oder backdrop-filter
  return createPortal(
    <div className="plan-hintergrund" onClick={(e) => e.target === e.currentTarget && schliessen()}>
      <div ref={fensterRef} className="plan-fenster" role="dialog" aria-modal="true" aria-labelledby="planTitel">
        <button ref={zuRef} className="plan-zu" type="button" aria-label="Schliessen" onClick={schliessen}>
          <Kreuz />
        </button>

        <div className="plan-scroll">
          <header className="plan-kopf">
            <div className="plan-marken">
              <span className="plan-produkt">{PRODUKT_ICON[produkt.id]()}{produkt.label}</span>
              {plan.beliebt && <span className="plan-beliebt">Beliebt</span>}
            </div>
            <h3 id="planTitel">{plan.name}</h3>
            <p className="plan-fuer">{plan.fuer}</p>

            <div className="plan-preiszeile">
              <div className="plan-betrag" aria-live="polite">
                <Betrag plan={plan} abrechnung={abrechnung} />
              </div>
              <Umschalter
                label="Abrechnung"
                className="plan-abrechnung"
                wert={abrechnung}
                setWert={setAbrechnung}
                optionen={[
                  { id: "monat", text: "Monatlich" },
                  { id: "jahr", text: <>Jährlich <span className="rabatt">−{rabattProzent(plan)} %</span></> },
                ]}
              />
            </div>
            {abrechnung === "jahr" && (
              <p className="plan-spare">
                Pro Monat, jährlich abgerechnet ({chf(plan.jahr)} pro Jahr)
              </p>
            )}
            <p className="plan-setup"><Werkzeug />{plan.setup}</p>
          </header>

          <div className="plan-inhalt">
            <div className={"plan-kacheln" + (kacheln.length < 2 ? " einzeln" : "")}>
              {kacheln.map((d, i) => (
                <section key={d.titel} className="plan-kachel" style={{ animationDelay: 80 + i * 60 + "ms" }}>
                  <h4><span className="plan-kachel-ico"><GruppenIcon titel={d.titel} /></span>{d.titel}</h4>
                  <ul>
                    {d.punkte.map((p) => (
                      <li key={p}><Haken />{p}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            {hinweise.map((d) => (
              <p key={d.titel} className="plan-hinweis">
                <Info />
                <span><b>{d.titel}:</b> {d.punkte.join(" · ")}</span>
              </p>
            ))}
          </div>
        </div>

        <footer className="plan-fuss">
          <p><span>fonio-Listenpreise in CHF, exkl. MWST</span> <span>Stand {PREISSTAND}</span></p>
          <button className="btn btn-primaer" type="button" onClick={anfragen}>
            Unverbindlich anfragen <Pfeil strich={2} />
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export default function Preise() {
  const [produktId, setProduktId] = useState<ProduktId>("telefon");
  const [abrechnung, setAbrechnung] = useState<Abrechnung>("monat");
  const [offen, setOffen] = useState<Plan | null>(null);
  const [anfrage, setAnfrage] = useState<AnfrageKontext | null>(null);
  const produkt = PRODUKTE.find((p) => p.id === produktId) ?? PRODUKTE[0];
  const schliessen = useRef(() => setOffen(null)).current;
  const anfrageSchliessen = useRef(() => setAnfrage(null)).current;

  return (
    <section className="abschnitt weiss" id="preise">
      <div className="wrap">
        <div className="reveal">
          <h2>Klare Preise, Abo und Einrichtung getrennt.</h2>
          <p className="sub">
            Ihr fonio-Abo aktivieren wir gemeinsam mit Ihnen. So ist Ihr Assistent vom ersten Tag an richtig eingerichtet.
            Einrichtung, Schulung und Betreuung durch uns: offeriert auf Anfrage, passend zu Ihrem Betrieb.
          </p>
        </div>

        {/* Das Pilotangebot vor den Karten: der wichtigste Punkt zur Einrichtung, bevor man Beträge vergleicht */}
        <p className="pilot-zeile reveal">
          <span className="pilot-ico"><Stern /></span>
          <span>
            <b>Pilotangebot für die ersten zehn Betriebe:</b> Einrichtung zum Vorzugspreis, weil wir Referenzen aus der
            Region aufbauen. Im Gegenzug dürfen wir Sie namentlich als Referenz nennen.
          </span>
        </p>
        <div className="schalter reveal" data-ohne-chatknopf>
          <Umschalter
            label="Produkt"
            className="produkt-tabs"
            wert={produktId}
            setWert={setProduktId}
            optionen={PRODUKTE.map((p) => ({ id: p.id, text: p.label }))}
          />
          <Umschalter
            label="Abrechnung"
            className="abrechnung"
            wert={abrechnung}
            setWert={setAbrechnung}
            optionen={[
              { id: "monat", text: "Monatlich" },
              { id: "jahr", text: <>Jährlich <span className="rabatt">{rabattLabel(produkt)}</span></> },
            ]}
          />
        </div>

        {/* Hier blendet sich der Chat-Knopf unten rechts aus, damit er die Anfrage-Knöpfe nicht verdeckt */}
        <div className="preise" key={produkt.id} data-ohne-chatknopf>
          {produkt.plaene.map((plan) => (
            <div key={plan.name} className={"preis spot" + (plan.beliebt ? " mitte" : "")}>
              {plan.beliebt && <span className="beliebt">Beliebt</span>}
              <h3>{plan.name}</h3>
              <p className="fuer">{plan.fuer}</p>
              {/* Nur der Betrag wechselt sichtbar, wenn Monat/Jahr umgeschaltet wird; die Karte bleibt stehen */}
              <div className="betrag" key={abrechnung}><Betrag plan={plan} abrechnung={abrechnung} /></div>
              {abrechnung === "jahr" && <JahresInfo plan={plan} />}
              {/* Die Einrichtung steht einmal in der Einleitung oben und im Plan-Fenster, nicht auf jeder Karte */}
              <ul>
                {plan.punkte.map((p) => (
                  <li key={p}><Haken />{p}</li>
                ))}
              </ul>
              <div className="preis-aktionen">
                <button
                  className={"btn " + (plan.beliebt ? "btn-primaer" : "btn-linie")}
                  type="button"
                  onClick={() => setAnfrage(planAnfrage(produkt, plan, abrechnung, "Preise, Karte"))}
                >
                  Unverbindlich anfragen <Pfeil strich={2} />
                </button>
                <button className="preis-details" type="button" onClick={() => setOffen(plan)}>
                  Alle Details zu {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
        <ul className="gut-zu-wissen" aria-label="Gut zu wissen">
          <li>fonio-Listenpreise in CHF, exkl. MWST, Stand {PREISSTAND}. Das Abo rechnet fonio.ai direkt mit Ihnen ab.</li>
          <li>Anpassungen nach dem Livegang übernehmen wir laufend, nach Aufwand und transparent offeriert.</li>
          <li>Technischer Support für das Produkt: fonio.ai. Für grössere Volumen stellen wir ein passendes Paket zusammen.</li>
        </ul>
      </div>
      {offen && (
        <DetailFenster
          produkt={produkt}
          plan={offen}
          abrechnung={abrechnung}
          setAbrechnung={setAbrechnung}
          schliessen={schliessen}
          anfragen={() => {
            setOffen(null);
            setAnfrage(planAnfrage(produkt, offen, abrechnung, "Preise, Plan-Details"));
          }}
        />
      )}
      {anfrage && <AnfrageChat kontext={anfrage} schliessen={anfrageSchliessen} />}
    </section>
  );
}
