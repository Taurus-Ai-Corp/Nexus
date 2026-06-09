import { NextResponse } from "next/server";

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json([
    { title: "Smart Lead Follow-up System" },
    { title: "AI Viral News Scraper" },
    { title: "Ecommerce Chatbot" },
    { title: "Cross-Platform Publishing Bot" },
  ]);
}