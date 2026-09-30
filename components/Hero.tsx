import ChatKnopf from "./ChatKnopf";
import { Chat } from "./Icons";
import LiveDemoFormular from "./LiveDemoFormular";
import StimmeAuftrag from "./StimmeAuftrag";

export default function Hero() {
  return (
    // Im Hero steht der Beispiel-Chat schon als Link, darum tritt der Chat-Knopf hier zurück
    <section className="hero" data-ohne-chatknopf>
      <div className="wrap">
        <div>
          <h1>
            Ihr Telefon nimmt <span className="glanz">jetzt immer ab.</span>
          </h1>
          <p className="lead">
            Der KI-Telefonassistent für Betriebe in der Ostschweiz: nimmt jeden Anruf entgegen, gibt Auskunft und meldet Ihnen, was wirklich zu Ihnen muss. Persönlich
            eingerichtet und betreut aus St.&nbsp;Gallen, ohne neue Telefonanlage.
          </p>
          {/* Anruf-Demo mit der eigenen Website (fonio-Partner-Link); in derselben Zeile der Beispiel-Chat */}
          <LiveDemoFormular
            zusatz={
              <ChatKnopf className="hero-chat">
                <Chat />
                Beispiel-Chat
              </ChatKnopf>
            }
          />
        </div>

        <div className="demo">
          <StimmeAuftrag />
        </div>
      </div>
    </section>
  );
}
