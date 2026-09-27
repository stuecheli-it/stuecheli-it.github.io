"use client";

import { useRef, useState } from "react";
import type { BrancheId } from "@/lib/branchen";
import DemoChat from "./DemoChat";

/** Knopf «Im Chat testen»: öffnet den Demo-Chat (mit Branche den Assistenten der Beispiel-Firma). */
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
  const schliessen = useRef(() => setOffen(false)).current;
  return (
    <>
      <button className={className} type="button" onClick={() => setOffen(true)}>
        {children}
      </button>
      {offen && <DemoChat branche={branche} schliessen={schliessen} />}
    </>
  );
}
