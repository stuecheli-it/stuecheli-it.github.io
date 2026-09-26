// Branchenseite unter /branchen/<slug>/: gleicher Stil wie die Startseite, Inhalte aus lib/branchenseiten.ts.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Kopf from "@/components/Kopf";
import StimmeAuftrag from "@/components/StimmeAuftrag";
import ChatKnopf from "@/components/ChatKnopf";
import AnfrageKnopf from "@/components/AnfrageKnopf";
import FonioWidget from "@/components/FonioWidget";
import Reveal from "@/components/Reveal";
import { Fuss, Kontakt, Nutzen, SCHRITTE } from "@/components/Abschnitte";
import { BrancheIcon, Illustration } from "@/components/BranchenGrafik";
import { Chat, Haken, Pfeil, Telefon } from "@/components/Icons";
import { BRANCHEN } from "@/lib/branchen";
import { BRANCHENSEITEN, seiteFuer, type BranchenSeite, type Frage } from "@/lib/branchenseiten";
import { PREISSTAND, PRODUKTE, chf } from "@/lib/preise";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BRANCHENSEITEN.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = seiteFuer((await params).slug);
  if (!s) return {};
  const titel = `${s.metaTitel} | Stücheli IT Consulting`;
  const pfad = `/branchen/${s.slug}/`;
  return {
    title: titel,
    description: s.metaBeschreibung,
    alternates: { canonical: pfad },
    openGraph: { title: titel, description: s.metaBeschreibung, url: pfad, type: "website", locale: "de_CH" },
  };
}

const SOLO = PRODUKTE.find((p) => p.id === "telefon")!.plaene.find((p) => p.name === "Solo")!;

/** Fragen, die in jeder Branche gleich beantwortet werden */
function allgemeineFragen(s: BranchenSeite): Frage[] {
  return [
    {
      frage: "Bleibt meine Telefonnummer?",
      antwort:
        "Ja. Sie leiten Anrufe auf den Assistenten um, zum Beispiel nur wenn besetzt ist oder ausserhalb der Öffnungszeiten. Ihre Kundschaft wählt weiterhin Ihre Nummer.",
    },
    {
      frage: "Merkt man, dass es eine KI ist?",
      antwort:
        "Der Assistent spricht natürlich und im Namen Ihres Betriebs. Wir empfehlen, dass er sich offen als digitaler Assistent vorstellt. Das schafft Vertrauen.",
    },
    {
      frage: `Was kostet das für ${s.mehrzahl === "Restaurants" ? "ein Restaurant" : "meinen Betrieb"}?`,
      antwort: `Das Abo Telefon KI Solo kostet ${chf(SOLO.monat)} pro Monat (fonio-Listenpreis, exkl. MWST). Dazu kommt die einmalige Einrichtung durch uns: CHF 1'290, im Pilotangebot für die ersten zehn Betriebe CHF 690.`,
    },
  ];
}

export default async function Branchenseite({ params }: Props) {
  const s = seiteFuer((await params).slug);
  if (!s) notFound();
  const b = BRANCHEN.find((x) => x.id === s.id)!;
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
      <Kopf />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="hero bs-hero">
          <div className="hero-glow" />
          <div className="hero-raster" />
          <div className="wrap">
            <div>
              <nav className="bs-krumen" aria-label="Brotkrumen">
                <a href="/">Startseite</a>
                <span aria-hidden="true">/</span>
                <a href="/#branchen">Branchen</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{s.kurz}</span>
              </nav>
              <div className="augenbraue">
                <span className="punkt" />
                KI-Telefonassistent für {s.mehrzahl}
              </div>
              <h1>
                {s.titel}
                <br />
                <span className="glanz">Ihr Telefon nimmt ab.</span>
              </h1>
              <p className="lead">{s.lead}</p>
              <div className="cta">
                <a className="btn btn-primaer" href="tel:+41615391202">
                  <Telefon strich={2} />
                  Demo anrufen
                </a>
                <ChatKnopf className="btn btn-hell">
                  <Chat />
                  Im Chat testen
                </ChatKnopf>
              </div>
              <p className="klein">Die Demo spricht für alle Branchen. Für Ihren Betrieb richten wir ihn auf Ihr Angebot ein.</p>
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
              <div className="kicker">Der Alltag {s.beiEiner}</div>
              <h2>Das Telefon klingelt immer im falschen Moment.</h2>
            </div>
            <div className="karten">
              {s.situationen.map((x, i) => (
                <div key={x.titel} className={"karte bs-situation reveal" + (i ? ` verzoegert-${i}` : "")}>
                  <span className="bs-nr">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{x.titel}</h3>
                  <p>{x.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Typische Anrufe ---------- */}
        <section className="abschnitt weiss">
          <div className="wrap">
            <div className="reveal">
              <div className="kicker">Das übernimmt er</div>
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

        {/* ---------- Beispielgespräch ---------- */}
        <section className="abschnitt">
          <div className="wrap">
            <div className="reveal">
              <div className="kicker">Beispiel</div>
              <h2>So klingt das {s.beiEiner}.</h2>
            </div>
            <div className="branche reveal">
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

        {/* ---------- Einstieg und Preis ---------- */}
        <section className="abschnitt weiss">
          <div className="wrap bs-start">
            <div className="reveal">
              <div className="kicker">Einstieg</div>
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
            <div className="preis mitte bs-preis reveal verzoegert-1">
              <span className="beliebt">Passt für die meisten</span>
              <h3>Telefon KI {SOLO.name}</h3>
              <p className="fuer">{SOLO.fuer}</p>
              <div className="betrag">
                {chf(SOLO.monat)} <small>/ Monat</small>
              </div>
              <p className="setup">
                Einrichtung durch uns einmalig CHF 1&apos;290. Pilotangebot für die ersten zehn Betriebe: CHF 690.
              </p>
              <ul>
                {SOLO.punkte.map((p) => (
                  <li key={p}><Haken />{p}</li>
                ))}
              </ul>
              <AnfrageKnopf className="btn btn-primaer" thema={`Telefon KI · ${s.kurz}`}>
                Unverbindlich anfragen <Pfeil strich={2} />
              </AnfrageKnopf>
              <a className="bs-alle-preise" href="/#preise">
                Alle Preise und Pakete
              </a>
              <p className="bs-steuer">fonio-Listenpreis in CHF, exkl. MWST, Stand {PREISSTAND}.</p>
            </div>
          </div>
        </section>

        {/* ---------- Häufige Fragen ---------- */}
        <section className="abschnitt">
          <div className="wrap bs-fragen-wrap">
            <div className="reveal">
              <div className="kicker">Häufige Fragen</div>
              <h2>Was {s.mehrzahl} uns fragen.</h2>
            </div>
            <div className="bs-fragen reveal verzoegert-1">
              {fragen.map((f) => (
                <details key={f.frage} className="bs-frage">
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
        <section className="abschnitt weiss bs-weitere">
          <div className="wrap">
            <div className="reveal">
              <div className="kicker">Weitere Branchen</div>
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

        <Kontakt />
      </main>
      <Fuss />
      <FonioWidget />
      <Reveal />
    </>
  );
}
