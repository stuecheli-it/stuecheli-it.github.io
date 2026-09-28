# Website V2.2: Arbeitsplan

Ausgangslage: V2.1 ist live und abgeschlossen (Git-Marke `v2.1.9`, Commit 212a983, Stand 28.09.2026).
Enthalten sind Branchenseiten, Impressum und Datenschutz, Handy-Menü, eigene Chat-Fenster mit sechs
Branchen-Demos und dem Anfrage-Chat sowie die neue Kopfzeile mit «Branchen», «Demo» und «Unverbindlich anfragen».

Gearbeitet wird im Zweig `v2.2`. Die Live-Seite ändert sich erst, wenn `v2.2` in `main` übernommen wird,
denn nur ein Push auf `main` veröffentlicht (Workflow «Website veröffentlichen»).

## Priorität 1: keine Anfrage verlieren

- [ ] **E-Mail bei jeder neuen Anfrage** (fonio-Fähigkeit «E-Mail senden» beim Assistenten «Webseite - Anfragen»)
- [ ] **Demo-Nummer +41 61 539 12 02** passend machen: hängt am Assistenten «Demo Fahrschulen». Allgemeine Demo oder neutrale Begrüssung.
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
