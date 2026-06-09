import { NextResponse } from 'next/server';
import { LeadPayloadSchema } from '@/lib/lead-schema';
import { emailTemplate } from '@/lib/email-template';
import { whatsappPayload } from '@/lib/whatsapp-payload';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const BROCHURE_URL =
  'https://matermariahomes.com/brochures/mater-maria-investor-deck.pdf';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = LeadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }
  const lead = parsed.data;

  // ── Write to Supabase first (source of truth) ────────────────────
  let supabaseId: string | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('investor_inquiries')
      .insert({
        full_name: lead.name,
        email: lead.email,
        phone: lead.phone,
        unit_type: lead.tier === 'undecided' ? null : lead.tier,
        investment_amount:
          lead.tier === 'silver' ? 10 : lead.tier === 'gold' ? 20 : lead.tier === 'platinum' ? 30 : 0,
        source: lead.source,
        message: lead.message,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
    } else {
      supabaseId = data?.id ?? null;
    }
  } catch (err) {
    console.error('Supabase write failed:', err);
  }

  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendEmail(lead),
    sendWhatsApp(lead),
  ]);

  const emailOk = emailResult.status === 'fulfilled' && emailResult.value.ok;
  const whatsappOk =
    whatsappResult.status === 'fulfilled' && whatsappResult.value.ok;

  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      supabaseId,
      lead: { ...lead, email: redact(lead.email), phone: redact(lead.phone) },
      delivery: { email: emailOk, whatsapp: whatsappOk },
      diag: {
        emailStatus:
          emailResult.status === 'fulfilled'
            ? emailResult.value.status
            : 'rejected',
        whatsappStatus:
          whatsappResult.status === 'fulfilled'
            ? whatsappResult.value.status
            : 'rejected',
      },
    })
  );

  if (!emailOk && !whatsappOk) {
    return NextResponse.json({ error: 'both_channels_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, email: emailOk, whatsapp: whatsappOk, id: supabaseId });
}

async function sendEmail(lead: ReturnType<typeof LeadPayloadSchema.parse>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 'missing_RESEND_API_KEY' as const };

  const { subject, html } = emailTemplate(lead);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Mater Maria Homes <noreply@matermariahomes.com>',
      to: [lead.email],
      subject,
      html,
      attachments: [
        {
          filename: 'Mater-Maria-Investor-Deck.pdf',
          path: BROCHURE_URL,
        },
      ],
    }),
  });

  return { ok: res.ok, status: String(res.status) };
}

async function sendWhatsApp(lead: ReturnType<typeof LeadPayloadSchema.parse>) {
  const token = process.env.WA_TOKEN;
  const phoneId = process.env.WA_PHONE_ID;
  if (!token || !phoneId) {
    return { ok: false, status: 'missing_WA_env' as const };
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(whatsappPayload(lead)),
    }
  );

  return { ok: res.ok, status: String(res.status) };
}

function redact(s: string): string {
  if (s.length <= 6) return '***';
  return s.slice(0, 2) + '***' + s.slice(-2);
}
