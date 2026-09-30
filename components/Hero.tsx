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
          {/* Situativ wie auf den Branchenseiten («Sie sind auf der Baustelle. Ihr Telefon nimmt ab.») */}
          <h1>
            Sie arbeiten.
            <br />
            <span className="glanz">Ihr Telefon nimmt&nbsp;ab.</span>
          </h1>
          <p className="lead">
            Ein KI-Assistent nimmt Ihre Anrufe entgegen, gibt Auskunft und meldet Ihnen, was wirklich zu Ihnen muss.
            Persönlich eingerichtet aus St.&nbsp;Gallen, ohne neue Telefonanlage.
          </p>
          {/* Anruf-Demo mit der eigenen Website (fonio-Partner-Link); in derselben Zeile der Beispiel-Chat */}
          <LiveDemoFormular
            beschriftung
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
