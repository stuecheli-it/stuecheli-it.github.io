// Der Klangkörper und der Sternenhimmel im Hero (Three.js, ein Canvas so gross wie der Hero, seit 01.10.2026;
// vorher fest hinter der ganzen Seite). Alle Lagen in CSS-Pixeln relativ zum Canvas.
// - Die Kugel aus Lichtpunkten gehört zum Hero: Sie sitzt dort, wo der Hero sie hinsetzt, und scrollt mit ihm weg.
//   Sie spricht ruhig mit (atmet mit der Stimme) und trägt die Farben der laufenden Branche.
// - Der Sternenhimmel liegt hinter der ganzen Seite: gedämpfte Punkte, die langsam treiben, beim Scrollen in
//   mehreren Ebenen mitwandern und der Maus leicht ausweichen. Seit dem 30.09.2026 ruhiger (Wunsch des Inhabers):
//   keine Druckwelle beim Klick, weniger Sterne, auf dem Handy ohne Dauerschleife nach dem Hero.
// - Auf dem Handy (gestapeltes Layout) steht statt der Kugel die Schallwelle aus Punkten von Website 2.2
//   (Wunsch des Inhabers, 01.10.2026: die kleine Kugel wirkte dort fehl am Platz).

import * as THREE from "three";
import type { BrancheId } from "../branchen";

export type Sprecher = "Anrufer" | "Assistent" | "fertig" | null;

type Ton = [number, number, number];
/** Zwei Töne pro Branche (Grundton, Glanz); der Sprecher bewegt die Kugel, färbt sie aber nicht */
const FARBEN: Record<BrancheId, [Ton, Ton]> = {
  garage: [[1.0, 0.52, 0.34], [1.0, 0.72, 0.3]],
  handwerk: [[1.0, 0.7, 0.28], [1.0, 0.88, 0.55]],
  coiffeur: [[0.95, 0.45, 0.75], [1.0, 0.7, 0.88]],
  fahrschule: [[0.55, 0.48, 1.0], [0.8, 0.62, 1.0]],
  gastro: [[0.3, 0.89, 0.65], [0.72, 0.95, 0.6]],
  immo: [[0.35, 0.6, 1.0], [0.62, 0.85, 1.0]],
};

type Optionen = { motion: boolean; lowPower: boolean };

const KUGEL_VERTEX = /* glsl */ `
  attribute float aZufall;
  uniform float uZeit;
  uniform float uPegel;
  uniform float uPunkt;
  uniform vec3 uFarbeA;
  uniform vec3 uFarbeB;
  varying vec3 vFarbe;
  varying float vAlpha;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float rauschen(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                  mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
    return n * 2.0 - 1.0;
  }

  void main() {
    vec3 p = position;
    // Die Kugel atmet und spricht, ruhig: leichtes Rauschen entlang der Normalen, etwas stärker mit dem Pegel
    float n = rauschen(p * 1.6 + vec3(uZeit * 0.25, uZeit * 0.15, 0.0));
    float n2 = rauschen(p * 4.0 - vec3(0.0, uZeit * 0.9, uZeit * 0.6));
    p *= 1.0 + n * (0.04 + uPegel * 0.08) + n2 * uPegel * 0.03;

    vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPunkt * (0.6 + aZufall * 0.9) * (1.0 + uPegel * 0.3) * (15.0 / -mv.z);

    // Zwei Töne der laufenden Branche, verteilt nach Höhe
    float h = clamp(p.y * 0.25 + 0.5, 0.0, 1.0);
    vec3 farbe = mix(uFarbeA, uFarbeB, clamp(h * 0.8 + n * 0.2, 0.0, 1.0));
    farbe += vec3(1.0, 0.85, 0.7) * uPegel * 0.1 * aZufall;
    vFarbe = farbe;
    vAlpha = 0.55 + aZufall * 0.45;
  }
`;

