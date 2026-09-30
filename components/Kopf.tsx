import type { BrancheId } from "@/lib/branchen";
import { kopfAnfrage } from "@/lib/fonio";
import { MENUE_PUNKTE } from "@/lib/navigation";
import AnfrageKnopf from "./AnfrageKnopf";
import BranchenMenue from "./BranchenMenue";
import HandyMenue from "./HandyMenue";
import KopfAktionen from "./KopfAktionen";
import LiveDemoNachfassen from "./LiveDemoNachfassen";

/** Kopfzeile; auf Branchenseiten mit `branche`, damit Demo und Anfrage dazu passen */
export default function Kopf({ branche }: { branche?: BrancheId } = {}) {
  return (
    <header className="kopf">
      <div className="wrap">
        {/* Logo als Bildmarke plus echte Schrift (nach Logo-Richtlinien: Geist Bold / Geist Regular in Versalien) */}
        <a className="logo marke" href="/" aria-label="Etivo – KI-Assistenten und Beratung, zur Startseite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="marke-orb" src="/assets/stuecheli-favicon.svg" alt="" />
          <span className="marke-text" aria-hidden="true">
            <span className="marke-name">Etivo</span>
            <span className="marke-zusatz">KI-Assistenten und Beratung</span>
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
          {/* Auf dem Handy: die Anfrage direkt erreichbar; die Anruf-Demo steht im Hero und im Menü */}
          <AnfrageKnopf className="btn btn-dunkel btn-klein kopf-tel" kontext={kopfAnfrage(branche)}>
            Anfragen
          </AnfrageKnopf>
          <HandyMenue branche={branche} />
        </nav>
        {/* Nach der Live-Demo: Einrichtung anbieten, wenn der Besucher zurückkommt (erscheint unten links) */}
        <LiveDemoNachfassen branche={branche} />
      </div>
    </header>
  );
}
