// Merkt sich die Branche, die der Besucher zuletzt selbst gewählt hat (Hero-Chips oder Branchen-Tabs),
// damit der Beispiel-Chat direkt mit deren Beispiel-Firma startet und der Branchen-Abschnitt dieselbe Branche zeigt.
// Automatische Wechsel zählen nicht. Gilt nur für den aktuellen Seitenaufruf.

import type { BrancheId } from "./branchen";

let gewaehlt: BrancheId | undefined;
const zuhoerer = new Set<(id: BrancheId) => void>();

export function brancheWaehlen(id: BrancheId) {
  gewaehlt = id;
  zuhoerer.forEach((f) => f(id));
}

export function gewaehlteBranche(): BrancheId | undefined {
  return gewaehlt;
}

/** Meldet jede neue Wahl; gibt die Abmeldung zurück */
export function brancheBeobachten(f: (id: BrancheId) => void): () => void {
  zuhoerer.add(f);
  return () => {
    zuhoerer.delete(f);
  };
}
