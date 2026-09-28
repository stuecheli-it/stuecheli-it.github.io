import type { BrancheId } from "@/lib/branchen";
import { MENUE_PUNKTE } from "@/lib/navigation";
import BranchenMenue from "./BranchenMenue";
import HandyMenue from "./HandyMenue";
import KopfAktionen from "./KopfAktionen";
import { Globus } from "./Icons";
import LiveDemoKnopf from "./LiveDemoFenster";
import LiveDemoNachfassen from "./LiveDemoNachfassen";

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
          {/* Auf dem Handy: Live-Demo direkt erreichbar, Anfrage und Chat stehen im Menü */}
          <LiveDemoKnopf className="btn btn-dunkel btn-klein kopf-tel" branche={branche}>
            <Globus />
            Live-Demo
          </LiveDemoKnopf>
          <HandyMenue branche={branche} />
        </nav>
        {/* Nach der Live-Demo: Einrichtung anbieten, wenn der Besucher zurückkommt (erscheint unten links) */}
        <LiveDemoNachfassen branche={branche} />
      </div>
    </header>
  );
}
