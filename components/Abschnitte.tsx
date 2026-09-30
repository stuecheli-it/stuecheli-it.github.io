// Statische Abschnitte der Startseite (ohne eigene Logik im Browser).
import type { BrancheId } from "@/lib/branchen";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import { FIRMA } from "@/lib/firma";
import type { AnfrageKontext } from "@/lib/fonio";
import { STARTSEITE_FRAGEN } from "@/lib/fragen";
import AnfrageKnopf from "./AnfrageKnopf";
import { Chat, ChatPunkte, ChatStrich, Globus, Klemmbrett, Mail, Pfeil, Uhr } from "./Icons";
import LiveDemoKnopf from "./LiveDemoFenster";

const verzoegert = (i: number) => (i > 0 ? ` verzoegert-${i}` : "");

// ---------- Nutzen-Leiste ----------

const NUTZEN = [
  { icon: <Uhr />, titel: "Immer erreichbar", text: "Auch abends, am Wochenende und wenn alle im Einsatz sind." },
  { icon: <ChatStrich />, titel: "Gibt Auskunft", text: "Öffnungszeiten, Anfahrt, Ablauf und Zuständigkeiten." },
  { icon: <Klemmbrett />, titel: "Nimmt auf, was zählt", text: "Anliegen, Termine und Rückrufwünsche." },
  { icon: <Mail />, titel: "Zusammen­fassung per Mail", text: "Sie lesen jedes Gespräch nach, wann es Ihnen passt." },
];

