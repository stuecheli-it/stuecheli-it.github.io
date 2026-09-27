"use client";

import { useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";
import { DEMO_BRANCHEN, demoChatAdresse } from "@/lib/demo";
import { BrancheIcon } from "./BranchenGrafik";
import ChatFenster from "./ChatFenster";
import { Pfeil } from "./Icons";

/**
 * Demo-Chat im Fenster mit dem Assistenten einer Beispiel-Firma (z.B. «Garage Muster AG»).
 * Auf einer Branchenseite startet er direkt mit deren Firma, sonst fragt er zuerst nach der Branche.
 * «Andere Branche» führt jederzeit zurück zur Auswahl.
 */
export default function DemoChat({ branche, schliessen }: { branche?: BrancheId; schliessen: () => void }) {
  const [gewaehlt, setGewaehlt] = useState<BrancheId | undefined>(branche);

  if (!gewaehlt) {
    return (
      <ChatFenster
        chip="Demo"
        titel="Chat testen"
        text={
          <>
            Wählen Sie eine Branche. Sie schreiben dann mit dem Assistenten einer erfundenen Beispiel-Firma, so wie Ihre
            Kundschaft mit Ihrem Assistenten schreiben würde.
          </>
        }
        hinweis="Demo ohne Anmeldung"
        inhalt={
          <div className="demo-wahl" role="list">
            {BRANCHENSEITEN.map((s) => (
              <button key={s.id} type="button" role="listitem" onClick={() => setGewaehlt(s.id)}>
                <span className="demo-wahl-ico"><BrancheIcon id={s.id} /></span>
                <span className="demo-wahl-text">
                  <b>{s.kurz}</b>
                  <span>{DEMO_BRANCHEN[s.id].firma}</span>
                </span>
                <Pfeil strich={2} />
              </button>
            ))}
          </div>
        }
        schliessen={schliessen}
      />
    );
  }

  const demo = DEMO_BRANCHEN[gewaehlt];
  return (
    <ChatFenster
      chip={`Demo · ${demo.firma}`}
      zusatz={
        <button type="button" className="demo-wechsel" onClick={() => setGewaehlt(undefined)}>
          Andere Branche
        </button>
      }
      titel="Chat testen"
      text={
        <>
          Sie schreiben mit dem Assistenten der Beispiel-Firma «{demo.firma}». Alle Angaben sind erfunden, es wird nichts
          gebucht. Zum Beispiel:
        </>
      }
      beispiele={demo.beispiele}
      hinweis="Demo ohne Anmeldung"
      adresse={demoChatAdresse(demo)}
      rahmenTitel={`Demo-Chat ${demo.firma}`}
      schliessen={schliessen}
    />
  );
}
