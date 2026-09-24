"use client";

import { useEffect, useRef, useState } from "react";
import { ABLAUF, ABSCHLUSS_MS, FELDER, type FeldId } from "@/lib/auftrag/ablauf";
import type { Welle, WelleSprecher } from "@/lib/auftrag/Welle";
import { Haken } from "./Icons";

/** Tippt einen Text Zeichen für Zeichen, sobald er aktiv wird. */
function Tipp({ text, sofort }: { text: string; sofort: boolean }) {
  const [n, setN] = useState(sofort ? text.length : 0);
  useEffect(() => {
    if (sofort) {
      setN(text.length);
      return;
    }
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(t);
    }, 26);
    return () => window.clearInterval(t);
  }, [text, sofort]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="tipp-cursor" aria-hidden="true" />}
    </>
  );
}

/** Ruhige SVG-Welle, falls der Browser kein WebGL kann. */
function RuhigeWelle() {
  const pfade = [0, 1, 2].map((s) => {
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const x = i / 120;
      const f = Math.pow(Math.sin(Math.PI * x), 1.4);
      const y = 50 + (Math.sin(x * 11 + s * 2.1) * 0.55 + Math.sin(x * 23 + s * 5.3) * 0.28) * 36 * f * (0.5 + 0.25 * s);
      d += (i ? "L" : "M") + (x * 400).toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  });
  return (
    <svg className="welle-svg" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="welle-verlauf" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3ff0c9" />
          <stop offset="0.48" stopColor="#3a8cff" />
          <stop offset="1" stopColor="#6b45ff" />
        </linearGradient>
      </defs>
      {pfade.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="url(#welle-verlauf)" strokeWidth={1.6} opacity={0.45 + 0.2 * i} />
      ))}
    </svg>
  );
}

/**
 * Hero-Visual «Stimme wird Auftrag»: Eine Schallwelle aus Partikeln zeigt das Gespräch,
 * wichtige Angaben fliegen als Partikel in eine Auftragskarte und füllen sie aus.
 */
