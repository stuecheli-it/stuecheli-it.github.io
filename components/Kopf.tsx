import { MENUE_PUNKTE } from "@/lib/navigation";
import BranchenMenue from "./BranchenMenue";
import HandyMenue from "./HandyMenue";
import { Telefon } from "./Icons";

export default function Kopf() {
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
          <a className="btn btn-dunkel btn-klein" href="tel:+41615391202">
            <Telefon />
            Demo anrufen
          </a>
          <HandyMenue />
        </nav>
      </div>
    </header>
  );
}
