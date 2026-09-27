// fonio-Webchat des Assistenten "Stücheli IT Consulting".
// Erlaubte Websites im fonio-Dashboard: https://stuecheli-it.github.io und http://localhost:8087
export const FONIO_WIDGET_ID = "ad8e8193-6a15-45e9-9278-73b8d186a7d9";

// Anfrage-Chat hinter «Unverbindlich anfragen» (Widget 52aac962-8a9d-4f4f-9640-688f3b595eac).
// fonio erlaubt nur ein Widget pro Seite, darum läuft er in einer eigenen Seite im Rahmen.
// Die Widget-ID steht in public/anfrage-chat.html. Erlaubte Websites im fonio-Dashboard
// für dieses Widget: https://stuecheli-it.github.io und http://localhost:8087
export const ANFRAGE_CHAT_SEITE = "/anfrage-chat.html";

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
  /** Wo auf der Website angefragt wurde */
  quelle?: string;
};

export function anfrageChatAdresse(k: AnfrageKontext): string {
  const p = new URLSearchParams();
  for (const [schluessel, wert] of Object.entries(k)) if (wert) p.set(schluessel, wert);
  return `${ANFRAGE_CHAT_SEITE}?${p.toString()}`;
}

type FonioWebchat = Partial<Record<"open" | "show" | "toggle" | "close" | "hide", () => void>>;

declare global {
  interface Window {
    fonio?: { webchat?: FonioWebchat };
  }
}

/** Öffnet den Chat, sobald das Widget geladen ist. */
export function chatOeffnen() {
  const wc = window.fonio?.webchat;
  const fn = wc?.open ?? wc?.show ?? wc?.toggle;
  if (fn) {
    fn();
    return;
  }
  alert("Der Chat öffnet sich über die Sprechblase unten rechts. Falls sie nicht erscheint, laden Sie die Seite bitte neu.");
}
