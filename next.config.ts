import type { NextConfig } from "next";

// Statischer Export: `npm run build` erzeugt `out/`, das GitHub Pages ausliefert.
// Alles in `public/` (Logos, Kunden-Testseiten unter /test/) wird unverändert mitkopiert.
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
};

export default nextConfig;
