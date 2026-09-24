// Verschlüsselt die interne Testseiten-Übersicht mit einem Passwort.
//
// Aufruf:   node schutz-tool.js "MEIN-PASSWORT"
//
// Liest  test/_uebersicht-inhalt.html  (Klartext, wird NICHT veröffentlicht)
// und schreibt  test/index.html  (Passwortseite mit AES-256-verschlüsseltem Inhalt).
// Nach jeder Änderung an der Übersicht oder des Passworts neu ausführen,
// danach wie üblich per git add/commit/push veröffentlichen.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const passwort = process.argv[2];
if (!passwort) {
  console.error('Passwort fehlt. Aufruf: node schutz-tool.js "MEIN-PASSWORT"');
  process.exit(1);
}

const inhalt = fs.readFileSync(path.join(__dirname, "intern", "_uebersicht-inhalt.html"), "utf8");

const ITERATIONEN = 300000;
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const schluessel = crypto.pbkdf2Sync(passwort, salt, ITERATIONEN, 32, "sha256");
const cipher = crypto.createCipheriv("aes-256-gcm", schluessel, iv);
const verschluesselt = Buffer.concat([cipher.update(inhalt, "utf8"), cipher.final(), cipher.getAuthTag()]);

const seite = `<!DOCTYPE html>
<html lang="de-CH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Interner Bereich | Stücheli IT Consulting</title>
  <link rel="icon" href="../assets/favicon.ico" sizes="any">
  <link rel="icon" href="../assets/stuecheli-favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="intern.css">
  <style>
    .schloss { max-width: 420px; margin: 80px auto; text-align: center; }
    .schloss input {
      width: 100%; padding: 13px 16px; border-radius: 10px;
      border: 1px solid var(--linie); background: var(--karte); color: var(--weiss);
      font: inherit; font-size: 1rem; margin: 14px 0; box-sizing: border-box;
    }
    .schloss input:focus { outline: none; border-color: var(--cyan); }
    .schloss .fehler { color: #ff8a8f; font-size: 0.9rem; min-height: 1.4em; margin: 8px 0 0; }
    .schloss button { width: 100%; border: 0; cursor: pointer; }
  </style>
</head>
<body>

<header class="site">
  <div class="wrap">
    <a class="logo" href="../index.html">
      <img src="../assets/stuecheli-logo-horizontal-dunkel.svg" alt="Stücheli IT Consulting">
    </a>
    <nav class="main"><a href="../index.html">Zur Homepage</a></nav>
  </div>
</header>

<section class="block" id="gate">
  <div class="wrap">
    <div class="schloss">
      <h2>🔒 Interner Bereich</h2>
      <p style="color:var(--grau)">Dieser Bereich ist passwortgeschützt.</p>
      <input type="password" id="pw" placeholder="Passwort" autocomplete="current-password">
      <button class="btn" id="auf">Öffnen</button>
      <p class="fehler" id="fehler"></p>
    </div>
  </div>
</section>

<section class="block" id="inhaltBereich" hidden>
  <div class="wrap" id="inhalt"></div>
</section>

<footer class="site">
  <div class="wrap">
    <div>
      <div class="name">Stücheli IT Consulting</div>
      <div class="zusatz">Interne Testumgebung · © 2026</div>
    </div>
  </div>
</footer>

<script>
  const DATEN = {
    salt: "${salt.toString("base64")}",
    iv: "${iv.toString("base64")}",
    ct: "${verschluesselt.toString("base64")}",
    iter: ${ITERATIONEN}
  };
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  async function entsperren(pw) {
    const enc = new TextEncoder();
    const km = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64(DATEN.salt), iterations: DATEN.iter, hash: "SHA-256" },
      km, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const klar = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(DATEN.iv) }, key, b64(DATEN.ct));
    return new TextDecoder().decode(klar);
  }

  async function versuchen(pw, still) {
    try {
      const html = await entsperren(pw);
      document.getElementById("inhalt").innerHTML = html;
      document.getElementById("gate").hidden = true;
      document.getElementById("inhaltBereich").hidden = false;
      try { sessionStorage.setItem("uebersicht-pw", pw); } catch (e) {}
    } catch (e) {
      if (!still) document.getElementById("fehler").textContent = "Falsches Passwort.";
    }
  }

  document.getElementById("auf").addEventListener("click", () => versuchen(document.getElementById("pw").value, false));
  document.getElementById("pw").addEventListener("keydown", e => {
    if (e.key === "Enter") versuchen(document.getElementById("pw").value, false);
  });

  try {
    const gemerkt = sessionStorage.getItem("uebersicht-pw");
    if (gemerkt) versuchen(gemerkt, true);
  } catch (e) {}
</script>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "public", "test", "index.html"), seite, "utf8");
console.log("test/index.html neu erzeugt und verschlüsselt (" + verschluesselt.length + " Bytes Inhalt).");
