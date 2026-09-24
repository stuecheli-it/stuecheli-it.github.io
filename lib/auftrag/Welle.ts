import * as THREE from "three";
import { flugFragment, flugVertex, welleFragment, welleVertex } from "./shaders";
import { speechEnvelope } from "./sprache";

/** Markenfarben als rohe sRGB-Werte (bewusst ohne Farbraum-Umrechnung). */
function srgb(hex: string): THREE.Vector3 {
  const n = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
const TUERKIS = srgb("#3ff0c9");
const BLAU = srgb("#3a8cff");
const VIOLETT = srgb("#6b45ff");
const ANRUFER = srgb("#dce9ff");

const FLUG_POOL = 2400;
/** Kometen pro Flug, jeder mit einem Schweif aus mehreren Punkten */
const KOMETEN = 90;
const SCHWEIF = 5;

export type WelleOptionen = { motion: boolean; lowPower: boolean };
export type WelleSprecher = "Assistent" | "Anrufer" | null;

/**
 * Schallwelle aus Partikeln plus fliegende Partikel.
 * Das Canvas liegt als Overlay über der ganzen Hero-Bühne (pointer-events: none).
 * `wellenFlaeche` ist das leere Element, in dem die Welle schwingen soll.
 */
export class Welle {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private kamera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
  private welleMat: THREE.ShaderMaterial;
  private flugMat: THREE.ShaderMaterial;
  private flugGeo: THREE.BufferGeometry;
  private flugIndex = 0;
  private entsorgen: Array<{ dispose: () => void }> = [];

  private uhr = new THREE.Timer();
  private rafId = 0;
  private laeuft = false;
  private zeit = 0;
  private pegel = 0;
  private sprecherWert = 0;
  private sprecher: WelleSprecher = null;
  private readonly opts: WelleOptionen;

  constructor(
    private canvas: HTMLCanvasElement,
    private wellenFlaeche: HTMLElement,
    opts: WelleOptionen,
  ) {
    this.opts = opts;
    // Wirft, wenn kein WebGL verfügbar ist; die Komponente zeigt dann eine ruhige SVG-Welle.
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.lowPower ? 1.5 : 2));

    // ---------- Welle ----------
    const straenge = 7;
    const proStrang = opts.lowPower ? 220 : 520;
    const n = straenge * proStrang;
    const aX = new Float32Array(n);
    const aStrang = new Float32Array(n);
    const aSeed = new Float32Array(n);
    for (let s = 0; s < straenge; s++) {
      for (let i = 0; i < proStrang; i++) {
        const k = s * proStrang + i;
        aX[k] = (i + Math.random()) / proStrang;
        aStrang[k] = s / (straenge - 1);
        aSeed[k] = Math.random();
      }
    }
    const wGeo = new THREE.BufferGeometry();
    wGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    wGeo.setAttribute("aX", new THREE.BufferAttribute(aX, 1));
    wGeo.setAttribute("aStrang", new THREE.BufferAttribute(aStrang, 1));
    wGeo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
    this.welleMat = new THREE.ShaderMaterial({
      vertexShader: welleVertex,
      fragmentShader: welleFragment,
      uniforms: {
        uZeit: { value: 0 },
        uPegel: { value: 0 },
        uLinks: { value: 0 },
        uBreite: { value: 100 },
        uMitteY: { value: 50 },
        uAmp: { value: 40 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uMotion: { value: opts.motion ? 1 : 0 },
        uC1: { value: TUERKIS },
        uC2: { value: BLAU },
        uC3: { value: VIOLETT },
        uAnrufer: { value: ANRUFER },
        uSprecher: { value: 0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      premultipliedAlpha: true,
    });
    const welle = new THREE.Points(wGeo, this.welleMat);
    welle.frustumCulled = false;
    this.scene.add(welle);
    this.entsorgen.push(wGeo, this.welleMat);

    // ---------- Fliegende Partikel (Ringpuffer) ----------
    this.flugGeo = new THREE.BufferGeometry();
    this.flugGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(FLUG_POOL * 3), 3));
    this.flugGeo.setAttribute("aStart", new THREE.BufferAttribute(new Float32Array(FLUG_POOL * 2), 2));
    this.flugGeo.setAttribute("aKontroll", new THREE.BufferAttribute(new Float32Array(FLUG_POOL * 2), 2));
    this.flugGeo.setAttribute("aZiel", new THREE.BufferAttribute(new Float32Array(FLUG_POOL * 2), 2));
    this.flugGeo.setAttribute("aStartZeit", new THREE.BufferAttribute(new Float32Array(FLUG_POOL).fill(-100), 1));
    this.flugGeo.setAttribute("aDauer", new THREE.BufferAttribute(new Float32Array(FLUG_POOL).fill(1), 1));
    const seeds = new Float32Array(FLUG_POOL);
    for (let i = 0; i < FLUG_POOL; i++) seeds[i] = Math.random();
    this.flugGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    this.flugGeo.setAttribute("aSchweif", new THREE.BufferAttribute(new Float32Array(FLUG_POOL), 1));
    this.flugMat = new THREE.ShaderMaterial({
      vertexShader: flugVertex,
      fragmentShader: flugFragment,
      uniforms: {
        uZeit: { value: 0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uC1: { value: TUERKIS },
        uC2: { value: BLAU },
        uC3: { value: VIOLETT },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      premultipliedAlpha: true,
    });
    const flug = new THREE.Points(this.flugGeo, this.flugMat);
    flug.frustumCulled = false;
    flug.renderOrder = 5;
    this.scene.add(flug);
    this.entsorgen.push(this.flugGeo, this.flugMat);

    this.resize();
  }

  // ---------- Steuerung ----------

  setSprecher(s: WelleSprecher) {
    this.sprecher = s;
    if (!this.opts.motion) this.bild(0);
  }

  /**
   * Lässt einen Schwarm Partikel aus der Welle in ein Zielelement fliegen.
   * Liefert die Zeit in Millisekunden, bis der Grossteil angekommen ist.
   */
  flug(ziel: HTMLElement): number {
    if (!this.opts.motion) return 0;
    const c = this.canvas.getBoundingClientRect();
    const w = this.wellenFlaeche.getBoundingClientRect();
    const z = ziel.getBoundingClientRect();
    const zx = z.left - c.left;
    const zy = z.top - c.top;

    const attr = (name: string) => this.flugGeo.getAttribute(name) as THREE.BufferAttribute;
    const start = attr("aStart");
    const kontroll = attr("aKontroll");
    const zielA = attr("aZiel");
    const startZeit = attr("aStartZeit");
    const dauer = attr("aDauer");
    const schweif = attr("aSchweif");

    // Gebündelter Strom: Start in der Wellenmitte, gemeinsamer Bogen, Ziel am Textanfang des Feldes
    const mitteX = w.left - c.left + w.width * 0.5;
    const zielBreite = Math.min(z.width, 220);
    for (let i = 0; i < KOMETEN; i++) {
      const sx = mitteX + (Math.random() - 0.5) * w.width * 0.55;
      const sy = w.top - c.top + w.height * (0.5 + (Math.random() - 0.5) * 0.4);
      const ex = zx + zielBreite * (0.02 + Math.random() * 0.6);
      const ey = zy + z.height * (0.25 + Math.random() * 0.5);
      const kx = (sx + ex) / 2 + 60 + (Math.random() - 0.5) * 70;
      const ky = (sy + ey) / 2 - 20 + (Math.random() - 0.5) * 60;
      const t0 = this.zeit + Math.random() * 0.3;
      const d = 0.8 + Math.random() * 0.3;
      for (let j = 0; j < SCHWEIF; j++) {
        const k = this.flugIndex;
        this.flugIndex = (this.flugIndex + 1) % FLUG_POOL;
        start.setXY(k, sx, sy);
        zielA.setXY(k, ex, ey);
        kontroll.setXY(k, kx, ky);
        // Schweifpunkte folgen dem Kopf mit kleiner Verzögerung
        startZeit.setX(k, t0 + j * 0.028);
        dauer.setX(k, d);
        schweif.setX(k, j / (SCHWEIF - 1));
      }
    }
    [start, kontroll, zielA, startZeit, dauer, schweif].forEach((a) => (a.needsUpdate = true));
    return 900;
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    this.renderer.setSize(r.width, r.height, false);
    this.kamera.left = 0;
    this.kamera.right = r.width;
    this.kamera.top = 0;
    this.kamera.bottom = r.height;
    this.kamera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    this.welleMat.uniforms.uPixelRatio.value = pr;
    this.flugMat.uniforms.uPixelRatio.value = pr;
    this.wellenBereich();
    this.bild(0);
  }

  start() {
    if (this.laeuft || !this.opts.motion) {
      this.bild(0);
      return;
    }
    this.laeuft = true;
    this.uhr.reset();
    const schritt = (ts: number) => {
      if (!this.laeuft) return;
      this.uhr.update(ts);
      this.bild(Math.min(this.uhr.getDelta(), 0.05));
      this.rafId = requestAnimationFrame(schritt);
    };
    this.rafId = requestAnimationFrame(schritt);
  }

  stop() {
    this.laeuft = false;
    cancelAnimationFrame(this.rafId);
  }

  dispose() {
    this.stop();
    this.entsorgen.forEach((d) => d.dispose());
    this.renderer.dispose();
  }

  // ---------- intern ----------

  private wellenBereich() {
    const c = this.canvas.getBoundingClientRect();
    const w = this.wellenFlaeche.getBoundingClientRect();
    const u = this.welleMat.uniforms;
    u.uLinks.value = w.left - c.left;
    u.uBreite.value = w.width;
    u.uMitteY.value = w.top - c.top + w.height / 2;
    u.uAmp.value = w.height * 0.5;
  }

  private bild(dt: number) {
    const bewegt = this.opts.motion;
    this.zeit += dt;
    const glatt = (rate: number) => (bewegt ? 1 - Math.exp(-dt * rate) : 1);

    const ziel = !bewegt
      ? 0.35
      : this.sprecher === "Assistent"
        ? speechEnvelope(this.zeit)
        : this.sprecher === "Anrufer"
          ? speechEnvelope(this.zeit + 7.3) * 0.85
          : 0.05 + 0.03 * Math.sin(this.zeit * 1.3);
    this.pegel += (ziel - this.pegel) * (bewegt ? 1 - Math.exp(-dt * (ziel > this.pegel ? 16 : 6)) : 1);
    this.sprecherWert += ((this.sprecher === "Anrufer" ? 1 : 0) - this.sprecherWert) * glatt(5);

    this.welleMat.uniforms.uZeit.value = this.zeit;
    this.welleMat.uniforms.uPegel.value = this.pegel;
    this.welleMat.uniforms.uSprecher.value = this.sprecherWert;
    this.flugMat.uniforms.uZeit.value = this.zeit;
    this.renderer.render(this.scene, this.kamera);
  }
}
