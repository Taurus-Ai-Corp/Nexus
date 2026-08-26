import nodemailer from 'nodemailer';

const MAX_LENGTHS = { name: 100, email: 254, company: 150, vertical: 100, market: 100, message: 5000 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, company, vertical, market, message, honeypot } = req.body || {};

  if (honeypot) {
    res.status(400).json({ error: 'Invalid submission' });
    return;
  }

  if (!name || !email || !name.trim() || !email.trim()) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const value = (req.body || {})[field];
    if (typeof value === 'string' && value.length > max) {
      res.status(400).json({ error: 'Field exceeds maximum length', field });
      return;
    }
  }

  const lead = {
    name: name.trim(),
    email: email.trim(),
    company: (company || '').trim() || '—',
    vertical: vertical || 'platform',
    market: market || '—',
    message: (message || '').trim() || '—',
    submittedAt: new Date().toISOString(),
    source: req.headers['referer'] || 'direct',
  };

  const smtpHost = process.env['SMTP_HOST'];
  const smtpPort = parseInt(process.env['SMTP_PORT'] || '587', 10);
  const smtpUser = process.env['SMTP_USER'];
  const smtpPass = process.env['SMTP_PASS'];
  const fromEmail = process.env['EMAIL_FROM'] || 'Neorm-Era Leads <leads@neorm-era.com>';
  const recipient = process.env['LEAD_RECIPIENT_EMAIL'];

  if (!smtpHost || !smtpUser || !smtpPass || !recipient) {
    res.status(503).json({
      error: 'Lead capture is not configured',
      ok: false,
      missing: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'LEAD_RECIPIENT_EMAIL'].filter(
        (k) => !process.env[k]
      ),
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: true },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: fromEmail,
      to: [recipient],
      replyTo: lead.email,
      subject: `Neorm-Era lead: ${lead.name} — ${lead.vertical}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Company: ${lead.company}`,
        `Vertical: ${lead.vertical}`,
        `Market: ${lead.market}`,
        `Source: ${lead.source}`,
        `Submitted at: ${lead.submittedAt}`,
        '',
        'Message:',
        lead.message,
      ].join('\n'),
      html: `
        <h2>New NEORM-ERA lead</h2>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(lead.name)}</li>
          <li><strong>Email:</strong> ${escapeHtml(lead.email)}</li>
          <li><strong>Company:</strong> ${escapeHtml(lead.company)}</li>
          <li><strong>Vertical:</strong> ${escapeHtml(lead.vertical)}</li>
          <li><strong>Market:</strong> ${escapeHtml(lead.market)}</li>
          <li><strong>Source:</strong> ${escapeHtml(lead.source)}</li>
          <li><strong>Submitted at:</strong> ${escapeHtml(lead.submittedAt)}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(lead.message).replace(/\n/g, '<br>')}</p>
      `,
    });

    res.status(200).json({ ok: true, message: 'Lead submitted' });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to send lead', detail: err.message });
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
