// Gemeinsamer Rahmen für Impressum und Datenschutzerklärung:
// dunkler Kopf wie im Hero, darunter gut lesbarer Fliesstext.
import Kopf from "./Kopf";
import FonioWidget from "./FonioWidget";
import { Fuss } from "./Abschnitte";
import { Pfeil } from "./Icons";

export default function RechtsSeite({
  kicker,
  titel,
  stand,
  children,
}: {
  kicker: string;
  titel: string;
  stand?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Kopf />
      <main>
        <section className="recht-kopf">
          <div className="hero-glow" />
          <div className="wrap">
            <a className="bs-leiste-start" href="/">
              <Pfeil strich={2} />
              Startseite
            </a>
            <div className="kicker">{kicker}</div>
            <h1>{titel}</h1>
            {stand && <p className="recht-stand">Stand {stand}</p>}
          </div>
        </section>
        <section className="abschnitt weiss recht-abschnitt">
          <div className="wrap">
            <article className="recht">{children}</article>
          </div>
        </section>
      </main>
      <Fuss />
      <FonioWidget />
    </>
  );
}
