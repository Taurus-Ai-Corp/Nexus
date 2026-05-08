import { NextRequest, NextResponse } from "next/server";
import {
  INVESTMENT_TIERS,
  INVESTOR_PROMISES,
  INVESTOR_PERKS,
} from "@/lib/investor-constants";
import { INVESTOR_FAQ, INVESTOR_TESTIMONIALS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  System prompt — all investor data injected as structured context   */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are the Mater Maria Investor Concierge — an expert AI assistant for Mater Maria Homes, Kerala's first AI-powered smart wellness community in Kanjirappally, Kottayam, Kerala, India.

Your role: Help potential investors (especially NRI families from UAE, US, UK, Gulf) understand investment options, ROI, and next steps. Be warm, professional, concise. Answer in 2-3 sentences max unless the question requires detail.

KEY FACTS:
- Kerala's FIRST AI-powered smart wellness community — open to all ages
- Location: Elangulam, Kanjirappally, overlooking Ponkunnam-Pala Corridor, Kottayam, Kerala
- 90 total residences: 20 Independent Villas + 50 Walk-up Villas + 20 Executive Apartments
- AI health monitoring with IoT sensors, fall detection, vital tracking for all residents
- Smart home automation in every unit (lighting, climate, security, emergency alerts)
- 100% solar-powered net-zero energy campus, rainwater harvesting, water-rechargeable wells
- Organic central kitchen with tropical fruit orchards, private fishing ponds
- On-site MMT Hospital Annexure, 24/7 ambulance, specialized care units
- Ayurvedic Treatment Block, Yoga & Meditation halls
- Luxury home theatre, amphitheatre, elegant resident lounges
- Green building certification, sustainable architecture
- ISO 9001 certified, NRI-friendly (UAE, US, UK, Gulf diaspora)
- Contact: Rajeev Abraham (Chairman) — WhatsApp +91 94470 80356

INVESTMENT TIERS:
${INVESTMENT_TIERS.map((t) => `- ${t.name} (${t.investmentDisplay}): ${t.totalReturn}% returns over 15 years. ${t.annualInterest}% annual interest ${t.interestYears}. Dividends ${t.dividendStart}. Perks: Event Hall: ${t.perks.eventHall}, Guest House: ${t.perks.guestHouse}, Patron Wall: ${t.perks.patronWall}`).join("\n")}

FINANCIAL MODEL:
- Years 1-4: 10% annual interest on deposit
- Year 5: Deposit converts to share capital
- Years 5-15: Escalating dividends from 6% to 20%
- Total returns: 150-153% over 15 years

INVESTOR PERKS:
${INVESTOR_PERKS.map((p) => `- ${p.title}: ${p.description} (${p.detail})`).join("\n")}

FAQ:
${INVESTOR_FAQ.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

RULES:
- Always recommend scheduling a call or WhatsApp chat with Rajeev Abraham for detailed discussions
- Never make guarantees about returns — use "projected" or "estimated"
- If asked about something you don't know, say "I'd recommend speaking directly with our investment team for the most accurate information"
- Keep answers concise and investor-focused`;

/* ------------------------------------------------------------------ */
/*  Ollama fallback — keyword-match FAQ if LLM is unavailable         */
/* ------------------------------------------------------------------ */

function faqFallback(message: string): string {
  const lower = message.toLowerCase();
  const match = INVESTOR_FAQ.find(
    (f) =>
      f.question.toLowerCase().split(" ").some((w) => w.length > 4 && lower.includes(w)) ||
      lower.includes(f.question.toLowerCase().slice(0, 20)),
  );
  if (match) return match.answer;

  // Tier-specific fallback
  const tierMatch = INVESTMENT_TIERS.find((t) =>
    lower.includes(t.id) || lower.includes(t.name.toLowerCase()),
  );
  if (tierMatch) {
    return `The ${tierMatch.name} tier requires an investment of ${tierMatch.investmentDisplay} with ${tierMatch.totalReturn}% projected returns over 15 years. You get ${tierMatch.annualInterest}% annual interest for ${tierMatch.interestYears}, then escalating dividends ${tierMatch.dividendStart}. Perks include: Guest House (${tierMatch.perks.guestHouse}), Event Hall (${tierMatch.perks.eventHall}). For a detailed proposal, I'd recommend connecting with our team on WhatsApp.`;
  }

  return "Thank you for your interest in Mater Maria Homes! For detailed investment information, I'd recommend speaking with our Chairman Rajeev Abraham on WhatsApp (+91 94470 80356). He can provide personalized investment proposals and answer all your questions.";
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                       */
/* ------------------------------------------------------------------ */

const OLLAMA_BASE = process.env["OLLAMA_BASE_URL"] ?? "http://localhost:11434";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_LENGTH = 10;

// Simple in-memory rate limiter (per-IP, 10 requests per minute)
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function sanitizeHistory(
  raw: unknown,
): Array<{ role: "user" | "assistant"; content: string }> {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is { role: string; content: string } =>
        m != null &&
        typeof m === "object" &&
        typeof m.role === "string" &&
        typeof m.content === "string" &&
        (m.role === "user" || m.role === "assistant") &&
        m.content.length <= MAX_MESSAGE_LENGTH,
    )
    .slice(-MAX_HISTORY_LENGTH)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }

    const body = await req.json();
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is required and must be under 1000 characters" },
        { status: 400 },
      );
    }

    const history = sanitizeHistory(body?.history);

    // Build messages array for Ollama — only user/assistant roles allowed
    const ollamaMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history,
      { role: "user" as const, content: message },
    ];

    try {
      // Try Ollama first
      const ollamaRes = await fetch(`${OLLAMA_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen3-coder:latest",
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 300,
          },
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        const reply =
          data.message?.content?.trim() ||
          faqFallback(message);
        return NextResponse.json({ reply });
      }

      // Ollama returned error — fallback
      return NextResponse.json({ reply: faqFallback(message) });
    } catch {
      // Ollama unreachable — graceful FAQ fallback
      return NextResponse.json({ reply: faqFallback(message) });
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}
