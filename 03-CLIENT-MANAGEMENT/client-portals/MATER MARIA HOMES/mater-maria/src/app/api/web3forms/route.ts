import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const web3formsSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(5).max(30).optional(),
  message: z.string().max(2000).optional(),
  subject: z.string().max(200).optional(),
  from_name: z.string().max(100).optional(),
  botcheck: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check
    if (body.botcheck) {
      return NextResponse.json({ error: "bot_detected" }, { status: 400 });
    }

    const parsed = web3formsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation_failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // ── Write to Supabase (unified leads table) ────────────────────────
    let supabaseId: string | null = null;
    try {
      const supabase = getSupabaseAdmin();
      const { data: row, error } = await supabase
        .from("investor_inquiries")
        .insert({
          full_name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: data.message,
          subject: data.subject,
          source: "contact_form",
          status: "new",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
      } else {
        supabaseId = row?.id ?? null;
      }
    } catch (err) {
      console.error("Supabase write failed:", err);
    }

    const accessKey = process.env["WEB3FORMS_ACCESS_KEY"];
    if (!accessKey) {
      return NextResponse.json(
        { error: "web3forms_not_configured", id: supabaseId },
        { status: 500 }
      );
    }

    const payload = {
      access_key: accessKey,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      message: data.message || "",
      subject: data.subject || "New Enquiry — Mater Maria Homes",
      from_name: data.from_name || "Mater Maria Homes Website",
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "unknown");
      console.error("Web3Forms submission failed:", response.status, text);
      return NextResponse.json(
        { error: "web3forms_error", id: supabaseId },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: supabaseId }, { status: 200 });
  } catch (error) {
    console.error("Error in web3forms proxy:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
