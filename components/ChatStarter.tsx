"use client";

import { useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { demoFuer } from "@/lib/demo";
import DemoChat from "./DemoChat";
import { ChatPunkte } from "./Icons";

/**
 * Eigener Chat-Knopf unten rechts (ersetzt die fonio-Sprechblase).
 * Öffnet den Demo-Chat im gleichen Fenster wie «Im Chat testen»; auf Branchenseiten den der Beispiel-Firma.
 */
export default function ChatStarter({ branche }: { branche?: BrancheId }) {
  const [offen, setOffen] = useState(false);
  const schliessen = useRef(() => setOffen(false)).current;
  const demo = demoFuer(branche);
  const beschriftung = demo.firma ? `Demo-Chat ${demo.firma}` : "Demo-Chat";
  return (
    <>
      <button className="chat-starter" type="button" onClick={() => setOffen(true)} aria-label={`${beschriftung} öffnen`}>
        <ChatPunkte strich={2} />
        <span className="chat-starter-text">Chat testen</span>
      </button>
      {offen && <DemoChat branche={branche} schliessen={schliessen} />}
    </>
  );
}
