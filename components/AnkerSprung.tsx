"use client";

import { useEffect } from "react";

/**
 * Springt nach dem Laden zum Abschnitt aus der Adresse (z.B. /#preise von einer Branchenseite aus).
 * Der Browser versucht das selbst, trifft aber nicht immer, weil sich die Seite beim Laden noch aufbaut.
 */
export default function AnkerSprung() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const ziel = document.getElementById(id);
    if (!ziel) return;
    const springen = () => ziel.scrollIntoView({ behavior: "instant", block: "start" });
    const bild = requestAnimationFrame(springen);
    // Nochmals, sobald Schrift und Bilder geladen sind und sich die Höhe nicht mehr verschiebt
    const spaeter = window.setTimeout(springen, 400);
    return () => {
      cancelAnimationFrame(bild);
      window.clearTimeout(spaeter);
    };
  }, []);
  return null;
}
