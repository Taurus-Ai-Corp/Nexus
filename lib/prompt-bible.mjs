// lib/prompt-bible.mjs — Ad Campaign Prompt Bible integration
// The master prompt framework for generating product-based ad campaigns.
// Synthesizes: Claytox Product Identity Lock + Arcads 9-layer UGC + Premium Reveal + Product Hero + 37 Meta templates.
//
// This module provides the 9-block universal prompt skeleton and category element banks
// that feed into the campaign pipeline and image generation routes.
//
// See skill: ad-campaign-prompt-bible (Hermes) for the full reference.

// === PRODUCT CATEGORY DETECTION ===

const CATEGORY_KEYWORDS = {
  skincare: ['skincare', 'cleanser', 'serum', 'moisturizer', 'face wash', 'cream', 'lotion', 'beauty', 'cosmetic', 'makeup', 'lipstick', 'foundation', 'mask'],
  beverage: ['beverage', 'drink', 'juice', 'soda', 'cola', 'water', 'coffee', 'tea', 'energy drink', 'protein shake', 'smoothie', 'wine', 'beer', 'cocktail'],
  food: ['food', 'snack', 'chips', 'fries', 'burger', 'pizza', 'chocolate', 'candy', 'cookie', 'cake', 'meal', 'restaurant', 'fries', 'burrito', 'sandwich'],
  tech: ['tech', 'gadget', 'phone', 'laptop', 'earbuds', 'headphone', 'speaker', 'watch', 'device', 'app', 'software', 'saas', 'ai', 'drone', 'camera'],
  supplement: ['supplement', 'vitamin', 'protein', 'powder', 'capsule', 'pill', 'nutrition', 'pre-workout', 'creatine', 'wellness', 'health'],
  fragrance: ['fragrance', 'perfume', 'cologne', 'scent', 'eau de', 'parfum', 'aroma', 'essential oil'],
  fashion: ['fashion', 'clothing', 'apparel', 'shirt', 'dress', 'jacket', 'shoes', 'sneaker', 'bag', 'accessory', 'jewelry', 'watch', 'sunglasses'],
  home: ['home', 'candle', 'decor', 'furniture', 'lamp', 'rug', 'pillow', 'blanket', 'art', 'frame', 'vase'],
  pet: ['pet', 'dog', 'cat', 'animal', 'pet food', 'treat', 'toy', 'leash', 'collar'],
  fitness: ['fitness', 'gym', 'workout', 'exercise', 'yoga', 'running', 'weights', 'dumbbell', 'resistance', 'athletic'],
  real_estate: ['real estate', 'property', 'home', 'villa', 'apartment', 'condo', 'house', 'luxury home', 'penthouse', 'estate'],
  saas: ['saas', 'platform', 'software', 'tool', 'dashboard', 'analytics', 'crm', 'automation', 'workflow', 'api'],
};

export function detectCategory(brief) {
  const lower = brief.toLowerCase();
  let best = 'saas'; // default
  let bestScore = 0;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += kw.length > 5 ? 2 : 1; // longer keywords weigh more
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return { category: best, confidence: bestScore };
}

// === PRODUCT IDENTITY LOCK BUILDER ===

export function buildProductLock(product) {
  // product = { name, color, finish, packaging, typography, formFactor }
  const parts = [];
  parts.push(`Product @img1: Preserve the exact product shape`);
  if (product.color) parts.push(product.color);
  if (product.finish) parts.push(`${product.finish} finish`);
  if (product.packaging) parts.push(product.packaging);
  if (product.typography) parts.push(product.typography);
  parts.push('label placement, proportions, and packaging identity exactly');
  const lockLine = parts.join(', ') + '.';
  
  const dontChange = [];
  if (product.formFactor) dontChange.push(product.formFactor);
  dontChange.push('structure');
  const dontLine = `Do not change the product branding, text layout, color, ${dontChange.join(', ')}, or proportions.`;
  
  return `${lockLine} ${dontLine}`;
}

// === CATEGORY ELEMENT BANKS ===

