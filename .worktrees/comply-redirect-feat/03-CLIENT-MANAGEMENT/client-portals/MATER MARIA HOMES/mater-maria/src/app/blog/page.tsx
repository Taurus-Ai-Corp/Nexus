import type { Metadata } from "next";
import { BlogPageClient } from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on community living, Kerala lifestyle, NRI investment guides, and wellness tips from Mater Maria Homes.",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
