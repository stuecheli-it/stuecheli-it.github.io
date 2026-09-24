import ChatKnopf from "./ChatKnopf";
import { Chat, Telefon } from "./Icons";
import StimmeAuftrag from "./StimmeAuftrag";

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
          <StimmeAuftrag />
        </div>
      </div>
    </section>
  );
}