export const CATEGORY_ELEMENTS = {
  skincare: {
    label: 'Skincare / Cosmetic',
    imageElements: ['cream swirl', 'liquid drip', 'mist', 'dewy droplets', 'light refraction'],
    videoElements: ['cream swirl', 'liquid drip', 'mist', 'dewy droplets'],
    backgrounds: {
      monochrome: 'deep cobalt blue, navy gradient, royal blue, matte deep blue',
      complementary: 'warm beige, cream, soft taupe, sandy neutral, ivory',
      wet: 'glossy blue wet surface, water droplets, slick reflection',
      environment: 'blue tiles, warm terracotta tiles, sink-side styling, bathroom',
    },
    bestArchetype: 'studio',
    introStyle: 'show-to-camera (review)',
    lighting: 'cinematic studio lighting, polished beauty lighting',
  },
  beverage: {
    label: 'Beverage',
    imageElements: ['condensation', 'ice crystals', 'splash', 'pour', 'frost'],
    videoElements: ['water splash', 'rain', 'pour into glass', 'condensation', 'ice', 'droplets frozen in air'],
    backgrounds: {
      monochrome: 'deep amber, cola brown, matcha green, berry red',
      complementary: 'ice white, frost silver, neutral ivory',
      wet: 'condensation, ice crystals, glossy wet surface',
      environment: 'bar counter, cooler, outdoor table',
    },
    bestArchetype: 'hero',
    introStyle: 'already-using (tutorial)',
    lighting: 'high contrast single spotlight, product brightest in frame',
  },
  food: {
    label: 'Food',
    imageElements: ['steam', 'sizzle', 'drip', 'crumbs', 'splatter'],
    videoElements: ['steam', 'sizzle', 'drip', 'condensation', 'crumbs', 'splatter'],
    backgrounds: {
      monochrome: 'warm red, kraft brown, charcoal',
      complementary: 'cool blue accent, fresh green',
      wet: 'grease sheen, steam condensation',
      environment: 'checkered tablecloth, wooden board, restaurant table',
    },
    bestArchetype: 'hero',
    introStyle: 'before/after (results)',
    lighting: 'warm tungsten, product brightest, dramatic shadows',
  },
  tech: {
    label: 'Tech / Gadget',
    imageElements: ['sparks', 'light trails', 'reflections', 'lens flare', 'smoke'],
    videoElements: ['sparks', 'light trails', 'electricity', 'reflections', 'lens flare', 'smoke'],
    backgrounds: {
      monochrome: 'pure black, deep navy, charcoal',
      complementary: 'pure white, silver, steel',
      wet: 'lens flare, reflections on glass',
      environment: 'desk setup, minimal workspace, dark studio',
    },
    bestArchetype: 'reveal',
    introStyle: 'in-hand-casual (day-in-life)',
    lighting: 'rim/edge lighting, no visible source, pure black void',
  },
  supplement: {
    label: 'Supplement / Nutrition',
    imageElements: ['powder explosion', 'dust cloud', 'particles', 'capsule break'],
    videoElements: ['powder explosion', 'dust cloud', 'particles catching light', 'settling'],
    backgrounds: {
      monochrome: 'deep charcoal, matte black, dark green',
      complementary: 'silver, white, clean ivory',
      wet: 'powder dust, particle scatter',
      environment: 'kitchen counter, gym bag, shaker bottle',
    },
    bestArchetype: 'hero',
    introStyle: 'unboxing-reveal (haul)',
    lighting: 'high contrast rim, product brightest',
  },
  fragrance: {
    label: 'Fragrance',
    imageElements: ['mist diffusion', 'glass refraction', 'soft glow', 'scent visualization'],
    videoElements: ['mist diffusion', 'glass refraction', 'soft glow', 'scent visualization'],
    backgrounds: {
      monochrome: 'matching scent color, amber, floral pink, woody brown',
      complementary: 'neutral ivory, stone, marble',
      wet: 'glass refraction, caustics',
      environment: 'dressing table, vanity, bathroom shelf',
    },
    bestArchetype: 'reveal',
    introStyle: 'show-to-camera (review)',
    lighting: 'amber rim lighting, pure black void',
  },
  fashion: {
    label: 'Fashion / Apparel',
    imageElements: ['fabric texture', 'raking light', 'soft shadows', 'fabric sheen'],
    videoElements: ['fabric movement', 'raking light', 'soft shadows', 'fabric sheen'],
    backgrounds: {
      monochrome: 'matching garment tone, editorial neutral',
      complementary: 'contrasting editorial color',
      wet: 'fabric texture close-up, material detail',
      environment: 'studio backdrop, street scene, runway',
    },
    bestArchetype: 'ugc',
    introStyle: 'show-to-camera (review)',
    lighting: 'editorial studio lighting, dramatic contrast',
  },
  home: {
    label: 'Home / Decor',
    imageElements: ['warm glow', 'flame flicker', 'smoke wisp', 'material texture'],
    videoElements: ['flame flicker', 'smoke rising', 'soft light diffusion', 'warm glow'],
    backgrounds: {
      monochrome: 'deep warm brown, charcoal, stone gray',
      complementary: 'warm ivory, wood tones',
      wet: 'wax pool, condensation',
      environment: 'wooden surface, shelf, table setting',
    },
    bestArchetype: 'hero',
    introStyle: 'show-to-camera (review)',
    lighting: 'warm cinematic, product brightest',
  },
  pet: {
    label: 'Pet',
    imageElements: ['fur texture', 'shiny coat', 'playful motion', 'treat crumble'],
    videoElements: ['fur movement', 'tail wag', 'playful action', 'eating'],
    backgrounds: {
      monochrome: 'kraft paper, warm brown, natural green',
      complementary: 'bright blue, fresh tone',
      wet: 'slobber, water bowl splash',
      environment: 'kitchen floor, dog bed, outdoor grass',
    },
    bestArchetype: 'ugc',
    introStyle: 'show-to-camera (review)',
    lighting: 'natural window light, warm kitchen',
  },
  fitness: {
    label: 'Fitness / Athletic',
    imageElements: ['condensation', 'sweat droplets', 'steel reflection', 'ice'],
    videoElements: ['water splash', 'ice cubes', 'condensation droplets', 'sweat'],
    backgrounds: {
      monochrome: 'deep blue, charcoal, matte black',
      complementary: 'silver, white, lime accent',
      wet: 'condensation, wet steel, splash',
      environment: 'gym floor, outdoor track, yoga studio',
    },
    bestArchetype: 'hero',
    introStyle: 'in-hand-casual (day-in-life)',
    lighting: 'high contrast, product brightest, dynamic',
  },
  real_estate: {
    label: 'Real Estate',
    imageElements: ['architectural lines', 'warm light', 'stone texture', 'golden hour'],
    videoElements: ['slow pan', 'door reveal', 'light wash', 'aerial drift'],
    backgrounds: {
      monochrome: 'warm stone, deep slate, architectural gray',
      complementary: 'brass gold, warm ivory',
      wet: 'pool reflection, water feature',
      environment: 'interior, exterior facade, balcony view',
    },
    bestArchetype: 'studio',
    introStyle: 'show-to-camera (tour)',
    lighting: 'golden hour, warm natural light, architectural',
  },
  saas: {
    label: 'SaaS / Software',
    imageElements: ['UI screenshot', 'dashboard', 'clean typography', 'data visualization'],
    videoElements: ['screen recording', 'UI animation', 'cursor movement'],
    backgrounds: {
      monochrome: 'clean white, light gray, minimal',
      complementary: 'brand accent color',
      wet: 'n/a',
      environment: 'laptop screen, desk, minimal workspace',
    },
    bestArchetype: 'meta',
    introStyle: 'show-to-camera (demo)',
    lighting: 'clean screen lighting, minimal',
  },
};

