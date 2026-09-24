import { Telefon } from "./Icons";

export default function Kopf() {
  return (
    <header className="kopf">
      <div className="wrap">
        {/* Logo als Bildmarke plus echte Schrift (nach Logo-Richtlinien: Geist Bold / Geist Regular in Versalien) */}
        <a className="logo marke" href="#" aria-label="Stücheli IT Consulting, zum Seitenanfang">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="marke-orb" src="/assets/stuecheli-favicon.svg" alt="" />
          <span className="marke-text" aria-hidden="true">
            <span className="marke-name">Stücheli</span>
            <span className="marke-zusatz">IT Consulting</span>
          </span>
        </a>
        <nav className="nav" aria-label="Hauptnavigation">
          <a href="#branchen">Branchen</a>
          <a href="#leistungen">Leistungen</a>
          <a href="#vorgehen">Vorgehen</a>
          <a href="#preise">Preise</a>
          <a href="#kontakt">Kontakt</a>
          <a className="btn btn-dunkel btn-klein" href="tel:+41615391202">
            <Telefon />
            Demo anrufen
          </a>
        </nav>
      </div>
    </header>
  );
}
