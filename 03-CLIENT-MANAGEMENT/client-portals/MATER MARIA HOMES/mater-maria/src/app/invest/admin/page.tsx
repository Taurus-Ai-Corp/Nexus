import { isAdminAuthenticated } from "./actions";
import { AdminLoginForm } from "./AdminLoginForm";
import { AdminDashboard, type Lead } from "./AdminDashboard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function mapSupabaseRow(row: Record<string, unknown>): Lead {
  const rawTier = (row.unit_type as string) || "undecided";
  const tier = rawTier === "silver" || rawTier === "gold" || rawTier === "platinum" ? rawTier : "undecided";
  const isNRI = (row.country as string) !== "India" && !!(row.country as string);

  return {
    id: String(row.id),
    name: String(row.full_name || ""),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    country: String(row.country || "India"),
    tier,
    isNRI,
    createdAt: String(row.created_at || new Date().toISOString()),
    status: String(row.status || "new"),
  };
}

export default async function InvestAdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <AdminLoginForm />;

  let leads: Lead[] = [];
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("investor_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Supabase fetch error:", error);
    } else if (data) {
      leads = data.map(mapSupabaseRow);
    }
  } catch (err) {
    console.error("Failed to fetch leads from Supabase:", err);
  }

  return <AdminDashboard leads={leads} />;
}
