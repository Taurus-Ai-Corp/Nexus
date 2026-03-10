import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover Mater Maria — an AI-powered, solar-powered wellness community in the hills of Kerala. Open to all ages, built for people who want a connected, sustainable way of life.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
