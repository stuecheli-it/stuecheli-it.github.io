// Laufband unter dem Hero: «Das sagen Anrufer». Echte Anruf-Beispiele aus den Branchenseiten als Sprechblasen der
// anrufenden Person (Glut), langsam von rechts nach links, hält beim Darüberfahren an, steht still bei «Bewegung reduzieren».
// Der Inhalt steht doppelt im Band, damit die Schleife nahtlos ist; für Screenreader zählt nur die Liste darunter.
import { BRANCHENSEITEN } from "@/lib/branchenseiten";

/** Je zwei Anrufe pro Branche, abwechselnd gemischt: Garage, Handwerk, Coiffeur … und dann die zweite Runde */
const ANRUFE = [0, 1].flatMap((runde) =>
  BRANCHENSEITEN.map((b) => ({ branche: b.kurz, zitat: b.anrufe[runde * 2]?.zitat })).filter(
    (a): a is { branche: string; zitat: string } => Boolean(a.zitat),
  ),
);

export default function Laufband() {
  const band = (
    <span className="laufband-teil">
      {ANRUFE.map((a, i) => (
        <span key={i} className="anruf-blase">
          <small>{a.branche}</small>
          «{a.zitat}»
        </span>
      ))}
    </span>
  );
  return (
    <section className="laufband" aria-label="Das sagen Anrufer">
      <div className="laufband-spur" aria-hidden="true">
        {band}
        {band}
      </div>
      <ul className="sr-only">
        {ANRUFE.map((a, i) => (
          <li key={i}>
            {a.branche}: «{a.zitat}»
          </li>
        ))}
      </ul>
    </section>
  );
}
