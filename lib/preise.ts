// Abopreise laut fonio-Listenpreisen in CHF, Stand 15.09.2026.
// Jahrespreise sind Beträge pro Jahr (nicht pro Monat).
// Einrichtungspreise sind die Ansätze von Stücheli IT Consulting.

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

export const PREISSTAND = "15.09.2026";

const ZUSATZKOSTEN_HINWEIS = "Zusätzliche Minuten, Nummern und Kontakte gemäss aktueller fonio-Preisliste";

export const PRODUKTE: Produkt[] = [
  {
    id: "telefon",
    label: "Telefon KI",
    plaene: [
      {
        name: "Solo",
        fuer: "Für 1 bis 20 Anrufe pro Tag",
        monat: 119,
        jahr: 1188,
        setup: "Einmalige Einrichtung durch uns: CHF 1'290",
        punkte: [
          "1'000 Gesprächsminuten inklusive",
          "1 Rufnummer inklusive",
          "Unbegrenzte Assistenten, 1 Benutzer",
          "Terminplaner, 120+ Stimmen, 60+ Sprachen",
        ],
        details: [
          { titel: "Nutzung", punkte: ["1'000 Gesprächsminuten inklusive", "1 Anruf gleichzeitig", "1 Rufnummer inklusive", "1 Benutzer, 1 Kontoverbindung", "Unbegrenzte Assistenten"] },
          { titel: "Stimme & Sprache", punkte: ["120+ Stimmen", "60+ Sprachen", "Sprechgeschwindigkeit, Empfindlichkeit und Kreativität anpassbar", "Hintergrundgeräusche zuschaltbar"] },
          { titel: "Fähigkeiten", punkte: ["Terminplaner", "Unternehmensinfos direkt von Ihrer Website", "Selbstlernende Wissensdatenbank", "Anrufweiterleitung", "Internetsuche und Fachbegriffe", "DTMF-Codes senden"] },
          { titel: "Plattform & Support", punkte: ["Anrufaufzeichnung, auf Wunsch mit automatischem Löschen", "Prompt-Vorlagen und Einfachmodus", "Gratis Audio-Test", "E-Mail-Support, Onboarding Academy, Community-Zugang"] },
          { titel: "Zusatzkosten", punkte: [ZUSATZKOSTEN_HINWEIS] },
        ],
      },
      {
        name: "Team",
        fuer: "Für 20 bis 100 Anrufe pro Tag",
        beliebt: true,
        monat: 359,
        jahr: 3588,
        setup: "Einmalige Einrichtung durch uns: CHF 1'890",
        punkte: [
          "3'600 Gesprächsminuten inklusive",
          "Bis 3 gleichzeitige Anrufe, 3 Rufnummern",
          "Eigener SIP-Trunk, Outbound-Anrufe",
          "Alles aus Solo",
        ],
        details: [
          { titel: "Nutzung", punkte: ["3'600 Gesprächsminuten inklusive", "Bis 3 Anrufe gleichzeitig", "3 Rufnummern inklusive", "Unbegrenzte Benutzer, 3 Kontoverbindungen", "Unbegrenzte Assistenten"] },
          { titel: "Zusätzlich zu Solo", punkte: ["Eigener SIP-Trunk", "Outbound-Anrufe und Kampagnen (zu Verbindungskosten)", "Priorisierter Support"] },
          { titel: "Fähigkeiten", punkte: ["Alle Fähigkeiten aus Solo: Terminplaner, Wissensdatenbank, Anrufweiterleitung, Internetsuche, 120+ Stimmen, 60+ Sprachen"] },
          { titel: "Zusatzkosten", punkte: [ZUSATZKOSTEN_HINWEIS] },
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
        fuer: "Bis 100 Konversationen pro Monat",
        monat: 69,
        jahr: 696,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: ["100 Konversationen pro Monat", "1 WhatsApp-Nummer inklusive", "Chat-Übergabe an Menschen", "Automatischer Terminplaner"],
        details: [
          { titel: "Nutzung", punkte: ["100 Konversationen pro Monat", "1 WhatsApp-Nummer inklusive", "Unbegrenzte Chatbots", "1 Benutzer"] },
          { titel: "Funktionen", punkte: ["Chat-Übergabe an Menschen", "Automatischer Terminplaner", "Antworten aus Ihrer Wissensdatenbank"] },
          { titel: "Zusatzkosten", punkte: [ZUSATZKOSTEN_HINWEIS] },
        ],
      },
      {
        name: "Team",
        fuer: "Bis 500 Konversationen pro Monat",
        beliebt: true,
        monat: 249,
        jahr: 2496,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: ["500 Konversationen pro Monat", "3 WhatsApp-Nummern", "Unbegrenzte Benutzer", "Alles aus Solo"],
        details: [
          { titel: "Nutzung", punkte: ["500 Konversationen pro Monat", "3 WhatsApp-Nummern inklusive", "Unbegrenzte Chatbots und Benutzer"] },
          { titel: "Zusätzlich zu Solo", punkte: ["Unterstützung bei der Einrichtung durch fonio", "Alle Funktionen aus Solo: Chat-Übergabe, Terminplaner, Wissensdatenbank"] },
          { titel: "Zusatzkosten", punkte: [ZUSATZKOSTEN_HINWEIS] },
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
        fuer: "Chat-Assistent für Ihre Website",
        monat: 49,
        jahr: 499,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: ["Antworten aus Ihrem Firmenwissen", "Im Design Ihrer Marke", "Getestet vor dem Livegang"],
        details: [
          { titel: "Unsere Leistung", punkte: ["Einrichtung mit Ihrem Firmenwissen", "Gestaltung im Design Ihrer Marke", "Test auf einer Kopie Ihrer Website vor dem Livegang"] },
          { titel: "Paketumfang", punkte: ["Anzahl Chats und Benutzer gemäss aktueller fonio-Preisliste. Wir beraten Sie gerne, welches Paket passt."] },
        ],
      },
      {
        name: "Team",
        fuer: "Chat-Assistent für Ihre Website, für Teams",
        beliebt: true,
        monat: 139,
        jahr: 1399,
        setup: "Einrichtung durch uns: auf Anfrage",
        punkte: ["Antworten aus Ihrem Firmenwissen", "Im Design Ihrer Marke", "Getestet vor dem Livegang"],
        details: [
          { titel: "Unsere Leistung", punkte: ["Einrichtung mit Ihrem Firmenwissen", "Gestaltung im Design Ihrer Marke", "Test auf einer Kopie Ihrer Website vor dem Livegang"] },
          { titel: "Paketumfang", punkte: ["Anzahl Chats und Benutzer gemäss aktueller fonio-Preisliste. Wir beraten Sie gerne, welches Paket passt."] },
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
