import { Telefon } from "./Icons";

export default function Kopf() {
  return (
    <header className="kopf">
      <div className="wrap">
        <a className="logo" href="#" aria-label="Stücheli IT Consulting, zum Seitenanfang">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/stuecheli-logo-horizontal-hell-knapp.svg" alt="Stücheli IT Consulting" />
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
