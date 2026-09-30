import Kopf from "@/components/Kopf";
import Hero from "@/components/Hero";
import Laufband from "@/components/Laufband";
import Branchen from "@/components/Branchen";
import Preise from "@/components/Preise";
import { Ablauf, Fragen, Fuss, Kontakt, Nutzen } from "@/components/Abschnitte";
import ChatStarter from "@/components/ChatStarter";
import Reveal from "@/components/Reveal";
import AnkerSprung from "@/components/AnkerSprung";
import Klangbuehne from "@/components/Klangbuehne";
import Effekte from "@/components/Effekte";

export default function Startseite() {
  return (
    <>
      <Klangbuehne />
      <Kopf />
      <main>
        <Hero />
        <Laufband />
        <Nutzen />
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
