"use client";

import { type RefObject, useEffect } from "react";

/**
 * Gemeinsames Verhalten der Popup-Fenster:
 * Fokus auf den Schliessen-Knopf, Esc schliesst, Tab bleibt im Fenster,
 * die Seite dahinter scrollt nicht, und der Chat-Knopf unten rechts wird ausgeblendet.
 */
export function useFenster(
  fensterRef: RefObject<HTMLElement | null>,
  startRef: RefObject<HTMLElement | null>,
  schliessen: () => void,
) {
  useEffect(() => {
    const vorher = document.activeElement as HTMLElement | null;
    startRef.current?.focus();

    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") return schliessen();
      if (e.key !== "Tab" || !fensterRef.current) return;
      const ziele = fensterRef.current.querySelectorAll<HTMLElement>("button, a[href], iframe");
      const erstes = ziele[0];
      const letztes = ziele[ziele.length - 1];
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault();
        letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault();
        erstes.focus();
      }
    };
    document.addEventListener("keydown", taste);

    const breite = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = breite ? breite + "px" : "";

    // Blendet den eigenen Chat-Knopf unten rechts aus, solange ein Fenster offen ist
    document.body.classList.add("fenster-offen");

    return () => {
      document.removeEventListener("keydown", taste);
      document.body.classList.remove("fenster-offen");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      vorher?.focus({ preventScroll: true });
    };
  }, [fensterRef, startRef, schliessen]);
}
