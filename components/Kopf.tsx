import type { BrancheId } from "@/lib/branchen";
import { FIRMA } from "@/lib/firma";
import { MENUE_PUNKTE } from "@/lib/navigation";
import BranchenMenue from "./BranchenMenue";
import HandyMenue from "./HandyMenue";
import KopfAktionen from "./KopfAktionen";
import { Telefon } from "./Icons";

/** Kopfzeile; auf Branchenseiten mit `branche`, damit Demo und Anfrage dazu passen */
export default function Kopf({ branche }: { branche?: BrancheId } = {}) {
  return (
    <header className="kopf">
      <div className="wrap">
        {/* Logo als Bildmarke plus echte Schrift (nach Logo-Richtlinien: Geist Bold / Geist Regular in Versalien) */}
        <a className="logo marke" href="/" aria-label="Stücheli IT Consulting, zur Startseite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="marke-orb" src="/assets/stuecheli-favicon.svg" alt="" />
          <span className="marke-text" aria-hidden="true">
            <span className="marke-name">Stücheli</span>
            <span className="marke-zusatz">IT Consulting</span>
          </span>
        </a>
        <nav className="nav" aria-label="Hauptnavigation">
          {MENUE_PUNKTE.map((p) =>
            p.href === "/#branchen" ? (
              <BranchenMenue key={p.href} />
            ) : (
              <a key={p.href} href={p.href}>{p.text}</a>
            ),
          )}
          <KopfAktionen branche={branche} />
          {/* Auf dem Handy: Anruf direkt erreichbar, Anfrage und Chat stehen im Menü */}
          <a className="btn btn-dunkel btn-klein kopf-tel" href={FIRMA.demoTelefonLink}>
            <Telefon />
            Demo anrufen
          </a>
          <HandyMenue branche={branche} />
        </nav>
      </div>
    </header>
  );
}
