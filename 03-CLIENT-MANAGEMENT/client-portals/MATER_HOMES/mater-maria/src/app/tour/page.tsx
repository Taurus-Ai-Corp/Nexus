import type { Metadata } from "next";
import { TourPageClient } from "./TourPageClient";

export const metadata: Metadata = {
  title: "Villa Tour",
  description:
    "Take an immersive drone-style tour of a Mater Maria villa — fly through interiors, circle the pool, and experience the lifestyle at Kanjirappally, Kerala.",
};

export default function TourPage() {
  return <TourPageClient />;
}
