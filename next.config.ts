import type { NextConfig } from "next";

// Statischer Export: `npm run build` erzeugt `out/`, das GitHub Pages ausliefert.
// Alles in `public/` (Logos, Kunden-Testseiten unter /test/) wird unverändert mitkopiert.
const nextConfig: NextConfig = {
  output: "export",
  // Jede Seite als Ordner mit index.html (z.B. /branchen/garage/), so liefert GitHub Pages sie sauber aus
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
