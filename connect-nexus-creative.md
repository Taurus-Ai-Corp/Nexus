# Nexus Creative — Integration with Nexus Platform Code

## Goal
Connect the landing-page "prompt lab" to the actual Nexus Creative code so generated briefs use real product context and style memory.

## Current state
- Landing page prompt lab is a browser demo using a static JS function.
- Real Nexus Creative code lives at:
  - `/Users/taurus_ai/Documents/Nexus-Platform/taurus-nexus-creative/creative_agents/ai_content_generator.py`
  - `/Users/taurus_ai/Documents/Nexus-Platform/social-suite-dashboard/api/enhanced_nlp_engine.py`

## Proposed API endpoint
Add a lightweight FastAPI/Flask route in `social-suite-dashboard/api/`:

```python
# creative_brief_api.py
from fastapi import FastAPI, Body
from enhanced_nlp_engine import interpret_command  # existing NLP
from ai_content_generator import generate_creative  # existing creative agent

app = FastAPI()

@app.post("/creative-brief")
def creative_brief(brief: str = Body(..., embed=True)):
    intent = interpret_command(brief)
    creative = generate_creative(intent)
    return {
        "headline": creative["headline"],
        "image_prompt": creative["image_prompt"],
        "platform_plan": creative["platform_plan"],
        "mood": creative["mood"],
        "deliverables": creative["deliverables"],
    }
```

## Landing page hook
In `nexus-creative-editorial/index.html`, replace the static `generateBrief()` with an async call to the API:

```javascript
async function generateBrief() {
  const input = document.getElementById('briefInput').value.trim();
  if (!input) return;
  const res = await fetch('https://api.nexus.taurusai.io/creative-brief', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({brief: input})
  });
  const data = await res.json();
  document.getElementById('outputTitle').textContent = data.headline;
  document.getElementById('outputBody').textContent = formatBrief(data);
}
```

## CL4R1T4S integration points
From the elder-plinius CL4R1T4S repo:
1. `tone_mode` — map landing-page style to brand voice (editorial, minimal, luxury).
2. `brand-memory` — store style references per client and prepend to every image prompt.
3. `copyright-guard` — run generated prompts through a similarity check before shipping.

## Next implementation steps
1. Expose the existing `ai_content_generator.py` as a POST endpoint.
2. Add CORS so the landing page can call it.
3. Add a `/health` route for Vercel/frontend status checks.
4. Replace the static JS demo with the async API call once the endpoint is live.
5. Add error fallback: if API fails, show the static demo output.

## Files involved
- `/Users/taurus_ai/Documents/Nexus-Platform/social-suite-dashboard/api/creative_brief_api.py` (new)
- `/Users/taurus_ai/Documents/Nexus-Platform/social-suite-dashboard/api/enhanced_nlp_engine.py` (read-only)
- `/Users/taurus_ai/Documents/Nexus-Platform/taurus-nexus-creative/creative_agents/ai_content_generator.py` (read-only)
- `/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/nexus-creative-editorial/index.html` (update demo hook)
