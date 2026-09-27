"use client";

import type { BrancheId } from "@/lib/branchen";
import { demoChatAdresse, demoFuer } from "@/lib/demo";
import ChatFenster from "./ChatFenster";

/**
 * Demo-Chat im Fenster: auf der Startseite der allgemeine Demo-Assistent,
 * auf den Branchenseiten der Assistent der passenden Beispiel-Firma (z.B. «Garage Muster AG»).
 */
export default function DemoChat({ branche, schliessen }: { branche?: BrancheId; schliessen: () => void }) {
  const demo = demoFuer(branche);
  return (
    <ChatFenster
      chip={demo.firma ? `Demo · ${demo.firma}` : "Demo"}
      titel="Chat testen"
      text={
        demo.firma ? (
          <>
            Sie schreiben mit dem Assistenten der Beispiel-Firma «{demo.firma}». Alle Angaben sind erfunden, es wird nichts
            gebucht. Zum Beispiel:
          </>
        ) : (
          <>So beantwortet ein KI-Assistent die Fragen Ihrer Kundschaft, rund um die Uhr. Zum Beispiel:</>
        )
      }
      beispiele={demo.beispiele}
      hinweis="Demo ohne Anmeldung"
      adresse={demoChatAdresse(demo)}
      rahmenTitel={demo.firma ? `Demo-Chat ${demo.firma}` : "Demo-Chat"}
      schliessen={schliessen}
    />
  );
}
