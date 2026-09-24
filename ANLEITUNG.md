# Homepage & Webchat-Testumgebung: Anleitung

Stand: 06.09.2026 (Website 2.0). Diese Website liegt im Ordner `homepage\` und besteht aus:

| Datei | Zweck |
|---|---|
| `index.html` | Deine Homepage (Website 2.0: hell mit Nachtblau im Hero und Kontakt, Verlauf Türkis→Blau→Violett, animiertes Schaubild, Branchen-Umschalter, Preise mit Popup, fonio-Webchat mit Widget-ID im Kopfbereich) |
| `style.css` | Design der Homepage (hell). Die interne Testübersicht nutzt das alte dunkle Design in `test/intern.css` |
| `assets/` | Logo (horizontal dunkel), Favicon, fonio-Logo, kopiert aus `Logo\Final` und `Flyer\Quelle` |
| `test/index.html` | Interne Übersicht aller Kunden-Testseiten (nicht von der Homepage verlinkt, `noindex`) |
| `test/stadlerit.html` | Testseite stadler IT AG: Nachbau ihrer echten Startseite (www.stadler-it.ch) mit fonio-Webchat. Das stadler-Logo wird direkt von stadler-it.ch geladen |
| `test/_vorlage.html` | Kopiervorlage für weitere Kunden (eigenständig, Farben pro Kunde anpassbar über `--akzent`) |

Inhalte der Homepage stammen aus der Ablage: Flyer (Headline, Demo-Nummer +41 61 539 12 02, vier Punkte, drei Schritte), LinkedIn-Seitentexte (Info-Text) und `Akquise\Strategie\01-Angebot-und-Preise.md` (Pakete Start/Betrieb/Individuell, Pilotangebot). Kontakt: stuecheli.it@bluewin.ch.

---

## 1. Website kostenlos veröffentlichen (GitHub Pages)

fonio verlangt für das Widget eine **HTTPS-Adresse** (HTTP nur für localhost). GitHub Pages liefert das gratis und ohne Wartung:

1. Auf https://github.com ein Konto erstellen (falls noch keines vorhanden).
2. Neues Repository anlegen, Name exakt: `DEIN-BENUTZERNAME.github.io` (öffentlich).
3. Den **Inhalt** des Ordners `homepage\` hochladen (auf der Repository-Seite: *Add file → Upload files*, alle Dateien und den Ordner `test` hineinziehen). `index.html` muss auf der obersten Ebene liegen.
4. Nach 1–2 Minuten ist die Seite erreichbar unter:
   `https://DEIN-BENUTZERNAME.github.io`

Die Testseiten liegen dann unter:
- Übersicht: `https://DEIN-BENUTZERNAME.github.io/test/`
- StadlerIT: `https://DEIN-BENUTZERNAME.github.io/test/stadlerit.html`

**Änderungen veröffentlichen:** Datei im Repository ersetzen (Upload überschreibt), nach ca. 1 Minute live.

**Eigene Domain später:** Eine Domain (z.B. stuecheli-consulting.ch) lässt sich bei GitHub Pages hinterlegen. Achtung: Danach ändert sich die Origin, sie muss in fonio neu unter "Erlaubte Websites" eingetragen werden.

---

## 2. fonio-Webchat auf einer Testseite aktivieren

Pro Kunde (im jeweiligen fonio-Assistenten):

1. Dashboard → Assistent → **Webchat verwalten** → Reiter **Website-Widget**.
2. Unter **Erlaubte Websites** die exakte Origin eintragen:
   `https://DEIN-BENUTZERNAME.github.io`
   (nur die Origin, ohne `/test/...`; ein Eintrag gilt für alle Testseiten).
3. Widget auf **Aktiv** stellen → der Bereich **Installation** erscheint mit dem Script und der **Widget-ID**.
4. Die Widget-ID kopieren und in der Testseite eintragen, z.B. in `test/stadlerit.html`:
   ```js
   const FONIO_WIDGET_ID = "HIER-DIE-ID";
   ```
5. Datei hochladen/ersetzen, Testseite öffnen. Unten links zeigt eine Statusanzeige, ob das Widget geladen wurde; die Buttons oben testen die SDK-Funktionen (open, close, ...).

**Wichtig (aus der Praxis-Referenz):**
- Widget-Änderungen im Dashboard wirken sofort auf allen Seiten mit dem Script; vor Änderungen am Live-Kunden lieber zuerst per "Test chat" im Dashboard prüfen.
- Geht der Kunde später live, muss **seine** Website-Origin zusätzlich in "Erlaubte Websites" eingetragen werden. Achtung: dieselbe Widget-Konfiguration (Begrüssung, Farben) gilt dann für Testseite und Live-Site gemeinsam.

---

## 3. Neue Kunden-Testseite anlegen

1. `test/_vorlage.html` kopieren und umbenennen, z.B. `test/muster-ag.html` (Kleinbuchstaben, keine Umlaute/Leerzeichen im Dateinamen).
2. In der Datei `KUNDENNAME` ersetzen und die Widget-ID des Kunden eintragen. Optional die Beispiel-Leistungen durch echte Inhalte ersetzen, der Chat wirkt dann realistischer.
3. In `test/index.html` den vorbereiteten Kommentarblock kopieren und den Link eintragen.
4. Hochladen und dem Kunden den direkten Link schicken.

Die Testseiten sind über die Homepage **nicht** verlinkt und tragen `noindex`, Suchmaschinen ignorieren sie. Wer den Link nicht kennt, findet sie praktisch nicht. Einen echten Passwortschutz gibt es bei statischem Hosting aber nicht.

---

## 4. Lokal testen (ohne Veröffentlichung)

fonio erlaubt `http://localhost` als Origin. Im Ordner liegt dafür ein kleiner Testserver (`serve.js`, benötigt das installierte Node.js):

```bash
node "C:\Users\Consulting\Documents\KI Assistent\Stücheli\homepage\serve.js"
```

Dann `http://localhost:8087` im Browser öffnen und in fonio `http://localhost:8087` als erlaubte Website eintragen. `serve.js` muss beim Hochladen zu GitHub Pages nicht mit, schadet aber auch nicht.