// === 9-BLOCK UNIVERSAL PROMPT SKELETON ===

export function build9BlockPrompt({ product, category, archetype, setting, beats, camera, lighting, audio, staticLock, vibe, aspectRatio = '3:4' }) {
  // Archetype: 'ugc' | 'reveal' | 'hero' | 'showcase' | 'studio'
  // Each archetype uses different blocks
  
  const cat = CATEGORY_ELEMENTS[category] || CATEGORY_ELEMENTS.saas;
  const blocks = [];
  
  // Block 1: PREAMBLE / FORMAT HEADER
  if (archetype === 'ugc') {
    blocks.push(`${product.duration || '12s'} UGC style ${product.contentType || 'review'} video, filmed on smartphone, ${lighting || 'natural window light'}, handheld selfie angle.`);
  } else if (archetype === 'reveal') {
    blocks.push(`${product.duration || '15s'} premium product reveal video, ${lighting || 'rim lighting'}, pure black void stage.`);
  } else if (archetype === 'hero') {
    blocks.push(`${product.duration || '15s'} ${cat.label.toLowerCase()} commercial video, ${camera || 'slow-motion macro cinematography'}, dramatic and premium.`);
  } else if (archetype === 'showcase') {
    blocks.push(`${product.duration || '12s'} product showcase video, ${camera || 'handheld'}, ${lighting || 'natural lighting'}.`);
  } else {
    // studio (image)
    blocks.push(`Premium ${cat.label} advertisement in vertical ${aspectRatio} format.`);
  }
  
  // Block 2: PRODUCT IDENTITY LOCK
  if (product.lockLine) {
    blocks.push(product.lockLine);
  } else if (product.name) {
    blocks.push(buildProductLock(product));
  }
  
  // Block 3: SUBJECT / PERSON (omit for product-only)
  if (archetype === 'ugc' || archetype === 'showcase') {
    if (product.person) {
      blocks.push(product.person);
    }
  }
  
  // Block 4: SETTING / ENVIRONMENT
  if (setting) {
    blocks.push(setting);
  } else if (archetype === 'reveal') {
    blocks.push('pure black background, no visible light source.');
  } else if (archetype === 'hero') {
    blocks.push(`Set against a ${cat.backgrounds.monochrome} backdrop on a reflective surface.`);
  } else if (archetype === 'studio') {
    const bg = cat.backgrounds;
    blocks.push(`The background must complement the product color — ${bg.monochrome}, ${bg.complementary}, ${bg.wet}, or ${bg.environment}.`);
  }
  
  // Block 5: BEATS / SHOT SEQUENCE / ACTION
  if (beats) {
    blocks.push(beats);
  } else if (archetype === 'ugc') {
    blocks.push('Jump cut — hook: show the product. Jump cut — demo: use it. Jump cut — result: react. Final shot — verdict.');
  } else if (archetype === 'hero') {
    blocks.push('Shot 1 (0-4s): Macro close-up. Shot 2 (4-8s): Hand interaction with elemental effect. Shot 3 (8-12s): Dramatic low angle. Shot 4 (12-15s): Hero composition with tagline.');
  } else if (archetype === 'reveal') {
    blocks.push('Shot 1 (0-4s): Product emerges from darkness, first text line. Shot 2 (4-10s): Slow rotation, second text line. Shot 3 (10-15s): Final hero angle, brand lockup.');
  }
  
  // Block 6: CAMERA / COMPOSITION
  if (camera) {
    blocks.push(`CAMERA: ${camera}`);
  } else if (archetype === 'ugc') {
    blocks.push('CAMERA: Handheld selfie angle, each jump cut slightly different angle.');
  } else if (archetype === 'hero') {
    blocks.push('CAMERA: Slow-motion macro, smooth camera no shake, dramatic product cinematography.');
  } else if (archetype === 'reveal') {
    blocks.push('CAMERA: All SLOW, 3-5s minimum. 360 rotation, gentle push-in, or overhead descent.');
  } else if (archetype === 'studio') {
    blocks.push('COMPOSITION: Vertical 3:4, centered, close-up or hero foreground, premium ad framing.');
  }
  
  // Block 7: LIGHTING
  if (lighting) {
    blocks.push(`LIGHTING: ${lighting}`);
  } else {
    blocks.push(`LIGHTING: ${cat.lighting}.`);
  }
  
  // Block 8: AUDIO (video only) / QUALITY DIRECTION (image)
  if (archetype === 'ugc' || archetype === 'showcase') {
    blocks.push(`AUDIO: ${audio || 'Phone mic, room ambience, no music.'}`);
  } else if (archetype === 'hero' || archetype === 'reveal') {
    blocks.push(`AUDIO: ${audio || 'Dramatic music bed + foley, no dialogue.'}`);
  } else if (archetype === 'studio') {
    blocks.push('QUALITY: Photorealistic, sharp focus, luxury campaign finish, commercial polish.');
  }
  
  // Block 9: STATIC LOCK / CONSISTENCY ANCHORS
  if (staticLock) {
    blocks.push(`STATIC LOCK: ${staticLock}`);
  }
  if (archetype !== 'studio' && product.name) {
    blocks.push('The product from @(img1) must remain visually unchanged in every shot. Maintain product design and label details throughout.');
  }
  
  // Vibe statement
  if (vibe) {
    blocks.push(`The overall feel is ${vibe}.`);
  } else if (archetype === 'ugc') {
    blocks.push('The overall feel is trustworthy, relatable, real — a friend telling you about something they genuinely like.');
  } else if (archetype === 'hero') {
    blocks.push('The overall feel is powerful, premium, cinematic.');
  } else if (archetype === 'reveal') {
    blocks.push('The overall feel is premium, authoritative, restrained.');
  } else if (archetype === 'studio') {
    blocks.push(`The final image should look like a luxury ${cat.label.toLowerCase()} campaign shot created for a premium commercial brand.`);
  }
  
  return blocks.join('\n');
}

