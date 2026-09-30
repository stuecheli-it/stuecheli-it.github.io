import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";

// Schriften werden beim Build heruntergeladen und von der eigenen Seite ausgeliefert (kein Aufruf zu Google im Browser).
// Bricolage Grotesque für grosse Titel (eigenwillig, warm), Geist für Text und die Wortmarke im Logo.
const anzeige = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700", "800"], display: "swap", variable: "--font-anzeige" });
const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-geist" });

const TITEL = "Stücheli IT Consulting | Ihr Telefon nimmt jetzt immer ab";
const BESCHREIBUNG =
  "KI-Telefonassistenten für KMU in der Ostschweiz: nimmt jeden Anruf entgegen, gibt Auskunft und meldet Ihnen, was wirklich zu Ihnen muss. Persönlich eingerichtet und betreut aus St. Gallen, fonio.ai-Partner.";

export const metadata: Metadata = {
  metadataBase: new URL("https://stuecheli-it.github.io"),
  title: TITEL,
  description: BESCHREIBUNG,
  openGraph: {
    title: TITEL,
    description: "KI-Telefonassistenten für KMU in der Ostschweiz, eingerichtet aus St. Gallen. Hören Sie Ihren Assistenten in einer Anruf-Demo mit Ihrer eigenen Website.",
    type: "website",
    url: "/",
    locale: "de_CH",
  },
  icons: {
    icon: [
      { url: "/assets/favicon.ico", sizes: "any" },
      { url: "/assets/stuecheli-favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0c1b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" className={`${anzeige.variable} ${geist.variable}`}>
      <body>
        {/* Ohne JavaScript: Ablauf-Linie gleich vollständig zeigen */}
        <noscript>
          <style>{".schritt .strich{transform:none!important}.reveal{opacity:1!important;transform:none!important;clip-path:none!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
