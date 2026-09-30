// Verbindung zwischen dem Beispielgespräch im Hero und dem Klangkörper im Hintergrund.
// Das Gespräch meldet, wer gerade spricht (bewegt die Kugel) und welche Branche läuft (färbt die Kugel);
// der Klangkörper hört zu, ohne dass beide voneinander wissen.

import type { BrancheId } from "./branchen";

export type Sprecher = "Anrufer" | "Assistent" | "fertig" | null;
export type Stimme = { wer: Sprecher; branche: BrancheId | null };

const EREIGNIS = "stimme";
let zuletzt: Stimme = { wer: null, branche: null };

export function stimmeMelden(wer: Sprecher, branche: BrancheId | null) {
  zuletzt = { wer, branche };
  window.dispatchEvent(new CustomEvent<Stimme>(EREIGNIS, { detail: zuletzt }));
}

/** Ruft `f` bei jeder Änderung auf, sofort auch mit dem aktuellen Stand; gibt die Abmeldung zurück */
export function stimmeHoeren(f: (s: Stimme) => void): () => void {
  const h = (e: Event) => f((e as CustomEvent<Stimme>).detail);
  window.addEventListener(EREIGNIS, h);
  f(zuletzt);
  return () => window.removeEventListener(EREIGNIS, h);
}
