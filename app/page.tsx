import Kopf from "@/components/Kopf";
import Hero from "@/components/Hero";
import Branchen from "@/components/Branchen";
import Preise from "@/components/Preise";
import { Ablauf, Fuss, Kontakt, Nutzen } from "@/components/Abschnitte";
import ChatStarter from "@/components/ChatStarter";
import Reveal from "@/components/Reveal";
import AnkerSprung from "@/components/AnkerSprung";

export default function Startseite() {
  return (
    <>
      <Kopf />
      <main>
        <Hero />
        <Nutzen />
        <Branchen />
        <Preise />
        <Ablauf />
        <Kontakt />
      </main>
      <Fuss />
      <ChatStarter />
      <Reveal />
      <AnkerSprung />
    </>
  );
}
