# C2PA Implementation — Nexus Creative by Taurus AI

## Overview

C2PA (Coalition for Content Provenance and Authenticity) metadata is embedded into all AI-generated images produced by Nexus Creative. This ensures transparency, provenance tracking, and compliance with emerging AI content disclosure regulations (EU AI Act, UAE AI ethics guidelines, China deep synthesis rules).

## Architecture

```
User brief → /api/generate (LLM) → Campaign text + image prompt
                     ↓
            /api/imagen (Vertex AI Imagen 3) → Raw AI-generated image
                     ↓
            /scripts/embed_c2pa.py → C2PA-embedded final image
                     ↓
            /api/guardrail → Safety check before delivery
                     ↓
            Brand Compliance Modal → User accepts liability → Download
```

## C2PA Manifest Structure

Every generated image includes a C2PA manifest with:

| Field | Value |
|-------|-------|
| `claim_generator` | `Nexus Creative by Taurus AI` |
| `title` | `Nexus Creative AI-Generated Campaign Asset` |
| `format` | `PNG` (or appropriate image format) |

### Assertions

#### 1. c2pa.actions
```json
{
  "actions": [
    {
      "action": "AI Generated",
      "software": "Vertex AI Imagen 3",
      "parameters": {
        "model": "imagen-3.0-generate-002",
        "provider": "Google Cloud Vertex AI"
      },
      "when": "2026-06-16T00:00:00Z"
    }
  ]
}
```

#### 2. c2pa.author
```json
{
  "name": "Nexus Creative by Taurus AI",
  "identifier": "https://nexus.taurusai.io"
}
```

#### 3. c2pa.generator
```json
{
  "name": "Vertex AI Imagen 3",
  "version": "3.0",
  "provider": "Google Cloud"
}
```

## Signing Strategy

### Current (Development)
- Self-signed X.509 certificate (ECDSA P-256)
- Self-signed CA for manifest signing
- Suitable for testing and local verification

### Production
- C2PA-approved CA certificate (e.g., C2PA Test CA → production CA)
- Hardware Security Module (HSM) for key storage
- Timestamp Authority: DigiCert TSA (`https://timestamp.digicert.com`)

### Certificate Requirements
1. Register with C2PA as a publisher
2. Obtain certificate from approved CA
3. Store private key in HSM or cloud KMS (Google Cloud KMS recommended)
4. Rotate certificates annually per C2PA best practices

## Integration Points

### 1. Image Generation Pipeline
- After `/api/imagen` returns a base64 image, the frontend or a post-processing worker calls `embed_c2pa.py` to inject C2PA data before serving to the user.

### 2. Batch Processing
```bash
# Process a directory of generated images
for img in output/campaigns/*.png; do
  python3 scripts/embed_c2pa.py "$img"
done
```

### 3. API Integration (Planned)
A future `/api/c2pa-embed` endpoint will:
1. Accept base64 image + metadata
2. Call `embed_c2pa.py` server-side
3. Return C2PA-embedded image

### 4. Client-Side Verification
Users and downstream consumers can verify C2PA metadata using:
- [Content Credentials Verify](https://contentcredentials.org/verify)
- Adobe Photoshop / Lightroom C2PA inspection
- `c2pa-tool` CLI for programmatic verification

## Verification

```bash
# Install c2pa-tool for verification
pip install c2pa-tool

# Verify C2PA metadata in an image
c2pa-tool inspect campaign-asset.png

# Show full manifest
c2pa-tool show campaign-asset.png
```

## Regulatory Alignment

| Regulation | Requirement | C2PA Coverage |
|-----------|-------------|---------------|
| EU AI Act (2024) | AI-generated content must be labeled | ✅ AI Generated action |
| UAE AI Ethics | Transparency for AI outputs | ✅ claim_generator + author |
| China Deep Synthesis Rules | Watermark + metadata for AI media | ✅ C2PA manifest + Imagen watermark |
| US state laws (CA, IL) | Disclosure of AI-generated content | ✅ Embedded provenance |

## C2PA Python Library

```bash
# Install
pip install c2pa-python

# Also requires cryptography for cert generation
pip install cryptography
```

## File Structure

```
nexus-creative-editorial/
├── api/
│   ├── generate.js         # LLM router (refine/generate)
│   ├── imagen.js           # Vertex AI Imagen 3
│   ├── guardrail.js        # Content safety filter
│   └── checkout.js         # Stripe payments
├── scripts/
│   └── embed_c2pa.py       # C2PA metadata embedder
├── C2PA-IMPLEMENTATION.md  # This document
├── index.html              # Frontend with lab + guardrails
└── vercel.json             # Route config
```

## Future Enhancements

1. **Cloud KMS Signing**: Move from self-signed certs to Google Cloud KMS-managed keys
2. **Automated Pipeline**: Server-side C2PA embedding after every Imagen generation
3. **Ingredient Provenance**: Add `c2pa.ingredient` assertions when compositing from multiple AI/stock sources
4. **Thumbnail Generation**: C2PA manifests can include thumbnails for preview in verification tools
5. **Content Credentials Integration**: Register as a C2PA publisher for global verification

## Notes

- The `c2pa-python` library API may vary between versions. See [c2pa-python on GitHub](https://github.com/contentauth/c2pa-python) for latest API.
- Self-signed certificates produce valid C2PA manifests but show "unverified signer" in consumer tools. Production deployment requires CA-signed certificates.
- Imagen 3's `addWatermark: true` parameter adds a visible watermark; C2PA metadata provides the invisible provenance layer.
