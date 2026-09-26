# Website V2.1: Arbeitsplan

Ausgangslage: Version 2.0 ist live (Git-Marke `v2.0`, Stand 26.09.2026).
Gearbeitet wird im Zweig `v2.1`. Die Live-Seite ändert sich erst, wenn `v2.1` in `main` übernommen wird,
denn nur ein Push auf `main` veröffentlicht (Workflow «Website veröffentlichen»).

## Priorität 1: Pflicht

- [ ] **Datenschutzerklärung** (beide fonio-Chats bearbeiten Personendaten, Informationspflicht nach Schweizer Datenschutzgesetz). Entwurf durch Claude, Prüfung durch den Inhaber.
- [ ] **Impressum** mit Firmenangaben.
- [ ] **Vorschaubild und Firmendaten für Google** (Open-Graph-Bild für geteilte Links, strukturierte Daten LocalBusiness).

## Priorität 2: mehr Anfragen

- [ ] **Rechner «Was kosten Sie verpasste Anrufe?»**: Anrufe pro Tag, Anteil verpasst, Auftragswert; Ergebnis entgangener Umsatz pro Monat neben dem Preis von Telefon KI Solo.
- [ ] **Anfrage-Chat kennt den gewählten Plan** (fonio `setContext`, z.B. «Telefon KI Solo»).
- [ ] **Hörprobe im Hero**: Play-Knopf pro Branche, echtes fonio-Gespräch synchron zu Welle und Auftragskarte. Braucht Aufnahmen vom Inhaber.

## Weitere Ideen

- [ ] Rückruf durch die KI (ausgehende Anrufe, Team-Plan, Einwilligung für die Telefonnummer)
- [ ] Musterbericht nach dem Anruf (E-Mail/WhatsApp-Vorschau)
- [ ] Sprachen-Umschalter in der Demo (FR, IT, EN)
- [ ] Eigene Seiten pro Branche (Garage, Coiffeur, Fahrschule …)
- [ ] Pilotplatz-Zähler (nur mit echter Zahl)
- [ ] Beratungstermin direkt buchen

## Veröffentlichen

1. Änderungen im Zweig `v2.1` lokal prüfen (`npm run dev`, Port 8087).
2. Nach dem Go des Inhabers: `v2.1` in `main` übernehmen und `main` pushen.
3. Deploy-Lauf «Website veröffentlichen» abwarten, Live-Seite prüfen, Marke `v2.1` setzen.
