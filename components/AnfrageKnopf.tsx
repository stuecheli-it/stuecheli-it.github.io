"use client";

import { useRef, useState } from "react";
import AnfrageChat from "./AnfrageChat";

/** Knopf, der den Anfrage-Chat öffnet (wie «Unverbindlich anfragen» im Preis-Popup). */
export default function AnfrageKnopf({
  thema,
  className,
  children,
}: {
  thema: string;
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
      {offen && <AnfrageChat thema={thema} schliessen={schliessen} />}
    </>
  );
}
