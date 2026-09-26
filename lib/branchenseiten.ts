// Inhalte der Branchenseiten unter /branchen/<slug>/ (V2.1).
// Beispielgespräch, Vorteile und Illustration kommen aus lib/branchen.ts, die animierte Szene aus lib/auftrag/ablauf.ts.
// Aussagen zu Anbindungen an fremde Systeme bewusst vorsichtig: das klären wir im Erstgespräch.

import type { BrancheId } from "./branchen";

export type Situation = { titel: string; text: string };
export type Anruf = { titel: string; zitat: string; loesung: string };
export type Frage = { frage: string; antwort: string };

export type BranchenSeite = {
  id: BrancheId;
  slug: string;
  /** Mehrzahl für «für …», z.B. «Garagen» */
  mehrzahl: string;
  /** Kurzname für Links, z.B. «Garage» */
  kurz: string;
  /** «bei einer Garage», «in einem Coiffeursalon» … */
  beiEiner: string;
  metaTitel: string;
  metaBeschreibung: string;
  /** Erste Zeile der Überschrift, zweite Zeile ist immer «Ihr Telefon nimmt ab.» */
  titel: string;
  lead: string;
  situationen: Situation[];
  anrufe: Anruf[];
  fragen: Frage[];
};

export const BRANCHENSEITEN: BranchenSeite[] = [
  {
    id: "garage",
    slug: "garage",
    mehrzahl: "Garagen",
    kurz: "Garage",
    beiEiner: "bei einer Garage",
    metaTitel: "KI-Telefonassistent für Garagen",
    metaBeschreibung:
      "Termine für Service und Reifenwechsel, Pannen sofort gemeldet, Auskunft auch nach Feierabend: der KI-Telefonassistent für Garagen in der Deutschschweiz.",
    titel: "Sie schrauben.",
    lead:
      "Der KI-Telefonassistent nimmt Anrufe für Ihre Garage entgegen, vergibt Termine für Service und Reifenwechsel und meldet Ihnen Pannen sofort. Sie arbeiten weiter, kein Anruf geht verloren.",
    situationen: [
      { titel: "Die Hände voller Öl", text: "Das Telefon klingelt, während Sie unter dem Auto liegen. Bis Sie dran sind, hat der Kunde aufgelegt." },
      { titel: "Reifenwechsel-Saison", text: "Im Frühling und im Herbst rufen alle gleichzeitig an. Die Werkstatt ist voll, das Telefon auch." },
      { titel: "Nach Feierabend", text: "Viele melden sich abends oder am Samstag. Einen Anrufbeantworter bespricht kaum jemand, mit einem Assistenten reden die meisten." },
    ],
    anrufe: [
      { titel: "Service und Reifenwechsel", zitat: "Ich bräuchte einen Termin für den Reifenwechsel.", loesung: "Schlägt freie Zeiten vor und trägt den Termin ein." },
      { titel: "MFK-Vorbereitung", zitat: "Mein Auto muss zur MFK. Können Sie es vorher anschauen?", loesung: "Nimmt Fahrzeug, Frist und Wunschtermin auf." },
      { titel: "Panne", zitat: "Mein Auto springt nicht mehr an.", loesung: "Erkennt die Dringlichkeit und leitet sofort an Sie weiter." },
      { titel: "Offertanfrage", zitat: "Was kostet ein grosser Service beim Golf?", loesung: "Nimmt Modell und Wunsch auf, Sie melden sich mit dem Preis." },
      { titel: "Rückfragen zum Auftrag", zitat: "Ist mein Wagen schon fertig?", loesung: "Notiert die Frage und meldet sie Ihnen mit Rückrufnummer." },
      { titel: "Zeiten und Ersatzwagen", zitat: "Haben Sie einen Ersatzwagen?", loesung: "Beantwortet Öffnungszeiten, Anfahrt und Angebot." },
    ],
    fragen: [
      {
        frage: "Kann der Assistent direkt Termine eintragen?",
        antwort:
          "Ja. Mit dem Terminplaner von fonio schlägt er freie Zeiten vor und trägt den Termin ein. Ob sich Ihr heutiger Werkstattkalender anbinden lässt, klären wir im Erstgespräch.",
      },
      {
        frage: "Was passiert bei einer Panne?",
        antwort:
          "Er erkennt dringende Anliegen und leitet den Anruf an Ihre Nummer weiter oder meldet ihn sofort. Wie das genau laufen soll, legen Sie fest.",
      },
    ],
  },
  {
    id: "handwerk",
    slug: "handwerk",
    mehrzahl: "Handwerksbetriebe",
    kurz: "Handwerk",
    beiEiner: "bei einem Handwerksbetrieb",
    metaTitel: "KI-Telefonassistent für Handwerksbetriebe",
    metaBeschreibung:
      "Notfälle erkennen, Offertanfragen vollständig aufnehmen, Rückrufe sammeln: der KI-Telefonassistent für Sanitär, Heizung, Elektro und alle Handwerksbetriebe.",
    titel: "Sie sind auf der Baustelle.",
    lead:
      "Der KI-Telefonassistent nimmt Anrufe für Ihren Betrieb entgegen, erkennt Notfälle, nimmt Offertanfragen vollständig auf und sammelt Rückrufe. Sie arbeiten weiter und wissen trotzdem, was los ist.",
    situationen: [
      { titel: "Auf dem Dach, im Keller, im Lärm", text: "Wer arbeitet, kann nicht abnehmen. Jeder verpasste Anruf kann ein verlorener Auftrag sein." },
      { titel: "Notfälle gehen unter", text: "Ein Wasserschaden wartet nicht bis zum Feierabend. Ein Anrufbeantworter erkennt nicht, was dringend ist." },
      { titel: "Rückrufe ohne Angaben", text: "Wer erst alles nachfragen muss, verliert Zeit. Besser, die Angaben liegen schon beim ersten Rückruf vor." },
    ],
    anrufe: [
      { titel: "Notfall", zitat: "Bei uns tropft es aus der Decke.", loesung: "Erkennt die Dringlichkeit und leitet sofort weiter." },
      { titel: "Offertanfrage", zitat: "Was kostet ein neues Badezimmer?", loesung: "Nimmt Art der Arbeit, Adresse und Zeitraum auf." },
      { titel: "Service und Wartung", zitat: "Die Heizungswartung ist wieder fällig.", loesung: "Nimmt den Auftrag mit Wunschtermin auf." },
      { titel: "Terminfragen", zitat: "Wann kommt Ihr Monteur morgen?", loesung: "Notiert die Frage und meldet sie dem Team." },
      { titel: "Rückrufwunsch", zitat: "Können Sie mich heute noch zurückrufen?", loesung: "Sammelt Name, Nummer und Anliegen für Sie." },
      { titel: "Allgemeine Auskunft", zitat: "Arbeiten Sie auch in Herisau?", loesung: "Beantwortet Einsatzgebiet, Leistungen und Zeiten." },
    ],
    fragen: [
      {
        frage: "Wie erkennt der Assistent einen Notfall?",
        antwort:
          "Sie legen fest, was als dringend gilt, zum Beispiel Wasser, kein Warmwasser oder Stromausfall. In diesen Fällen leitet er den Anruf weiter oder meldet ihn sofort an Sie oder den Pikettdienst.",
      },
      {
        frage: "Welche Angaben nimmt er bei einer Offertanfrage auf?",
        antwort:
          "Genau die, die Sie brauchen: Art der Arbeit, Adresse, gewünschter Zeitraum und Kontakt. Die Liste stimmen wir gemeinsam ab.",
      },
    ],
  },
  {
    id: "coiffeur",
    slug: "coiffeur",
    mehrzahl: "Coiffeursalons",
    kurz: "Coiffeur",
    beiEiner: "in einem Coiffeursalon",
    metaTitel: "KI-Telefonassistent für Coiffeursalons",
    metaBeschreibung:
      "Termine buchen, Preise erklären, Absagen aufnehmen, während Sie schneiden: der KI-Telefonassistent für Coiffeursalons in der Deutschschweiz.",
    titel: "Sie schneiden.",
    lead:
      "Der KI-Telefonassistent nimmt Terminwünsche entgegen, erklärt Preise und Behandlungen und nimmt Absagen auf. Sie bleiben bei Ihrer Kundin.",
    situationen: [
      { titel: "Die Schere in der Hand", text: "Mitten im Schnitt klingelt es. Abnehmen heisst, die Kundin im Stuhl warten zu lassen." },
      { titel: "Lücken im Kalender", text: "Eine Absage, die niemand hört, wird zum leeren Termin." },
      { titel: "Immer die gleichen Fragen", text: "Was kostet Färben? Haben Sie am Samstag offen? Der Assistent beantwortet es freundlich, jedes Mal." },
    ],
    anrufe: [
      { titel: "Termin buchen", zitat: "Haben Sie am Samstag noch etwas frei?", loesung: "Schlägt freie Zeiten vor und bucht den Termin." },
      { titel: "Verschieben und absagen", zitat: "Ich muss meinen Termin morgen absagen.", loesung: "Nimmt die Absage auf und meldet sie sofort." },
      { titel: "Preise", zitat: "Was kostet Schneiden und Färben?", loesung: "Nennt Ihre Preise so, wie Sie sie hinterlegen." },
      { titel: "Wunsch-Coiffeuse", zitat: "Ist Andrea nächste Woche da?", loesung: "Berücksichtigt, bei wem der Termin sein soll." },
      { titel: "Öffnungszeiten", zitat: "Haben Sie am Montag offen?", loesung: "Beantwortet Zeiten, Anfahrt und Parkplätze." },
      { titel: "Gutscheine und Produkte", zitat: "Kann ich bei Ihnen einen Gutschein kaufen?", loesung: "Gibt Auskunft und nimmt Wünsche für Sie auf." },
    ],
    fragen: [
      {
        frage: "Kann er Termine bei einer bestimmten Mitarbeiterin buchen?",
        antwort:
          "Ja, wenn die Kalender dafür eingerichtet sind. Welche Lösung zu Ihrem heutigen Buchungssystem passt, klären wir im Erstgespräch.",
      },
      {
        frage: "Was passiert bei einer Absage?",
        antwort: "Er nimmt die Absage auf und meldet sie Ihnen sofort. So können Sie die Lücke noch füllen.",
      },
    ],
  },
  {
    id: "fahrschule",
    slug: "fahrschule",
    mehrzahl: "Fahrschulen",
    kurz: "Fahrschule",
    beiEiner: "bei einer Fahrschule",
    metaTitel: "KI-Telefonassistent für Fahrschulen",
    metaBeschreibung:
      "Preise und Ablauf erklären, neue Fahrschüler aufnehmen, die erste Lektion vereinbaren: der KI-Telefonassistent für Fahrschulen in der Deutschschweiz.",
    titel: "Sie fahren Lektionen.",
    lead:
      "Der KI-Telefonassistent erklärt Preise und Ablauf, nimmt neue Fahrschülerinnen und Fahrschüler auf und vereinbart die erste Lektion. Sie konzentrieren sich auf die Strasse.",
    situationen: [
      { titel: "Im Auto kein Telefon", text: "Während der Lektion abnehmen geht nicht. Zurückrufen zwischen zwei Lektionen ist Stress." },
      { titel: "Interessenten vergleichen", text: "Wer eine Fahrschule sucht, ruft mehrere an. Wer zuerst Auskunft gibt, gewinnt den Fahrschüler." },
      { titel: "Immer dieselben Fragen", text: "Kosten, VKU, Ablauf bis zur Prüfung: Der Assistent erklärt es geduldig, so oft wie nötig." },
    ],
    anrufe: [
      { titel: "Neuanmeldung", zitat: "Ich möchte mit Fahrstunden anfangen.", loesung: "Nimmt die Angaben auf und vereinbart die erste Lektion." },
      { titel: "Preise", zitat: "Was kostet bei Ihnen eine Lektion?", loesung: "Nennt Ihre Preise und Pakete." },
      { titel: "Kurse", zitat: "Wann findet der nächste VKU statt?", loesung: "Nennt die Daten, die Sie hinterlegen." },
      { titel: "Lektion verschieben", zitat: "Ich kann morgen nicht zur Fahrstunde.", loesung: "Nimmt die Verschiebung auf und meldet sie Ihnen." },
      { titel: "Ablauf", zitat: "Was brauche ich für den Lernfahrausweis?", loesung: "Erklärt den Ablauf so, wie Sie ihn hinterlegen." },
      { titel: "Weitere Kategorien", zitat: "Bieten Sie auch Motorradkurse an?", loesung: "Gibt Auskunft zu Ihrem ganzen Angebot." },
    ],
    fragen: [
      {
        frage: "Kann er Lektionen verschieben?",
        antwort:
          "Er nimmt Verschiebungen und Absagen auf und meldet sie Ihnen. Mit dem Terminplaner von fonio kann er auch direkt freie Zeiten anbieten.",
      },
      {
        frage: "Weiss er, was eine Lektion bei uns kostet?",
        antwort: "Ja. Wir hinterlegen Ihre Preise, Kurse und Abläufe. Ändert sich etwas, passen wir es an.",
      },
    ],
  },
  {
    id: "gastro",
    slug: "gastronomie",
    mehrzahl: "Restaurants",
    kurz: "Gastronomie",
    beiEiner: "in einem Restaurant",
    metaTitel: "KI-Telefonassistent für Restaurants",
    metaBeschreibung:
      "Reservationen annehmen, Fragen zu Menü und Allergenen beantworten, Gruppenanfragen weiterleiten, auch mitten im Service: der KI-Telefonassistent für die Gastronomie.",
    titel: "Sie servieren.",
    lead:
      "Der KI-Telefonassistent nimmt Reservationen entgegen, beantwortet Fragen zu Öffnungszeiten, Menü und Allergenen und leitet Gruppenanfragen an Sie weiter. Auch mitten im Service.",
    situationen: [
      { titel: "Die Service-Spitze", text: "Um 19 Uhr sind alle Hände voll. Genau dann rufen die Gäste für heute Abend an." },
      { titel: "Ruhetag und Nacht", text: "Viele reservieren ausserhalb der Öffnungszeiten. Ohne Antwort reservieren sie woanders." },
      { titel: "Fragen, die aufhalten", text: "Gibt es vegane Gerichte? Hat es Parkplätze? Der Assistent weiss es." },
    ],
    anrufe: [
      { titel: "Reservation", zitat: "Haben Sie heute um 19 Uhr einen Tisch für vier?", loesung: "Nimmt die Reservation mit allen Angaben auf." },
      { titel: "Änderung und Absage", zitat: "Wir kommen zu sechst statt zu viert.", loesung: "Nimmt die Änderung auf und meldet sie sofort." },
      { titel: "Menü und Allergene", zitat: "Haben Sie glutenfreie Gerichte?", loesung: "Antwortet aus Ihren Angaben, im Zweifel verweist er ans Team." },
      { titel: "Gruppen und Anlässe", zitat: "Wir planen ein Firmenessen für 30 Personen.", loesung: "Nimmt Datum, Grösse und Wünsche auf und leitet weiter." },
      { titel: "Zeiten und Anfahrt", zitat: "Haben Sie am Sonntag offen?", loesung: "Beantwortet Öffnungszeiten, Anfahrt und Parkplätze." },
      { titel: "Take-away", zitat: "Kann man bei Ihnen auch etwas mitnehmen?", loesung: "Gibt Auskunft so, wie Sie es hinterlegen." },
    ],
    fragen: [
      {
        frage: "Kann er Reservationen in unser System eintragen?",
        antwort:
          "Er nimmt Reservationen mit allen Angaben auf und meldet sie Ihnen sofort. Ob eine direkte Anbindung an Ihr Reservationssystem möglich ist, klären wir im Erstgespräch.",
      },
      {
        frage: "Gibt er auch Auskunft zu Allergenen?",
        antwort: "Ja, wenn Sie die Angaben hinterlegen. Bei Unsicherheit verweist er an Ihr Team, statt zu raten.",
      },
    ],
  },
  {
    id: "immo",
    slug: "immobilienverwaltung",
    mehrzahl: "Immobilienverwaltungen",
    kurz: "Immobilien",
    beiEiner: "bei einer Immobilienverwaltung",
    metaTitel: "KI-Telefonassistent für Immobilienverwaltungen",
    metaBeschreibung:
      "Mieteranliegen aufnehmen und zuordnen, Schadenmeldungen sofort an den Pikettdienst: der KI-Telefonassistent für Immobilienverwaltungen, rund um die Uhr.",
    titel: "Sie sind bei der Wohnungsabnahme.",
    lead:
      "Der KI-Telefonassistent nimmt Mieteranliegen auf, ordnet sie der richtigen Person zu und leitet Schadenmeldungen sofort an den Pikettdienst weiter. Rund um die Uhr.",
    situationen: [
      { titel: "Termine ausser Haus", text: "Besichtigungen, Abnahmen, Eigentümerversammlungen: Das Telefon klingelt trotzdem." },
      { titel: "Schäden kennen keine Bürozeiten", text: "Ein Wasserrohrbruch am Sonntag muss sofort beim Pikettdienst landen, nicht auf dem Anrufbeantworter." },
      { titel: "Viele Anliegen, viele Zuständige", text: "Nebenkosten, Reparaturen, Kündigungen: Jedes Anliegen soll bei der richtigen Person ankommen." },
    ],
    anrufe: [
      { titel: "Schadenmeldung", zitat: "In der Waschküche läuft Wasser aus.", loesung: "Erkennt den Notfall und leitet an den Pikettdienst weiter." },
      { titel: "Reparatur", zitat: "Der Geschirrspüler ist defekt.", loesung: "Nimmt Wohnung, Gerät und Erreichbarkeit auf." },
      { titel: "Nebenkosten", zitat: "Ich habe eine Frage zur Abrechnung.", loesung: "Nimmt die Frage auf und ordnet sie zu." },
      { titel: "Besichtigung", zitat: "Ist die 3½-Zimmer-Wohnung noch frei?", loesung: "Sammelt Interessenten mit Kontakt und Wunschtermin." },
      { titel: "Kündigung und Umzug", zitat: "Ich möchte meine Wohnung kündigen.", loesung: "Nimmt das Anliegen auf und leitet es weiter." },
      { titel: "Zuständigkeit", zitat: "Wer ist für unsere Liegenschaft zuständig?", loesung: "Nennt die zuständige Person, wie Sie es hinterlegen." },
    ],
    fragen: [
      {
        frage: "Wie gelangt eine Meldung zur richtigen Person?",
        antwort:
          "Wir legen fest, wie Anliegen zugeordnet werden, zum Beispiel nach Liegenschaft oder Thema. Die Zusammenfassung enthält diese Zuordnung, damit sie ohne Umweg bei der richtigen Person landet.",
      },
      {
        frage: "Was passiert bei einem Notfall in der Nacht?",
        antwort:
          "Er erkennt Schäden wie Wasser, Feuer oder Stromausfall und leitet den Anruf an Ihren Pikettdienst weiter. Alles andere liegt am Morgen zusammengefasst bei Ihnen.",
      },
    ],
  },
];

export function seiteFuer(slug: string): BranchenSeite | undefined {
  return BRANCHENSEITEN.find((s) => s.slug === slug);
}

export function pfadFuer(id: BrancheId): string {
  const s = BRANCHENSEITEN.find((x) => x.id === id);
  return s ? `/branchen/${s.slug}/` : "/#branchen";
}
