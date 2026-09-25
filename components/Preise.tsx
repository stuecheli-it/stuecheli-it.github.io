"use client";

import { type ReactElement, useRef, useState } from "react";
import {
  PREISSTAND,
  PRODUKTE,
  chf,
  ersparnisProJahr,
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
  Kreislauf,
  Kreuz,
  Pfeil,
  Plus,
  Schall,
  Stern,
  Telefon,
  Werkzeug,
} from "./Icons";
import AnfrageChat from "./AnfrageChat";
import { useFenster } from "./useFenster";

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

  return (
    <div className="plan-hintergrund" onClick={(e) => e.target === e.currentTarget && schliessen()}>
      <div ref={fensterRef} className="plan-fenster" role="dialog" aria-modal="true" aria-labelledby="planTitel">
        <button ref={zuRef} className="plan-zu" type="button" aria-label="Schliessen" onClick={schliessen}>
          <Kreuz />
        </button>

        <div className="plan-scroll">
          <header className="plan-kopf">
            <div className="plan-glow" aria-hidden />
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
              <div className="gruppe plan-abrechnung" role="group" aria-label="Abrechnung">
                <button
                  type="button"
                  aria-pressed={abrechnung === "monat"}
                  className={abrechnung === "monat" ? "aktiv" : ""}
                  onClick={() => setAbrechnung("monat")}
                >
                  Monatlich
                </button>
                <button
                  type="button"
                  aria-pressed={abrechnung === "jahr"}
                  className={abrechnung === "jahr" ? "aktiv" : ""}
                  onClick={() => setAbrechnung("jahr")}
                >
                  Jährlich <span className="rabatt">−{rabattProzent(plan)} %</span>
                </button>
              </div>
            </div>
            {abrechnung === "jahr" && (
              <p className="plan-spare">
                Entspricht {proMonatImJahresabo(plan)} pro Monat · Sie sparen {chf(ersparnisProJahr(plan))} pro Jahr
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
                <span><b>{d.titel}:</b> {d.punkte.join(" ")}</span>
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
    </div>
  );
}

export default function Preise() {
  const [produktId, setProduktId] = useState<ProduktId>("telefon");
  const [abrechnung, setAbrechnung] = useState<Abrechnung>("monat");
  const [offen, setOffen] = useState<Plan | null>(null);
  const [anfrage, setAnfrage] = useState<string | null>(null);
  const produkt = PRODUKTE.find((p) => p.id === produktId) ?? PRODUKTE[0];
  const schliessen = useRef(() => setOffen(null)).current;
  const anfrageSchliessen = useRef(() => setAnfrage(null)).current;

  return (
    <section className="abschnitt weiss" id="preise">
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Preise</div>
          <h2>Transparent und ohne Umwege.</h2>
          <p className="sub">
            Ihr fonio-Abo aktivieren wir gemeinsam mit Ihnen. So ist Ihr Assistent vom ersten Tag an richtig eingerichtet.
            Einrichtung, Schulung und Betreuung verrechnen wir separat.
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

      {offen && (
        <DetailFenster
          produkt={produkt}
          plan={offen}
          abrechnung={abrechnung}
          setAbrechnung={setAbrechnung}
          schliessen={schliessen}
          anfragen={() => {
            setOffen(null);
            setAnfrage(produkt.label + " " + offen.name);
          }}
        />
      )}
      {anfrage && <AnfrageChat thema={anfrage} schliessen={anfrageSchliessen} />}
    </section>
  );
}
