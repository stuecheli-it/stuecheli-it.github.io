"use client";

import { anfrageChatAdresse, type AnfrageKontext } from "@/lib/fonio";
import ChatFenster from "./ChatFenster";

/** Chat-Fenster für «Unverbindlich anfragen». Der Kontext (Plan, Branche) geht über die Adresse an fonio. */
export default function AnfrageChat({ kontext, schliessen }: { kontext: AnfrageKontext; schliessen: () => void }) {
  const { thema } = kontext;
  return (
    <ChatFenster
      chip={thema}
      titel="Unverbindlich anfragen"
      text={<>Ihre Anfrage zu «{thema}». Schreiben Sie uns kurz, was Sie wissen möchten. Wir melden uns persönlich bei Ihnen.</>}
      hinweis="Lieber per E-Mail oder Telefon?"
      adresse={anfrageChatAdresse(kontext)}
      rahmenTitel="Anfrage-Chat von Stücheli IT Consulting"
      schliessen={schliessen}
    />
  );
}
