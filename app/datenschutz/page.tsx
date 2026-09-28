import type { Metadata } from "next";
import RechtsSeite from "@/components/RechtsSeite";
import { FIRMA, RECHTSTEXTE_STAND } from "@/lib/firma";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Stücheli IT Consulting",
  description:
    "Wie Stücheli IT Consulting Personendaten auf dieser Website, im KI-Web-Chat und bei der Live-Demo bearbeitet.",
  alternates: { canonical: "/datenschutz/" },
};

// Aufbau nach dem Schweizer Datenschutzgesetz (DSG); Hinweise zur DSGVO, soweit sie anwendbar ist.
// Abschnitt KI-Web-Chat nach dem Textbaustein von fonio.ai, angepasst an diese Website.

export default function Datenschutz() {
  return (
    <RechtsSeite kicker="Rechtliches" titel="Datenschutzerklärung" stand={RECHTSTEXTE_STAND}>
      <p className="recht-einleitung">
        Wir nehmen den Schutz Ihrer Personendaten ernst. Hier erklären wir, welche Daten wir bearbeiten, wenn Sie
        diese Website besuchen, mit unserem KI-Web-Chat schreiben, eine Live-Demo mit Ihrer Website erstellen oder uns
        eine E-Mail senden. Massgebend ist das Schweizer Datenschutzgesetz (DSG). Soweit die Datenschutz-Grundverordnung der EU
        (DSGVO) anwendbar ist, gelten ergänzend die Hinweise in Abschnitt 9.
      </p>

      <nav className="recht-inhalt" aria-label="Inhalt">
        <b>Inhalt</b>
        <ol>
          <li><a href="#verantwortlich">Verantwortlich</a></li>
          <li><a href="#website">Besuch dieser Website</a></li>
          <li><a href="#chat">KI-Web-Chat</a></li>
          <li><a href="#live-demo">Live-Demo mit Ihrer Website</a></li>
          <li><a href="#email">Kontakt per E-Mail</a></li>
          <li><a href="#empfaenger">Empfänger und Bekanntgabe ins Ausland</a></li>
          <li><a href="#dauer">Aufbewahrung</a></li>
          <li><a href="#rechte">Ihre Rechte</a></li>
          <li><a href="#dsgvo">Hinweise zur DSGVO</a></li>
          <li><a href="#aenderungen">Änderungen</a></li>
        </ol>
      </nav>

      <h2 id="verantwortlich">1. Verantwortlich</h2>
      <address className="recht-adresse">
        <b>{FIRMA.name}</b>
        <br />
        {FIRMA.inhaber}
        <br />
        {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}, {FIRMA.land}
        <br />
        <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>
      </address>
      <p>Für alle Fragen zum Datenschutz und für Ihre Anliegen nach Abschnitt 8 schreiben Sie uns an diese Adresse.</p>

      <h2 id="website">2. Besuch dieser Website</h2>
      <p>
        Diese Website wird über <b>GitHub Pages</b> der GitHub, Inc., San Francisco (USA), ausgeliefert. Beim Aufruf
        einer Seite verarbeitet GitHub technisch notwendige Daten, insbesondere Ihre IP-Adresse, Datum und Uhrzeit,
        die aufgerufene Adresse sowie Angaben zu Browser und Betriebssystem. GitHub speichert die IP-Adressen der
        Besucherinnen und Besucher zu Sicherheitszwecken. Wir selbst werten diese Daten nicht aus. Mehr dazu im{" "}
        <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">
          Datenschutzhinweis von GitHub
        </a>
        .
      </p>
      <p>
        Wir setzen <b>keine Analyse- oder Werbewerkzeuge</b> ein und verwenden keine Tracking-Cookies. Die Schriften
        liefern wir von dieser Website selbst aus; dabei werden keine Daten an Google oder andere Schriftanbieter
        übermittelt.
      </p>

      <h2 id="chat">3. KI-Web-Chat</h2>
      <p>
        Auf dieser Website können Sie mit uns über einen KI-Web-Chat schreiben: zum Ausprobieren (Knöpfe «Im Chat
        testen» und «Chat testen» unten rechts) und für unverbindliche Anfragen (Knopf «Unverbindlich anfragen»). Die
        Demo-Chats auf den Branchenseiten sprechen im Namen erfundener Beispiel-Firmen; dort wird nichts gebucht, und Sie
        brauchen keine echten Angaben zu machen. Wir
        bieten diesen Dienst mit <b>fonio.ai</b> der fonio GmbH, Österreich, an. Der Dienst wird in Deutschland
        gehostet; im Zuge der Nutzung kann es zu Datenübermittlungen in weitere Länder kommen (siehe Abschnitt 6). Mit
        dem Anbieter besteht eine Vereinbarung zur Auftragsbearbeitung, die den Schutz Ihrer Daten sicherstellt.
      </p>
      <p>Zweck: Beantworten Ihrer Fragen zu unseren Produkten und Dienstleistungen und Aufnehmen Ihrer Anfrage.</p>
      <p>Bearbeitete Daten:</p>
      <ul>
        <li>Identifikationsdaten, zum Beispiel Ihr Name, falls Sie ihn angeben</li>
        <li>Alle Informationen, die Sie uns über den Chat übermitteln</li>
        <li>Kontaktdaten, zum Beispiel E-Mail-Adresse oder Telefonnummer, falls Sie diese angeben</li>
        <li>Technische Daten, die für den Betrieb des Chats nötig sind, zum Beispiel die IP-Adresse</li>
      </ul>
      <p>
        Der Chat kann zur Funktion Daten in Ihrem Browser speichern, etwa damit eine laufende Unterhaltung erhalten
        bleibt. Die Antworten erzeugt eine künstliche Intelligenz; sie können unvollständig oder fehlerhaft sein und
        sind keine verbindliche Offerte. Bitte geben Sie im Chat keine besonders schützenswerten Personendaten ein,
        zum Beispiel Gesundheitsdaten.
      </p>
      <p>
        Auftragsbearbeiter: fonio GmbH, Neustiftgasse 73-75/3/7, 1070 Wien, Österreich. Weitere Informationen im{" "}
        <a href="https://www.fonio.ai/de/datenschutzerklarung/" rel="noopener">
          Datenschutzhinweis von fonio.ai
        </a>{" "}
        und im{" "}
        <a href="https://www.fonio.ai/de/datenschutzerklarung-app/" rel="noopener">
          Datenschutzhinweis zur fonio-Applikation
        </a>
        .
      </p>

      <h2 id="live-demo">4. Live-Demo mit Ihrer Website</h2>
      <p>
        Mit dem Feld «Ihre Website» und dem Knopf «Eigene Demo erstellen» erstellen Sie bei unserem Partner fonio.ai
        einen Demo-Assistenten für Ihren Betrieb. Nach dem Absenden öffnet sich die Seite app.fonio.ai in einem neuen
        Tab. Dabei übergeben wir in der Adresse die eingegebene Website sowie einen Partner-Code, an dem fonio erkennt,
        dass Sie über uns kommen. Wir selbst speichern Ihre Eingabe nicht.
      </p>
      <p>
        Auf app.fonio.ai bearbeitet die fonio GmbH Ihre Daten in eigener Verantwortung, zum Beispiel die Inhalte Ihrer
        Website, Ihre Telefonnummer für den Demo-Anruf, das Gespräch selbst oder ein Testkonto. Es gelten die{" "}
        <a href="https://www.fonio.ai/de/datenschutzerklarung-app/" rel="noopener">
          Datenschutzhinweise zur fonio-Applikation
        </a>
        . fonio speichert den Partner-Code bis zu 30 Tage in Ihrem Browser. Über diesen Code kann fonio uns mitteilen,
        dass Sie eine Demo erstellt oder ein Testkonto eröffnet haben, damit wir Sie bei der Einrichtung begleiten
        können.
      </p>

      <h2 id="email">5. Kontakt per E-Mail</h2>
      <p>
        Wenn Sie uns schreiben, bearbeiten wir Ihre E-Mail-Adresse, Ihren Namen und den Inhalt Ihrer Nachricht, um Ihr
        Anliegen zu beantworten. Unser E-Mail-Postfach wird von der Swisscom (Schweiz) AG betrieben.
      </p>

      <h2 id="empfaenger">6. Empfänger und Bekanntgabe ins Ausland</h2>
      <p>Wir geben Personendaten nur an Dienstleister weiter, die wir für die oben genannten Zwecke einsetzen:</p>
      <ul>
        <li>GitHub, Inc., USA: Auslieferung dieser Website</li>
        <li>
          fonio GmbH, Österreich, Hosting in Deutschland: KI-Web-Chat und Live-Demo. fonio setzt für
          Sprach-, Telefonie- und KI-Funktionen weitere Unterauftragsbearbeiter ein, unter anderem in Irland (zum
          Beispiel OpenAI, Microsoft, Twilio) und in den USA (zum Beispiel ElevenLabs, Deepgram, Cartesia, LiveKit).
          Die vollständige Liste steht im Datenschutzhinweis zur fonio-Applikation.
        </li>
        <li>Swisscom (Schweiz) AG, Schweiz: E-Mail</li>
      </ul>
      <p>
        Österreich und Deutschland gewährleisten nach Einschätzung des Bundesrats einen angemessenen Datenschutz. Bei
        Übermittlungen in Länder ohne angemessenen Datenschutz, etwa in die USA, stützen sich die Dienstleister auf
        anerkannte Garantien, insbesondere eine Zertifizierung nach dem Data Privacy Framework,
        Standardvertragsklauseln oder verbindliche interne Datenschutzvorschriften. Wir verkaufen keine Personendaten.
      </p>

      <h2 id="dauer">7. Aufbewahrung</h2>
      <p>
        Wir bewahren Personendaten nur so lange auf, wie es für den jeweiligen Zweck nötig ist oder das Gesetz es
        verlangt. Chat-Daten ohne weitere Geschäftsbeziehung löschen wir, sobald Ihr Anliegen erledigt ist.
        Unterlagen einer Geschäftsbeziehung bewahren wir während der gesetzlichen Fristen auf.
      </p>

      <h2 id="rechte">8. Ihre Rechte</h2>
      <p>Sie haben im Rahmen des anwendbaren Rechts insbesondere das Recht,</p>
      <ul>
        <li>Auskunft über Ihre bei uns bearbeiteten Personendaten zu verlangen,</li>
        <li>unrichtige Daten berichtigen zu lassen,</li>
        <li>die Löschung Ihrer Daten zu verlangen,</li>
        <li>der Bearbeitung zu widersprechen und</li>
        <li>die Herausgabe oder Übertragung Ihrer Daten zu verlangen.</li>
      </ul>
      <p>
        Schreiben Sie uns dafür an <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>. Wir können einen Nachweis
        Ihrer Identität verlangen. Sie können sich ausserdem beim Eidgenössischen Datenschutz- und
        Öffentlichkeitsbeauftragten (EDÖB) beschweren:{" "}
        <a href="https://www.edoeb.admin.ch" rel="noopener">www.edoeb.admin.ch</a>.
      </p>

      <h2 id="dsgvo">9. Hinweise zur DSGVO</h2>
      <p>Soweit die DSGVO anwendbar ist, stützen wir die Bearbeitung auf folgende Rechtsgrundlagen:</p>
      <ul>
        <li>
          Vertragliche und vorvertragliche Massnahmen, Art. 6 Abs. 1 lit. b DSGVO, zum Beispiel bei Anfragen zu
          unserem Angebot
        </li>
        <li>
          Berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO: sicherer Betrieb der Website und Beantworten von
          Anfragen zu unseren Produkten und Dienstleistungen
        </li>
      </ul>
      <p>
        Sie haben zusätzlich das Recht auf Einschränkung der Bearbeitung und können sich bei einer
        Datenschutz-Aufsichtsbehörde in der EU beschweren, insbesondere an Ihrem Wohnort.
      </p>

      <h2 id="aenderungen">10. Änderungen</h2>
      <p>
        Wir passen diese Datenschutzerklärung an, wenn sich unsere Bearbeitung ändert. Es gilt die jeweils auf dieser
        Website veröffentlichte Fassung.
      </p>
    </RechtsSeite>
  );
}
