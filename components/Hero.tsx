import ChatKnopf from "./ChatKnopf";
import { Chat } from "./Icons";
import LiveDemoFormular from "./LiveDemoFormular";
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
          {/* Live-Demo mit der eigenen Website (fonio-Partner-Link), daneben der Demo-Chat */}
          <LiveDemoFormular />
          <ChatKnopf className="hero-chat">
            <Chat />
            Oder gleich hier im Chat testen
          </ChatKnopf>
        </div>

        <div className="demo">
          <StimmeAuftrag />
        </div>
      </div>
    </section>
  );
}