// === CAMPAIGN KIT GENERATOR (upgrades existing generateCampaignKit) ===

export function buildBibleCampaignKit(brief, scores, options = {}) {
  const { van, dmn, dan, limbic } = scores;
  const vanPct = zToPct(van);
  const dmnPct = zToPct(-dmn);
  const danPct = zToPct(dan);
  const limbicPct = zToPct(limbic);
  const overall = Math.round(vanPct * 0.35 + Math.max(0, -dmn * 33 + 50) * 0.25 + danPct * 0.15 + limbicPct * 0.25);
  
  // Detect product category from brief
  const { category, confidence } = detectCategory(brief);
  const cat = CATEGORY_ELEMENTS[category] || CATEGORY_ELEMENTS.saas;
  
  // Determine archetype based on category + neural scores
  let archetype = cat.bestArchetype;
  if (options.archetype) archetype = options.archetype;
  else if (limbicPct > 60 && category === 'skincare') archetype = 'ugc';
  else if (vanPct > 60 && category === 'tech') archetype = 'reveal';
  else if (vanPct > 50 && limbicPct > 50) archetype = 'hero';
  
  // Headline generation (kept from original, enhanced with category awareness)
  const lower = brief.toLowerCase();
  let headline;
  if (category === 'skincare' || lower.includes('skincare') || lower.includes('beauty')) {
    headline = limbicPct > 50 ? 'Your skin deserves this.' : 'The routine that changes everything.';
  } else if (category === 'beverage' || lower.includes('drink') || lower.includes('beverage')) {
    headline = vanPct > 50 ? 'Taste the difference.' : 'Refresh, reimagined.';
  } else if (category === 'food') {
    headline = 'Crave more. Wait less.';
  } else if (category === 'tech') {
    headline = 'The future, in your hands.';
  } else if (category === 'fashion') {
    headline = 'Wear your story.';
  } else if (category === 'real_estate' || lower.includes('real estate') || lower.includes('property')) {
    headline = 'The property your competitors haven\'t found.';
  } else if (lower.includes('pqc') || lower.includes('quantum') || lower.includes('compliance')) {
    headline = 'Your data isn\'t safe. Here\'s why.';
  } else if (lower.includes('agency') || lower.includes('marketing') || lower.includes('social')) {
    headline = 'Your agency is overpaying. We fixed it.';
  } else if (lower.includes('blockchain') || lower.includes('hedera') || lower.includes('smart contract')) {
    headline = 'Enterprise blockchain. No PhD required.';
  } else {
    headline = van > 0.4 ? 'This changes everything.' : 'What they\'re not telling you.';
  }
  
  // Subheadline
  const subheadline = dmn < 0
    ? brief.split(' ').slice(0, 15).join(' ') + ' — this is why it matters now.'
    : brief.length > 80 ? brief.substring(0, 80) + '...' : brief;
  
  // Platform plan
  const platforms = [];
  if (danPct > 50) platforms.push('LinkedIn carousel (thought leadership)');
  if (vanPct > 50) platforms.push('Twitter/X thread (hook-driven)');
  if (limbicPct > 50) platforms.push('Instagram (visual + emotional)');
  if (vanPct > 60) platforms.push('TikTok short (pattern interrupt)');
  if (platforms.length === 0) platforms.push('LinkedIn post', 'Twitter/X thread');
  
  // Build the Bible image prompt (replaces the old one-liner)
  const productObj = {
    name: brief.split(' ').slice(0, 5).join(' '),
    color: extractColor(brief, category),
    finish: extractFinish(brief, category),
    packaging: extractPackaging(brief, category),
    typography: 'clean typography',
    formFactor: extractFormFactor(brief, category),
  };
  
  const bibleImagePrompt = build9BlockPrompt({
    product: productObj,
    category,
    archetype: 'studio',
    aspectRatio: '3:4',
    vibe: `editorial, premium, ${cat.label.toLowerCase()} campaign`,
  });
  
  // Also build a video prompt if archetype is video-based
  let bibleVideoPrompt = null;
  if (archetype !== 'studio') {
    bibleVideoPrompt = build9BlockPrompt({
      product: { ...productObj, duration: '12s', contentType: 'review' },
      category,
      archetype,
      vibe: archetype === 'ugc' ? 'trustworthy, relatable, real' : 'powerful, premium, cinematic',
    });
  }
  
  // CTA
  const cta = dan > 0.2
    ? ['Book a demo', 'See the platform', 'Schedule an audit']
    : limbic > 0.1
      ? ['Get started today', 'Claim your spot', 'Join the waitlist']
      : ['Learn more', 'Get in touch', 'Request access'];
  
  return {
    campaign: {
      headline,
      subheadline,
      brief: brief.trim(),
      platforms,
      image_prompt: bibleImagePrompt,
      video_prompt: bibleVideoPrompt,
      cta_options: cta,
      aspect_ratios: ['4:5', '9:16', '1:1', '16:9', '3:4'],
      tone: van > 0.5 ? 'provocative' : dmn < -0.2 ? 'urgent' : limbic > 0.2 ? 'emotional' : 'authoritative',
      archetype,
      product_category: category,
      category_confidence: confidence,
    },
    neural_scores: {
      van: { z: Math.round(van * 100) / 100, pct: vanPct },
      dmn: { z: Math.round(dmn * 100) / 100, pct: dmnPct },
      dan: { z: Math.round(dan * 100) / 100, pct: danPct },
      limbic: { z: Math.round(limbic * 100) / 100, pct: limbicPct },
      overall,
    },
  };
}

