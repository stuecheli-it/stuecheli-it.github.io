# Homepage & Webchat-Testumgebung: Anleitung

Stand: 24.09.2026 (Website 2.1, Next.js). Die Website liegt im Ordner `homepage\` und wird mit
Next.js, React und TypeScript gebaut. GitHub Pages liefert das fertige Ergebnis als statische Seite aus.

## Aufbau

| Ort | Zweck |
|---|---|
| `app/page.tsx` | Startseite: setzt die Abschnitte zusammen |
| `app/layout.tsx` | Seitentitel, Beschreibung, Vorschau für Social Media, Schrift Geist |
| `app/globals.css` | Design der Homepage (hell, Nachtblau im Hero und Kontakt, Verlauf Türkis→Blau→Violett) |
| `components/` | Die Abschnitte: Kopf, Hero, Branchen, Preise, Leistungen, Vorgehen, Kontakt, Fuss |
| `lib/preise.ts` | **Alle Preise** (fonio-Listenpreise in CHF, Einrichtungspreise, Paketinhalte) |
| `lib/branchen.ts` | Beispielgespräche und Nutzen je Branche |
| `lib/fonio.ts` | Widget-ID des eigenen fonio-Webchats |
| `public/assets/` | Logos, Favicon, fonio-Logo |
| `public/test/` | Kunden-Testseiten, werden unverändert ausgeliefert (siehe unten) |
| `intern/` | Klartext der internen Testübersicht. **Nur lokal**, wird nie hochgeladen |
| `schutz-tool.js` | Verschlüsselt die interne Testübersicht |
| `.github/workflows/veroeffentlichen.yml` | Baut und veröffentlicht die Seite automatisch |

## Preise ändern

Nur `lib/preise.ts` anpassen: Monats- und Jahresbetrag in CHF, Einrichtung, Paketinhalte, Stand-Datum.
Rabatt-Anzeige, Ersparnis und Monatsbetrag im Jahresabo rechnet die Seite selbst aus.

---

## 1. Lokal ansehen

Einmalig im Ordner `homepage\` die Pakete installieren, danach den Entwicklungsserver starten:

```bash
npm install
npm run dev
```

Dann http://localhost:8087 öffnen. Änderungen erscheinen sofort. Damit der eigene Chat auch lokal
antwortet, muss `http://localhost:8087` im fonio-Dashboard beim Widget unter «Erlaubte Websites» stehen.

Vor dem Veröffentlichen prüfen:

```bash
npm run typecheck
npm run build
```

## 2. Veröffentlichen

Einmalig: auf GitHub im Repository `stuecheli-it.github.io` unter **Settings → Pages → Source**
«GitHub Actions» wählen.

Danach genügt ein Push auf `main`. GitHub baut die Seite und stellt sie nach ein bis zwei Minuten
online. Den Fortschritt zeigt der Reiter **Actions** im Repository.

**Eigene Domain später:** Lässt sich unter Settings → Pages hinterlegen. Danach die neue Adresse in
fonio unter «Erlaubte Websites» eintragen und in `app/layout.tsx` bei `metadataBase` anpassen.

---

## 3. fonio-Webchat auf einer Kunden-Testseite aktivieren

Pro Kunde (im jeweiligen fonio-Assistenten):

1. Dashboard → Assistent → **Webchat verwalten** → Reiter **Website-Widget**.
2. Unter **Erlaubte Websites** `https://stuecheli-it.github.io` eintragen (ein Eintrag gilt für alle Testseiten).
3. Widget auf **Aktiv** stellen und die **Widget-ID** kopieren.
4. In der Testseite eintragen, z.B. in `public/test/stadlerit.html`:
   ```js
   const FONIO_WIDGET_ID = "HIER-DIE-ID";
   ```
5. Veröffentlichen (Push), Testseite öffnen. Unten links zeigt eine Statusanzeige, ob das Widget geladen wurde.

**Wichtig:** Widget-Änderungen im Dashboard wirken sofort auf allen Seiten mit diesem Widget. Geht der
Kunde live, muss **seine** Website zusätzlich unter «Erlaubte Websites» stehen, und Begrüssung und Farben
gelten dann für Testseite und Live-Seite gemeinsam.

## 4. Neue Kunden-Testseite anlegen

1. `public/test/_vorlage.html` kopieren und umbenennen, z.B. `public/test/muster-ag.html`
   (Kleinbuchstaben, keine Umlaute oder Leerzeichen).
2. `KUNDENNAME` ersetzen und die Widget-ID des Kunden eintragen.
3. Den Link in `intern/_uebersicht-inhalt.html` ergänzen und die Übersicht neu verschlüsseln:
   ```bash
   npm run schutz -- "PASSWORT"
   ```
   Das schreibt `public/test/index.html` neu. Das Passwort nie in eine Datei schreiben.
4. Veröffentlichen und dem Kunden den direkten Link schicken.

Die Testseiten sind von der Homepage nicht verlinkt und tragen `noindex`.
