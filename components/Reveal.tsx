"use client";

import { useEffect } from "react";

/** Blendet Elemente mit der Klasse `reveal` beim Scrollen ein. */
export default function Reveal() {
  useEffect(() => {
    const elemente = document.querySelectorAll<HTMLElement>(".reveal");
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || ruhig) {
      elemente.forEach((el) => el.classList.add("sichtbar"));
      return;
    }
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sichtbar");
            beobachter.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    elemente.forEach((el) => beobachter.observe(el));
    return () => beobachter.disconnect();
  }, []);
  return null;
}
