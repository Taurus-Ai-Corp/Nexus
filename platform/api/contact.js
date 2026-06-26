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

  if (!process.env['RESEND_API_KEY'] || !process.env['LEAD_RECIPIENT_EMAIL']) {
    res.status(503).json({
      error: 'Lead capture is not configured',
      ok: false,
      missing: ['RESEND_API_KEY', 'LEAD_RECIPIENT_EMAIL'].filter((k) => !process.env[k]),
    });
    return;
  }

  try {
    const payload = {
      from: process.env['RESEND_FROM_EMAIL'] || 'Nexus Leads <leads@nexus.taurusai.io>',
      to: [process.env['LEAD_RECIPIENT_EMAIL']],
      subject: `Nexus lead: ${lead.name} — ${lead.vertical}`,
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
        <h2>New NEXUS lead</h2>
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
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env['RESEND_API_KEY']}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend ${response.status}: ${body}`);
    }

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