export function Nutzen() {
  // Eine Glasfläche mit vier Spalten statt einzelner Karten: kompakt, ohne Leerraum
  return (
    <section className="nutzen abschnitt">
      <div className="wrap">
        <div className="reveal">
          <h2>Das übernimmt der Assistent.</h2>
        </div>
        <ul className="nutzen-raster reveal">
          {NUTZEN.map((n) => (
            <li key={n.titel} className="nutz spot">
              <span className="zeichen" aria-hidden="true">{n.icon}</span>
              <b>{n.titel}</b>
              <span className="nutz-text">{n.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
// ---------- Ablauf: so richten wir ihn ein ----------

export const SCHRITTE = [
  { titel: "Zuhören", text: "Sie erzählen, wie bei Ihnen telefoniert wird und was Anrufende wollen." },
  {
    titel: "Einrichten",
    text: "Wir geben dem Assistenten Ihr Wissen mit, testen mit Ihnen und passen an, bis er klingt wie Ihr Betrieb.",
  },
  { titel: "Dranbleiben", text: "Ändert sich bei Ihnen etwas, ändern wir den Assistenten mit." },
];

export function Ablauf() {
  return (
    <section className="abschnitt" id="ablauf">
      <div className="wrap">
        <div className="reveal">
          <h2>Keine IT‑Kenntnisse, keine neue Telefonanlage.</h2>
          <p className="sub">Ihre Nummer bleibt. Sie erzählen, wir richten ein und bleiben dran, ohne Fachbegriffe.</p>
        </div>
        <ol className="schritte">
          {SCHRITTE.map((s, i) => (
            <li key={s.titel} className={"schritt reveal" + verzoegert(i)}>
              <div className="nr" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
              {i < SCHRITTE.length - 1 && <div className="strich" />}
              <h3>{s.titel}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="ablauf-zusatz reveal">
          <ChatPunkte />
          <span>
            <b>Auch als Chat:</b> Derselbe Assistent beantwortet Fragen auf Ihrer Website oder in WhatsApp, im Design
            Ihrer Marke und getestet vor dem Livegang.
          </span>
        </p>
      </div>
    </section>
  );
}

// ---------- Häufige Fragen ----------

export function Fragen() {
  // Strukturierte Daten für Suchmaschinen, wie auf den Branchenseiten
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STARTSEITE_FRAGEN.map((f) => ({
      "@type": "Question",
      name: f.frage,
      acceptedAnswer: { "@type": "Answer", text: f.antwort },
    })),
  };
  return (
    <section className="abschnitt weiss" id="fragen" data-ohne-chatknopf>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap bs-fragen-wrap">
        <div className="reveal">
          <h2>Was Betriebe uns vor dem Start fragen.</h2>
          <p className="sub">Ihre Frage ist nicht dabei? Stellen Sie sie im Anfrage-Chat, wir antworten persönlich.</p>
        </div>
        <div className="bs-fragen reveal verzoegert-1">
          {STARTSEITE_FRAGEN.map((f) => (
            <details key={f.frage} className="bs-frage" name="haeufige-fragen">
              <summary>
                {f.frage}
                <span className="bs-plus" aria-hidden="true" />
              </summary>
              <p>{f.antwort}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Kontakt ----------

function kontaktAnfrage(branche?: BrancheId): AnfrageKontext {
  const s = branche ? BRANCHENSEITEN.find((x) => x.id === branche) : undefined;
  return s
    ? { thema: `Telefon KI für ${s.mehrzahl}`, branche: s.mehrzahl, quelle: `Kontakt, Branchenseite ${s.kurz}` }
    : { thema: "Einrichtung besprechen", quelle: "Kontakt" };
}

export function Kontakt({ branche }: { branche?: BrancheId } = {}) {
  return (
    <section className="kontakt" id="kontakt" data-ohne-chatknopf>
      <div className="wrap">
        <div className="reveal">
          <h2>Neugierig, wie das für Ihren Betrieb klingen würde?</h2>
          <p className="sub">
            Sie sprechen direkt mit dem Inhaber. Er richtet Ihren Assistenten persönlich ein, testet ihn mit Ihnen und
            bleibt Ihr Ansprechpartner. Ohne Verpflichtung.
          </p>
          <div className="person">
            <span className="person-zeichen" aria-hidden="true">GS</span>
            <span>
              <b>{FIRMA.inhaber}</b>
              <span>Inhaber von {FIRMA.marke}, {FIRMA.ort}</span>
            </span>
          </div>
        </div>
        <div className="wege reveal verzoegert-1">
          <AnfrageKnopf className="weg spot" kontext={kontaktAnfrage(branche)}>
            <div className="ico24"><Chat /></div>
            <div>
              <b>Unverbindlich anfragen</b>
              <span>Einrichtung besprechen: Kontaktdaten hinterlassen, wir melden uns innert eines Arbeitstages persönlich.</span>
            </div>
            <span className="pfeil"><Pfeil /></span>
          </AnfrageKnopf>
          <a className="weg spot" href={`mailto:${FIRMA.email}`}>
            <div className="ico24"><Mail /></div>
            <div><b>{FIRMA.email}</b><span>Lieber per E-Mail? Antwort innert eines Arbeitstages.</span></div>
            <span className="pfeil"><Pfeil /></span>
          </a>
          <LiveDemoKnopf className="weg spot" branche={branche}>
            <div className="ico24"><Globus /></div>
            <div><b>Anruf-Demo mit Ihrer Website</b><span>fonio ruft Sie an, Sie hören Ihren Assistenten. Kostenlos.</span></div>
            <span className="pfeil"><Pfeil /></span>
          </LiveDemoKnopf>
        </div>
      </div>
    </section>
  );
}

// ---------- Fusszeile ----------

export function Fuss() {
  return (
    <footer className="fuss" data-ohne-chatknopf>
      <div className="wrap">
        <div>
          <div className="name">{FIRMA.name}</div>
          <div className="zusatz">
            {FIRMA.zusatz} für KMU in der Ostschweiz · {FIRMA.ort} · © 2026
          </div>
          <nav className="fuss-branchen" aria-label="Branchen">
            {BRANCHENSEITEN.map((b) => (
              <a key={b.slug} href={`/branchen/${b.slug}/`}>{b.kurz}</a>
            ))}
          </nav>
          <nav className="fuss-recht" aria-label="Rechtliches">
            <a href="/impressum/">Impressum</a>
            <a href="/datenschutz/">Datenschutz</a>
          </nav>
        </div>
        <div className="lockup">
          {/* Gleiches Logo wie in der Kopfzeile: Bildmarke plus echte Schrift, hier in der Variante für dunklen Grund */}
          <span className="marke" role="img" aria-label="Etivo – KI-Assistenten und Beratung">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="marke-orb" src="/assets/stuecheli-favicon.svg" alt="" />
            <span className="marke-text" aria-hidden="true">
              <span className="marke-name">Etivo</span>
              <span className="marke-zusatz">KI-Assistenten und Beratung</span>
            </span>
          </span>
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
