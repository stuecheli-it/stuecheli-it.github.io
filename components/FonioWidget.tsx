"use client";

import { useEffect } from "react";
import { FONIO_WIDGET_ID } from "@/lib/fonio";

/** Lädt das fonio-Webchat-Widget einmal pro Seite. */
export default function FonioWidget() {
  useEffect(() => {
    if (!FONIO_WIDGET_ID || document.querySelector("script[data-fonio-webchat-widget-id]")) return;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://widget.fonio.ai/webchat-widget.js";
    s.dataset.fonioWebchatWidgetId = FONIO_WIDGET_ID;
    document.head.appendChild(s);
  }, []);
  return null;
}
