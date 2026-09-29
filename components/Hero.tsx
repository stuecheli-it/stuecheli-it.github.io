import ChatKnopf from "./ChatKnopf";
import { Chat } from "./Icons";
import LiveDemoFormular from "./LiveDemoFormular";
import StimmeAuftrag from "./StimmeAuftrag";

export default function Hero() {
  return (
    // Im Hero steht der Beispiel-Chat schon als Link, darum tritt der Chat-Knopf hier zurück
    <section className="hero" data-ohne-chatknopf>
      <div className="hero-glow" />
      <div className="wrap">
        <div>
          <div className="augenbraue"><span className="punkt" />KI-Telefonassistent für KMU in der Ostschweiz</div>
          <h1>
            Ihr Telefon nimmt
            <br />
            <span className="glanz">jetzt immer ab.</span>
          </h1>
          <p className="lead">
            Nimmt jeden Anruf entgegen, gibt Auskunft und meldet Ihnen, was wirklich zu Ihnen muss. Persönlich
            eingerichtet und betreut aus St. Gallen, ohne neue Telefonanlage.
          </p>
          {/* Anruf-Demo mit der eigenen Website (fonio-Partner-Link), daneben der Beispiel-Chat */}
          <LiveDemoFormular />
          <ChatKnopf className="hero-chat">
            <Chat />
            Lieber schreiben? Beispiel-Chat öffnen
          </ChatKnopf>
        </div>

        <div className="demo">
          <StimmeAuftrag />
        </div>
      </div>
    </section>
  );
}
