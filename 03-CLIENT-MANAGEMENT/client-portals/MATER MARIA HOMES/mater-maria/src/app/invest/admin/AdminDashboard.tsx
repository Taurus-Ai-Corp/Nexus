"use client";

import { useMemo } from "react";
import { Users, TrendingUp, Globe, BarChart3, LogOut } from "lucide-react";
import { Container } from "@/components/ui/container";
import { INVESTMENT_TIERS } from "@/lib/investor-constants";
import { adminLogout } from "./actions";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  tier: string;
  isNRI: boolean;
  createdAt: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data — replaced by Firebase/Supabase once credentials are set  */
/* ------------------------------------------------------------------ */
export const MOCK_LEADS: Lead[] = [
  { id: "1", name: "George Thomas", email: "george@gmail.com", phone: "+971551234567", country: "United Arab Emirates", tier: "platinum", isNRI: true, createdAt: "2026-02-28T14:30:00Z", status: "new" },
  { id: "2", name: "Mary Kurian", email: "mary.k@yahoo.com", phone: "+919847012345", country: "India", tier: "gold", isNRI: false, createdAt: "2026-02-28T15:45:00Z", status: "contacted" },
  { id: "3", name: "Dr. Rajan Mathew", email: "rajan.m@nhs.uk", phone: "+447891234567", country: "United Kingdom", tier: "platinum", isNRI: true, createdAt: "2026-02-27T10:00:00Z", status: "qualified" },
  { id: "4", name: "Leela Abraham", email: "leela.a@gmail.com", phone: "+919446789012", country: "India", tier: "silver", isNRI: false, createdAt: "2026-02-27T08:15:00Z", status: "new" },
  { id: "5", name: "John Varghese", email: "john.v@outlook.com", phone: "+61423456789", country: "Australia", tier: "platinum", isNRI: true, createdAt: "2026-02-26T22:00:00Z", status: "new" },
  { id: "6", name: "Suja Philip", email: "suja@gmail.com", phone: "+919995123456", country: "India", tier: "gold", isNRI: false, createdAt: "2026-02-26T16:30:00Z", status: "contacted" },
];

