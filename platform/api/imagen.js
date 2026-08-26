// /api/imagen.js — Vertex AI Imagen 3 image generation
// Accepts POST with { prompt } and returns a generated image.
// Uses Application Default Credentials (ADC) for auth.

const VERTEX_LOCATION = 'us-central1';
const VERTEX_MODEL = 'imagen-3.0-generate-002';
// Declared before VERTEX_ENDPOINT deliberately: this const is interpolated into
// that template literal, and while it sat further down the file the module threw
// "Cannot access 'VERTEX_PROJECT' before initialization" on import -- /api/imagen
// was dead, not degraded. Do not move this below its use.
const VERTEX_PROJECT = process.env.GOOGLE_CLOUD_PROJECT_ID || 'project-0ae56a62-0f0a-4d8a-9b7';
const VERTEX_ENDPOINT = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT}/locations/${VERTEX_LOCATION}/publishers/google/models/${VERTEX_MODEL}:predict`;

// Get OAuth2 access token from ADC metadata server (Vercel / GCP environments)
// Falls back to GOOGLE_APPLICATION_CREDENTIALS JSON if available
async function getAccessToken() {
  // 1. Try refresh-token flow (Vercel / non-GCP environments)
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData.access_token) return tokenData.access_token;
      }
    } catch { /* best-effort: fall through to the next strategy below */ }
  }

  // 2. Try metadata server (GCP/Vercel with workload identity)
  try {
    const metaRes = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      { headers: { 'Metadata-Flavor': 'Google' }, signal: AbortSignal.timeout(3000) }
    );
    if (metaRes.ok) {
      const meta = await metaRes.json();
      return meta.access_token;
    }
  } catch { /* best-effort: fall through to the next strategy below */ }

  // 3. Try GOOGLE_APPLICATION_CREDENTIALS JSON file
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      const { readFileSync } = await import('fs');
      const creds = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
      if (creds.private_key && creds.client_email) {
        return await getAccessTokenFromSA(creds);
      }
    } catch { /* best-effort: fall through to the next strategy below */ }
  }

  // 4. Try explicit GOOGLE_ACCESS_TOKEN (for dev/testing)
  if (process.env.GOOGLE_ACCESS_TOKEN) {
    return process.env.GOOGLE_ACCESS_TOKEN;
  }

  return null;
}

async function getAccessTokenFromSA(creds) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encoder = new TextEncoder();
  const base64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const headerB64 = base64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)));
  const signInput = `${headerB64}.${payloadB64}`;

  // Import private key
  const keyPem = creds.private_key.replace(/-----BEGIN.*?-----/g, '').replace(/-----END.*?-----/g, '').replace(/\s/g, '');
  const keyBinary = Uint8Array.from(atob(keyPem), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyBinary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(signInput)
  );

  const jwt = `${signInput}.${base64url(signature)}`;

  // Exchange JWT for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token exchange failed: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const { prompt } = req.body || {};

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing required field: prompt' });
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return res.status(500).json({
      error: 'No Google Cloud credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or deploy to a GCP environment with ADC.',
    });
  }

  try {
    const response = await fetch(VERTEX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: prompt.trim() }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '3:4',
          personGeneration: 'allow_adult',
          safetyFilterLevel: 'block_only_high',
          addWatermark: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errMsg;
      try { errMsg = JSON.parse(errText).error?.message || errText; } catch { errMsg = errText; }
      return res.status(response.status).json({ error: `Vertex AI error: ${errMsg}` });
    }

    const data = await response.json();
    const predictions = data.predictions;

    if (!predictions || predictions.length === 0) {
      return res.status(502).json({ error: 'No image returned from Vertex AI Imagen 3.' });
    }

    // Imagen 3 returns base64-encoded image
    const imageBase64 = predictions[0].bytesBase64Encoded;

    if (!imageBase64) {
      // Some responses use a different envelope
      const imageUrl = predictions[0].url || predictions[0].image;
      if (imageUrl) {
        return res.status(200).json({ image_url: imageUrl, model: VERTEX_MODEL });
      }
      return res.status(502).json({ error: 'Unexpected prediction format from Vertex AI.', prediction_keys: Object.keys(predictions[0]) });
    }

    return res.status(200).json({
      image_base64: imageBase64,
      image_url: `data:image/png;base64,${imageBase64}`,
      model: VERTEX_MODEL,
    });

  } catch (err) {
    console.error('[/api/imagen] error:', err);
    return res.status(500).json({ error: `Internal error: ${err.message}` });
  }
}
