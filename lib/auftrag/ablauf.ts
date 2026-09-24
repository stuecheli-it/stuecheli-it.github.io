// Beispielanrufe für den Hero, eine pro Branche. Sie laufen nacheinander ab.
// Aus jedem Gespräch wird Schritt für Schritt ein Auftrag, Termin oder eine Meldung.
// Alle Namen, Adressen und Preise sind Beispielwerte.

export type BrancheId = "garage" | "handwerk" | "coiffeur" | "fahrschule" | "gastro" | "immo";

export type Feld = {
  id: string;
  label: string;
  wert: string;
  /** Das Ergebnis des Gesprächs, wird hervorgehoben */
  wichtig?: boolean;
};

export type Sprecher = "Assistent" | "Anrufer";

export type Schritt = {
  wer: Sprecher;
  text: string;
  /** Dauer in Millisekunden */
  dauer: number;
  /** Felder, die während dieses Satzes gefüllt werden, mit Zeitpunkt als Anteil der Dauer */
  felder: Array<{ id: string; bei: number }>;
};

export type Szenario = {
  id: BrancheId;
  tab: string;
  /** Titel der Karte, z.B. «Neuer Termin · Garage Muster AG» */
  titel: string;
  /** Bezeichnung der anrufenden Person im Untertitel */
  anrufer: string;
  felder: Feld[];
  ablauf: Schritt[];
};