const FUNNEL_DATA = [
  { stage: "Page Views", count: 1247, color: "hsl(220, 10%, 50%)" },
  { stage: "Calculator Used", count: 384, color: "hsl(42, 72%, 65%)" },
  { stage: "Form Started", count: 142, color: "hsl(42, 72%, 55%)" },
  { stage: "Form Submitted", count: 48, color: "hsl(42, 72%, 45%)" },
];

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */
export function AdminDashboard({ leads }: { leads: Lead[] }) {
  const tierDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.tier] = (counts[l.tier] ?? 0) + 1;
    });
    return INVESTMENT_TIERS.map((t) => ({
      tier: t.name,
      count: counts[t.id] ?? 0,
      investment: t.investmentDisplay,
    }));
  }, [leads]);

  const geoDistribution = useMemo(() => {
    const nri = leads.filter((l) => l.isNRI).length;
    return { nri, local: leads.length - nri };
  }, [leads]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] ?? 0) + 1;
    });
    return counts;
  }, [leads]);

  return (
    <main className="min-h-screen bg-bg-base pt-24 pb-16">
      <Container size="lg">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-text-primary lg:text-3xl">
              Investor Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Mater Maria Homes — Real-time lead intelligence
            </p>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm text-text-secondary transition-colors hover:border-red-400/50 hover:text-red-400"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            icon={Users}
            label="Total Leads"
            value={leads.length.toString()}
            change="+3 this week"
          />
          <KPICard
            icon={TrendingUp}
            label="Qualified"
            value={(statusCounts["qualified"] ?? 0).toString()}
            change={`${Math.round(((statusCounts["qualified"] ?? 0) / leads.length) * 100)}% conversion`}
          />
          <KPICard
            icon={Globe}
            label="NRI Leads"
            value={geoDistribution.nri.toString()}
            change={`${Math.round((geoDistribution.nri / leads.length) * 100)}% of total`}
          />
          <KPICard
            icon={BarChart3}
            label="Form Conversion"
            value="3.8%"
            change="48 of 1,247 visitors"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tier Distribution */}
          <div className="rounded-2xl border border-border-default bg-surface p-6">
            <h2 className="mb-4 font-heading text-lg font-bold text-text-primary">
              Tier Distribution
            </h2>
            <div className="space-y-3">
              {tierDistribution.map((item) => {
                const pct = leads.length > 0 ? (item.count / leads.length) * 100 : 0;
                return (
                  <div key={item.tier}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-text-primary">
                        {item.tier}{" "}
                        <span className="text-text-muted">({item.investment})</span>
                      </span>
                      <span className="font-medium text-text-primary">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-bg-base">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-default to-accent-dark transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="rounded-2xl border border-border-default bg-surface p-6">
            <h2 className="mb-4 font-heading text-lg font-bold text-text-primary">
              Geographic Distribution
            </h2>
            <div className="flex items-center justify-center gap-12 py-8">
              <div className="text-center">
                <div className="mb-2 font-heading text-4xl font-bold text-accent-default">
                  {geoDistribution.local}
                </div>
                <p className="text-sm text-text-muted">Local (India)</p>
                <div className="mt-2 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  {Math.round((geoDistribution.local / leads.length) * 100)}%
                </div>
              </div>
              <div className="h-20 w-px bg-border-default" />
              <div className="text-center">
                <div className="mb-2 font-heading text-4xl font-bold text-accent-default">
                  {geoDistribution.nri}
                </div>
                <p className="text-sm text-text-muted">NRI (International)</p>
                <div className="mt-2 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  {Math.round((geoDistribution.nri / leads.length) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="rounded-2xl border border-border-default bg-surface p-6 lg:col-span-2">
            <h2 className="mb-4 font-heading text-lg font-bold text-text-primary">
              Conversion Funnel
            </h2>
            <div className="flex items-end justify-center gap-6 py-4">
              {FUNNEL_DATA.map((stage, i) => {
                const maxCount = FUNNEL_DATA[0]?.count ?? 1;
                const height = Math.max(20, (stage.count / maxCount) * 200);
                return (
                  <div key={stage.stage} className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{stage.count}</span>
                    <div
                      className="w-20 rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${height}px`,
                        background: `linear-gradient(to top, ${stage.color}, ${stage.color}88)`,
                      }}
                    />
                    <span className="max-w-[80px] text-center text-xs text-text-muted">
                      {stage.stage}
                    </span>
                    {i < FUNNEL_DATA.length - 1 && (
                      <span className="text-xs text-text-muted">
                        {Math.round(((FUNNEL_DATA[i + 1]?.count ?? 0) / stage.count) * 100)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border-default bg-surface">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="px-5 py-4 font-semibold text-text-primary">Name</th>
                <th className="px-5 py-4 font-semibold text-text-primary">Email</th>
                <th className="px-5 py-4 font-semibold text-text-primary">Tier</th>
                <th className="px-5 py-4 font-semibold text-text-primary">Country</th>
                <th className="px-5 py-4 font-semibold text-text-primary">Status</th>
                <th className="px-5 py-4 font-semibold text-text-primary">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr
                  key={lead.id}
                  className={`border-b border-border-subtle ${i % 2 === 0 ? "bg-transparent" : "bg-surface/50"}`}
                >
                  <td className="px-5 py-3 font-medium text-text-primary">
                    {lead.name}
                    {lead.isNRI && (
                      <span className="ml-2 inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                        NRI
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{lead.email}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-accent-default/10 px-2.5 py-0.5 text-xs font-medium capitalize text-accent-default">
                      {lead.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{lead.country}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-3 text-text-muted">
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */
function KPICard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-border-default bg-surface p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent-default/10">
          <Icon className="size-4 text-accent-default" />
        </div>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
      <p className="font-heading text-3xl font-bold text-text-primary">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{change}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-yellow-500/10 text-yellow-400",
    contacted: "bg-blue-500/10 text-blue-400",
    qualified: "bg-green-500/10 text-green-400",
    converted: "bg-accent-default/10 text-accent-default",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? "bg-gray-500/10 text-gray-400"}`}
    >
      {status}
    </span>
  );
}
