// Laufband unter dem Hero: die Branchen und was der Assistent tut, in grosser Schrift, endlos von rechts nach links.
// Der Inhalt steht doppelt im Band, damit die Schleife nahtlos ist; für Screenreader zählt nur die Liste darunter.
import { BRANCHENSEITEN } from "@/lib/branchenseiten";

const ZEILE = ["Nimmt jeden Anruf entgegen", "Gibt Auskunft", "Vereinbart Termine", "Meldet Ihnen, was zählt"];

export default function Laufband() {
  const teile = BRANCHENSEITEN.flatMap((b, i) => [b.kurz, ZEILE[i % ZEILE.length]]);
  const band = (
    <span className="laufband-teil">
      {teile.map((t, i) => (
        <span key={i} className={i % 2 ? "laufband-satz" : "laufband-wort"}>
          {t}
          <i aria-hidden="true" />
        </span>
      ))}
    </span>
  );
  return (
    <section className="laufband" aria-label="Branchen">
      <div className="laufband-spur" aria-hidden="true">
        {band}
        {band}
      </div>
      <ul className="sr-only">
        {BRANCHENSEITEN.map((b) => (
          <li key={b.slug}>{b.kurz}</li>
        ))}
      </ul>
    </section>
  );
}
