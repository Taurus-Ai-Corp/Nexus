// /api/veo.js — Gemini API Veo video generation + polling (Vercel-safe, cloud-only)
// POST /api/veo → start video generation
// GET /api/veo?operation=... → poll long-running operation

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const VEO_MODEL = 'veo-3.1-generate-preview';

function getApiKey() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key || key === '***') return null;
  return key;
}

function getOperationParam(req) {
  if (req.query && req.query.operation) return req.query.operation;
  const match = (req.url || '').split('?')[1] && (req.url || '').split('?')[1].match(/operation=([^\u0026]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function handleGenerate(req, res) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured on server.', fix: 'Add a real GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY to Vercel environment variables.', docs: 'https://aistudio.google.com/app/apikey' });
  }

  const body = req.body || {};
  const prompt = body.prompt;
  const aspect_ratio = body.aspect_ratio || '16:9';
  const duration = body.duration || 8;
  const resolution = body.resolution || '720p';
  const image_url = body.image_url;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing required field: prompt' });
  }

  const validAspects = ['16:9', '9:16', '1:1', '4:3', '3:4'];
  if (!validAspects.includes(aspect_ratio)) {
    return res.status(400).json({ error: 'Invalid aspect_ratio. Use one of: ' + validAspects.join(', ') });
  }

  const validDurations = [5, 6, 7, 8, 9, 10];
  const durationNum = Number(duration);
  if (!validDurations.includes(durationNum)) {
    return res.status(400).json({ error: 'Invalid duration. Use one of: ' + validDurations.join(', ') });
  }

  try {
    const instance = { prompt: prompt.trim() };

    if (image_url) {
      const controller = new AbortController();
      const timeout = setTimeout(function() { controller.abort(); }, 30000);
      const imageRes = await fetch(image_url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!imageRes.ok) {
        return res.status(400).json({ error: 'Could not fetch image_url: ' + imageRes.status + ' ' + imageRes.statusText });
      }
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
      const contentType = imageRes.headers.get('content-type') || 'image/png';
      instance.image = { bytesBase64Encoded: imageBuffer.toString('base64'), mimeType: contentType };
    }

    const predictRes = await fetch(GEMINI_BASE + '/models/' + VEO_MODEL + ':predictLongRunning?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [instance],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspect_ratio,
          durationSeconds: durationNum,
          resolution,
        },
      }),
    });

    if (!predictRes.ok) {
      const errText = await predictRes.text();
      let errMsg;
      try { errMsg = JSON.parse(errText).error.message || errText; } catch (e) { errMsg = errText; }
      return res.status(predictRes.status).json({ error: 'Gemini Veo error: ' + errMsg, model: VEO_MODEL });
    }

    const predictData = await predictRes.json();

    if (predictData.error) {
      return res.status(400).json({ error: 'Gemini Veo error: ' + predictData.error.message, model: VEO_MODEL });
    }

    const operationName = predictData.name;
    if (!operationName) {
      const video = extractVideo(predictData);
      return res.status(200).json({
        status: 'done',
        video_url: video.url,
        video_base64: video.base64,
        mime_type: video.mimeType,
        model: VEO_MODEL,
        aspect_ratio,
        duration: durationNum,
        prompt: prompt.trim(),
        image_url: image_url || null,
        operation_name: null,
      });
    }

    return res.status(202).json({
      status: 'pending',
      operation_name: operationName,
      model: VEO_MODEL,
      aspect_ratio,
      duration: durationNum,
      prompt: prompt.trim(),
      image_url: image_url || null,
      poll_url: '/api/veo?operation=' + encodeURIComponent(operationName),
      message: 'Video generation started. Poll poll_url until status becomes "done".',
    });

  } catch (err) {
    console.error('[/api/veo] generate error:', err);
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
}

async function handlePoll(req, res) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY not configured.' });
  }

  const operation = getOperationParam(req);
  if (!operation) {
    return res.status(400).json({ error: 'Missing operation query param.' });
  }

  try {
    const pollRes = await fetch(GEMINI_BASE + '/' + operation + '?key=' + apiKey);
    if (!pollRes.ok) {
      const errText = await pollRes.text();
      let errMsg;
      try { errMsg = JSON.parse(errText).error.message || errText; } catch (e) { errMsg = errText; }
      return res.status(pollRes.status).json({ status: 'error', error: errMsg, operation });
    }

    const data = await pollRes.json();

    if (data.error) {
      return res.status(400).json({ status: 'error', error: data.error.message, operation });
    }

    if (!data.done) {
      return res.status(202).json({ status: 'pending', operation, metadata: data.metadata || null });
    }

    const response = data.response || data;
    const predictions = response.predictions || [];
    if (predictions.length === 0) {
      return res.status(502).json({ status: 'done', error: 'No predictions in completed operation.', operation });
    }

    const video = extractVideoFromPrediction(predictions[0]);

    return res.status(200).json({
      status: 'done',
      operation,
      video_url: video.url,
      video_base64: video.base64,
      mime_type: video.mimeType,
      model: VEO_MODEL,
    });

  } catch (err) {
    console.error('[/api/veo] poll error:', err);
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
}

function extractVideo(data) {
  const response = data.response || data;
  const predictions = response.predictions || [];
  if (predictions.length === 0) {
    return { url: null, base64: null, mimeType: 'video/mp4' };
  }
  return extractVideoFromPrediction(predictions[0]);
}

function extractVideoFromPrediction(pred) {
  if (pred.bytesBase64Encoded) {
    const mimeType = pred.mimeType || 'video/mp4';
    return { url: 'data:' + mimeType + ';base64,' + pred.bytesBase64Encoded, base64: pred.bytesBase64Encoded, mimeType };
  }
  if (pred.video && pred.video.uri) {
    return { url: pred.video.uri, base64: null, mimeType: pred.video.mimeType || 'video/mp4' };
  }
  return { url: null, base64: null, mimeType: 'video/mp4' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'POST') return handleGenerate(req, res);
  if (req.method === 'GET') return handlePoll(req, res);
  return res.status(405).json({ error: 'Method not allowed. Use POST to generate, GET to poll.' });
}
