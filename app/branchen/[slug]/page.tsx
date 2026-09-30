// Branchenseite unter /branchen/<slug>/: gleicher Stil wie die Startseite, Inhalte aus lib/branchenseiten.ts.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Kopf from "@/components/Kopf";
import StimmeAuftrag from "@/components/StimmeAuftrag";
import ChatKnopf from "@/components/ChatKnopf";
import LiveDemoFormular from "@/components/LiveDemoFormular";
import AnfrageKnopf from "@/components/AnfrageKnopf";
import ChatStarter from "@/components/ChatStarter";
import Reveal from "@/components/Reveal";
import Klangbuehne from "@/components/Klangbuehne";
import Effekte from "@/components/Effekte";
import { Fuss, Kontakt, Nutzen, SCHRITTE } from "@/components/Abschnitte";
import { BrancheIcon, Illustration } from "@/components/BranchenGrafik";
import { Chat, Haken, Pfeil } from "@/components/Icons";
import { BRANCHEN } from "@/lib/branchen";
import { BRANCHENSEITEN, seiteFuer, type BranchenSeite, type Frage } from "@/lib/branchenseiten";
import { FRAGE_KI, FRAGE_NUMMER, frageKosten } from "@/lib/fragen";
import { PREISSTAND, PRODUKTE, abPreis, chf } from "@/lib/preise";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BRANCHENSEITEN.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = seiteFuer((await params).slug);
  if (!s) return {};
  const titel = `${s.metaTitel} | Etivo – KI-Assistenten und Beratung`;
  const pfad = `/branchen/${s.slug}/`;
  return {
    title: titel,
    description: s.metaBeschreibung,
    alternates: { canonical: pfad },
    openGraph: { title: titel, description: s.metaBeschreibung, url: pfad, type: "website", locale: "de_CH" },
  };
}

/** Telefon KI mit beiden Paketen: welches passt, hängt von der Anrufmenge ab, nicht von der Branche */
const TELEFON = PRODUKTE.find((p) => p.id === "telefon")!;

/** Fragen, die in jeder Branche gleich beantwortet werden (gemeinsam mit der Startseite, lib/fragen.ts) */
function allgemeineFragen(s: BranchenSeite): Frage[] {
  return [FRAGE_NUMMER, FRAGE_KI, frageKosten(s.mehrzahl === "Restaurants" ? "ein Restaurant" : "meinen Betrieb")];
}

