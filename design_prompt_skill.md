---
name: design-prompt-generator
description: >-
  Generates highly detailed UI/UX design and rendering prompts for Gemini 3.1 Pro and Claude, strictly enforcing TAURUS AI CORP branding (Gridera, NEXUS, NEOFLOW™).
---

# Design Prompt Generator

## Overview
This instruction-only skill provides a structured workflow for generating comprehensive design prompts used by rendering LLMs (e.g., Gemini 3.1 Pro, Claude Kimi2.6). It ensures output accurately uses the latest Taurus AI Corp product names (NEXUS, Gridera, NEOFLOW™) and adheres to developer-first, dark-mode branding.

## Dependencies
- Knowledge of `brand_guidelines.md`
- Knowledge of `prd_website_launch.md`
- Knowledge of `company_hierarchy.md`

## Quick Start
When a user requests a design prompt for a specific page (e.g., "Create a design prompt for the Nexus_Social dashboard"), follow the workflow below to output a structured text prompt.

## Workflow

### 1. Identify the Target Component/Page
Ask the user (or parse their request) to determine the exact page or component to be rendered. Determine which sub-brand it belongs to (e.g., Gridera by Taurus Ai for security/PQC; NEXUS by Taurus Ai for agent routing/social).

### 2. Contextualize with Brand Guidelines
Ensure the prompt explicitly enforces:
- **Nomenclature:** Do not hallucinate generic names. Force the LLM to use "NEXUS by Taurus Ai", "Gridera by Taurus Ai", "NEOFLOW™", or "Nexus_Social".
- **Color Palette:** Deep Obsidian background. Use #00E676 (Green) for NEXUS/NEOFLOW™ features, and #6200EA (Purple) for Gridera features.
- **Typography:** Geist Sans for copy, Geist Mono for code/data.

### 3. Structure the Output Prompt
Construct the output prompt using the following template:

```text
**[SYSTEM CONTEXT]**
You are an expert UI/UX designer and Frontend Engineer. Your task is to generate the HTML/Tailwind4 layout for the following component: [COMPONENT_NAME].

**[BRANDING & NOMENCLATURE REQUIREMENTS]**
- Theme: Dark Mode ONLY.
- Exact Text to Use: Do not use placeholder names like "Acme Corp". You must use "[INSERT RELEVANT BRAND: Gridera by Taurus Ai / NEXUS by Taurus Ai / NEOFLOW™ / Nexus_Social]".
- Background: #0A0A0A
- Primary Text: #FAFAFA
- Fonts: Use 'Inter' or 'Geist Sans' for text, 'JetBrains Mono' or 'Geist Mono' for code.
- Accents: Use #00E676 (Neon Green) and #6200EA (Deep Purple) sparingly for CTAs or highlights.
- Vibe: Vercel/HashiCorp style. Technical, clean, zero fluff.

**[COMPONENT SPECIFICATIONS]**
- Describe the data or features to be displayed here (e.g., Gridera ML-DSA audit log, Nexus_Social analytics dashboard, TAURUS_AI_SAAS deployment terminal).
- Avoid generic illustrations; use code-centric visuals.

**[DELIVERABLE]**
Provide the raw, semantic HTML structure using Tailwind CSS classes. Ensure responsive design and accessible ARIA attributes.
```

### 4. Deliver the Prompt
Output the resulting text in a markdown code block so the user can easily copy it and paste it into their desired rendering AI.
