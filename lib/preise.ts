// Abopreise und Paketinhalte laut fonio.ai/de/preise in CHF, abgeglichen am 28.09.2026.
// Jahrespreise sind Beträge pro Jahr (nicht pro Monat).
// Die Einrichtung durch Stücheli IT Consulting wird auf Anfrage offeriert (keine Beträge auf der Website).

export type ProduktId = "telefon" | "whatsapp" | "webchat";

export type Detailgruppe = { titel: string; punkte: string[] };

export type Plan = {
  name: string;
  fuer: string;
  monat: number;
  jahr: number;
  beliebt?: boolean;
  setup: string;
  punkte: string[];
  details: Detailgruppe[];
};

export type Produkt = {
  id: ProduktId;
  label: string;
  plaene: Plan[];
};

export const PREISSTAND = "28.09.2026";

// Zusatzkosten laut fonio-Preisliste (CHF, exkl. MWST)
const TELEFON_ZUSATZ = [
  "CHF 15 pro 100 zusätzliche Minuten",
  "CHF 7 pro Monat je weitere Rufnummer",
  "CHF 20 pro Monat je 1'000 weitere Kontakte",
];
const WEITERE_ZUSATZKOSTEN = "übrige gemäss aktueller fonio-Preisliste";

export const PRODUKTE: Produkt[] = [
  {
    id: "telefon",
    label: "Telefon KI",
    plaene: [
      {
        name: "Solo",
        beliebt: true,
        fuer: "Für 1 bis 20 Anrufe pro Tag",
        monat: 119,
        jahr: 1188,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: [
          "1'000 Gesprächsminuten inklusive",
          "1 Rufnummer inklusive",
          "Unbegrenzte Assistenten, 1 Benutzer",
          "Terminplaner, 120+ Stimmen, 60+ Sprachen",
        ],
        details: [
          { titel: "Nutzung", punkte: ["1'000 Gesprächsminuten inklusive", "1'000 Kontakte inklusive", "1 Anruf gleichzeitig", "1 Rufnummer inklusive", "1 Benutzer, 1 Kontoverbindung", "Unbegrenzte Assistenten"] },
          { titel: "Stimme & Sprache", punkte: ["120+ Stimmen", "60+ Sprachen", "Sprechgeschwindigkeit, Empfindlichkeit und Kreativität anpassbar", "Hintergrundgeräusche zuschaltbar"] },
          { titel: "Fähigkeiten", punkte: ["Terminplaner", "Unternehmensinfos direkt von Ihrer Website", "Selbstlernende Wissensdatenbank", "Anrufweiterleitung", "Internetsuche und Fachbegriffe", "DTMF-Codes senden"] },
          { titel: "Plattform & Support", punkte: ["Anrufaufzeichnung, auf Wunsch mit automatischem Löschen", "Prompt-Vorlagen und Einfachmodus", "Gratis Audio-Test", "E-Mail-Support, Onboarding Academy, Community-Zugang"] },
          { titel: "Zusatzkosten", punkte: TELEFON_ZUSATZ },
        ],
      },
      {
        name: "Team",
        fuer: "Für 20 bis 100 Anrufe pro Tag",
        monat: 359,
        jahr: 3588,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: [
          "3'600 Gesprächsminuten inklusive",
          "Bis 3 gleichzeitige Anrufe, 3 Rufnummern",
          "Eigener SIP-Trunk, Outbound-Anrufe",
          "Alles aus Solo",
        ],
        details: [
          { titel: "Nutzung", punkte: ["3'600 Gesprächsminuten inklusive", "3'000 Kontakte inklusive", "Bis 3 Anrufe gleichzeitig", "3 Rufnummern inklusive", "Unbegrenzte Benutzer, 3 Kontoverbindungen", "Unbegrenzte Assistenten"] },
          { titel: "Zusätzlich zu Solo", punkte: ["Eigener SIP-Trunk", "Outbound-Anrufe und Kampagnen (zu Verbindungskosten)", "Priorisierter Support"] },
          { titel: "Fähigkeiten", punkte: ["Alle Fähigkeiten aus Solo: Terminplaner, Wissensdatenbank, Anrufweiterleitung, Internetsuche, 120+ Stimmen, 60+ Sprachen"] },
          { titel: "Zusatzkosten", punkte: [...TELEFON_ZUSATZ, "CHF 5 pro Monat je weitere Kontoverbindung"] },
        ],
      },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp KI",
    plaene: [
      {
        name: "Solo",
        beliebt: true,
        fuer: "Bis 100 Konversationen pro Monat",
        monat: 69,
        jahr: 696,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: ["100 Konversationen pro Monat", "1 WhatsApp-Nummer inklusive", "Chat-Übergabe an Menschen", "Automatischer Terminplaner"],
        details: [
          { titel: "Nutzung", punkte: ["100 Konversationen pro Monat", "1 WhatsApp-Nummer inklusive", "Unbegrenzte Chatbots", "1 Benutzer"] },
          { titel: "Funktionen", punkte: ["Chat-Übergabe an Menschen", "Automatischer Terminplaner", "Antworten aus Ihrer Wissensdatenbank"] },
          { titel: "Zusatzkosten", punkte: ["CHF 19 pro Monat je weitere WhatsApp-Nummer", WEITERE_ZUSATZKOSTEN] },
        ],
      },
      {
        name: "Team",
        fuer: "Bis 500 Konversationen pro Monat",
        monat: 249,
        jahr: 2496,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: ["500 Konversationen pro Monat", "3 WhatsApp-Nummern", "Unbegrenzte Benutzer", "Alles aus Solo"],
        details: [
          { titel: "Nutzung", punkte: ["500 Konversationen pro Monat", "3 WhatsApp-Nummern inklusive", "Unbegrenzte Chatbots und Benutzer"] },
          { titel: "Zusätzlich zu Solo", punkte: ["Unterstützung bei der Einrichtung durch fonio", "Alle Funktionen aus Solo: Chat-Übergabe, Terminplaner, Wissensdatenbank"] },
          { titel: "Zusatzkosten", punkte: ["CHF 19 pro Monat je weitere WhatsApp-Nummer", WEITERE_ZUSATZKOSTEN] },
        ],
      },
    ],
  },
  {
    id: "webchat",
    label: "Web-Chat",
    plaene: [
      {
        name: "Solo",
        beliebt: true,
        fuer: "Bis 100 Konversationen pro Monat",
        monat: 49,
        jahr: 504,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: [
          "100 Konversationen pro Monat",
          "Unbegrenzte Chatbots, 1 Benutzer",
          "Antworten aus Ihrem Firmenwissen",
          "Im Chat steht «Bereitgestellt von fonio.ai»",
        ],
        details: [
          { titel: "Nutzung", punkte: ["100 Konversationen pro Monat", "Unbegrenzte Chatbots", "1 Benutzer", "Im Chat erscheint der Hinweis «Bereitgestellt von fonio.ai»"] },
          { titel: "Unsere Leistung", punkte: ["Einrichtung mit Ihrem Firmenwissen", "Test auf einer Kopie Ihrer Website vor dem Livegang"] },
          { titel: "Zusatzkosten", punkte: ["Gemäss aktueller fonio-Preisliste"] },
        ],
      },
      {
        name: "Team",
        fuer: "Bis 400 Konversationen pro Monat",
        monat: 149,
        jahr: 1500,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: [
          "400 Konversationen pro Monat",
          "Ohne fonio-Branding, im Design Ihrer Marke",
          "Übergabe an Menschen, Kalender-Anbindung",
          "Alles aus Solo",
        ],
        details: [
          { titel: "Nutzung", punkte: ["400 Konversationen pro Monat", "Unbegrenzte Chatbots und Benutzer", "1 Kalender-Anbindung inklusive"] },
          { titel: "Zusätzlich zu Solo", punkte: ["Kein fonio-Branding", "PDFs und Bilder hochladen", "Übergabe an Menschen", "Reporting mit Download und Auswertung"] },
          { titel: "Unsere Leistung", punkte: ["Einrichtung mit Ihrem Firmenwissen", "Gestaltung im Design Ihrer Marke", "Test auf einer Kopie Ihrer Website vor dem Livegang"] },
          { titel: "Zusatzkosten", punkte: ["CHF 5 pro Monat je weitere Kalender-Anbindung", WEITERE_ZUSATZKOSTEN] },
        ],
      },
    ],
  },
];

// ---------- Hilfsfunktionen ----------

/** Schweizer Schreibweise mit Hochkomma: 1'188, auf Wunsch mit zwei Rappen-Stellen. */
export function chf(betrag: number, mitRappen = false): string {
  const fest = mitRappen ? (Math.round(betrag * 20) / 20).toFixed(2) : String(Math.round(betrag));
  const [ganz, rappen] = fest.split(".");
  const mitHochkomma = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return "CHF " + mitHochkomma + (rappen ? "." + rappen : "");
}

/** Monatsbetrag bei Jahresabo, auf 5 Rappen gerundet. */
export function proMonatImJahresabo(plan: Plan): string {
  const wert = plan.jahr / 12;
  return chf(wert, !Number.isInteger(wert));
}

export function ersparnisProJahr(plan: Plan): number {
  return plan.monat * 12 - plan.jahr;
}

/** Ersparnis pro Monat im Jahresabo, wie fonio sie anzeigt («Spare CHF 20») */
export function ersparnisProMonat(plan: Plan): string {
  const wert = plan.monat - plan.jahr / 12;
  return chf(wert, !Number.isInteger(wert));
}

export function rabattProzent(plan: Plan): number {
  return Math.round((1 - plan.jahr / (plan.monat * 12)) * 100);
}

/** Beschriftung für den Jahres-Schalter, z.B. "−17 %" oder "bis −16 %". */
export function rabattLabel(produkt: Produkt): string {
  const werte = produkt.plaene.map(rabattProzent);
  const max = Math.max(...werte);
  const min = Math.min(...werte);
  return (min === max ? "" : "bis ") + "−" + max + " %";
}
