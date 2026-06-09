import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Mater Maria Homes. Ask questions, request more information, or reach out via phone, email, or WhatsApp.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
