"use client";

import { chatOeffnen } from "@/lib/fonio";

export default function ChatKnopf({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <button className={className} type="button" onClick={chatOeffnen}>
      {children}
    </button>
  );
}
