// GLSL-Shader für «Stimme wird Auftrag».
// Die Kamera arbeitet in CSS-Pixeln wie das Seitenlayout (x nach rechts, y nach unten),
// damit Partikel direkt zu DOM-Elementen der Auftragskarte fliegen können.
// Farben sind rohe sRGB-Werte der Marke (Türkis #3ff0c9 → Blau #3a8cff → Violett #6b45ff).

const VERLAUF = /* glsl */ `
vec3 verlauf(float x, vec3 c1, vec3 c2, vec3 c3) {
  return x < 0.48 ? mix(c1, c2, x / 0.48) : mix(c2, c3, (x - 0.48) / 0.52);
}
`;

// ---------- Schallwelle aus Partikeln ----------

export const welleVertex = /* glsl */ `
uniform float uZeit;
uniform float uPegel;     // 0..1 Lautstärke
uniform float uLinks;     // Wellenbereich in CSS-Pixeln
uniform float uBreite;
uniform float uMitteY;
uniform float uAmp;       // maximale Auslenkung in CSS-Pixeln
uniform float uPixelRatio;
uniform float uMotion;
attribute float aX;       // 0..1 entlang der Welle
attribute float aStrang;  // 0..1, mehrere Stränge übereinander
attribute float aSeed;
varying float vX;
varying float vHell;

void main() {
  float x = aX;
  float t = uZeit * uMotion;
  float s = aStrang;
  // Fenster: die Welle läuft an den Enden weich aus
  float fenster = pow(sin(3.14159265 * x), 1.4);
  float y = sin(x * 11.0 + t * 3.1 + s * 2.1) * 0.55
          + sin(x * 23.0 - t * 4.3 + s * 5.3) * 0.28
          + sin(x * 41.0 + t * 6.7 + s * 1.7) * 0.17;
  float amp = uAmp * (0.07 + uPegel * 0.93) * fenster * (0.45 + 0.55 * s);
  float streuung = (aSeed - 0.5) * (2.0 + uPegel * 7.0) * fenster;
  vec2 p = vec2(uLinks + x * uBreite, uMitteY + y * amp + streuung);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  gl_PointSize = (1.1 + aSeed * 1.7 + uPegel * 1.3) * uPixelRatio;
  vX = x;
  vHell = 0.35 + 0.65 * fenster;
}
`;

export const welleFragment = /* glsl */ `
${VERLAUF}
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uAnrufer;
uniform float uSprecher;  // 0 = Assistent (Markenverlauf), 1 = Anruferin (hell)
varying float vX;
varying float vHell;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, r) * (0.3 + 0.55 * vHell);
  if (a <= 0.003) discard;
  vec3 col = mix(verlauf(vX, uC1, uC2, uC3), uAnrufer, uSprecher * 0.8);
  gl_FragColor = vec4(col * a, a);
}
`;

// ---------- Fliegende Partikel: von der Welle in ein Feld der Auftragskarte ----------

export const flugVertex = /* glsl */ `
uniform float uZeit;
uniform float uPixelRatio;
attribute vec2 aStart;
attribute vec2 aKontroll;
attribute vec2 aZiel;
attribute float aStartZeit;
attribute float aDauer;
attribute float aSeed;
attribute float aSchweif; // 0 = Kopf des Kometen, 1 = Ende des Schweifs
varying float vA;
varying float vSeed;
void main() {
  float t = (uZeit - aStartZeit) / aDauer;
  if (t < 0.0 || t > 1.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vA = 0.0;
    vSeed = aSeed;
    return;
  }
  float e = t * t * (3.0 - 2.0 * t);
  // Quadratische Bézierkurve: Bogen von der Welle hinunter in die Karte
  vec2 p = mix(mix(aStart, aKontroll, e), mix(aKontroll, aZiel, e), e);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  gl_PointSize = (2.8 + aSeed * 3.4) * (1.0 - 0.4 * t) * (1.0 - 0.6 * aSchweif) * uPixelRatio;
  vA = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.84, 1.0, t)) * (1.0 - 0.7 * aSchweif);
  vSeed = aSeed;
}
`;

export const flugFragment = /* glsl */ `
${VERLAUF}
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
varying float vA;
varying float vSeed;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float kern = smoothstep(1.0, 0.0, r);
  float a = min(1.0, kern * 0.95 + smoothstep(0.45, 0.0, r) * 0.3) * vA;
  if (a <= 0.003) discard;
  // kräftige Markenfarbe mit leicht aufgehelltem Kern, gut sichtbar auf Dunkel und auf der weissen Karte
  vec3 col = mix(verlauf(vSeed, uC1, uC2, uC3), vec3(1.0), smoothstep(0.3, 0.0, r) * 0.22);
  gl_FragColor = vec4(col * a, a);
}
`;
