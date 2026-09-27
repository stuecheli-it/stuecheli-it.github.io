// Demo-Chats: je ein fonio-Assistent pro Branche mit Beispiel-Firma. Ohne Branche wählt man sie im Fenster aus.
// Die Widget-IDs stehen in public/chat.html (Schlüssel wie unten). Die Firmen passen zu den Hero-Szenen.

import type { BrancheId } from "./branchen";

export type DemoChat = {
  /** Schlüssel in public/chat.html */
  schluessel: string;
  /** Beispiel-Firma */
  firma: string;
  /** Anstösse für die ersten Fragen */
  beispiele: string[];
};

export const DEMO_BRANCHEN: Record<BrancheId, DemoChat> = {
  garage: {
    schluessel: "garage",
    firma: "Garage Muster AG",
    beispiele: [
      "Haben Sie nächste Woche einen Termin für den Reifenwechsel?",
      "Was kostet ein kleiner Service?",
      "Mein Auto springt nicht mehr an.",
    ],
  },
  handwerk: {
    schluessel: "handwerk",
    firma: "Muster Sanitär AG",
    beispiele: ["Bei uns tropft es aus der Decke.", "Was kostet ein Boilerservice?", "Kommen Sie auch nach Herisau?"],
  },
  coiffeur: {
    schluessel: "coiffeur",
    firma: "Coiffure Muster",
    beispiele: [
      "Haben Sie am Samstag einen Termin bei Andrea?",
      "Was kostet Schneiden und Färben?",
      "Ich muss meinen Termin absagen.",
    ],
  },
  fahrschule: {
    schluessel: "fahrschule",
    firma: "Fahrschule Muster",
    beispiele: [
      "Was kostet eine Fahrstunde?",
      "Wann ist der nächste VKU?",
      "Was brauche ich für den Lernfahrausweis?",
    ],
  },
  gastro: {
    schluessel: "gastro",
    firma: "Restaurant Muster",
    beispiele: [
      "Haben Sie heute um 19 Uhr einen Tisch für vier?",
      "Haben Sie glutenfreie Gerichte?",
      "Wir planen ein Firmenessen für 30 Personen.",
    ],
  },
  immo: {
    schluessel: "immo",
    firma: "Muster Immobilien AG",
    beispiele: [
      "In der Waschküche läuft Wasser aus.",
      "Ist die 3½-Zimmer-Wohnung noch frei?",
      "Wer ist für meine Liegenschaft zuständig?",
    ],
  },
};

export const CHAT_SEITE = "/chat.html";

export function demoChatAdresse(d: DemoChat): string {
  return `${CHAT_SEITE}?w=${d.schluessel}`;
}
