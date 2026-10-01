import Kopf from "@/components/Kopf";
import Hero from "@/components/Hero";
import Branchen from "@/components/Branchen";
import Preise from "@/components/Preise";
import { Ablauf, Fragen, Fuss, Kontakt } from "@/components/Abschnitte";
import ChatStarter from "@/components/ChatStarter";
import Reveal from "@/components/Reveal";
import AnkerSprung from "@/components/AnkerSprung";
import Effekte from "@/components/Effekte";

export default function Startseite() {
  return (
    <>
      <Kopf />
      <main>
        <Hero />
        <Branchen />
        <Preise />
        <Ablauf />
        <Fragen />
        <Kontakt />
      </main>
      <Fuss />
      <ChatStarter />
      <Reveal />
      <AnkerSprung />
      <Effekte />
    </>
  );
}