// === HELPER FUNCTIONS ===

function zToPct(z) { return Math.round(Math.min(100, Math.max(0, (z + 1.5) / 3 * 100))); }

function extractColor(brief, category) {
  const lower = brief.toLowerCase();
  const colorMap = {
    blue: 'deep cobalt-blue', cobalt: 'deep cobalt-blue', navy: 'navy blue',
    red: 'deep red', crimson: 'crimson', berry: 'berry red',
    green: 'matcha green', sage: 'sage green', forest: 'forest green',
    black: 'matte black', charcoal: 'charcoal',
    white: 'clean white', ivory: 'warm ivory', cream: 'warm cream',
    gold: 'gold', silver: 'silver', amber: 'amber',
    pink: 'dusty rose', rose: 'dusty rose',
    brown: 'warm brown', taupe: 'taupe',
  };
  for (const [kw, color] of Object.entries(colorMap)) {
    if (lower.includes(kw)) return color;
  }
  // Category defaults
  const defaults = {
    skincare: 'deep cobalt-blue', beverage: 'deep amber', food: 'warm red',
    tech: 'matte black', supplement: 'matte black', fragrance: 'amber',
    fashion: 'editorial neutral', home: 'warm brown', pet: 'kraft brown',
    fitness: 'matte black', real_estate: 'warm stone', saas: 'clean white',
  };
  return defaults[category] || 'premium';
}

