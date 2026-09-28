"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BrancheId } from "@/lib/branchen";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import type { AnfrageKontext } from "@/lib/fonio";
import { liveDemoErledigt, liveDemoLesen, type LiveDemoStart } from "@/lib/livedemo";
import AnfrageChat from "./AnfrageChat";
import { Globus, Kreuz, Pfeil } from "./Icons";

/** Erst nachfassen, wenn der Besucher die Demo eine Weile ausprobieren konnte */
const WARTEN_MS = 20_000;

/**
 * Nachfassen nach der Live-Demo: Die fonio-Demo läuft in einem neuen Tab, diese Seite bleibt offen.
 * Kommt der Besucher zurück, bietet eine Karte unten links an, die Einrichtung zu besprechen.
 * «Einrichtung besprechen» öffnet den Anfrage-Chat mit Website und Branche als Kontext.
 * Einmal pro Tab: nach Anfrage oder «Später» erscheint die Karte nicht wieder.
 */
export default function LiveDemoNachfassen({ branche }: { branche?: BrancheId }) {
  const [start, setStart] = useState<LiveDemoStart | null>(null);
  const [chat, setChat] = useState(false);
  const [kontext, setKontext] = useState<AnfrageKontext | null>(null);
  const schliessen = useRef(() => setChat(false)).current;

  useEffect(() => {
    const pruefen = () => {
      if (document.visibilityState !== "visible") return;
      const s = liveDemoLesen();
      if (s && !s.erledigt && Date.now() - s.zeit >= WARTEN_MS) setStart(s);
    };
    // Zurück im Tab oder im Fenster; nach einem Seitenwechsel auf der Website kurz nach dem Laden
    document.addEventListener("visibilitychange", pruefen);
    window.addEventListener("focus", pruefen);
    const t = window.setTimeout(pruefen, 2500);
    return () => {
      document.removeEventListener("visibilitychange", pruefen);
      window.removeEventListener("focus", pruefen);
      window.clearTimeout(t);
    };
  }, []);

  // Solange die Karte sichtbar ist, weicht der Chat-Knopf auf dem Handy aus
  useEffect(() => {
    document.body.classList.toggle("nachfassen-offen", start != null);
    return () => document.body.classList.remove("nachfassen-offen");
  }, [start]);

  const erledigt = () => {
    liveDemoErledigt();
    setStart(null);
  };

  const seite = BRANCHENSEITEN.find((s) => s.id === (start?.branche ?? branche));

  const besprechen = () => {
    if (!start) return;
    setKontext({
      thema: start.website ? `Einrichtung für ${start.website}` : "Einrichtung nach der Live-Demo",
      branche: seite?.mehrzahl,
      website: start.website,
      quelle: "Live-Demo",
    });
    erledigt();
    setChat(true);
  };

  return (
    <>
      {start &&
        createPortal(
          <aside className="nachfassen" aria-labelledby="nachfassenTitel">
            <button type="button" className="nachfassen-zu" aria-label="Später" onClick={erledigt}>
              <Kreuz />
            </button>
            <span className="nachfassen-chip">
              <Globus />
              Ihre Live-Demo
            </span>
            <h2 id="nachfassenTitel">Wie hat er Ihnen gefallen?</h2>
            <p>
              {start.website ? (
                <>
                  Der Assistent für <b>{start.website}</b> war ein erster Entwurf.
                </>
              ) : (
                <>Die Demo zeigt einen allgemeinen Assistenten.</>
              )}{" "}
              Wir richten Ihren eigenen ein, mit Ihren Zeiten, Preisen und Abläufen. Aus der Region, persönlich betreut.
            </p>
            <div className="nachfassen-knoepfe">
              <button type="button" className="btn btn-primaer btn-klein" onClick={besprechen}>
                Einrichtung besprechen <Pfeil strich={2} />
              </button>
              <button type="button" className="nachfassen-spaeter" onClick={erledigt}>
                Später
              </button>
            </div>
          </aside>,
          document.body,
        )}
      {chat && kontext && <AnfrageChat kontext={kontext} schliessen={schliessen} />}
    </>
  );
}
