# Website V2.2: Arbeitsplan

Ausgangslage: V2.1 ist live und abgeschlossen (Git-Marke `v2.1.9`, Commit 212a983, Stand 28.09.2026).
Enthalten sind Branchenseiten, Impressum und Datenschutz, Handy-Menü, eigene Chat-Fenster mit sechs
Branchen-Demos und dem Anfrage-Chat sowie die neue Kopfzeile mit «Branchen», «Demo» und «Unverbindlich anfragen».

**29.09.2026: V2.2 abgeschlossen** mit Marke `v2.2.3` (Commit e5b6c1e). Weiter geht es im Zweig `v2.3`, siehe PLAN-V2.3.md.

Gearbeitet wurde im Zweig `v2.2`. Die Live-Seite ändert sich erst, wenn `v2.2` in `main` übernommen wird,
denn nur ein Push auf `main` veröffentlicht (Workflow «Website veröffentlichen»).

## Priorität 1: keine Anfrage verlieren

- [x] **Live-Demo mit der eigenen Website** statt Demo-Nummer (28.09.2026): Feld im Hero, «Demo» in der Kopfzeile, Kontakt; leitet an den fonio-Partner-Link weiter (lib/livedemo.ts). Demo-Nummer entfernt, Datenschutz Abschnitt 4 neu.
- [x] **Nachfassen nach der Live-Demo** (28.09.2026): Karte beim Zurückkommen, «Einrichtung besprechen» öffnet den Anfrage-Chat mit Website und Branche; drei Schritte unter dem Feld; Beispiel-Adresse pro Branche.

- [ ] **E-Mail bei jeder neuen Anfrage** (fonio-Fähigkeit «E-Mail senden» beim Assistenten «Webseite - Anfragen»)
- [x] ~~Demo-Nummer passend machen~~: Nummer ist nicht mehr auf der Website (28.09.2026).
- [ ] **Kontext im Anfrage-Chat einschalten**: fonio meldet `isSetContextEnabled: false`, der Plan-Kontext kommt so wahrscheinlich nicht an.

## Priorität 2: Vertrauen

- [ ] **Seite «Über mich»** mit Foto und kurzem Text. Braucht Foto und Stichworte vom Inhaber.
- [ ] **Erste Referenz** eines Pilotbetriebs (Zitat, Name, Ort, eventuell Zahl). Erst mit echtem Kunden.
- [ ] **Häufige Fragen auf der Startseite** (Datenschutz, KI erkennbar, Kündigung, Nummer bleibt)

## Priorität 3: Reichweite

- [ ] **Vorschaubild für geteilte Links** (Open Graph) und Firmendaten für Google (LocalBusiness)
- [ ] **Eigene Domain**, z.B. stuecheli-it.ch. Kauf durch den Inhaber, Umstellung durch Claude.
- [ ] **Google-Unternehmensprofil** mit Link zur Website

## Später

- [ ] Rechner «Was kosten Sie verpasste Anrufe?»
- [ ] Hörprobe im Hero (braucht Aufnahmen vom Inhaber)
- [ ] Besucherzahlen ohne Cookies (Plausible oder GoatCounter)
- [ ] Beispielfragen im Chat direkt übernehmen statt nur kopieren (fonio bietet dafür heute keine Schnittstelle)
- [ ] Offene Ideen aus V2.1: Rückruf durch die KI, Musterbericht nach dem Anruf, Sprachen in der Demo, Pilotplatz-Zähler, Beratungstermin buchen

## Veröffentlichen

1. Änderungen im Zweig `v2.2` lokal prüfen (`npm run dev`, Port 8087, oder statischer Build).
2. Nach dem Go des Inhabers: `v2.2` per fast-forward in `main` übernehmen und `main` pushen.
3. Deploy-Lauf «Website veröffentlichen» abwarten, Live-Seite prüfen, Marke setzen (`v2.2.0`, `v2.2.1` …; nicht `v2.2`, so heisst der Zweig).