const PUNKT_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uDeckkraft;
  varying vec3 vFarbe;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float kern = smoothstep(0.5, 0.0, r);
    float hof = kern * kern;
    gl_FragColor = vec4(vFarbe * (0.55 + hof * 0.8), hof * vAlpha * uDeckkraft * 0.65);
  }
`;

// Sterne direkt in Bildschirmkoordinaten: x/y von -1 bis 1, z = Tiefe (0 fern, 1 nah)
const STERNE_VERTEX = /* glsl */ `
  attribute vec3 aStern;
  attribute vec3 aFarbe;
  attribute float aPhase;
  uniform float uZeit;
  uniform float uScroll;
  uniform float uSeite;
  uniform float uPunkt;
  uniform vec2 uMaus;
  uniform float uMausKraft;
  varying vec3 vFarbe;
  varying float vAlpha;

  void main() {
    float tiefe = aStern.z;
    // Langsames Treiben und Wandern beim Scrollen, nahe Sterne schneller (Parallaxe); am Rand wieder einsetzen
    vec2 p = aStern.xy;
    p.x += uZeit * (0.004 + tiefe * 0.01);
    p.y += uZeit * 0.003 + uScroll * (0.15 + tiefe * 0.85);
    p = mod(p + 1.0, 2.0) - 1.0;

    // Seitenverhältnis berücksichtigen, damit Kräfte rund wirken
    vec2 q = p * vec2(uSeite, 1.0);
    vec2 zurMaus = q - uMaus * vec2(uSeite, 1.0);
    float nah = exp(-dot(zurMaus, zurMaus) * 18.0) * uMausKraft;
    q += normalize(zurMaus + 0.0001) * nah * 0.05 * (0.4 + tiefe);

    gl_Position = vec4(q / vec2(uSeite, 1.0), 0.0, 1.0);

    float funkeln = 0.75 + 0.25 * sin(uZeit * (0.5 + aPhase * 1.4) + aPhase * 40.0);
    gl_PointSize = uPunkt * (0.8 + tiefe * 2.2) * (1.0 + nah * 0.5);
    vFarbe = aFarbe + vec3(1.0, 0.8, 0.6) * nah * 0.3;
    vAlpha = (0.25 + tiefe * 0.75) * funkeln;
  }
`;

// Schallwelle aus Punkten (aus Website 2.2): mehrere Stränge, an den Enden weich auslaufend.
// Lage in CSS-Pixeln des Fensters, umgerechnet direkt in Bildschirmkoordinaten wie die Sterne.
const WELLE_VERTEX = /* glsl */ `
  attribute float aX;
  attribute float aStrang;
  attribute float aSeed;
  uniform float uZeit;
  uniform float uPegel;
  uniform vec4 uFlaeche;   // links, oben, Breite, Höhe in CSS-Pixeln
  uniform vec2 uBild;      // Fenstergrösse in CSS-Pixeln
  uniform float uPixelRatio;
  uniform vec3 uFarbeA;
  uniform vec3 uFarbeB;
  uniform float uSprecher; // 0 Assistent, 1 anrufende Person
  varying vec3 vFarbe;
  varying float vAlpha;

  void main() {
    float x = aX;
    float t = uZeit;
    float s = aStrang;
    float fenster = pow(sin(3.14159265 * x), 1.4);
    float y = sin(x * 11.0 + t * 3.1 + s * 2.1) * 0.55
            + sin(x * 23.0 - t * 4.3 + s * 5.3) * 0.28
            + sin(x * 41.0 + t * 6.7 + s * 1.7) * 0.17;
    float amp = uFlaeche.w * 0.5 * (0.07 + uPegel * 0.93) * fenster * (0.45 + 0.55 * s);
    float streuung = (aSeed - 0.5) * (2.0 + uPegel * 7.0) * fenster;
    vec2 p = vec2(uFlaeche.x + x * uFlaeche.z, uFlaeche.y + uFlaeche.w * 0.5 + y * amp + streuung);
    gl_Position = vec4(p.x / uBild.x * 2.0 - 1.0, 1.0 - p.y / uBild.y * 2.0, 0.0, 1.0);
    gl_PointSize = (1.1 + aSeed * 1.7 + uPegel * 1.3) * uPixelRatio;
    // Farben der laufenden Branche entlang der Welle; spricht die anrufende Person, wird sie heller
    vFarbe = mix(mix(uFarbeA, uFarbeB, x), vec3(1.0, 0.92, 0.85), uSprecher * 0.55);
    // An den Enden liegen alle Stränge übereinander: dort fast durchsichtig, sonst wird der Rand grell
    vAlpha = 0.04 + 0.8 * fenster;
  }
