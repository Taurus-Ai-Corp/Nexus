import type { Metadata } from "next";
import ResidencesPageClient from "./ResidencesPageClient";

export const metadata: Metadata = {
  title: "Residences",
  description:
    "Explore our 3 premium residence types — Studio, 1 BHK, and 2 BHK options. Each home features modern amenities, smart home panels, and private balconies.",
};

export default function ResidencesPage() {
  return <ResidencesPageClient />;
}
