// Der Klangkörper und der Sternenhimmel hinter der Seite (Three.js, ein Canvas fest im Bildschirm).
// - Die Kugel aus Lichtpunkten gehört zum Hero: Sie sitzt dort, wo der Hero sie hinsetzt, und scrollt mit ihm weg.
//   Sie spricht mit (bewegt sich mit der Stimme) und trägt die Farben der laufenden Branche.
// - Der Sternenhimmel liegt hinter der ganzen Seite: funkelnde Punkte, die langsam treiben, beim Scrollen in
//   mehreren Ebenen mitwandern, der Maus ausweichen und nach einem Klick als Welle auseinanderstieben.

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
  uniform float uKnall;
  uniform vec3 uMaus;
  uniform float uMausKraft;
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
    // Die Kugel atmet und spricht: Rauschen entlang der Normalen, stärker mit dem Pegel
    float n = rauschen(p * 1.6 + vec3(uZeit * 0.35, uZeit * 0.2, 0.0));
    float n2 = rauschen(p * 4.0 - vec3(0.0, uZeit * 1.4, uZeit * 0.9));
    p *= 1.0 + n * (0.06 + uPegel * 0.16) + n2 * uPegel * 0.07;

    vec4 welt = modelMatrix * vec4(p, 1.0);
    vec3 mitte = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

    // Druckwelle nach einem Klick
    float d = length(welt.xyz - mitte);
    float stoss = exp(-pow(d - uKnall * 9.0, 2.0) * 1.5) * (1.0 - smoothstep(0.0, 1.2, uKnall)) * step(0.0001, uKnall);
    welt.xyz += normalize(welt.xyz - mitte + 0.0001) * stoss * 0.9;

    // Maus schiebt Punkte weg
    vec3 weg = welt.xyz - uMaus;
    float nah = exp(-dot(weg, weg) * 0.9) * uMausKraft;
    welt.xyz += normalize(weg + 0.0001) * nah * 0.8;

    vec4 mv = viewMatrix * welt;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPunkt * (0.6 + aZufall * 0.9) * (1.0 + uPegel * 0.6 + nah * 1.5 + stoss * 2.0) * (15.0 / -mv.z);

    // Zwei Töne der laufenden Branche, verteilt nach Höhe
    float h = clamp(p.y * 0.25 + 0.5, 0.0, 1.0);
    vec3 farbe = mix(uFarbeA, uFarbeB, clamp(h * 0.8 + n * 0.2, 0.0, 1.0));
    farbe += vec3(1.0, 0.85, 0.7) * (nah * 0.6 + stoss * 0.8 + uPegel * 0.15 * aZufall);
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
    gl_FragColor = vec4(vFarbe * (0.55 + hof * 0.9), hof * vAlpha * uDeckkraft * 0.8);
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
  uniform vec2 uKnallOrt;
  uniform float uKnall;
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
    q += normalize(zurMaus + 0.0001) * nah * 0.12 * (0.4 + tiefe);

    vec2 zumKnall = q - uKnallOrt * vec2(uSeite, 1.0);
    float d = length(zumKnall);
    float front = uKnall * 2.2;
    float stoss = exp(-pow(d - front, 2.0) * 40.0) * (1.0 - smoothstep(0.0, 1.4, uKnall)) * step(0.0001, uKnall);
    q += normalize(zumKnall + 0.0001) * stoss * 0.08;

    gl_Position = vec4(q / vec2(uSeite, 1.0), 0.0, 1.0);

    float funkeln = 0.55 + 0.45 * sin(uZeit * (0.8 + aPhase * 2.2) + aPhase * 40.0);
    gl_PointSize = uPunkt * (0.8 + tiefe * 2.6) * (1.0 + nah * 1.2 + stoss * 1.5);
    vFarbe = aFarbe + vec3(1.0, 0.8, 0.6) * (nah * 0.5 + stoss);
    vAlpha = (0.25 + tiefe * 0.75) * funkeln;
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
  private knallStart = -10;
  private maus = new THREE.Vector2(0, 0);
  private mausKraft = 0;
  private scroll = 0;
  private kugelSichtbar = true;
  private sterneDeck = 0.5;
  private zielSterneDeck = 0.5;

  constructor(canvas: HTMLCanvasElement, opts: Optionen) {
    this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: opts.lowPower ? "low-power" : "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);

    // ---------- Sternenhimmel ----------
    const anzahl = opts.lowPower ? 900 : 1800;
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
        uKnallOrt: { value: new THREE.Vector2(0, 0) },
        uKnall: { value: 0 },
        uDeckkraft: { value: 0.5 },
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
        uKnall: { value: 0 },
        uMaus: { value: new THREE.Vector3(99, 99, 99) },
        uMausKraft: { value: 0 },
        uPunkt: { value: opts.lowPower ? 3.2 : 2.6 },
        uFarbeA: { value: this.farbeA },
        uFarbeB: { value: this.farbeB },
        uDeckkraft: { value: 1 },
      },
    });
    this.kugel = new THREE.Points(geo, this.kugelMat);
    this.kugel.frustumCulled = false;
    this.scene.add(this.kugel);

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

  /** Klick: Druckwelle durch Kugel und Sterne, ausgehend vom Klickpunkt (-1…1) */
  knall(x: number, y: number) {
    this.knallStart = this.zeit;
    (this.sterneMat.uniforms.uKnallOrt.value as THREE.Vector2).set(x, y);
    this.anstossen();
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

  /**
   * Lage der Kugel in CSS-Pixeln (Mittelpunkt im Fenster) und Grösse als Anteil der Fensterhöhe.
   * Die Kugel folgt der Seite ohne Verzögerung, damit sie wie ein Teil des Heros wirkt.
   */
  setKugel(x: number, y: number, hoeheAnteil: number) {
    const { breite, hoehe } = this.sichtfeld();
    const w = window.innerWidth;
    const h = window.innerHeight;
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

  /** Scrollposition in Pixeln; die Sterne wandern in Ebenen mit, im Hero leiser als auf der restlichen Seite */
  setScroll(y: number, imHero: boolean) {
    this.scroll = y;
    this.zielSterneDeck = imHero ? 0.5 : 1;
    if (!this.opts.motion) this.sterneDeck = this.zielSterneDeck;
    this.anstossen();
  }

  resize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.sterneMat.uniforms.uSeite.value = w / h;
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
    cancelAnimationFrame(this.bild);
  }

  private anstossen() {
    if (!this.opts.motion && !this.laeuft) requestAnimationFrame(() => this.zeichnen(performance.now(), true));
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

    const { breite, hoehe } = this.sichtfeld();
    const kraft = this.opts.motion ? this.mausKraft : 0;
    const k = this.zeit - this.knallStart;

    // ---------- Kugel ----------
    this.kugel.visible = this.hof.visible = this.kugelSichtbar;
    if (this.kugelSichtbar) {
      // Die Kugel dreht sich nur langsam um sich selbst; die Maus bewegt sie nicht (Wunsch des Inhabers)
      this.kugel.rotation.x = 0.15;
      this.kugel.rotation.y = this.zeit * 0.08;
      const u = this.kugelMat.uniforms;
      u.uZeit.value = this.zeit;
      u.uPegel.value = this.pegel;
      u.uMausKraft.value = 0;
      u.uKnall.value = k >= 0 && k < 1.2 && this.opts.motion ? k : 0;

      this.hofMat.uniforms.uStaerke.value = 0.28 + this.pegel * 0.3;
      (this.hofMat.uniforms.uFarbe.value as THREE.Color).copy(this.farbeA);
    }

    // ---------- Sterne ----------
    const s = this.sterneMat.uniforms;
    s.uZeit.value = this.zeit;
    s.uScroll.value = this.scroll / Math.max(1, window.innerHeight) * 0.35;
    (s.uMaus.value as THREE.Vector2).copy(this.maus);
    s.uMausKraft.value += (kraft - s.uMausKraft.value) * weich;
    s.uKnall.value = k >= 0 && k < 1.4 && this.opts.motion ? k : 0;
    s.uDeckkraft.value = this.sterneDeck;

    this.renderer.render(this.scene, this.camera);
    if (this.laeuft && !einmal) this.bild = requestAnimationFrame(this.zeichnen);
  };

  dispose() {
    this.stop();
    this.kugel.geometry.dispose();
    this.kugelMat.dispose();
    this.hof.geometry.dispose();
    this.hofMat.dispose();
    this.sterne.geometry.dispose();
    this.sterneMat.dispose();
    this.renderer.dispose();
  }
}