function extractFinish(brief, category) {
  const lower = brief.toLowerCase();
  if (lower.includes('glossy') || lower.includes('shiny')) return 'glossy';
  if (lower.includes('matte')) return 'matte';
  if (lower.includes('metallic') || lower.includes('chrome') || lower.includes('steel')) return 'metallic';
  if (lower.includes('glass')) return 'glass';
  const defaults = {
    skincare: 'glossy', beverage: 'glass', food: 'matte', tech: 'matte',
    supplement: 'matte', fragrance: 'glass', fashion: 'fabric',
    home: 'matte', pet: 'kraft', fitness: 'matte', real_estate: 'stone', saas: 'clean',
  };
  return defaults[category] || 'premium';
}

function extractPackaging(brief, category) {
  const lower = brief.toLowerCase();
  if (lower.includes('bottle')) return 'bottle design';
  if (lower.includes('can')) return 'cylindrical can';
  if (lower.includes('box')) return 'rectangular box';
  if (lower.includes('jar')) return 'tapered jar';
  if (lower.includes('tube')) return 'squeeze tube';
  if (lower.includes('tub')) return 'tub design';
  if (lower.includes('bag')) return 'paper bag';
  if (lower.includes('case')) return 'case design';
  const defaults = {
    skincare: 'rounded capsule bottle', beverage: 'glass bottle', food: 'box',
    tech: 'minimal device', supplement: 'tub', fragrance: 'crystal bottle',
    fashion: 'garment', home: 'jar', pet: 'bag', fitness: 'bottle',
    real_estate: 'architectural', saas: 'interface',
  };
  return defaults[category] || 'product design';
}

