// Gemeinsamer Rahmen für Impressum und Datenschutzerklärung:
// Kopf mit grossem Titel, darunter gut lesbarer Fliesstext auf einer ruhigen Fläche.
import Kopf from "./Kopf";
import ChatStarter from "./ChatStarter";
import { Fuss } from "./Abschnitte";
import { Pfeil } from "./Icons";
import Klangbuehne from "./Klangbuehne";

export default function RechtsSeite({
  titel,
  stand,
  children,
}: {
  /** Früher Kicker über dem Titel; nicht mehr angezeigt */
  kicker?: string;
  titel: string;
  stand?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Klangbuehne />
      <Kopf />
      <main>
        <section className="recht-kopf">
          <div className="wrap">
            <a className="bs-leiste-start" href="/">
              <Pfeil strich={2} />
              Startseite
            </a>
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
      <ChatStarter />
    </>
  );
}
