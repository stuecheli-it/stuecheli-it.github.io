// Linien-Icons (24er-Raster, Strichstärke einheitlich), Farbe über `currentColor` oder CSS.

type IconProps = { strich?: number; farbe?: string };

const basis = (strich: number, farbe: string) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: farbe,
  strokeWidth: strich,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const TELEFON_PFAD =
  "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z";
const CHAT_PFAD = "M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.4A8 8 0 1 1 21 12z";

export function Telefon({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d={TELEFON_PFAD} /></svg>;
}
export function Chat({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d={CHAT_PFAD} /></svg>;
}
export function ChatPunkte({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d={CHAT_PFAD} /><path d="M8 11h.01M12 11h.01M16 11h.01" /></svg>;
}
export function ChatStrich({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d={CHAT_PFAD} /><path d="M9 12h6" /></svg>;
}
export function Mail({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
}
export function Uhr({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}
export function Klemmbrett({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9 12l2 2 4-4" /></svg>;
}
export function Stern({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d="M12 3l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" /></svg>;
}
export function Auszeichnung({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d="M12 3l1.8 3.6L18 8l-3 3 .7 4.3L12 13.5 8.3 15.3 9 11 6 8l4.2-1.4z" /><path d="M5 19h14" /></svg>;
}
export function Kreislauf({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return (
    <svg {...basis(strich, farbe)}>
      <path d="M4 12a8 8 0 0 1 14-5.3L20 8" /><path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-14 5.3L4 16" /><path d="M4 20v-4h4" />
    </svg>
  );
}
export function Pfeil({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
export function Haken({ strich = 2, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d="M5 12l4 4 10-10" /></svg>;
}

// Plan-Details im Preis-Popup
export function Balken({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d="M4 20h16" /><path d="M7 16v-5" /><path d="M12 16V6" /><path d="M17 16v-8" /></svg>;
}
export function Schall({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d="M4 10v4" /><path d="M8 7v10" /><path d="M12 4v16" /><path d="M16 8v8" /><path d="M20 11v2" /></svg>;
}
export function Funken({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return (
    <svg {...basis(strich, farbe)}>
      <path d="M10 3l1.6 4.4L16 9l-4.4 1.6L10 15l-1.6-4.4L4 9l4.4-1.6z" /><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z" />
    </svg>
  );
}
export function Plus({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>;
}
export function Info({ strich = 1.8, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></svg>;
}
export function Kreuz({ strich = 2, farbe = "currentColor" }: IconProps) {
  return <svg {...basis(strich, farbe)}><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

// Branchen-Tabs
export function Auto() {
  return (
    <svg {...basis(1.8, "currentColor")}>
      <path d="M5 17h14l-1.5-6H6.5z" /><path d="M7 11l1.5-4h7L17 11" /><circle cx="8" cy="17" r="2" /><circle cx="16" cy="17" r="2" />
    </svg>
  );
}
export function Werkzeug() {
  return <svg {...basis(1.8, "currentColor")}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.4-2.4z" /></svg>;
}
export function Schere() {
  return (
    <svg {...basis(1.8, "currentColor")}>
      <circle cx="7" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><path d="M9.5 9L20 18" /><path d="M9.5 15L20 6" />
    </svg>
  );
}
export function Hut() {
  return <svg {...basis(1.8, "currentColor")}><path d="M12 3L4 7l8 4 8-4-8-4z" /><path d="M6 9v5c0 2 3 4 6 4s6-2 6-4V9" /></svg>;
}
export function Besteck() {
  return (
    <svg {...basis(1.8, "currentColor")}>
      <path d="M7 3v8" /><path d="M5 3v4a2 2 0 0 0 4 0V3" /><path d="M7 11v10" /><path d="M17 3c-2 0-3 2-3 5v3h3v10" />
    </svg>
  );
}
export function Haus() {
  return <svg {...basis(1.8, "currentColor")}><path d="M4 21V9l8-6 8 6v12" /><path d="M10 21v-6h4v6" /></svg>;
}
