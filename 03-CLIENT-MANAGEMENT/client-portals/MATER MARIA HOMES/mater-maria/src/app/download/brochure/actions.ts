"use server";

import { createClient } from "@/lib/supabase/server";

export type BrochureLeadResult =
  | { success: true }
  | { success: false; error: string };

export async function submitBrochureLead(
  _prev: BrochureLeadResult | null,
  formData: FormData,
): Promise<BrochureLeadResult> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim() || null;

  if (!name || name.length < 2) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    await supabase.from("brochure_leads").insert({
      name,
      email,
      phone,
      source: "brochure-download",
      created_at: new Date().toISOString(),
    });
  } catch {
    // Supabase may not be configured — proceed anyway
  }

  return { success: true };
}