export default async function Branchenseite({ params }: Props) {
  const s = seiteFuer((await params).slug);
  if (!s) notFound();
  const fragen = [...s.fragen, ...allgemeineFragen(s)];
  const andere = BRANCHENSEITEN.filter((x) => x.id !== s.id);
  const pfad = `/branchen/${s.slug}/`;

  // Strukturierte Daten für Suchmaschinen: Brotkrumen und häufige Fragen
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://stuecheli-it.github.io/" },
        { "@type": "ListItem", position: 2, name: "Branchen", item: "https://stuecheli-it.github.io/#branchen" },
        { "@type": "ListItem", position: 3, name: s.kurz, item: `https://stuecheli-it.github.io${pfad}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: fragen.map((f) => ({
        "@type": "Question",
        name: f.frage,
        acceptedAnswer: { "@type": "Answer", text: f.antwort },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Klangbuehne />
      <Kopf branche={s.id} />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="hero bs-hero" data-ohne-chatknopf>
          <div className="wrap">
            {/* Übersicht wie im Hero der Startseite: zurück zur Startseite oder direkt zu einer anderen Branche */}
            <nav className="bs-leiste" aria-label="Branchen">
              <a className="bs-leiste-start" href="/">
                <Pfeil strich={2} />
                Startseite
              </a>
              <span className="bs-leiste-trenner" aria-hidden="true" />
              {/* Auf dem Handy eine wischbare Zeile mit Namen, die aktuelle Branche vorne */}
              <div className="chip-zeile">
                {BRANCHENSEITEN.map((x) => (
                  <a
                    key={x.slug}
                    href={`/branchen/${x.slug}/`}
                    className={"beispiel-chip" + (x.id === s.id ? " aktiv" : "")}
                    aria-current={x.id === s.id ? "page" : undefined}
                  >
                    <BrancheIcon id={x.id} />
                    <span>{x.kurz}</span>
                  </a>
                ))}
              </div>
            </nav>
            <div>
              <h1>
                {s.titel}
                <br />
                <span className="glanz">Ihr Telefon nimmt&nbsp;ab.</span>
              </h1>
              <p className="lead">{s.lead}</p>
              {/* Live-Demo mit der eigenen Website, daneben der Demo-Chat der Beispiel-Firma dieser Branche */}
              <LiveDemoFormular
                branche={s.id}
                beschriftung
                zusatz={
                  <ChatKnopf className="hero-chat" branche={s.id}>
                    <Chat />
                    Beispiel-Chat
                  </ChatKnopf>
                }
              />
            </div>
            <div className="demo">
              <StimmeAuftrag branche={s.id} />
            </div>
          </div>
        </section>

        <Nutzen />

        {/* ---------- Situationen ---------- */}
        <section className="abschnitt">
          <div className="wrap">
            <div className="reveal">
              <h2>Das Telefon klingelt immer im falschen Moment.</h2>
            </div>
            <div className="karten">
              {s.situationen.map((x, i) => (
                <div key={x.titel} className={"karte bs-situation reveal" + (i ? ` verzoegert-${i}` : "")}>
                  <h3>{x.titel}</h3>
                  <p>{x.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Typische Anrufe ---------- */}
        <section className="abschnitt">
          <div className="wrap">
            <div className="reveal">
              <h2>Typische Anrufe {s.beiEiner}.</h2>
              <p className="sub">
                Wir richten den Assistenten auf Ihr Angebot, Ihre Zeiten und Ihre Abläufe ein. Diese Anrufe erledigt er
                selbst oder gibt sie vollständig an Sie weiter.
              </p>
            </div>
            <div className="bs-anrufe">
              {s.anrufe.map((a, i) => (
                <div key={a.titel} className={"bs-anruf reveal" + (i % 3 ? ` verzoegert-${i % 3}` : "")}>
                  <b>{a.titel}</b>
                  <p className="bs-zitat">«{a.zitat}»</p>
                  <p className="bs-loesung">
                    <Haken />
                    {a.loesung}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Einstieg und Preis ---------- */}
        <section className="abschnitt">
          <div className="wrap bs-start">
            <div className="reveal">
              <h2>In drei Schritten startklar.</h2>
              <ol className="bs-schritte">
                {SCHRITTE.map((x, i) => (
                  <li key={x.titel}>
                    <span className="nr">{i + 1}</span>
                    <div>
                      <b>{x.titel}</b>
                      <p>{x.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {/* Keine pauschale Empfehlung: beide Pakete nach Anrufmenge, dazu der Hinweis auf die Chat-Assistenten */}
            <div className="preis mitte bs-preis reveal verzoegert-1">
              <h3>Telefon KI</h3>
              <div className="betrag">
                <small>ab</small> {chf(abPreis("telefon"))} <small>/ Monat</small>
              </div>
              <div className="bs-plaene">
                {TELEFON.plaene.map((p) => (
                  <div key={p.name} className="bs-plan">
                    <b>{p.name}</b>
                    <span>{p.fuer}</span>
                    <span className="bs-plan-preis">{chf(p.monat)}</span>
                  </div>
                ))}
              </div>
              <p className="bs-plan-hinweis">
                Welches Paket passt, klären wir im Gespräch. Auch als WhatsApp- oder Web-Chat-Assistent, ab{" "}
                {chf(abPreis("whatsapp", "webchat"))} pro Monat.
              </p>
              <p className="setup">
                Einrichtung durch uns: offeriert auf Anfrage, passend zu Ihrem Betrieb. Pilotangebot für die ersten zehn Betriebe.
              </p>
              <AnfrageKnopf
                className="btn btn-primaer"
                kontext={{
                  thema: `Telefon KI für ${s.mehrzahl}`,
                  produkt: "Telefon KI",
                  plan: TELEFON.plaene.map((p) => p.name).join(" oder "),
                  preis: `ab ${chf(abPreis("telefon"))} pro Monat`,
                  branche: s.mehrzahl,
                  quelle: `Branchenseite ${s.kurz}`,
                }}
              >
                Unverbindlich anfragen <Pfeil strich={2} />
              </AnfrageKnopf>
              <a className="bs-alle-preise" href="/#preise">
                Alle Preise und Pakete
              </a>
              <p className="bs-steuer">fonio-Listenpreise in CHF pro Monat, exkl. MWST, Stand {PREISSTAND}.</p>
            </div>
          </div>
        </section>

        {/* ---------- Häufige Fragen ---------- */}
        <section className="abschnitt">
          <div className="wrap bs-fragen-wrap">
            <div className="reveal">
              <h2>Häufige Fragen für {s.mehrzahl}.</h2>
            </div>
            <div className="bs-fragen reveal verzoegert-1">
              {fragen.map((f) => (
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

        {/* ---------- Weitere Branchen ---------- */}
        <section className="abschnitt bs-weitere">
          <div className="wrap">
            <div className="reveal">
              <h2>Auch für diese Betriebe.</h2>
            </div>
            <div className="bs-andere">
              {andere.map((x, i) => {
                const bx = BRANCHEN.find((y) => y.id === x.id)!;
                return (
                  <a
                    key={x.slug}
                    className={"bs-andere-karte reveal" + (i % 5 ? ` verzoegert-${Math.min(i, 3)}` : "")}
                    href={`/branchen/${x.slug}/`}
                  >
                    <Illustration b={bx} klasse="bs-mini" />
                    <span className="bs-andere-text">
                      <b>{x.mehrzahl}</b>
                      <span><BrancheIcon id={x.id} />{x.kurz}</span>
                    </span>
                    <span className="pfeil"><Pfeil /></span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <Kontakt branche={s.id} />
      </main>
      <Fuss />
      <ChatStarter branche={s.id} />
      <Reveal />
      <Effekte />
    </>
  );
}