export default function StimmeAuftrag() {
  const buehneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const welleRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Welle | null>(null);
  const sprecherRef = useRef<WelleSprecher>(ABLAUF[0].wer);
  const feldRefs = useRef<Partial<Record<FeldId, HTMLElement | null>>>({});

  const [ohneWebGL, setOhneWebGL] = useState(false);
  const [bewegt, setBewegt] = useState(true);
  const [schritt, setSchritt] = useState(0);
  const [gefuellt, setGefuellt] = useState<FeldId[]>([]);
  const [spielt, setSpielt] = useState(true);

  const fertig = schritt >= ABLAUF.length;

  // ---------- Grafik laden (Three.js erst nach dem ersten Bild) ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    const flaeche = welleRef.current;
    const buehne = buehneRef.current;
    if (!canvas || !flaeche || !buehne) return;
    const motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 720;
    setBewegt(motion);
    let weg = false;
    let aufraeumen = () => {};

    import("@/lib/auftrag/Welle")
      .then(({ Welle }) => {
        if (weg) return;
        let w: Welle;
        try {
          w = new Welle(canvas, flaeche, { motion, lowPower });
        } catch {
          setOhneWebGL(true);
          return;
        }
        engineRef.current = w;
        w.setSprecher(sprecherRef.current);

        let imBild = true;
        const steuern = () => (imBild && !document.hidden ? w.start() : w.stop());
        const groesse = new ResizeObserver(() => w.resize());
        groesse.observe(buehne);
        const sicht = new IntersectionObserver(([e]) => {
          imBild = e.isIntersecting;
          steuern();
        });
        sicht.observe(buehne);
        document.addEventListener("visibilitychange", steuern);
        steuern();

        aufraeumen = () => {
          groesse.disconnect();
          sicht.disconnect();
          document.removeEventListener("visibilitychange", steuern);
          w.dispose();
          engineRef.current = null;
        };
      })
      .catch(() => setOhneWebGL(true));

    return () => {
      weg = true;
      aufraeumen();
    };
  }, []);

  // ---------- Gesprächsablauf ----------
  useEffect(() => {
    const timer: number[] = [];
    const sprecher: WelleSprecher = !spielt || fertig ? null : ABLAUF[schritt].wer;
    sprecherRef.current = sprecher;
    engineRef.current?.setSprecher(sprecher);
    if (!spielt) return;

    if (fertig) {
      timer.push(
        window.setTimeout(() => {
          setGefuellt([]);
          setSchritt(0);
        }, ABSCHLUSS_MS),
      );
    } else {
      const s = ABLAUF[schritt];
      s.felder.forEach((f) => {
        timer.push(
          window.setTimeout(() => {
            const el = feldRefs.current[f.id];
            const ms = el && engineRef.current ? engineRef.current.flug(el) : 0;
            timer.push(window.setTimeout(() => setGefuellt((g) => (g.includes(f.id) ? g : [...g, f.id])), ms));
          }, s.dauer * f.bei),
        );
      });
      timer.push(window.setTimeout(() => setSchritt((x) => x + 1), s.dauer));
    }
    return () => timer.forEach((t) => window.clearTimeout(t));
  }, [schritt, spielt, fertig]);

  const aktuelle = fertig ? null : ABLAUF[schritt];

  return (
    <figure
      ref={buehneRef}
      className="auftrag-buehne"
      aria-label="Beispiel: Der KI-Assistent nimmt einen Anruf entgegen und füllt dabei einen Auftrag aus"
    >
      <div ref={welleRef} className="welle-flaeche" aria-hidden="true">
        {ohneWebGL && <RuhigeWelle />}
      </div>

      <div className="welle-untertitel">
        {aktuelle ? (
          <p key={schritt} className={"welle-zeile welle-" + aktuelle.wer.toLowerCase()}>
            <span className="welle-wer">{aktuelle.wer === "Anrufer" ? "Anruferin" : "Assistent"}</span>
            {aktuelle.text}
          </p>
        ) : (
          <p key="fertig" className="welle-zeile welle-fertig">
            <span className="welle-wer">Gespräch beendet</span>
            Der Auftrag liegt vollständig bei Ihnen.
          </p>
        )}
      </div>

      <div className={"auftrag-karte" + (fertig ? " fertig" : "")}>
        <div className="auftrag-kopf">
          <svg className="orb" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <radialGradient id="glow-auftrag" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0.72" stopColor="#3fc8ff" stopOpacity="0.55" />
                <stop offset="1" stopColor="#3fa0ff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="body-auftrag" x1="0.1" y1="0.05" x2="0.9" y2="0.95">
                <stop offset="0" stopColor="#3ff0c9" />
                <stop offset="0.48" stopColor="#3a8cff" />
                <stop offset="1" stopColor="#6b45ff" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="49" fill="url(#glow-auftrag)" />
            <circle cx="50" cy="50" r="36.5" fill="url(#body-auftrag)" />
            <g className="balken" stroke="#ffffff" strokeWidth="5.2" strokeLinecap="round">
              <line x1="30" y1="42.5" x2="30" y2="57.5" />
              <line x1="40" y1="35" x2="40" y2="65" />
              <line x1="50" y1="28" x2="50" y2="72" />
              <line x1="60" y1="35" x2="60" y2="65" />
              <line x1="70" y1="42.5" x2="70" y2="57.5" />
            </g>
          </svg>
          <div>
            <div className="titel">Neuer Auftrag · Muster Sanitär AG</div>
            <div className="status">
              {fertig ? (
                <>
                  <Haken strich={2.4} />
                  Per Mail an Sie gesendet
                </>
              ) : (
                <>
                  <i />
                  Anruf läuft
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            className="knopf"
            onClick={() => setSpielt((s) => !s)}
            aria-label={spielt ? "Beispiel pausieren" : "Beispiel abspielen"}
          >
            {spielt ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" /></svg>
            )}
          </button>
        </div>

        <dl className="auftrag-felder">
          {FELDER.map((f) => {
            const voll = gefuellt.includes(f.id);
            return (
              <div
                key={f.id}
                className={"auftrag-feld" + (voll ? " gefuellt" : "") + (f.id === "einschaetzung" ? " wichtig" : "")}
              >
                <dt>{f.label}</dt>
                <dd
                  ref={(el) => {
                    feldRefs.current[f.id] = el;
                  }}
                >
                  {voll ? <Tipp text={f.wert} sofort={!bewegt} /> : <span className="platzhalter" />}
                </dd>
                <span className="feld-haken" aria-hidden="true">
                  <Haken strich={3} farbe="#06121f" />
                </span>
              </div>
            );
          })}
        </dl>

        <div className="auftrag-fuss">
          {fertig ? "Zusammenfassung per Mail an Sie gesendet, 10:43" : "Der Assistent füllt den Auftrag während des Gesprächs aus"}
        </div>
      </div>

      <canvas ref={canvasRef} className="auftrag-canvas" aria-hidden="true" hidden={ohneWebGL} />
    </figure>
  );
}
