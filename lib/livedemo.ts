// Live-Demo mit der Website des Besuchers, über den Demo-Setup-Link aus dem fonio-Partner-Dashboard.
// fonio liest den Parameter «website», erstellt daraus einen Assistenten und ruft den Besucher zum Testen an.
// Der Code «ac» ordnet den Besucher uns als Partner zu (fonio speichert ihn 30 Tage im Browser).
// Die Setup-Seite lässt sich nicht einbetten (X-Frame-Options SAMEORIGIN), darum öffnet sie in einem neuen Tab.

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
