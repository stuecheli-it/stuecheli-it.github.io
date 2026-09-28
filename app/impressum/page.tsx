import type { Metadata } from "next";
import RechtsSeite from "@/components/RechtsSeite";
import { FIRMA, RECHTSTEXTE_STAND } from "@/lib/firma";

export const metadata: Metadata = {
  title: "Impressum | Stücheli IT Consulting",
  description: "Impressum von Stücheli IT Consulting, St. Gallen: Anbieter, Kontakt und rechtliche Hinweise.",
  alternates: { canonical: "/impressum/" },
};

export default function Impressum() {
  return (
    <RechtsSeite kicker="Rechtliches" titel="Impressum" stand={RECHTSTEXTE_STAND}>
      <h2>Anbieter dieser Website</h2>
      <address className="recht-adresse">
        <b>{FIRMA.name}</b>
        <br />
        Inhaber: {FIRMA.inhaber}
        <br />
        {FIRMA.strasse}
        <br />
        {FIRMA.plz} {FIRMA.ort}
        <br />
        {FIRMA.land}
      </address>
      <p>
        E-Mail: <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>
      </p>
      <p>Rechtsform: {FIRMA.rechtsform}</p>
      <p>Verantwortlich für den Inhalt: {FIRMA.inhaber}</p>

      <h2>Partnerschaft mit fonio.ai</h2>
      <p>
        Wir sind Partner der fonio GmbH, Wien (Österreich), und richten deren KI-Assistenten für unsere Kundschaft ein.
        Das fonio-Abo aktivieren wir gemeinsam mit unserer Kundschaft; Vertragspartner für das Abo ist fonio.ai. Die
        Preise auf dieser Website sind Listenpreise von fonio.ai ohne Gewähr; massgebend ist das jeweilige Angebot.
      </p>
      <p>
        Die Live-Demo mit Ihrer Website läuft direkt bei fonio.ai (app.fonio.ai). Dort gelten die Bedingungen und die
        Datenschutzhinweise von fonio.ai.
      </p>

      <h2>Haftungsausschluss</h2>
      <p>
        Wir prüfen die Inhalte dieser Website sorgfältig. Für Richtigkeit, Vollständigkeit und Aktualität übernehmen wir
        jedoch keine Gewähr. Haftungsansprüche wegen Schäden, die aus dem Zugriff auf die Website, ihrer Nutzung oder
        dem Vertrauen auf ihre Inhalte entstehen, sind ausgeschlossen, soweit das Gesetz dies zulässt.
      </p>
      <p>
        Die Beispielgespräche, Namen, Adressen und Preise in den Demos sind erfunden und dienen nur der Veranschaulichung.
      </p>

      <h2>Links zu anderen Websites</h2>
      <p>
        Für Inhalte externer Websites, auf die wir verweisen, sind ausschliesslich deren Betreiber verantwortlich. Der
        Zugriff und die Nutzung erfolgen auf eigene Gefahr.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Texte, Grafiken und Logos dieser Website gehören {FIRMA.name} oder den genannten Rechteinhabern. Jede
        Verwendung ausserhalb des privaten Gebrauchs braucht unsere vorherige schriftliche Zustimmung. Das Logo fonio.ai
        ist ein Zeichen der fonio GmbH.
      </p>

      <h2>Datenschutz</h2>
      <p>
        Wie wir mit Personendaten umgehen, lesen Sie in der <a href="/datenschutz/">Datenschutzerklärung</a>.
      </p>
    </RechtsSeite>
  );
}