`;

const WELLE_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vFarbe;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, r) * vAlpha;
    if (a <= 0.003) discard;
    gl_FragColor = vec4(vFarbe, a);
  }
`;

/** Gleichmässig verteilte Punkte auf einer Kugel (Fibonacci-Spirale) */
function kugelPunkte(n: number, radius: number): Float32Array {
  const a = new Float32Array(n * 3);
  const gold = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = gold * i;
    const tiefe = radius * (0.96 + Math.random() * 0.06);
    a.set([Math.cos(t) * r * tiefe, y * tiefe, Math.sin(t) * r * tiefe], i * 3);
  }
  return a;
}

export class Klangkoerper {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  private kugel: THREE.Points;
  private kugelMat: THREE.ShaderMaterial;
  private hof: THREE.Mesh;
  private hofMat: THREE.ShaderMaterial;
  private sterne: THREE.Points;
  private sterneMat: THREE.ShaderMaterial;
  private welle: THREE.Points;
  private welleMat: THREE.ShaderMaterial;
  private welleSichtbar = false;
  private sprecherWert = 0;
  private opts: Optionen;
  private bild = 0;
  private laeuft = false;
  private zuletzt = 0;
  private zeit = 0;

  private pegel = 0;
  /** Farbe der Kugel: zwei Töne pro Branche, wechseln langsam und nur beim Branchenwechsel */
  private farbeA = new THREE.Color(...FARBEN.garage[0]);
  private farbeB = new THREE.Color(...FARBEN.garage[1]);
  private zielA = new THREE.Color(...FARBEN.garage[0]);
  private zielB = new THREE.Color(...FARBEN.garage[1]);
  private sprecher: Sprecher = null;
  private silbe = 0;
  private maus = new THREE.Vector2(0, 0);
  private mausKraft = 0;
  private scroll = 0;
  private kugelSichtbar = true;
  private sterneDeck = 0.4;
  private zielSterneDeck = 0.4;
  /** Grösse des Canvas in CSS-Pixeln */
  private w = 1;
  private h = 1;
  /** Auf dem Handy ruht die Schleife, sobald die Kugel aus dem Bild ist; gezeichnet wird dann nur beim Scrollen */
  private schlaeft = false;

