// fonio-Chats der Website. Alle laufen in eigenen Rahmen über public/chat.html
// (fonio erlaubt nur ein Widget pro Seite). Die Widget-IDs stehen dort, die Demo-Chats in lib/demo.ts.
import type { BrancheId } from "./branchen";
import { BRANCHENSEITEN } from "./branchenseiten";
import { CHAT_SEITE } from "./demo";

/**
 * Kontext für den Anfrage-Chat: woher die Anfrage kommt (Plan, Branche).
 * Die Chat-Seite übergibt ihn mit fonio `setContext`; fonio speichert ihn mit dem Gespräch
 * (im Widget-Code als «webchatContext»). Damit der Assistent ihn nutzt, im fonio-Prompt darauf verweisen.
 */
export type AnfrageKontext = {
  /** Kurzform für die Anzeige, z.B. «Telefon KI Solo» */
  thema: string;
  produkt?: string;
  plan?: string;
  abrechnung?: string;
  preis?: string;
  branche?: string;
  /** Website des Betriebs, z.B. aus der Live-Demo */
  website?: string;
  /** Wo auf der Website angefragt wurde */
  quelle?: string;
};

/** Kontext für «Unverbindlich anfragen» aus der Kopfzeile und dem Handy-Menü, auf Branchenseiten mit Branche */
export function kopfAnfrage(branche?: BrancheId): AnfrageKontext {
  const s = branche ? BRANCHENSEITEN.find((x) => x.id === branche) : undefined;
  return s
    ? { thema: `Telefon KI für ${s.mehrzahl}`, branche: s.mehrzahl, quelle: `Kopfzeile, Branchenseite ${s.kurz}` }
    : { thema: "Allgemeine Anfrage", quelle: "Kopfzeile" };
}

/** Anfrage-Chat hinter «Unverbindlich anfragen» (fonio-Assistent «Webseite - Anfragen») */
export function anfrageChatAdresse(k: AnfrageKontext): string {
  const p = new URLSearchParams({ w: "anfrage" });
  for (const [schluessel, wert] of Object.entries(k)) if (wert) p.set(schluessel, wert);
  return `${CHAT_SEITE}?${p.toString()}`;
}
