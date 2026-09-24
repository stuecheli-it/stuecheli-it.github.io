import ChatKnopf from "./ChatKnopf";
import { Chat, Mail, TELEFON_PFAD, Telefon } from "./Icons";

const VERLAUF_STOPS = (
  <>
    <stop offset="0" stopColor="#3ff0c9" />
    <stop offset="0.48" stopColor="#3a8cff" />
    <stop offset="1" stopColor="#6b45ff" />
  </>
);

/** Schaubild: Anruf → KI-Assistent → Sie (Zusammenfassung per Mail). */
function Schaubild() {
  return (
    <div className="buehne" aria-hidden="true">
      <svg className="szene" viewBox="0 0 520 190">
        <defs>
          <radialGradient id="glow-szene" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.6" stopColor="#3fc8ff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#3fa0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="body-szene" x1="0.1" y1="0.05" x2="0.9" y2="0.95">{VERLAUF_STOPS}</linearGradient>
        </defs>
        <path className="leitung" d="M110 96 H212" />
        <path className="leitung" d="M308 96 H410" />
        <circle r="4" fill="#3ff0c9"><animateMotion dur="2.4s" repeatCount="indefinite" path="M110 96 H212" /></circle>
        <circle r="4" fill="#3ff0c9"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M308 96 H410" /></circle>
        <circle className="ring" cx="70" cy="96" r="40" />
        <circle className="ring r2" cx="70" cy="96" r="40" />
        <circle className="knoten" cx="70" cy="96" r="38" />
        <g transform="translate(56 82)" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={TELEFON_PFAD} transform="scale(1.15)" />
        </g>
        <g className="orb-gross">
          <circle className="orb-glow" cx="260" cy="96" r="62" fill="url(#glow-szene)" />
          <circle cx="260" cy="96" r="46" fill="url(#body-szene)" />
          <g className="balken" stroke="#ffffff" strokeWidth="5" strokeLinecap="round">
            <line x1="232" y1="90" x2="232" y2="102" />
            <line x1="246" y1="84" x2="246" y2="108" />
            <line x1="260" y1="78" x2="260" y2="114" />
            <line x1="274" y1="84" x2="274" y2="108" />
            <line x1="288" y1="90" x2="288" y2="102" />
          </g>
        </g>
        <circle className="knoten" cx="450" cy="96" r="38" />
        <g transform="translate(436 82)" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <g transform="scale(1.15)"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></g>
        </g>
        <rect x="392" y="18" width="116" height="24" rx="12" fill="rgba(63,240,201,0.14)" stroke="rgba(63,240,201,0.5)" strokeWidth="1" />
        <text className="abzeichen" x="450" y="34" textAnchor="middle">Zusammenfassung</text>
        <text className="beschriftung" x="70" y="168" textAnchor="middle">Anruf</text>
        <text className="beschriftung" x="260" y="176" textAnchor="middle">KI-Assistent</text>
        <text className="beschriftung" x="450" y="168" textAnchor="middle">Sie</text>
      </svg>
    </div>
  );
}

/** Animierte Transkript-Karte eines Beispielanrufs. */
function DemoKarte() {
  return (
    <div className="demo-karte" aria-label="Beispiel eines Anrufs">
      <div className="demo-kopf">
        <svg className="orb" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <radialGradient id="glow-hero" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.72" stopColor="#3fc8ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#3fa0ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="body-hero" x1="0.1" y1="0.05" x2="0.9" y2="0.95">{VERLAUF_STOPS}</linearGradient>
          </defs>
          <circle cx="50" cy="50" r="49" fill="url(#glow-hero)" />
          <circle cx="50" cy="50" r="36.5" fill="url(#body-hero)" />
          <g className="balken" stroke="#ffffff" strokeWidth="5.2" strokeLinecap="round">
            <line x1="30" y1="42.5" x2="30" y2="57.5" />
            <line x1="40" y1="35" x2="40" y2="65" />
            <line x1="50" y1="28" x2="50" y2="72" />
            <line x1="60" y1="35" x2="60" y2="65" />
            <line x1="70" y1="42.5" x2="70" y2="57.5" />
          </g>
        </svg>
        <div>
          <div className="titel">Assistent · Muster Sanitär AG</div>
          <div className="status"><i />Anruf läuft</div>
        </div>
        <div className="zeit">00:42</div>
      </div>
      <div className="verlauf">
        <div className="blase ki b1">Muster Sanitär, guten Tag. Wie kann ich Ihnen helfen?</div>
        <div className="blase anrufer b2">Grüezi, unser Boiler macht kein warmes Wasser mehr.</div>
        <div className="blase ki b3">Das nehme ich gleich auf. Wie lautet Ihre Adresse, und wann sind Sie erreichbar?</div>
        <div className="blase anrufer b4">Hauptstrasse 5 in Sissach, ab 14 Uhr.</div>
        <div className="blase ki b5">Notiert. Herr Muster ruft Sie heute Nachmittag zurück. Auf Wiederhören!</div>
      </div>
      <div className="mail">
        <div className="ico"><Mail strich={2} farbe="#06121f" /></div>
        <div>
          <b>Zusammenfassung per Mail, 10:43</b>
          <span>Boiler defekt · Hauptstrasse 5, Sissach · Rückruf ab 14 Uhr</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="hero-raster" />
      <div className="wrap">
        <div>
          <div className="augenbraue"><span className="punkt" />KI-Telefonassistent für KMU · fonio.ai-Partner</div>
          <h1>
            Ihr Telefon nimmt
            <br />
            <span className="glanz">jetzt immer ab.</span>
          </h1>
          <p className="lead">
            Nimmt jeden Anruf entgegen, gibt Auskunft und meldet Ihnen, was wirklich zu Ihnen muss. Eingerichtet und
            betreut aus der Region, ohne neue Telefonanlage.
          </p>
          <div className="cta">
            <a className="btn btn-primaer" href="tel:+41615391202">
              <Telefon strich={2} />
              +41 61 539 12 02 anrufen
            </a>
            <ChatKnopf className="btn btn-hell">
              <Chat />
              Im Chat testen
            </ChatKnopf>
          </div>
          <p className="klein">Hören Sie ihn selbst. Kostenlos, unverbindlich, rund um die Uhr.</p>
        </div>

        <div className="demo">
          <Schaubild />
          <DemoKarte />
        </div>
      </div>
    </section>
  );
}
