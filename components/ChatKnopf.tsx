"use client";

import { useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import { gewaehlteBranche } from "@/lib/gewaehlteBranche";
import DemoChat from "./DemoChat";

/**
 * Knopf zum Beispiel-Chat: öffnet den Assistenten einer Beispiel-Firma.
 * Ohne `branche` startet er mit der zuletzt gewählten Branche, sonst mit der Auswahl.
 */
export default function ChatKnopf({
  className,
  branche,
  children,
}: {
  className: string;
  branche?: BrancheId;
  children: React.ReactNode;
}) {
  const [offen, setOffen] = useState(false);
  const [start, setStart] = useState<BrancheId | undefined>(branche);
  const schliessen = useRef(() => setOffen(false)).current;
  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => {
          setStart(branche ?? gewaehlteBranche());
          setOffen(true);
        }}
      >
        {children}
      </button>
      {offen && <DemoChat branche={start} schliessen={schliessen} />}
    </>
  );
}
