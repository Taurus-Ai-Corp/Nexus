import { generateBrochurePdf } from "@/lib/pdf/brochure";

export async function GET() {
  const buffer = await generateBrochurePdf();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Mater-Maria-Homes-Brochure.pdf"',
      "Cache-Control": "private, max-age=3600",
    },
  });
}
