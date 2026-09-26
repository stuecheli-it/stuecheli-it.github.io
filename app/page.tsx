import Kopf from "@/components/Kopf";
import Hero from "@/components/Hero";
import Branchen from "@/components/Branchen";
import Preise from "@/components/Preise";
import { Fuss, Kontakt, Leistungen, Nutzen, Vorgehen } from "@/components/Abschnitte";
import FonioWidget from "@/components/FonioWidget";
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
        <Leistungen />
        <Vorgehen />
        <Preise />
        <Kontakt />
      </main>
      <Fuss />
      <FonioWidget />
      <Reveal />
      <AnkerSprung />
    </>
  );
}
