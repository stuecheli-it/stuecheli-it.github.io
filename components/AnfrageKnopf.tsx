"use client";

import { useRef, useState } from "react";
import type { AnfrageKontext } from "@/lib/fonio";
import AnfrageChat from "./AnfrageChat";

/** Knopf, der den Anfrage-Chat öffnet (wie «Unverbindlich anfragen» im Preis-Popup). */
export default function AnfrageKnopf({
  kontext,
  className,
  children,
}: {
  kontext: AnfrageKontext;
  className: string;
  children: React.ReactNode;
}) {
  const [offen, setOffen] = useState(false);
  const schliessen = useRef(() => setOffen(false)).current;
  return (
    <>
      <button className={className} type="button" onClick={() => setOffen(true)}>
        {children}
      </button>
      {offen && <AnfrageChat kontext={kontext} schliessen={schliessen} />}
    </>
  );
}
