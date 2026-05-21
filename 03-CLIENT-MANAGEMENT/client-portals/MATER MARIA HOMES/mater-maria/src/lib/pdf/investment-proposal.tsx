import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { ROIResult } from "@/lib/roi-calculator";
import { UNIT_CONFIGS, formatLakhs } from "@/lib/roi-calculator";
import type { TierId } from "@/lib/investor-constants";
import { INVESTMENT_TIERS, generateProjection } from "@/lib/investor-constants";

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const gold = "#D4A853";
const navy = "#0f1724";
const warmWhite = "#f5f0e8";
const textDark = "#1a1a2e";
const textMuted = "#6b7280";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: textDark,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: gold,
  },
  headerLeft: {},
  brandName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: navy,
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 8,
    color: gold,
    letterSpacing: 3,
    marginTop: 2,
    textTransform: "uppercase" as const,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 9,
    color: textMuted,
  },
  refText: {
    fontSize: 8,
    color: textMuted,
    marginTop: 2,
  },
  // Title area
  titleBlock: {
    backgroundColor: warmWhite,
    padding: 20,
    borderRadius: 6,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 6,
  },
  investorName: {
    fontSize: 12,
    color: gold,
    fontFamily: "Helvetica-Bold",
  },
  // Section
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 10,
    marginTop: 20,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  // Table
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: navy,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 9,
    color: textDark,
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: navy,
  },
  // Columns
  col1: { width: "12%" },
  col2: { width: "15%" },
  col3: { width: "18%" },
  col4: { width: "20%" },
  col5: { width: "18%" },
  col6: { width: "17%" },
  // Summary box
  summaryBox: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: warmWhite,
    padding: 12,
    borderRadius: 4,
    alignItems: "center" as const,
  },
  summaryLabel: {
    fontSize: 7,
    color: textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: navy,
  },
  summaryValueGold: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: gold,
  },
  // Highlights
  highlightRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  highlightIcon: {
    fontSize: 9,
    color: gold,
    width: 14,
  },
  highlightText: {
    fontSize: 9,
    color: textDark,
    flex: 1,
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: textMuted,
    lineHeight: 1.4,
  },
  footerBrand: {
    fontSize: 8,
    color: gold,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
  },
});

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface InvestmentProposalProps {
  investorName: string;
  /** Use tier-based model if tierId is provided */
  tierId?: TierId;
  /** Use unit-based model if roi result is provided */
  roiResult?: ROIResult;
  /** Pre-generated reference ID (avoids impure Date.now in render) */
  refId: string;
  /** Pre-formatted date string */
  dateStr: string;
}

/* ------------------------------------------------------------------ */
/*  Document                                                           */
/* ------------------------------------------------------------------ */

