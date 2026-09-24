import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Geist wird beim Build heruntergeladen und von der eigenen Seite ausgeliefert (kein Aufruf zu Google im Browser).
const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-geist" });

const TITEL = "Stücheli IT Consulting | Ihr Telefon nimmt jetzt immer ab";
const BESCHREIBUNG =
  "KI-Telefonassistenten für KMU in der Deutschschweiz: nimmt jeden Anruf entgegen, gibt Auskunft und meldet Ihnen, was wirklich zu Ihnen muss. Eingerichtet und betreut von Stücheli IT Consulting, fonio.ai-Partner.";

export const metadata: Metadata = {
  metadataBase: new URL("https://stuecheli-it.github.io"),
  title: TITEL,
  description: BESCHREIBUNG,
  openGraph: {
    title: TITEL,
    description: "KI-Telefonassistenten für KMU in der Deutschschweiz. Hören Sie ihn selbst: +41 61 539 12 02.",
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
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" className={geist.variable}>
      <body>
        {/* Ohne JavaScript alles sofort sichtbar */}
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
