# Chats der Website und ihre fonio-Assistenten

Stand 27.09.2026. Auf der Startseite und den Rechtsseiten wählt man im Demo-Fenster zuerst die Branche;
auf einer Branchenseite startet direkt deren Beispiel-Firma. Der frühere «Demo Chat-Assistent» wird nicht mehr genutzt.

Alle Chats laufen im Fenster der Website über `public/chat.html?w=<schlüssel>`
(fonio erlaubt nur ein Widget pro Seite). Die Widget-IDs stehen in `public/chat.html`,
Firmen und Beispielfragen in `lib/demo.ts`.

Bei jedem Widget sind in fonio als erlaubte Websites eingetragen:
`https://stuecheli-it.github.io` und `http://localhost:8087`.

| Wo auf der Website | Name in fonio | Anzeigename im Chat | Schlüssel | Widget-ID |
|---|---|---|---|---|
| «Unverbindlich anfragen» (Preise, Branchenseiten) | Webseite - Anfragen | Stücheli IT Consulting | `anfrage` | 52aac962-8a9d-4f4f-9640-688f3b595eac |
| Branchenseite Garage | Website-Demo Garage - Garage Muster AG | Garage Muster AG | `garage` | 39ec6ed4-a2fe-40b0-bc5e-9e502455f207 |
| Branchenseite Handwerk | Website-Demo Handwerk - Muster Sanitär AG | Muster Sanitär AG | `handwerk` | 339ac663-aa40-4a4e-94ef-c24d8cb47754 |
| Branchenseite Coiffeur | Website-Demo Coiffeur - Coiffure Muster | Coiffure Muster | `coiffeur` | e5b091dd-51d9-4df2-a5c4-da8e32323d39 |
| Branchenseite Fahrschule | Website-Demo Fahrschule - Fahrschule Muster | Fahrschule Muster | `fahrschule` | d9f6979c-1820-4aa4-9a14-2f0232c2244b |
| Branchenseite Gastronomie | Website-Demo Gastronomie - Restaurant Muster | Restaurant Muster | `gastro` | e91306cb-0b2e-40c4-9325-fb3e4a756b38 |
| Branchenseite Immobilien | Website-Demo Immobilien - Muster Immobilien AG | Muster Immobilien AG | `immo` | 84e91718-d13d-4810-9c17-5a1bfe54c420 |

## Die sechs Branchen-Demos

Einstellungen: Deutsch, formell (Sie), Gesprächs-Timeout 1 Stunde, eigene Begrüssung.
Die Anweisungen («Eigene Anweisungen») sind nach demselben Muster aufgebaut:

1. **Rolle:** digitaler Assistent der Beispiel-Firma in St. Gallen.
2. **Demo-Regeln:** erfundene Firma; auf Nachfrage erklären, dass es eine Demo von Stücheli IT Consulting ist;
   Termine, Aufträge und Reservationen nur zum Schein mit dem Hinweis «(Demo: …)»;
   keine echten Personendaten, ein erfundener Name genügt, nie Telefonnummer oder E-Mail verlangen.
3. **Firma, Angebot, Preise, freie Termine:** alles Beispielwerte, passend zur Hero-Szene der Branche.
4. **Dringendes:** Notfälle erkennen (Panne, Wasserschaden, Heizungsausfall …), bei Gefahr Notruf 112 empfehlen.
5. **Stil:** höchstens drei kurze Sätze, eine Frage pro Nachricht.

Ändern: im fonio-Konto den Assistenten wählen → «Eigene Anweisungen» bzw. «Webchat verwalten»
(Begrüssung, erlaubte Websites, Reiter «Anpassen» für den Anzeigenamen).

## Hinweise

- Das fonio-Fenster im Rahmen darf höchstens 480 px breit sein. Breiter zeigt fonio die Desktop-Karte
  statt des bildschirmfüllenden Chats.
- Alle Web-Chats teilen sich das Kontingent des fonio-Abos (Web-Chat-Gespräche pro Monat).
- Ein neuer Branchen-Chat braucht: Assistent in fonio, Widget mit erlaubten Websites, Eintrag in
  `WIDGETS` in `public/chat.html` und in `DEMO_BRANCHEN` in `lib/demo.ts`.
