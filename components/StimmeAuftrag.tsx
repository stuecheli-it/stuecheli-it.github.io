"use client";

import { useEffect, useState } from "react";
import { ABSCHLUSS_MS, SZENARIEN, type BrancheId } from "@/lib/auftrag/ablauf";
import { brancheWaehlen } from "@/lib/gewaehlteBranche";
import { stimmeMelden } from "@/lib/stimme";
import { BrancheIcon } from "./BranchenGrafik";
import { Haken } from "./Icons";

/** Tippt einen Text Zeichen für Zeichen, sobald er aktiv wird. */
function Tipp({ text, sofort }: { text: string; sofort: boolean }) {
  const [n, setN] = useState(sofort ? text.length : 0);
  useEffect(() => {
    if (sofort) {
      setN(text.length);
      return;
    }
    const start = performance.now();
    const t = window.setInterval(() => {
      const i = Math.min(text.length, Math.floor((performance.now() - start) / 26) + 1);
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

/**
 * Hero-Szene «Stimme wird Auftrag»: Der Klangkörper im Hintergrund spricht mit (orange die anrufende Person,
 * violett der Assistent), daneben füllt sich Satz für Satz die Meldung, die der Betrieb bekommt.
 * Die Branchen-Knöpfe spielen das Gespräch dieser Branche von vorne. Mit `branche` läuft nur dieses Beispiel.
 */
export default function StimmeAuftrag({ branche }: { branche?: BrancheId } = {}) {
  const liste = branche ? SZENARIEN.filter((s) => s.id === branche) : SZENARIEN;
  const [bewegt, setBewegt] = useState(true);
  const [nr, setNr] = useState(0);
  const [schritt, setSchritt] = useState(0);
  const [gefuellt, setGefuellt] = useState<string[]>([]);
  const [spielt, setSpielt] = useState(true);
  const [runde, setRunde] = useState(0);

  const szenario = liste[nr];
  const ABLAUF = szenario.ablauf;
  const fertig = schritt >= ABLAUF.length;
  const aktuelle = fertig ? null : ABLAUF[schritt];

  useEffect(() => setBewegt(!window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // Der Klangkörper spricht mit; seine Farbe hängt an der Branche, nicht am Sprecher
  useEffect(() => {
    stimmeMelden(!spielt ? null : aktuelle ? aktuelle.wer : "fertig", szenario.id);
  }, [aktuelle, spielt, szenario.id]);
  useEffect(() => () => stimmeMelden(null, null), []);

  // ---------- Gesprächsablauf ----------
  useEffect(() => {
    const timer: number[] = [];
    if (!spielt) return;
    if (fertig) {
      timer.push(
        window.setTimeout(() => {
          setGefuellt([]);
          setSchritt(0);
          setNr((n) => (n + 1) % liste.length);
          setRunde((r) => r + 1);
        }, ABSCHLUSS_MS),
      );
    } else {
      const s = ABLAUF[schritt];
      s.felder.forEach((f) => {
        timer.push(window.setTimeout(() => setGefuellt((g) => (g.includes(f.id) ? g : [...g, f.id])), s.dauer * f.bei));
      });
      timer.push(window.setTimeout(() => setSchritt((x) => x + 1), s.dauer));
    }
    return () => timer.forEach((t) => window.clearTimeout(t));
  }, [nr, schritt, spielt, fertig, ABLAUF, liste.length]);

  const waehlen = (i: number) => {
    setGefuellt([]);
    setSchritt(0);
    setNr(i);
    setRunde((r) => r + 1);
    setSpielt(true);
    brancheWaehlen(liste[i].id);
  };

  const anteil = Math.min(1, gefuellt.length / szenario.felder.length);

  return (
    <figure className="stimme-buehne" aria-label="Beispiel: Ein Anruf wird zu einer Meldung für den Betrieb">
      {liste.length > 1 && (
        <div className="stimme-wahl" role="group" aria-label="Beispielgespräch wählen">
          {liste.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={"stimme-chip" + (i === nr ? " aktiv" : "")}
              aria-pressed={i === nr}
              onClick={() => waehlen(i)}
            >
              <BrancheIcon id={s.id} />
              {s.tab}
            </button>
          ))}
        </div>
      )}

      <div className="stimme-untertitel" aria-live="off">
        {aktuelle ? (
          <p key={szenario.id + schritt + runde} className={"stimme-zeile stimme-" + aktuelle.wer.toLowerCase()}>
            <span className="stimme-wer">
              <span className="pegel" aria-hidden="true"><i /><i /><i /><i /></span>
              {aktuelle.wer === "Anrufer" ? szenario.anrufer : "Assistent"}
            </span>
            {aktuelle.text}
          </p>
        ) : (
          <p key={"fertig" + runde} className="stimme-zeile stimme-fertig">
            <span className="stimme-wer">Gespräch beendet</span>
            Alles Wichtige liegt vollständig bei Ihnen.
          </p>
        )}
      </div>

      <div key={szenario.id + runde} className={"auftrag-karte" + (fertig ? " fertig" : "")} style={{ "--anteil": anteil } as React.CSSProperties}>
        <div className="auftrag-kopf">
          <div>
            {/* Titel allein auf der Zeile, damit er nicht umbricht; «Beispiel» steht bei der Statuszeile */}
            <div className="titel">{szenario.titel}</div>
            <div className="status">
              <span className="beispiel-marke">Beispiel</span>
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
        <div className="auftrag-balken" aria-hidden="true"><i /></div>

        <dl className="auftrag-felder">
          {szenario.felder.map((f) => {
            const voll = gefuellt.includes(f.id);
            return (
              <div key={f.id} className={"auftrag-feld" + (voll ? " gefuellt" : "") + (f.wichtig ? " wichtig" : "")}>
                <dt>{f.label}</dt>
                <dd>{voll ? <Tipp text={f.wert} sofort={!bewegt} /> : <span className="platzhalter" />}</dd>
              </div>
            );
          })}
        </dl>

        <div className="auftrag-fuss">
          {fertig ? "Zusammenfassung per Mail · erfundene Beispiel-Firma" : "Der Assistent füllt die Meldung während des Gesprächs aus · erfundene Beispiel-Firma"}
        </div>
      </div>
    </figure>
  );
}
