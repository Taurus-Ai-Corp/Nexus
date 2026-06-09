import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/invest/admin/", "/download/"],
    },
    sitemap: "https://matermariahomes.com/sitemap.xml",
  };
}
