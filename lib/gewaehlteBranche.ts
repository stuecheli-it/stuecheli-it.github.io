// Merkt sich die Branche, die der Besucher zuletzt selbst gewählt hat (Hero-Chips oder Branchen-Tabs),
// damit der Beispiel-Chat direkt mit deren Beispiel-Firma startet. Automatische Wechsel zählen nicht.
// Gilt nur für den aktuellen Seitenaufruf.

import type { BrancheId } from "./branchen";

let gewaehlt: BrancheId | undefined;

export function brancheWaehlen(id: BrancheId) {
  gewaehlt = id;
}

export function gewaehlteBranche(): BrancheId | undefined {
  return gewaehlt;
}
