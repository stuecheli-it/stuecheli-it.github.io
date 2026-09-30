// Gemeinsame Grafiken der Branchen: Linien-Icon und Illustration im Orb-Stil.
// Genutzt auf der Startseite (Branchen-Tabs) und auf den Branchenseiten.
import type { Branche, BrancheId, Motiv } from "@/lib/branchen";
import { Auto, Besteck, Haus, Hut, Schere, Werkzeug } from "./Icons";

const ICONS: Record<BrancheId, () => React.ReactNode> = {
  garage: () => <Auto />,
  handwerk: () => <Werkzeug />,
  coiffeur: () => <Schere />,
  fahrschule: () => <Hut />,
  gastro: () => <Besteck />,
  immo: () => <Haus />,
};

export function BrancheIcon({ id }: { id: BrancheId }) {
  return <>{ICONS[id]()}</>;
}

function MotivForm({ m }: { m: Motiv }) {
  if (m.art === "kreis") return <circle className="motiv" cx={m.cx} cy={m.cy} r={m.r} />;
  if (m.art === "rechteck") return <rect className="motiv" x={m.x} y={m.y} width={m.w} height={m.h} rx={m.rx} />;
  return <path className="motiv" d={m.d} />;
}

/** Branchen-Illustration: glühendes Feld (Farbe aus globals.css) mit hellem Linienmotiv. */
export function Illustration({ b, klasse = "illu" }: { b: Branche; klasse?: string }) {
  return (
    <div className={klasse}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect className="illu-feld" x="8" y="8" width="104" height="104" rx="28" />
        {b.motiv.map((m, i) => (
          <MotivForm key={i} m={m} />
        ))}
      </svg>
    </div>
  );
}