function extractFormFactor(brief, category) {
  const lower = brief.toLowerCase();
  if (lower.includes('cap')) return 'cap shape';
  if (lower.includes('lid')) return 'lid design';
  if (lower.includes('pump')) return 'pump dispenser';
  if (lower.includes('flip')) return 'flip cap';
  if (lower.includes('cork')) return 'cork top';
  const defaults = {
    skincare: 'cap shape', beverage: 'cap design', food: 'box structure',
    tech: 'form factor', supplement: 'lid design', fragrance: 'cap design',
    fashion: 'cut', home: 'lid', pet: 'bag closure', fitness: 'cap design',
    real_estate: 'facade', saas: 'layout',
  };
  return defaults[category] || 'design';
}

// === ARCHETYPE LABELS ===

export const ARCHETYPES = {
  ugc: 'UGC Selfie Video (9-Layer)',
  reveal: 'Premium Reveal Video (Dark Void)',
  hero: 'Product Hero Video (Elemental)',
  showcase: 'Product Showcase Video (AI Person + Product)',
  studio: 'Studio Image Ad (Claytox System)',
  meta: 'Meta Image Ad (37 Templates)',
  pixar: 'Pixar-Style 3D Animated Ad',
  claymation: 'Claymation Animated Ad',
};

// === SAFETY SUFFIXES (for image ads) ===

export const SAFETY_SUFFIXES = {
  noChrome: 'No iOS device chrome, no platform UI, no link cards, no engagement rows. Output is the standalone upload-ready image.',
  safeZone: 'All text, headlines, CTAs, and focal subjects must fit within the central 84% of the canvas (8% padding from every edge). Backgrounds may bleed; text may not touch or extend off any edge.',
  glyphSafety: 'Inside body-text blocks: plain words only, no emoji, no unicode glyphs mid-sentence. Exactly the specified count of conversation elements.',
};

export function withSafetySuffixes(prompt) {
  return `${prompt}\n\n${SAFETY_SUFFIXES.noChrome}\n${SAFETY_SUFFIXES.safeZone}`;
}