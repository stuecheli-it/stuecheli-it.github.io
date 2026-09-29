# Website V2.3: Arbeitsplan

Ausgangslage: V2.2 ist live und abgeschlossen (Git-Marke `v2.2.3`, Commit e5b6c1e, Stand 29.09.2026).
Neu in V2.2: Live-Demo mit der eigenen Website über den fonio-Partner-Link (statt Demo-Nummer), Nachfassen beim
Zurückkommen, drei Schritte und Beispiel-Adresse pro Branche, Preise mit fonio abgeglichen (Web-Chat korrigiert,
Zusatzkosten in CHF, Jahresabo wie auf fonio.ai), Einrichtung «offeriert auf Anfrage, passend zu Ihrem Betrieb».

Gearbeitet wird im Zweig `v2.3`. Die Live-Seite ändert sich erst, wenn `v2.3` in `main` übernommen wird,
denn nur ein Push auf `main` veröffentlicht (Workflow «Website veröffentlichen»).

## Erledigt: Überarbeitung nach Design-Kritik (29.09.2026, noch nicht veröffentlicht)

Kritik der Startseite: 22/32 (Bericht in `../.impeccable/critique/`). Umgesetzt:

- [x] **Region und Person:** Ostschweiz / St. Gallen in Augenbraue, Lead, Fusszeile und Beschreibung. Der Name des
      Inhabers steht auf Wunsch nur noch in der Personenzeile im Kontakt (plus Impressum, Datenschutz, Anfrage-Chat).
- [x] **Begriffe:** «Anruf-Demo» (fonio ruft an, Hinweis auf die Telefonnummer vor dem Klick) und «Beispiel-Chat»;
      Fehlermeldung unterscheidet leer / ungültig; Fachbegriffe im Plan-Fenster erklärt.
- [x] **Weg zur Anfrage:** Preiskarten mit «Unverbindlich anfragen» (Plan wird mitgegeben), «Alle Details» als Link;
      Kontakt beginnt mit «Einrichtung besprechen»; Handy-Kopfzeile «Anfragen» statt «Live-Demo»; Chat-Knopf tritt
      über Hero, Preiskarten, Kontakt und Fusszeile zurück.
- [x] **Kürzer:** Leistungen und Vorgehen zu «Wie es funktioniert» zusammengelegt (nach den Preisen), Chips «Für wen
      sich das lohnt» und Hinweis «Nach dem Livegang» (jetzt im Kleingedruckten) entfernt. Handy: 11,5 → 8,5 Bildschirme.
- [x] **Branchen-Tabs:** echte Tabs an Ort und Stelle, Wechsel endet nach der ersten Wahl, Pausenknopf; Hero-Chips
      zeigen das Beispiel statt die Seite zu wechseln; Beispiel-Chat startet mit der zuletzt gewählten Branche.
- [x] **Lesbarkeit:** Kiesel `#67707d` und Grün `#0c7a62` (AA auch in kleiner Schrift), «PARTNER» 11 px, alle
      Tippflächen auf dem Handy ≥ 44 px, Handy-Menü füllt den Bildschirm, Gitternetz im Hero entfernt.

Hinweis zum Punkt «Live-Demo-Knopf auf dem Handy beim Scrollen» unten: Die Kopfzeile zeigt auf dem Handy jetzt
«Anfragen». Die Anruf-Demo steht im Hero, im Menü und im Kontakt. Eine mitlaufende Leiste bleibt offen.

## Offene Klärungen

- [ ] **Partner-Leads bei fonio** (Frage an David): Zählen Testkonten über den Code `ac` fest als unsere Kunden, und
      sehen wir sie mit Kontaktdaten im Partner-Dashboard? Davon hängt ein Satz in Datenschutz Abschnitt 4 ab.
- [ ] **WhatsApp «Antworten aus Ihrer Wissensdatenbank»** steht bei fonio nicht auf der WhatsApp-Karte: bestätigen oder streichen.
- [ ] **Interne Unterlagen** (Strategie, Vorlagen, CRM) nennen noch Einrichtung CHF 1'290: anpassen oder als interne Kalkulation lassen?

## Priorität 1: keine Anfrage verlieren

- [ ] **E-Mail bei jeder neuen Anfrage** (fonio-Fähigkeit «E-Mail senden» beim Assistenten «Webseite - Anfragen»)
- [ ] **Kontext im Anfrage-Chat**: «Kontext festlegen» gibt es beim Web-Chat nur im Paket Scale; ohne Scale kommt der
      Kontext (Plan, Website, Branche) nicht beim Assistenten an. Entscheiden: so lassen oder anders lösen.
- [ ] **Live-Demo-Knopf auf dem Handy beim Scrollen** (schmale Leiste «Eigene Demo erstellen», sobald der Hero weg ist)

## Priorität 2: Vertrauen

- [ ] **Seite «Über mich»** mit Foto und kurzem Text. Braucht Foto und Stichworte vom Inhaber.
- [ ] **Erste Referenz** eines Pilotbetriebs (Zitat, Name, Ort, eventuell Zahl). Erst mit echtem Kunden.
- [ ] **Häufige Fragen auf der Startseite** (Datenschutz, KI erkennbar, Kündigung, Nummer bleibt)

## Priorität 3: Reichweite

- [ ] **Vorschaubild für geteilte Links** (Open Graph) und Firmendaten für Google (LocalBusiness)
- [ ] **Eigene Domain**, z.B. stuecheli-it.ch. Kauf durch den Inhaber, Umstellung durch Claude.
- [ ] **Google-Unternehmensprofil** mit Link zur Website
- [ ] **Besucherzahlen ohne Cookies** (Plausible oder GoatCounter), inkl. Zählung gestarteter Live-Demos

## Später

- [ ] Rechner «Was kosten Sie verpasste Anrufe?»
- [ ] Hörprobe im Hero (braucht Aufnahmen vom Inhaber)
- [ ] Beispielfragen im Chat direkt übernehmen statt nur kopieren (fonio bietet dafür heute keine Schnittstelle)
- [ ] Offene Ideen aus V2.1: Musterbericht nach dem Anruf, Sprachen in der Demo, Pilotplatz-Zähler, Beratungstermin buchen

## Veröffentlichen

1. Änderungen im Zweig `v2.3` lokal prüfen (`npm run build`, statischer Server auf Port 8093).
2. Nach dem Go des Inhabers: `v2.3` per fast-forward in `main` übernehmen und `main` pushen.
3. Deploy-Lauf «Website veröffentlichen» abwarten, Live-Seite prüfen, Marke setzen (`v2.3.0`, `v2.3.1` …; nicht `v2.3`, so heisst der Zweig).
4. Scheitert der Schritt «configure-pages» mit «Not Found»: In GitHub unter Settings → Pages die Quelle wieder auf
   «GitHub Actions» stellen und den Lauf neu starten (so geschehen am 28.09.2026).
