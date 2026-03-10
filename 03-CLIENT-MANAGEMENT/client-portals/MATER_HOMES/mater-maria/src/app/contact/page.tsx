import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Mater Maria Wellness Homes. Schedule a visit, ask questions, or reach out via phone, email, or WhatsApp.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
