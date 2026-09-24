// Beispielgespräche und Nutzen je Branche (Entwürfe, CHF 95 bei der Fahrschule ist ein Beispielwert).

export type BrancheId = "garage" | "handwerk" | "coiffeur" | "fahrschule" | "gastro" | "immo";

/** Linienmotiv der Illustration im Orb-Stil (Koordinaten im 120er-Raster). */
export type Motiv =
  | { art: "pfad"; d: string }
  | { art: "kreis"; cx: number; cy: number; r: number }
  | { art: "rechteck"; x: number; y: number; w: number; h: number; rx: number };

export type Branche = {
  id: BrancheId;
  tab: string;
  titel: string;
  gespraech: Array<{ wer: "anrufer" | "ki"; text: string }>;
  vorteile: Array<{ fett: string; rest: string }>;
  motiv: Motiv[];
};

export const BRANCHEN: Branche[] = [
  {
    id: "garage",
    tab: "Garage",
    titel: "Garage",
    gespraech: [
      { wer: "anrufer", text: "Grüezi, ich bräuchte einen Termin für den Reifenwechsel. Geht das nächste Woche?" },
      { wer: "ki", text: "Gerne. Für welches Fahrzeug, und passt Ihnen eher Vormittag oder Nachmittag?" },
      { wer: "anrufer", text: "Ein VW Golf, Vormittag wäre gut." },
      { wer: "ki", text: "Ich habe Sie für Dienstag um 8.30 Uhr eingetragen. Sie erhalten eine Bestätigung per SMS." },
    ],
    vorteile: [
      { fett: "Termine für Service und Reifenwechsel", rest: " direkt entgegennehmen, auch wenn alle in der Werkstatt sind." },
      { fett: "Öffnungszeiten, Anfahrt und Ersatzwagen", rest: " beantworten, ohne dass jemand den Schraubenschlüssel weglegt." },
      { fett: "Pannen und Dringendes", rest: " erkennen und sofort an Sie weiterleiten." },
    ],
    motiv: [
      { art: "pfad", d: "M28 72v-8l8-16h48l8 16v8z" },
      { art: "pfad", d: "M28 64h64" },
      { art: "kreis", cx: 44, cy: 76, r: 6 },
      { art: "kreis", cx: 76, cy: 76, r: 6 },
      { art: "pfad", d: "M52 48h16" },
    ],
  },
  {
    id: "handwerk",
    tab: "Handwerk",
    titel: "Handwerk",
    gespraech: [
      { wer: "anrufer", text: "Bei uns tropft es aus der Decke. Können Sie heute noch jemanden schicken?" },
      { wer: "ki", text: "Das klingt dringend, ich gebe das sofort weiter. Wo befindet sich die Liegenschaft?" },
      { wer: "anrufer", text: "Teufener Strasse 40 in St. Gallen." },
      { wer: "ki", text: "Notiert. Das Team ruft Sie in den nächsten Minuten zurück." },
    ],
    vorteile: [
      { fett: "Notfälle erkennen", rest: " und sofort ans Team oder den Pikettdienst weiterleiten." },
      { fett: "Offertanfragen", rest: " mit allen nötigen Angaben aufnehmen, damit Sie nur noch rechnen müssen." },
      { fett: "Rückrufe sammeln,", rest: " während Sie auf der Baustelle sind." },
    ],
    motiv: [
      { art: "kreis", cx: 42, cy: 42, r: 9 },
      { art: "pfad", d: "M48 48l30 30" },
      { art: "pfad", d: "M78 42L48 72" },
      { art: "pfad", d: "M70 34l16 16" },
    ],
  },
  {
    id: "coiffeur",
    tab: "Coiffeur",
    titel: "Coiffeur",
    gespraech: [
      { wer: "anrufer", text: "Hallo, ich hätte gern einen Termin für Schneiden und Färben am Samstag." },
      { wer: "ki", text: "Samstag ist bei Andrea um 10 Uhr noch frei, oder um 14 Uhr bei Luca. Was passt Ihnen?" },
      { wer: "anrufer", text: "10 Uhr bei Andrea." },
      { wer: "ki", text: "Eingetragen. Bis Samstag!" },
    ],
    vorteile: [
      { fett: "Termine buchen,", rest: " auch während Sie gerade schneiden." },
      { fett: "Preise und Behandlungen", rest: " erklären, freundlich und immer gleich." },
      { fett: "Absagen und Verschiebungen", rest: " aufnehmen, damit keine Lücke unbemerkt bleibt." },
    ],
    motiv: [
      { art: "kreis", cx: 44, cy: 44, r: 8 },
      { art: "kreis", cx: 44, cy: 76, r: 8 },
      { art: "pfad", d: "M50 50l34 26" },
      { art: "pfad", d: "M50 70l34-26" },
    ],
  },
  {
    id: "fahrschule",
    tab: "Fahrschule",
    titel: "Fahrschule",
    gespraech: [
      { wer: "anrufer", text: "Ich möchte mit Fahrstunden anfangen. Was kostet das bei Ihnen?" },
      { wer: "ki", text: "Eine Lektion à 45 Minuten kostet CHF 95. Haben Sie den Lernfahrausweis schon?" },
      { wer: "anrufer", text: "Ja, seit letzter Woche." },
      { wer: "ki", text: "Super. Wann passt Ihnen eine erste Fahrstunde? Ich schaue nach einem freien Termin." },
    ],
    vorteile: [
      { fett: "Preise, Ablauf und VKU-Kurse", rest: " erklären, so oft wie nötig." },
      { fett: "Neue Fahrschüler", rest: " direkt für die erste Lektion einbuchen." },
      { fett: "Sie fahren Lektionen,", rest: " ohne vom Telefon unterbrochen zu werden." },
    ],
    motiv: [
      { art: "rechteck", x: 34, y: 34, w: 52, h: 52, rx: 10 },
      { art: "pfad", d: "M52 48v26h18" },
    ],
  },
  {
    id: "gastro",
    tab: "Gastronomie",
    titel: "Gastronomie",
    gespraech: [
      { wer: "anrufer", text: "Guten Abend, haben Sie heute um 19 Uhr noch einen Tisch für vier?" },
      { wer: "ki", text: "Um 19 Uhr sind wir voll, um 19.45 Uhr hätte ich einen Tisch für vier. Passt das?" },
      { wer: "anrufer", text: "Ja, das geht." },
      { wer: "ki", text: "Gerne. Auf welchen Namen darf ich reservieren?" },
    ],
    vorteile: [
      { fett: "Reservationen annehmen,", rest: " während der Service läuft." },
      { fett: "Öffnungszeiten, Menü und Allergene", rest: " beantworten, ohne den Gast am Tisch warten zu lassen." },
      { fett: "Gruppen- und Anlassanfragen", rest: " aufnehmen und an Sie weiterleiten." },
    ],
    motiv: [
      { art: "pfad", d: "M32 74a28 28 0 0 1 56 0z" },
      { art: "pfad", d: "M26 82h68" },
      { art: "pfad", d: "M60 46v-6" },
      { art: "kreis", cx: 60, cy: 38, r: 3 },
    ],
  },
  {
    id: "immo",
    tab: "Immobilien",
    titel: "Immobilienverwaltung",
    gespraech: [
      { wer: "anrufer", text: "Ich habe eine Frage zur Nebenkostenabrechnung, Wohnung im 3. Stock, Rosenweg 8." },
      { wer: "ki", text: "Gerne. Ich nehme Ihr Anliegen auf, die zuständige Bewirtschafterin meldet sich bei Ihnen. Wie erreichen wir Sie am besten?" },
      { wer: "anrufer", text: "Per Mail an m.keller@beispiel.ch." },
      { wer: "ki", text: "Notiert. Sie hören innert eines Arbeitstages von uns." },
    ],
    vorteile: [
      { fett: "Mieteranliegen aufnehmen", rest: " und der richtigen Person zuordnen." },
      { fett: "Schadenmeldungen", rest: " sofort an den Pikettdienst weiterleiten." },
      { fett: "Besichtigungsanfragen", rest: " sammeln, statt sie auf dem Anrufbeantworter zu verlieren." },
    ],
    motiv: [
      { art: "pfad", d: "M34 62l26-22 26 22" },
      { art: "pfad", d: "M40 58v26h40V58" },
      { art: "pfad", d: "M54 84V70h12v14" },
    ],
  },
];
