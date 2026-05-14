import type { LeadPayload } from './lead-schema';
import { getFirstName, getTierLabel } from './lead-schema';

export function emailTemplate(lead: LeadPayload): { subject: string; html: string } {
  const firstName = getFirstName(lead.name);
  const tierLabel = getTierLabel(lead.tier);

  const subject = `Welcome to Mater Maria, ${firstName}`;

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#FFFBF5;font-family:Helvetica,Arial,sans-serif;color:#333">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="600" style="max-width:600px;background:#FFFBF5;border:1px solid rgba(0,0,0,.08);border-radius:12px;overflow:hidden">
        <tr><td style="background:#224C98;padding:24px;text-align:center;color:#fff;font-family:Georgia,serif">
          <div style="font-size:14px;letter-spacing:.2em;opacity:.85">MATER MARIA HOMES</div>
          <div style="font-size:13px;font-style:italic;margin-top:4px;color:#C09B5E">Living Refined</div>
        </td></tr>
        <tr><td style="padding:32px 32px 8px">
          <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400;font-size:28px;color:#191D23">Dear ${escapeHtml(firstName)},</h1>
          <p style="margin:0 0 16px;line-height:1.7;font-size:16px">Thank you for your interest in Mater Maria Homes — a sanctuary of grace, peace, and dignity, crafted for those who have walked life's journey with faith and strength.</p>
          <p style="margin:0 0 24px;line-height:1.7;font-size:16px">Attached is our complete investor information deck. It covers:</p>
          <ul style="margin:0 0 24px;padding-left:20px;line-height:1.9;font-size:15px">
            <li>The Silver, Gold, and Platinum share-deposit programmes</li>
            <li>The 15-year ROI model (150–153% projected returns)</li>
            <li>Estate amenities, medical infrastructure, and chapel plans</li>
            <li>Founder profiles and governance structure</li>
          </ul>
          <p style="margin:0 0 16px;line-height:1.7;font-size:16px">A member of our team will be in touch within 2 hours regarding the <strong>${escapeHtml(tierLabel)}</strong> details. In the meantime, reach us instantly on WhatsApp:</p>
          <p style="margin:0 0 24px;text-align:center"><a href="https://wa.me/919447080356?text=Hello%20Mater%20Maria" style="display:inline-block;background:#C09B5E;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:16px">💬 WhatsApp +91 94470 80356</a></p>
        </td></tr>
        <tr><td style="padding:16px 32px 8px;border-top:1px solid rgba(0,0,0,.06)">
          <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:14px;color:#C09B5E;text-align:center;line-height:1.6">"He will cover you with His feathers, and under His wings you will find refuge."<br><span style="font-size:12px;opacity:.7;font-style:normal">— Psalm 91:4</span></p>
        </td></tr>
        <tr><td style="padding:24px 32px;background:#F7F2E9;font-size:12px;color:rgba(25,29,35,.6);line-height:1.6">
          <strong style="color:#191D23">Mater Maria Wellness Homes Pvt. Ltd.</strong><br>
          P.B. No: 22, Kanjirapally, Kottayam, Kerala 686507, India<br>
          +91 94470 80356 · <a href="mailto:info@matermariahomes.com" style="color:#C09B5E">info@matermariahomes.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
