import type { MetadataRoute } from "next";
import { BRANCHENSEITEN } from "@/lib/branchenseiten";

// Wird beim Build als /sitemap.xml erzeugt (statischer Export).
export const dynamic = "force-static";

const BASIS = "https://stuecheli-it.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASIS}/`, changeFrequency: "monthly", priority: 1 },
    ...BRANCHENSEITEN.map((s) => ({
      url: `${BASIS}/branchen/${s.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
