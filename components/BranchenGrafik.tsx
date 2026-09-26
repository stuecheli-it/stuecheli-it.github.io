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

/** Branchen-Illustration im Orb-Stil: Verlaufsscheibe mit weissem Linienmotiv. */
export function Illustration({ b, klasse = "illu" }: { b: Branche; klasse?: string }) {
  return (
    <div className={klasse}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <radialGradient id={`ig-${klasse}-${b.id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.72" stopColor="#3fc8ff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#3fa0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`ib-${klasse}-${b.id}`} x1="0.1" y1="0.05" x2="0.9" y2="0.95">
            <stop offset="0" stopColor="#3ff0c9" />
            <stop offset="0.48" stopColor="#3a8cff" />
            <stop offset="1" stopColor="#6b45ff" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="60" fill={`url(#ig-${klasse}-${b.id})`} />
        <circle cx="60" cy="60" r="46" fill={`url(#ib-${klasse}-${b.id})`} />
        {b.motiv.map((m, i) => (
          <MotivForm key={i} m={m} />
        ))}
      </svg>
    </div>
  );
}