function InvestmentProposalDocument({
  investorName,
  tierId,
  roiResult,
  refId,
  dateStr,
}: InvestmentProposalProps) {
  const today = dateStr;

  // Determine which model to render
  const tier = tierId
    ? INVESTMENT_TIERS.find((t) => t.id === tierId)
    : undefined;
  const projection = tier ? generateProjection(tier.investment) : undefined;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>MATER MARIA</Text>
            <Text style={styles.brandSub}>Kanjirappally</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>{today}</Text>
            <Text style={styles.refText}>Ref: {refId}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Investment Proposal</Text>
          <Text style={styles.investorName}>
            Prepared for: {investorName}
          </Text>
        </View>

        {/* === Tier-based model === */}
        {tier && projection && (
          <>
            {/* Summary */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Investment</Text>
                <Text style={styles.summaryValue}>
                  {tier.investmentDisplay}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Tier</Text>
                <Text style={styles.summaryValueGold}>{tier.name}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Returns</Text>
                <Text style={styles.summaryValue}>
                  {tier.totalReturn}%
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Annual Interest</Text>
                <Text style={styles.summaryValueGold}>
                  {tier.annualInterest}%
                </Text>
              </View>
            </View>

            {/* Year-by-Year Projection */}
            <Text style={styles.sectionTitle}>
              15-Year Return Projection
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.col1]}>
                  Year
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col2]}>
                  Phase
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col3]}>
                  Rate
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col4]}>
                  Annual Return
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col5]}>
                  Cumulative
                </Text>
              </View>
              {projection.map((row, i) => (
                <View
                  key={row.year}
                  style={[
                    styles.tableRow,
                    i % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                >
                  <Text style={[styles.tableCellBold, styles.col1]}>
                    {row.year}
                  </Text>
                  <Text style={[styles.tableCell, styles.col2]}>
                    {row.phase === "interest" ? "Interest" : "Dividend"}
                  </Text>
                  <Text style={[styles.tableCell, styles.col3]}>
                    {row.rate}%
                  </Text>
                  <Text style={[styles.tableCell, styles.col4]}>
                    ₹{row.annualReturn.toFixed(2)}L
                  </Text>
                  <Text style={[styles.tableCellBold, styles.col5]}>
                    ₹{row.cumulative.toFixed(2)}L
                  </Text>
                </View>
              ))}
            </View>

            {/* Tier Benefits */}
            <Text style={styles.sectionTitle}>
              {tier.name} Tier Benefits
            </Text>
            {tier.highlights.map((h) => (
              <View key={h} style={styles.highlightRow}>
                <Text style={styles.highlightIcon}>•</Text>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </>
        )}

        {/* === Unit-based model === */}
        {roiResult && (
          <>
            {/* Summary */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Unit Type</Text>
                <Text style={styles.summaryValue}>
                  {UNIT_CONFIGS[roiResult.unitType].label}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Investment</Text>
                <Text style={styles.summaryValueGold}>
                  {formatLakhs(roiResult.investmentAmount)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>5-Year ROI</Text>
                <Text style={styles.summaryValue}>
                  {roiResult.summary.roiPercent5yr}%
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Annual Rental</Text>
                <Text style={styles.summaryValueGold}>
                  {formatLakhs(roiResult.summary.annualRentalIncome)}
                </Text>
              </View>
            </View>

            {/* Projection Table */}
            <Text style={styles.sectionTitle}>
              15-Year Growth Projection
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.col1]}>
                  Year
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col3]}>
                  Property Value
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col3]}>
                  Annual Rental
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col3]}>
                  Cumulative Rental
                </Text>
                <Text style={[styles.tableHeaderCell, styles.col4]}>
                  Total Value
                </Text>
              </View>
              {roiResult.projections
                .filter((_, i) => i < 10 || i === 14)
                .map((row, i) => (
                  <View
                    key={row.year}
                    style={[
                      styles.tableRow,
                      i % 2 === 1 ? styles.tableRowAlt : {},
                    ]}
                  >
                    <Text style={[styles.tableCellBold, styles.col1]}>
                      {row.year}
                    </Text>
                    <Text style={[styles.tableCell, styles.col3]}>
                      {formatLakhs(row.propertyValue)}
                    </Text>
                    <Text style={[styles.tableCell, styles.col3]}>
                      {formatLakhs(row.rentalIncome)}
                    </Text>
                    <Text style={[styles.tableCell, styles.col3]}>
                      {formatLakhs(row.cumulativeRental)}
                    </Text>
                    <Text style={[styles.tableCellBold, styles.col4]}>
                      {formatLakhs(row.totalValue)}
                    </Text>
                  </View>
                ))}
            </View>
          </>
        )}

        {/* Investment Highlights */}
        <Text style={styles.sectionTitle}>Why Mater Maria</Text>
        {[
          "Board-Supervised — ISO 9001 certified governance and financial transparency",
          "AI-Powered — Smart home automation, IoT health monitoring in every unit",
          "Net-Zero Estate — 100% solar-powered, rainwater harvesting",
          "AI IoT Advanced Medical — 24/7 nursing, 10km to Medical College",
          "NRI-Friendly — Dedicated concierge for overseas investors",
          "8+ Acres — Organic farming, walking trails, wellness spa",
        ].map((h) => (
          <View key={h} style={styles.highlightRow}>
            <Text style={styles.highlightIcon}>✓</Text>
            <Text style={styles.highlightText}>{h}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Disclaimer: Projections are estimates based on current Kerala luxury
            real estate market trends and are not guaranteed. Past performance
            does not indicate future results. Investment is subject to market
            risks. Please consult your financial advisor
            before investing.
          </Text>
          <Text style={styles.footerBrand}>
            Mater Maria Homes · Elangulam, Kanjirappally, Kottayam, Kerala
            686507 · Info@matermariahomes.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/* ------------------------------------------------------------------ */
/*  PDF Generation Helper                                              */
/* ------------------------------------------------------------------ */

export async function generateInvestmentPDF(
  props: Omit<InvestmentProposalProps, "refId" | "dateStr">,
): Promise<Blob> {
  // Pre-compute impure values outside the render tree
  const refId = `MM-INV-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const blob = await pdf(
    <InvestmentProposalDocument {...props} refId={refId} dateStr={dateStr} />,
  ).toBlob();
  return blob;
}

export function downloadPDF(blob: Blob, investorName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Mater-Maria-Investment-Proposal-${investorName.replace(/\s+/g, "-")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
