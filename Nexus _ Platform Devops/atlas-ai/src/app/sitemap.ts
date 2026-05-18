import { MetadataRoute } from "next";

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://atlas-ai.com/", lastModified: new Date('2025-08-19') },
    { url: "https://atlas-ai.com/features", lastModified: new Date('2025-08-19') },
    { url: "https://atlas-ai.com/pricing", lastModified: new Date('2025-08-19') },
    { url: "https://atlas-ai.com/contact", lastModified: new Date('2025-08-19') },
  ];
}