export const SZENARIEN: Szenario[] = [
  {
    id: "garage",
    tab: "Garage",
    titel: "Neuer Termin · Garage Muster AG",
    anrufer: "Kunde",
    felder: [
      { id: "kunde", label: "Kunde", wert: "Marco Brunner" },
      { id: "anliegen", label: "Anliegen", wert: "Reifenwechsel" },
      { id: "fahrzeug", label: "Fahrzeug", wert: "VW Golf" },
      { id: "wunsch", label: "Wunschzeit", wert: "Nächste Woche, vormittags" },
      { id: "termin", label: "Termin", wert: "Dienstag, 8.30 Uhr · SMS verschickt", wichtig: true },
    ],
    ablauf: [
      { wer: "Assistent", text: "Garage Muster, guten Tag. Wie kann ich Ihnen helfen?", dauer: 3200, felder: [] },
      {
        wer: "Anrufer",
        text: "Grüezi, Marco Brunner. Ich bräuchte einen Termin für den Reifenwechsel.",
        dauer: 4200,
        felder: [
          { id: "kunde", bei: 0.3 },
          { id: "anliegen", bei: 0.75 },
        ],
      },
      { wer: "Assistent", text: "Gerne. Für welches Fahrzeug, und passt Ihnen eher Vormittag oder Nachmittag?", dauer: 4200, felder: [] },
      {
        wer: "Anrufer",
        text: "Ein VW Golf, am liebsten nächste Woche am Vormittag.",
        dauer: 3600,
        felder: [
          { id: "fahrzeug", bei: 0.25 },
          { id: "wunsch", bei: 0.72 },
        ],
      },
      {
        wer: "Assistent",
        text: "Ich habe Sie für Dienstag um 8.30 Uhr eingetragen. Sie erhalten eine Bestätigung per SMS.",
        dauer: 4600,
        felder: [{ id: "termin", bei: 0.45 }],
      },
    ],
  },
  {
    id: "handwerk",
    tab: "Handwerk",
    titel: "Neuer Auftrag · Muster Sanitär AG",
    anrufer: "Anruferin",
    felder: [
      { id: "anrufer", label: "Anruferin", wert: "Petra Keller" },
      { id: "anliegen", label: "Anliegen", wert: "Boiler liefert kein Warmwasser" },
      { id: "adresse", label: "Adresse", wert: "Hauptstrasse 5, Sissach" },
      { id: "erreichbar", label: "Erreichbar", wert: "Heute ab 14 Uhr" },
      { id: "einschaetzung", label: "Einschätzung", wert: "Dringend · Rückruf heute Nachmittag", wichtig: true },
    ],
    ablauf: [
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
    ],
  },
  {
    id: "coiffeur",
    tab: "Coiffeur",
    titel: "Neuer Termin · Coiffure Muster",
    anrufer: "Kundin",
    felder: [
      { id: "kundin", label: "Kundin", wert: "Laura Meier" },
      { id: "behandlung", label: "Behandlung", wert: "Schneiden und Färben" },
      { id: "bei", label: "Bei", wert: "Andrea" },
      { id: "termin", label: "Termin", wert: "Samstag, 10 Uhr" },
      { id: "hinweis", label: "Hinweis", wert: "Rund 2 Stunden eingeplant", wichtig: true },
    ],
    ablauf: [
      { wer: "Assistent", text: "Coiffure Muster, grüezi. Was darf ich für Sie tun?", dauer: 3200, felder: [] },
      {
        wer: "Anrufer",
        text: "Hallo, Laura Meier. Ich hätte gern einen Termin für Schneiden und Färben.",
        dauer: 4200,
        felder: [
          { id: "kundin", bei: 0.3 },
          { id: "behandlung", bei: 0.78 },
        ],
      },
      {
        wer: "Assistent",
        text: "Am Samstag ist bei Andrea um 10 Uhr noch frei, oder um 14 Uhr bei Luca. Was passt Ihnen?",
        dauer: 4800,
        felder: [],
      },
      { wer: "Anrufer", text: "10 Uhr bei Andrea, gerne.", dauer: 2800, felder: [{ id: "bei", bei: 0.55 }] },
      {
        wer: "Assistent",
        text: "Eingetragen: Samstag um 10 Uhr bei Andrea. Wir planen rund zwei Stunden ein. Bis Samstag!",
        dauer: 4600,
        felder: [
          { id: "termin", bei: 0.3 },
          { id: "hinweis", bei: 0.7 },
        ],
      },
    ],
  },
  {
    id: "fahrschule",
    tab: "Fahrschule",
    titel: "Neue Anmeldung · Fahrschule Muster",
    anrufer: "Anrufer",
    felder: [
      { id: "schueler", label: "Fahrschüler", wert: "Noah Frei" },
      { id: "anliegen", label: "Anliegen", wert: "Einstieg Fahrstunden" },
      { id: "auskunft", label: "Auskunft", wert: "CHF 95 pro Lektion à 45 Min." },
      { id: "ausweis", label: "Ausweis", wert: "Lernfahrausweis vorhanden" },
      { id: "lektion", label: "1. Lektion", wert: "Donnerstag, 17 Uhr", wichtig: true },
    ],
    ablauf: [
      { wer: "Assistent", text: "Fahrschule Muster, guten Tag. Wie kann ich helfen?", dauer: 3000, felder: [] },
      {
        wer: "Anrufer",
        text: "Hallo, Noah Frei. Ich möchte mit Fahrstunden anfangen. Was kostet das?",
        dauer: 4200,
        felder: [
          { id: "schueler", bei: 0.3 },
          { id: "anliegen", bei: 0.7 },
        ],
      },
      {
        wer: "Assistent",
        text: "Eine Lektion à 45 Minuten kostet CHF 95. Haben Sie den Lernfahrausweis schon?",
        dauer: 4400,
        felder: [{ id: "auskunft", bei: 0.45 }],
      },
      { wer: "Anrufer", text: "Ja, seit letzter Woche.", dauer: 2600, felder: [{ id: "ausweis", bei: 0.5 }] },
      {
        wer: "Assistent",
        text: "Super. Ich reserviere Ihnen Donnerstag um 17 Uhr für die erste Lektion.",
        dauer: 4200,
        felder: [{ id: "lektion", bei: 0.5 }],
      },
    ],
  },
  {
    id: "gastro",
    tab: "Gastronomie",
    titel: "Neue Reservation · Restaurant Muster",
    anrufer: "Gast",
    felder: [
      { id: "name", label: "Name", wert: "Familie Schneider" },
      { id: "personen", label: "Personen", wert: "4" },
      { id: "zeit", label: "Zeit", wert: "Heute, 19.45 Uhr" },
      { id: "hinweis", label: "Hinweis", wert: "1× vegetarisch" },
      { id: "status", label: "Status", wert: "Reserviert · Küche informiert", wichtig: true },
    ],
    ablauf: [
      { wer: "Assistent", text: "Restaurant Muster, guten Abend.", dauer: 2600, felder: [] },
      {
        wer: "Anrufer",
        text: "Guten Abend, hier Schneider. Haben Sie heute um 19 Uhr noch einen Tisch für vier?",
        dauer: 4600,
        felder: [
          { id: "name", bei: 0.3 },
          { id: "personen", bei: 0.8 },
        ],
      },
      {
        wer: "Assistent",
        text: "Um 19 Uhr sind wir voll, um 19.45 Uhr hätte ich einen Tisch für vier. Passt das?",
        dauer: 4600,
        felder: [],
      },
      {
        wer: "Anrufer",
        text: "Ja, das geht. Eine Person isst vegetarisch.",
        dauer: 3400,
        felder: [
          { id: "zeit", bei: 0.25 },
          { id: "hinweis", bei: 0.75 },
        ],
      },
      {
        wer: "Assistent",
        text: "Wunderbar, ich habe reserviert, und die Küche weiss Bescheid. Bis später!",
        dauer: 4000,
        felder: [{ id: "status", bei: 0.45 }],
      },
    ],
  },
  {
    id: "immo",
    tab: "Immobilien",
    titel: "Neue Meldung · Muster Immobilien AG",
    anrufer: "Mieter",
    felder: [
      { id: "mieter", label: "Mieter", wert: "Martin Huber" },
      { id: "adresse", label: "Adresse", wert: "Rosenweg 8" },
      { id: "anliegen", label: "Anliegen", wert: "Wasser läuft in der Waschküche aus" },
      { id: "massnahme", label: "Massnahme", wert: "Haupthahn zugedreht" },
      { id: "einschaetzung", label: "Einschätzung", wert: "Notfall · Pikettdienst informiert", wichtig: true },
    ],
    ablauf: [
      { wer: "Assistent", text: "Muster Immobilien, guten Tag. Wie kann ich helfen?", dauer: 3200, felder: [] },
      {
        wer: "Anrufer",
        text: "Martin Huber, Rosenweg 8. In der Waschküche läuft Wasser aus der Maschine.",
        dauer: 4800,
        felder: [
          { id: "mieter", bei: 0.2 },
          { id: "adresse", bei: 0.45 },
          { id: "anliegen", bei: 0.82 },
        ],
      },
      {
        wer: "Assistent",
        text: "Das leite ich sofort an den Pikettdienst weiter. Konnten Sie das Wasser abstellen?",
        dauer: 4400,
        felder: [],
      },
      {
        wer: "Anrufer",
        text: "Ja, den Haupthahn habe ich zugedreht.",
        dauer: 2800,
        felder: [{ id: "massnahme", bei: 0.55 }],
      },
      {
        wer: "Assistent",
        text: "Sehr gut. Der Pikettdienst meldet sich in den nächsten 30 Minuten bei Ihnen.",
        dauer: 4200,
        felder: [{ id: "einschaetzung", bei: 0.45 }],
      },
    ],
  },
];

/** Wie lange der Abschluss («Per Mail gesendet») stehen bleibt, bevor das nächste Beispiel beginnt. */
export const ABSCHLUSS_MS = 3800;
