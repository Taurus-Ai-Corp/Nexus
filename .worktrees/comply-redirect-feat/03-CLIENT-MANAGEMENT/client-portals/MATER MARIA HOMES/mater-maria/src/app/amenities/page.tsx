import type { Metadata } from "next";
import AmenitiesPageClient from "./AmenitiesPageClient";

export const metadata: Metadata = {
  title: "Amenities",
  description:
    "Explore world-class amenities at Mater Maria — AI health monitoring, smart home automation, organic dining, wellness spaces, recreation, and community facilities for a happening lifestyle.",
};

export default function AmenitiesPage() {
  return <AmenitiesPageClient />;
}
