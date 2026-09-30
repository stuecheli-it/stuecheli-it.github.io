// Häufige Fragen, die für alle Betriebe gleich beantwortet werden: auf der Startseite und auf jeder Branchenseite.
// Nur belegte Aussagen (PRODUCT.md, Preisliste); Vertragsdauer, Kündigung und Datenstandort erst mit Beleg ergänzen.

import type { Frage } from "./branchenseiten";
import { PRODUKTE, chf } from "./preise";

const SOLO = PRODUKTE.find((p) => p.id === "telefon")!.plaene.find((p) => p.name === "Solo")!;

export const FRAGE_NUMMER: Frage = {
  frage: "Bleibt meine Telefonnummer?",
  antwort:
    "Ja. Sie leiten Anrufe auf den Assistenten um, zum Beispiel nur wenn besetzt ist oder ausserhalb der Öffnungszeiten. Ihre Kundschaft wählt weiterhin Ihre Nummer.",
};

export const FRAGE_KI: Frage = {
  frage: "Merkt man, dass es eine KI ist?",
  antwort:
    "Der Assistent spricht natürlich und im Namen Ihres Betriebs. Wir empfehlen, dass er sich offen als digitaler Assistent vorstellt. Das schafft Vertrauen.",
};

/** Kosten, auf Branchenseiten mit passender Anrede («ein Restaurant», «meinen Betrieb») */
export function frageKosten(fuer = "meinen Betrieb"): Frage {
  return {
    frage: `Was kostet das für ${fuer}?`,
    antwort: `Das Abo Telefon KI Solo kostet ${chf(SOLO.monat)} pro Monat (fonio-Listenpreis, exkl. MWST). Dazu kommt die einmalige Einrichtung durch uns. Diese offerieren wir auf Anfrage, passend zu Ihrem Betrieb; für die ersten zehn Betriebe gibt es ein Pilotangebot.`,
  };
}

/** Zusätzlich auf der Startseite: was uns von einem Abo direkt bei fonio unterscheidet */
export const STARTSEITE_FRAGEN: Frage[] = [
  FRAGE_NUMMER,
  {
    frage: "Muss ich selbst etwas einrichten?",
    antwort:
      "Nein. Wir richten den Assistenten mit Ihrem Wissen ein, testen ihn mit Ihnen und passen ihn an, wenn sich bei Ihnen etwas ändert. Sie schreiben keine Anweisungen und pflegen nichts selbst.",
  },
  {
    frage: "Warum nicht direkt bei fonio abschliessen?",
    antwort:
      "Das können Sie. Bei uns richtet jemand aus der Region den Assistenten persönlich für Ihren Betrieb ein und bleibt danach Ihr Ansprechpartner. Das Abo läuft trotzdem direkt bei fonio.ai, zu denselben Listenpreisen.",
  },
  {
    frage: "Wer verrechnet was?",
    antwort:
      "Das fonio-Abo rechnet fonio.ai direkt mit Ihnen ab. Einrichtung, Schulung und spätere Anpassungen offerieren und verrechnen wir separat, nach Aufwand und transparent.",
  },
  FRAGE_KI,
  frageKosten(),
];
