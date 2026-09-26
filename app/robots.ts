import type { MetadataRoute } from "next";

// Wird beim Build als /robots.txt erzeugt. Kunden-Testseiten und der Anfrage-Chat gehören nicht in Suchmaschinen.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/test/", "/anfrage-chat.html"] },
    sitemap: "https://stuecheli-it.github.io/sitemap.xml",
  };
}
