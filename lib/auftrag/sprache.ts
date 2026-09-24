// Simulierter Sprachpegel für die Schallwelle (0 = still, 1 = laut).

/** Glatte Pseudo-Zufallskurve, damit die Silben unregelmässig wirken. */
function valueNoise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const hash = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

/** Rund 4 bis 5 Silben pro Sekunde, dazwischen kurze Wortpausen. */
export function speechEnvelope(seconds: number): number {
  const syllable = Math.pow(Math.max(0, Math.sin(seconds * Math.PI * 2 * 4.4)), 0.6);
  const loudness = 0.45 + 0.55 * valueNoise(seconds * 1.9);
  const wordGate = valueNoise(seconds * 2.3 + 11.7) > 0.28 ? 1 : 0.15;
  return Math.min(1, syllable * loudness * wordGate + 0.08);
}
