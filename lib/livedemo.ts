// Live-Demo mit der Website des Besuchers, über den Demo-Setup-Link aus dem fonio-Partner-Dashboard.
// fonio liest den Parameter «website», erstellt daraus einen Assistenten und ruft den Besucher zum Testen an.
// Der Code «ac» ordnet den Besucher uns als Partner zu (fonio speichert ihn 30 Tage im Browser).
// Die Setup-Seite lässt sich nicht einbetten (X-Frame-Options SAMEORIGIN), darum öffnet sie in einem neuen Tab.

import type { BrancheId } from "./branchen";

export const LIVE_DEMO_ADRESSE = "https://app.fonio.ai/demo/setup";

/**
 * Allgemeine Demo ohne Website: dorthin führt auch fonios «Ohne Website fortfahren» (Route /demo mit id=default).
 * Die Parameter bleiben dabei erhalten, auch der Partner-Code; mit isTrial blendet fonio «Experten buchen» aus.
 */
const LIVE_DEMO_OHNE_WEBSITE = "https://app.fonio.ai/demo";

/** Feste Parameter des Partner-Links */
export const LIVE_DEMO_PARAMETER = { isTrial: "true", ac: "N2YCC7PJEK", language: "de" } as const;

/** Partner-Link: mit Website die Setup-Seite, die daraus einen Assistenten erstellt, ohne Website die allgemeine Demo */
export function liveDemoLink(website?: string): string {
  const p = new URLSearchParams(LIVE_DEMO_PARAMETER);
  if (website) {
    p.set("website", website);
    return `${LIVE_DEMO_ADRESSE}?${p.toString()}`;
  }
  p.set("id", "default");
  p.set("productType", "voice");
  return `${LIVE_DEMO_OHNE_WEBSITE}?${p.toString()}`;
}

/**
 * Macht aus der Eingabe eine Domain wie «garage-muster.ch» (ohne https://, www bleibt, Umlaute als Punycode).
 * Liefert null, wenn es keine gültige Website-Adresse ist.
 */
export function websiteAusEingabe(eingabe: string): string | null {
  const roh = eingabe.trim().replace(/^https?:\/\//i, "");
  if (!roh || /\s/.test(roh)) return null;
  try {
    const host = new URL(`https://${roh}`).hostname.toLowerCase();
    return /^([a-z0-9-]+\.)+[a-z]{2,}$/.test(host) ? host : null;
  } catch {
    return null;
  }
}

/** Beispiel-Adresse im Feld, passend zur Branchenseite */
export const LIVE_DEMO_PLATZHALTER: Record<BrancheId, string> = {
  garage: "ihre-garage.ch",
  handwerk: "ihr-handwerksbetrieb.ch",
  coiffeur: "ihr-salon.ch",
  fahrschule: "ihre-fahrschule.ch",
  gastro: "ihr-restaurant.ch",
  immo: "ihre-verwaltung.ch",
};

// ---------- Nachfassen: gestartete Demo merken, damit die Website beim Zurückkommen die Einrichtung anbieten kann ----------

export type LiveDemoStart = { website?: string; branche?: BrancheId; zeit: number; erledigt?: boolean };

const SPEICHER = "stuecheli-live-demo";

/** Merkt die gestartete Demo für diesen Tab (sessionStorage; fehlt der Speicher, gibt es eben kein Nachfassen) */
export function liveDemoMerken(start: { website?: string; branche?: BrancheId }) {
  try {
    sessionStorage.setItem(SPEICHER, JSON.stringify({ ...start, zeit: Date.now() }));
  } catch {
    // Speicher gesperrt, z.B. im privaten Modus
  }
}

export function liveDemoLesen(): LiveDemoStart | null {
  try {
    const roh = sessionStorage.getItem(SPEICHER);
    return roh ? (JSON.parse(roh) as LiveDemoStart) : null;
  } catch {
    return null;
  }
}

/** Nachfassen erledigt (angefragt oder «Später»): in diesem Tab nicht mehr zeigen */
export function liveDemoErledigt() {
  const start = liveDemoLesen();
  if (!start) return;
  try {
    sessionStorage.setItem(SPEICHER, JSON.stringify({ ...start, erledigt: true }));
  } catch {
    // egal
  }
}
