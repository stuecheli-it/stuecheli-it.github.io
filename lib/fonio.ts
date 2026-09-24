// fonio-Webchat des Assistenten "Stücheli IT Consulting".
// Erlaubte Websites im fonio-Dashboard: https://stuecheli-it.github.io und http://localhost:8087
export const FONIO_WIDGET_ID = "ad8e8193-6a15-45e9-9278-73b8d186a7d9";

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
