// Statische Abschnitte der Startseite (ohne eigene Logik im Browser).
import ChatKnopf from "./ChatKnopf";
import { Auszeichnung, ChatPunkte, ChatStrich, Klemmbrett, Mail, Pfeil, Telefon, Uhr } from "./Icons";

const verzoegert = (i: number) => (i > 0 ? ` verzoegert-${i}` : "");

// ---------- Nutzen-Leiste ----------

const NUTZEN = [
  { icon: <Uhr />, titel: "Immer erreichbar", text: "Auch abends, am Wochenende und wenn alle im Einsatz sind." },
  { icon: <ChatStrich />, titel: "Gibt Auskunft", text: "Öffnungszeiten, Anfahrt, Ablauf und Zuständigkeiten." },
  { icon: <Klemmbrett />, titel: "Nimmt auf, was zählt", text: "Anliegen, Termine und Rückrufwünsche." },
  { icon: <Mail />, titel: "Sie lesen mit", text: "Jedes Gespräch kommt zusammengefasst per Mail." },
];

export function Nutzen() {
  return (
    <section className="nutzen">
      <div className="wrap">
        {NUTZEN.map((n, i) => (
          <div key={n.titel} className={"nutz reveal" + verzoegert(i)}>
            <div className="ico24">{n.icon}</div>
            <div>
              <b>{n.titel}</b>
              <span>{n.text}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Leistungen ----------

const LEISTUNGEN = [
  {
    icon: <Telefon />,
    titel: "KI-Telefonassistent",
    text: "Nimmt jeden Anruf freundlich und in Ihrem Namen entgegen, gibt Auskunft, nimmt Anliegen und Rückrufwünsche auf und leitet weiter, was wirklich zu Ihnen muss.",
  },
  {
    icon: <ChatPunkte />,
    titel: "Webchat & WhatsApp",
    text: "Derselbe Assistent als Chat auf Ihrer Website oder direkt in WhatsApp: beantwortet Kundenfragen aus Ihrem Firmenwissen. Im Design Ihrer Marke, getestet vor dem Livegang.",
  },
  {
    icon: <Auszeichnung />,
    titel: "Einrichtung & Betreuung",
    text: "Wir füttern den Assistenten mit Ihrem Wissen und testen mit Ihnen, bis er klingt wie Ihr Betrieb. Und wir bleiben dran, wenn sich bei Ihnen etwas ändert.",
  },
];

export function Leistungen() {
  return (
    <section className="abschnitt weiss" id="leistungen">
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Leistungen</div>
          <h2>Keine IT-Kenntnisse, keine neue Telefonanlage.</h2>
          <p className="sub">Wir erklären alles verständlich und ohne Fachbegriffe. Ihre Nummer bleibt.</p>
        </div>
        <div className="karten">
          {LEISTUNGEN.map((l, i) => (
            <div key={l.titel} className={"karte reveal" + verzoegert(i)}>
              <div className="ico24">{l.icon}</div>
              <h3>{l.titel}</h3>
              <p>{l.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Vorgehen ----------

const SCHRITTE = [
  { titel: "Zuhören", text: "Sie erzählen, wie bei Ihnen telefoniert wird und was Anrufende wollen." },
  { titel: "Einrichten", text: "Wir richten ihn ein, testen mit Ihnen und passen an, bis er klingt wie Ihr Betrieb." },
  { titel: "Dranbleiben", text: "Ändert sich bei Ihnen etwas, ändern wir den Assistenten mit." },
];

const ZIELGRUPPEN = [
  "Handwerk",
  "Garagen",
  "Gastronomie",
  "Coiffeure",
  "Fahrschulen",
  "Immobilienverwaltungen",
  "alle KMU, bei denen das Telefon klingelt, während gearbeitet wird",
];

export function Vorgehen() {
  return (
    <section className="abschnitt" id="vorgehen">
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">So arbeiten wir</div>
          <h2>Drei Schritte, keine Umwege.</h2>
        </div>
        <div className="schritte">
          {SCHRITTE.map((s, i) => (
            <div key={s.titel} className={"schritt reveal" + verzoegert(i)}>
              <div className="nr">{i + 1}</div>
              {i < SCHRITTE.length - 1 && <div className="strich" />}
              <h3>{s.titel}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="fuerwen reveal">
          <b>Für wen sich das lohnt:</b>
          <div className="chips">
            {ZIELGRUPPEN.map((z) => (
              <span key={z} className="chip">{z}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Kontakt ----------

export function Kontakt() {
  return (
    <section className="kontakt" id="kontakt">
      <div className="glow" />
      <div className="wrap">
        <div className="reveal">
          <div className="kicker">Kontakt</div>
          <h2>Neugierig, wie das für Ihren Betrieb klingen würde?</h2>
          <p className="sub">
            Schreiben Sie uns oder rufen Sie den Assistenten direkt an. Wir zeigen es Ihnen live, ohne Verpflichtung.
          </p>
        </div>
        <div className="wege reveal verzoegert-1">
          <a className="weg" href="mailto:stuecheli.it@bluewin.ch">
            <div className="ico24"><Mail /></div>
            <div><b>stuecheli.it@bluewin.ch</b><span>Wir antworten innert eines Arbeitstages.</span></div>
            <span className="pfeil"><Pfeil /></span>
          </a>
          <a className="weg" href="tel:+41615391202">
            <div className="ico24"><Telefon /></div>
            <div><b>+41 61 539 12 02</b><span>Den Assistenten hören, rund um die Uhr.</span></div>
            <span className="pfeil"><Pfeil /></span>
          </a>
          <ChatKnopf className="weg">
            <div className="ico24"><ChatStrich /></div>
            <div><b>Im Chat ausprobieren</b><span>Unten rechts, ohne Anmeldung.</span></div>
            <span className="pfeil"><Pfeil /></span>
          </ChatKnopf>
        </div>
      </div>
    </section>
  );
}

// ---------- Fusszeile ----------

export function Fuss() {
  return (
    <footer className="fuss">
      <div className="wrap">
        <div>
          <div className="name">Stücheli IT Consulting</div>
          <div className="zusatz">KI-Telefonassistenten für KMU in der Deutschschweiz · © 2026</div>
        </div>
        <div className="lockup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="eigen" src="/assets/stuecheli-logo-horizontal-dunkel.svg" alt="Stücheli IT Consulting" />
          <div className="trenner" />
          <div className="fonio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/fonio.png" alt="fonio.ai" />
            <span>PARTNER</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
