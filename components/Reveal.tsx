"use client";

import { useEffect } from "react";

/**
 * Blendet Elemente mit der Klasse `reveal` beim Scrollen ein.
 * Ausgelöst wird kurz bevor ein Element in den Bildschirm kommt, damit beim schnellen Scrollen keine leeren
 * oder halb durchsichtigen Flächen stehen bleiben. Was beim Laden schon im Bild oder darüber liegt
 * (z.B. nach einem Sprung zu /#preise), erscheint sofort.
 */
export default function Reveal() {
  useEffect(() => {
    const elemente = document.querySelectorAll<HTMLElement>(".reveal");
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || ruhig) {
      elemente.forEach((el) => el.classList.add("sichtbar"));
      return;
    }
    const unten = window.innerHeight;
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sichtbar");
            beobachter.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px 12% 0px", threshold: 0 },
    );
    elemente.forEach((el) => {
      if (el.getBoundingClientRect().top < unten) el.classList.add("sichtbar", "sofort");
      else beobachter.observe(el);
    });
    return () => beobachter.disconnect();
  }, []);
  return null;
}