  constructor(canvas: HTMLCanvasElement, opts: Optionen) {
    this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: opts.lowPower ? "low-power" : "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);

    // ---------- Sternenhimmel ----------
    const anzahl = opts.lowPower ? 500 : 1200;
    const sterne = new Float32Array(anzahl * 3);
    const farben = new Float32Array(anzahl * 3);
    const phasen = new Float32Array(anzahl);
    const palette = [
      [0.95, 0.93, 1.0],
      [0.55, 0.95, 0.8],
      [1.0, 0.8, 0.55],
      [0.75, 0.7, 1.0],
    ];
    for (let i = 0; i < anzahl; i++) {
      // Viele ferne, wenige nahe Sterne
      sterne.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.pow(Math.random(), 2.6)], i * 3);
      const f = palette[Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * 3)];
      farben.set(f, i * 3);
      phasen[i] = Math.random();
    }
    const sterneGeo = new THREE.BufferGeometry();
    sterneGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(anzahl * 3), 3));
    sterneGeo.setAttribute("aStern", new THREE.BufferAttribute(sterne, 3));
    sterneGeo.setAttribute("aFarbe", new THREE.BufferAttribute(farben, 3));
    sterneGeo.setAttribute("aPhase", new THREE.BufferAttribute(phasen, 1));
    this.sterneMat = new THREE.ShaderMaterial({
      vertexShader: STERNE_VERTEX,
      fragmentShader: PUNKT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uZeit: { value: 0 },
        uScroll: { value: 0 },
        uSeite: { value: 1 },
        uPunkt: { value: 2 * this.renderer.getPixelRatio() },
        uMaus: { value: new THREE.Vector2(9, 9) },
        uMausKraft: { value: 0 },
        uDeckkraft: { value: 0.4 },
      },
    });
    this.sterne = new THREE.Points(sterneGeo, this.sterneMat);
    this.sterne.frustumCulled = false;
    this.sterne.renderOrder = -1;
    this.scene.add(this.sterne);

    // ---------- Leuchtender Kern hinter der Kugel ----------
    this.hofMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uFarbe: { value: new THREE.Color(1, 0.42, 0.24) }, uStaerke: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader:
        "uniform vec3 uFarbe; uniform float uStaerke; varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0; float g = exp(-r * r * 5.0) * 0.55 + exp(-r * r * 40.0) * 0.35; gl_FragColor = vec4(uFarbe, clamp(g * uStaerke, 0.0, 1.0)); }",
    });
    this.hof = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), this.hofMat);
    this.scene.add(this.hof);

    // ---------- Kugel ----------
    const n = opts.lowPower ? 9000 : 22000;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(kugelPunkte(n, 2.6), 3));
    const zufall = new Float32Array(n);
    for (let i = 0; i < n; i++) zufall[i] = Math.random();
    geo.setAttribute("aZufall", new THREE.BufferAttribute(zufall, 1));
    this.kugelMat = new THREE.ShaderMaterial({
      vertexShader: KUGEL_VERTEX,
      fragmentShader: PUNKT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uZeit: { value: 0 },
        uPegel: { value: 0 },
        uPunkt: { value: opts.lowPower ? 3.2 : 2.6 },
        uFarbeA: { value: this.farbeA },
        uFarbeB: { value: this.farbeB },
        uDeckkraft: { value: 1 },
      },
    });
    this.kugel = new THREE.Points(geo, this.kugelMat);
    this.kugel.frustumCulled = false;
    this.scene.add(this.kugel);

    // ---------- Schallwelle (Handy) ----------
    const straenge = 7;
    const proStrang = opts.lowPower ? 220 : 400;
    const wn = straenge * proStrang;
    const aX = new Float32Array(wn);
    const aStrang = new Float32Array(wn);
    const aSeed = new Float32Array(wn);
    for (let st = 0; st < straenge; st++) {
      for (let i = 0; i < proStrang; i++) {
        const k = st * proStrang + i;
        aX[k] = (i + Math.random()) / proStrang;
        aStrang[k] = st / (straenge - 1);
        aSeed[k] = Math.random();
      }
    }
    const wGeo = new THREE.BufferGeometry();
    wGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(wn * 3), 3));
    wGeo.setAttribute("aX", new THREE.BufferAttribute(aX, 1));
    wGeo.setAttribute("aStrang", new THREE.BufferAttribute(aStrang, 1));
    wGeo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
    this.welleMat = new THREE.ShaderMaterial({
      vertexShader: WELLE_VERTEX,
      fragmentShader: WELLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uZeit: { value: 0 },
        uPegel: { value: 0 },
        uFlaeche: { value: new THREE.Vector4(0, -9999, 1, 1) },
        uBild: { value: new THREE.Vector2(1, 1) },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uFarbeA: { value: this.farbeA },
        uFarbeB: { value: this.farbeB },
        uSprecher: { value: 0 },
      },
    });
    this.welle = new THREE.Points(wGeo, this.welleMat);
    this.welle.frustumCulled = false;
    this.welle.visible = false;
    this.scene.add(this.welle);

    this.camera.position.set(0, 0, 11);
    this.resize();
  }

  /** Mausposition in Bildschirmkoordinaten (-1…1) */
  setMaus(x: number, y: number) {
    this.maus.set(x, y);
    this.mausKraft = 1;
  }

  mausWeg() {
    this.mausKraft = 0;
  }

  /** Neue Branche: die Kugel wechselt langsam in deren Farben */
  setBranche(b: BrancheId) {
    const [a, c] = FARBEN[b];
    this.zielA.setRGB(...a);
    this.zielB.setRGB(...c);
    this.anstossen();
  }

  setSprecher(s: Sprecher) {
    this.sprecher = s;
    this.anstossen();
  }

  /** Lage der Kugel in CSS-Pixeln (Mittelpunkt im Canvas) und Grösse als Anteil der Canvas-Höhe. */
  setKugel(x: number, y: number, hoeheAnteil: number) {
    const { breite, hoehe } = this.sichtfeld();
    const w = this.w;
    const h = this.h;
    this.kugel.position.set((x / w - 0.5) * breite, -(y / h - 0.5) * hoehe, 0);
    // Durchmesser der Kugel (5.2 Einheiten) auf den gewünschten Anteil der Höhe bringen
    this.kugel.scale.setScalar(Math.max(0.2, (hoeheAnteil * hoehe) / 5.2));
    this.hof.position.set(this.kugel.position.x, this.kugel.position.y, -1.5);
    this.hof.scale.setScalar(this.kugel.scale.x);
    // Ganz aus dem Bild: nicht zeichnen
    const r = (hoeheAnteil * h) / 2;
    this.kugelSichtbar = y + r * 1.4 > 0 && y - r * 1.4 < h;
    this.anstossen();
  }

  /**
   * Fläche der Schallwelle in CSS-Pixeln des Canvas; `null` blendet sie aus (Desktop zeigt die Kugel).
   */
  setWelle(f: { links: number; oben: number; breite: number; hoehe: number } | null) {
    if (!f) {
      this.welleSichtbar = false;
    } else {
      (this.welleMat.uniforms.uFlaeche.value as THREE.Vector4).set(f.links, f.oben, f.breite, f.hoehe);
      this.welleSichtbar = f.oben + f.hoehe > 0 && f.oben < this.h;
    }
    this.anstossen();
  }

  /** Scrollposition in Pixeln; die Sterne wandern beim Scrollen leicht in Ebenen mit */
  setScroll(y: number) {
    this.scroll = y;
    this.anstossen();
  }

  resize() {
    const c = this.renderer.domElement;
    const w = Math.max(1, c.clientWidth);
    const h = Math.max(1, c.clientHeight);
    this.w = w;
    this.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.sterneMat.uniforms.uSeite.value = w / h;
    (this.welleMat.uniforms.uBild.value as THREE.Vector2).set(w, h);
    this.anstossen();
  }

  start() {
    if (this.laeuft) return;
    this.laeuft = true;
    this.zuletzt = performance.now();
    this.bild = requestAnimationFrame(this.zeichnen);
  }

  stop() {
    this.laeuft = false;
    this.schlaeft = false;
    cancelAnimationFrame(this.bild);
  }

  /** Handy ohne sichtbare Kugel: keine Dauerschleife, das spart Akku */
  private darfRuhen() {
    return this.opts.lowPower && !this.kugelSichtbar && !this.welleSichtbar;
  }

  private anstossen() {
    if (this.schlaeft && !this.darfRuhen()) {
      this.schlaeft = false;
      this.zuletzt = performance.now();
      this.bild = requestAnimationFrame(this.zeichnen);
    } else if (this.schlaeft || (!this.opts.motion && !this.laeuft)) {
      requestAnimationFrame(() => this.zeichnen(performance.now(), true));
    }
  }

  /** Sichtbare Breite und Höhe der Szene in der Ebene z = 0 */
  private sichtfeld() {
    const hoehe = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    return { breite: hoehe * this.camera.aspect, hoehe };
  }

  private zeichnen = (jetzt: number, einmal = false) => {
    const dt = Math.min(0.05, (jetzt - this.zuletzt) / 1000);
    this.zuletzt = jetzt;
    this.zeit += this.opts.motion ? dt : 0;
    const weich = this.opts.motion ? 1 - Math.exp(-dt * 2.2) : 1;
    const flink = this.opts.motion ? 1 - Math.exp(-dt * 8) : 1;

    // Sprechpegel: Silben als kurze Stösse, solange jemand spricht
    const spricht = this.sprecher === "Anrufer" || this.sprecher === "Assistent";
    if (spricht && this.opts.motion) {
      this.silbe -= dt;
      if (this.silbe <= 0) this.silbe = 0.09 + Math.random() * 0.16;
      const ziel = 0.35 + Math.abs(Math.sin(this.zeit * 11)) * 0.4 * (this.silbe > 0.12 ? 1 : 0.4) + Math.random() * 0.2;
      this.pegel += (ziel - this.pegel) * flink;
    } else {
      this.pegel += ((spricht ? 0.4 : 0.05) - this.pegel) * weich;
    }
    // Farbwechsel über rund zwei Sekunden
    const farbTempo = this.opts.motion ? 1 - Math.exp(-dt * 1.6) : 1;
    this.farbeA.lerp(this.zielA, farbTempo);
    this.farbeB.lerp(this.zielB, farbTempo);
    this.sterneDeck += (this.zielSterneDeck - this.sterneDeck) * weich;

    const kraft = this.opts.motion ? this.mausKraft : 0;

    // ---------- Kugel ----------
    this.kugel.visible = this.hof.visible = this.kugelSichtbar;
    if (this.kugelSichtbar) {
      // Die Kugel dreht sich nur langsam um sich selbst; die Maus bewegt sie nicht (Wunsch des Inhabers)
      this.kugel.rotation.x = 0.15;
      this.kugel.rotation.y = this.zeit * 0.05;
      const u = this.kugelMat.uniforms;
      u.uZeit.value = this.zeit;
      u.uPegel.value = this.pegel;

      this.hofMat.uniforms.uStaerke.value = 0.16 + this.pegel * 0.1;
      (this.hofMat.uniforms.uFarbe.value as THREE.Color).copy(this.farbeA);
    }

    // ---------- Schallwelle ----------
    this.welle.visible = this.welleSichtbar;
    if (this.welleSichtbar) {
      this.sprecherWert += ((this.sprecher === "Anrufer" ? 1 : 0) - this.sprecherWert) * weich;
      const w = this.welleMat.uniforms;
      w.uZeit.value = this.zeit;
      w.uPegel.value = this.pegel;
      w.uSprecher.value = this.sprecherWert;
    }

    // ---------- Sterne ----------
    const s = this.sterneMat.uniforms;
    s.uZeit.value = this.zeit;
    s.uScroll.value = this.scroll / Math.max(1, window.innerHeight) * 0.35;
    (s.uMaus.value as THREE.Vector2).copy(this.maus);
    s.uMausKraft.value += (kraft - s.uMausKraft.value) * weich;
    s.uDeckkraft.value = this.sterneDeck;

    this.renderer.render(this.scene, this.camera);
    if (!this.laeuft || einmal) return;
    if (this.darfRuhen()) this.schlaeft = true;
    else this.bild = requestAnimationFrame(this.zeichnen);
  };

  dispose() {
    this.stop();
    this.kugel.geometry.dispose();
    this.kugelMat.dispose();
    this.hof.geometry.dispose();
    this.hofMat.dispose();
    this.welle.geometry.dispose();
    this.welleMat.dispose();
    this.sterne.geometry.dispose();
    this.sterneMat.dispose();
    this.renderer.dispose();
  }
}
