import type { Metadata } from "next";
import { GalleryPageClient } from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Take a visual tour of Mater Maria Homes — explore our exteriors, interiors, amenities, and community spaces in Kanjirappally, Kerala.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
