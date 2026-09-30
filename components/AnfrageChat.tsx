"use client";

import { FIRMA } from "@/lib/firma";
import { anfrageChatAdresse, type AnfrageKontext } from "@/lib/fonio";
import ChatFenster from "./ChatFenster";

/** Chat-Fenster für «Unverbindlich anfragen». Der Kontext (Plan, Branche) geht über die Adresse an fonio. */
export default function AnfrageChat({ kontext, schliessen }: { kontext: AnfrageKontext; schliessen: () => void }) {
  const { thema } = kontext;
  return (
    <ChatFenster
      chip={thema}
      titel="Unverbindlich anfragen"
      text={
        <>
          {thema === "Allgemeine Anfrage" ? "" : `Ihre Anfrage zu «${thema}». `}Hinterlassen Sie hier Ihre Kontaktdaten,
          Gilbert Stücheli meldet sich persönlich bei Ihnen und beantwortet Ihre Fragen.
        </>
      }
      hinweis={<a href={`mailto:${FIRMA.email}?subject=${encodeURIComponent(`Anfrage: ${thema}`)}`}>Lieber per E-Mail?</a>}
      adresse={anfrageChatAdresse(kontext)}
      rahmenTitel="Anfrage-Chat von Etivo"
      ladeText="Einen Moment, der Anfrage-Assistent startet …"
      betreff={`Anfrage: ${thema}`}
      schliessen={schliessen}
    />
  );
}
