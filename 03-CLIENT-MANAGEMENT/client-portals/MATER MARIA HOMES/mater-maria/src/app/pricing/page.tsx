import type { Metadata } from "next";
import { PricingPageClient } from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for Mater Maria residences. Studios from 25L, 1 BHK from 35L, 2 BHK villas from 55L. Special NRI packages available.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
