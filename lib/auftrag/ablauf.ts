// Beispielanruf für den Hero: Aus dem Gespräch wird Schritt für Schritt ein Auftrag.
// Alle Namen und Angaben sind Beispielwerte.

export type FeldId = "anrufer" | "anliegen" | "adresse" | "erreichbar" | "einschaetzung";

export type Feld = { id: FeldId; label: string; wert: string };

export const FELDER: Feld[] = [
  { id: "anrufer", label: "Anruferin", wert: "Petra Keller" },
  { id: "anliegen", label: "Anliegen", wert: "Boiler liefert kein Warmwasser" },
  { id: "adresse", label: "Adresse", wert: "Hauptstrasse 5, Sissach" },
  { id: "erreichbar", label: "Erreichbar", wert: "Heute ab 14 Uhr" },
  { id: "einschaetzung", label: "Einschätzung", wert: "Dringend · Rückruf heute Nachmittag" },
];

export type Sprecher = "Assistent" | "Anrufer";

export type Schritt = {
  wer: Sprecher;
  text: string;
  /** Dauer in Millisekunden */
  dauer: number;
  /** Felder, die während dieses Satzes gefüllt werden, mit Zeitpunkt als Anteil der Dauer */
  felder: Array<{ id: FeldId; bei: number }>;
};

export const ABLAUF: Schritt[] = [
  { wer: "Assistent", text: "Muster Sanitär, guten Tag. Wie kann ich Ihnen helfen?", dauer: 3200, felder: [] },
  {
    wer: "Anrufer",
    text: "Grüezi, hier ist Petra Keller. Unser Boiler macht kein warmes Wasser mehr.",
    dauer: 4400,
    felder: [
      { id: "anrufer", bei: 0.3 },
      { id: "anliegen", bei: 0.72 },
    ],
  },
  {
    wer: "Assistent",
    text: "Das nehme ich gleich auf. Wie lautet Ihre Adresse, und wann sind Sie erreichbar?",
    dauer: 4200,
    felder: [],
  },
  {
    wer: "Anrufer",
    text: "Hauptstrasse 5 in Sissach, ab 14 Uhr.",
    dauer: 3400,
    felder: [
      { id: "adresse", bei: 0.3 },
      { id: "erreichbar", bei: 0.72 },
    ],
  },
  {
    wer: "Assistent",
    text: "Notiert. Herr Muster ruft Sie heute Nachmittag zurück. Auf Wiederhören!",
    dauer: 4200,
    felder: [{ id: "einschaetzung", bei: 0.45 }],
  },
];

/** Wie lange «Per Mail gesendet» stehen bleibt, bevor alles von vorn beginnt. */
export const ABSCHLUSS_MS = 4200;
