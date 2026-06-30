Title: GitHub - awesome-genmedia/skills: Awesome skills for AI image generation, video generation, song generation and more!

URL Source: https://github.com/awesome-genmedia/skills

Markdown Content:
> 562 generative media skills for AI agents, powered by [each::labs](https://eachlabs.ai/).

Generate images, videos, audio, 3D models, and more using 431 AI models through a single API. Install as a Claude Code plugin and get instant access to every skill.

## Install

[](https://github.com/awesome-genmedia/skills#install)

# Claude Code plugin
/plugin install awesome-genmedia

# Or add individual skills
npx skills add awesome-genmedia/skills@image-generation
npx skills add awesome-genmedia/skills@flux-2-max
npx skills add awesome-genmedia/skills@logo-design

## Setup

[](https://github.com/awesome-genmedia/skills#setup)
1.   Sign up at [eachlabs.ai](https://eachlabs.ai/)
2.   Get your API key from Settings
3.   Set environment variable: export EACHLABS_API_KEY="your-api-key" 

## Quick Example

[](https://github.com/awesome-genmedia/skills#quick-example)

curl -X POST https://eachsense-agent.core.eachlabs.run/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $EACHLABS_API_KEY" \
  -d '{
 "messages": [{"role": "user", "content": "Generate a professional headshot, studio lighting, neutral background"}],
 "stream": false
 }'

## Default Skills (14)

[](https://github.com/awesome-genmedia/skills#default-skills-14)
Core generative media capabilities at the root level:

| Skill | Description |
| --- | --- |
| [image-generation](https://github.com/awesome-genmedia/skills/blob/main/image-generation/SKILL.md) | Generate images from text |
| [image-editing](https://github.com/awesome-genmedia/skills/blob/main/image-editing/SKILL.md) | Edit images with natural language |
| [image-upscaling](https://github.com/awesome-genmedia/skills/blob/main/image-upscaling/SKILL.md) | Enhance image resolution |
| [background-removal](https://github.com/awesome-genmedia/skills/blob/main/background-removal/SKILL.md) | Remove image backgrounds |
| [face-swap](https://github.com/awesome-genmedia/skills/blob/main/face-swap/SKILL.md) | Swap faces between photos |
| [video-generation](https://github.com/awesome-genmedia/skills/blob/main/video-generation/SKILL.md) | Generate videos from text or images |
| [video-editing](https://github.com/awesome-genmedia/skills/blob/main/video-editing/SKILL.md) | Edit videos with AI |
| [song-generation](https://github.com/awesome-genmedia/skills/blob/main/song-generation/SKILL.md) | Generate songs with vocals |
| [music-generation](https://github.com/awesome-genmedia/skills/blob/main/music-generation/SKILL.md) | Generate instrumental music |
| [lyrics-generation](https://github.com/awesome-genmedia/skills/blob/main/lyrics-generation/SKILL.md) | Generate song lyrics |
| [voice-generation](https://github.com/awesome-genmedia/skills/blob/main/voice-generation/SKILL.md) | Generate human-like voice audio |
| [text-to-speech](https://github.com/awesome-genmedia/skills/blob/main/text-to-speech/SKILL.md) | Convert text to speech |
| [speech-to-text](https://github.com/awesome-genmedia/skills/blob/main/speech-to-text/SKILL.md) | Transcribe audio to text |
| [sound-effects](https://github.com/awesome-genmedia/skills/blob/main/sound-effects/SKILL.md) | Generate custom sound effects |

## Categories (117 skills)

[](https://github.com/awesome-genmedia/skills#categories-117-skills)
Use-case specific skills organized by domain:

| Domain | Skills | Examples |
| --- | --- | --- |
| [Image](https://github.com/awesome-genmedia/skills/blob/main/categories/image) | 15 | Headshots, avatars, QR codes, patterns, tattoos |
| [Video](https://github.com/awesome-genmedia/skills/blob/main/categories/video) | 10 | Text/image-to-video, music videos, trailers, loops |
| [Audio](https://github.com/awesome-genmedia/skills/blob/main/categories/audio) | 6 | TTS, music, sound effects, voiceover, jingles |
| [Design](https://github.com/awesome-genmedia/skills/blob/main/categories/design) | 14 | Logos, thumbnails, posters, business cards, packaging |
| [Face & Portrait](https://github.com/awesome-genmedia/skills/blob/main/categories/face-portrait) | 7 | Face swap, aging, beauty, caricature, makeup |
| [Social Media](https://github.com/awesome-genmedia/skills/blob/main/categories/social-media) | 6 | Instagram, TikTok, Twitter, LinkedIn, Pinterest, YouTube |
| [E-commerce](https://github.com/awesome-genmedia/skills/blob/main/categories/ecommerce) | 5 | Product photos, mockups, lifestyle, video ads |
| [Marketing](https://github.com/awesome-genmedia/skills/blob/main/categories/marketing) | 5 | Ad creatives, brand kits, landing pages, campaigns |
| [Gaming](https://github.com/awesome-genmedia/skills/blob/main/categories/gaming) | 6 | Game assets, characters, environments, sprites, UI |
| [Fashion](https://github.com/awesome-genmedia/skills/blob/main/categories/fashion) | 5 | Fashion models, outfits, try-on, fabric patterns |
| [Real Estate](https://github.com/awesome-genmedia/skills/blob/main/categories/real-estate) | 5 | Virtual staging, interior design, floor plans |
| [Photography](https://github.com/awesome-genmedia/skills/blob/main/categories/photography) | 5 | Restoration, colorization, stock photos, HDR |
| [3D & AR](https://github.com/awesome-genmedia/skills/blob/main/categories/3d-ar) | 4 | 3D models, textures, image-to-3D, AR filters |
| [NFT & Art](https://github.com/awesome-genmedia/skills/blob/main/categories/nft-art) | 4 | NFT collections, pixel art, generative art |
| [Education](https://github.com/awesome-genmedia/skills/blob/main/categories/education) | 4 | Diagrams, flashcards, educational videos |
| [Architecture](https://github.com/awesome-genmedia/skills/blob/main/categories/architecture) | 3 | Building visualization, landscape, renders |
| [Food & Beverage](https://github.com/awesome-genmedia/skills/blob/main/categories/food-beverage) | 3 | Food photography, recipe visuals, menus |
| [Automotive](https://github.com/awesome-genmedia/skills/blob/main/categories/automotive) | 3 | Car configurator, vehicle wraps, auto ads |
| [NSFW](https://github.com/awesome-genmedia/skills/blob/main/categories/nsfw) | 2 | Adult image and video generation |
| [Workflows](https://github.com/awesome-genmedia/skills/blob/main/categories/workflows) | 5 | Multi-model pipelines and batch processing |

## Models (431)

[](https://github.com/awesome-genmedia/skills#models-431)
Every AI model available on each::labs has its own skill under [`models/`](https://github.com/awesome-genmedia/skills/blob/main/models):

### Image Generation

[](https://github.com/awesome-genmedia/skills#image-generation)
`flux-2-max` · `flux-2-pro` · `flux-2` · `flux-kontext-pro` · `flux-kontext-max` · `nano-banana-pro` · `nano-banana-2-text-to-image` · `gemini-3-pro-image-preview` · `imagen-4-fast` · `imagen4-preview` · `bytedance-seedream-v4-5-text-to-image` · `bytedance-seedream-v5-lite-text-to-image` · `kling-v3-text-to-image` · `gpt-image-v1-5-text-to-image` · `xai-grok-imagine-text-to-image` · `reve-text-to-image` · `ideogram-v3-turbo` · `stable-diffusion-3-5-large` · [and more...](https://github.com/awesome-genmedia/skills/blob/main/models)

### Video Generation

[](https://github.com/awesome-genmedia/skills#video-generation)
`veo-3` · `veo3-1-text-to-video` · `veo3-1-text-to-video-fast` · `kling-o3-pro-text-to-video` · `kling-v3-pro-text-to-video` · `sora-2-text-to-video-pro` · `pixverse-v5-6-text-to-video` · `wan-v2-6-text-to-video` · `runway-gen4-aleph` · `pika-v2-2-text-to-video` · `seedance-v1-5-pro-text-to-video` · `minimax-hailuo-v2-3-pro-text-to-video` · [and more...](https://github.com/awesome-genmedia/skills/blob/main/models)

### Image Editing

[](https://github.com/awesome-genmedia/skills#image-editing)
`flux-2-edit` · `flux-2-max-edit` · `flux-fill-pro` · `eachlabs-bg-remover-v1` · `topaz-upscale-image` · `kling-face-swap` · `nano-banana-pro-edit` · `qwen-ai-image-edit` · `firered-image-edit-v1-1` · [and more...](https://github.com/awesome-genmedia/skills/blob/main/models)

### Audio & Music

[](https://github.com/awesome-genmedia/skills#audio--music)
`elevenlabs-text-to-speech` · `mureka-generate-song` · `mureka-generate-instrumental` · `mureka-generate-lyrics` · `stable-audio-2-5-text-to-audio` · `xai-grok-tts-text-to-speech` · `google-text-to-speech` · `deepgram-nova-3-speech-to-text` · `whisper` · [and more...](https://github.com/awesome-genmedia/skills/blob/main/models)

### Video Editing & Effects

[](https://github.com/awesome-genmedia/skills#video-editing--effects)
`topaz-upscale-video` · `auto-subtitle` · `heygen-video-translate` · `pixverse-lip-sync` · `merge-videos` · `ffmpeg-api-merge-audio-video` · [and more...](https://github.com/awesome-genmedia/skills/blob/main/models)

### Talking Head & Avatar

[](https://github.com/awesome-genmedia/skills#talking-head--avatar)
`bytedance-omnihuman-v1-5` · `bytedance-dreamactor-v2` · `kling-avatar-v2-pro` · `sync-lipsync-v2-pro` · `infinitalk-image-to-video` · [and more...](https://github.com/awesome-genmedia/skills/blob/main/models)

[Browse all 431 models →](https://github.com/awesome-genmedia/skills/blob/main/models)

## API

[](https://github.com/awesome-genmedia/skills#api)
### each::sense (for use-case skills)

[](https://github.com/awesome-genmedia/skills#eachsense-for-use-case-skills)
OpenAI-compatible endpoint that auto-selects the best model:

from openai import OpenAI

client = OpenAI(
    api_key="YOUR_EACHLABS_API_KEY",
    base_url="https://eachsense-agent.core.eachlabs.run/v1"
)

response = client.chat.completions.create(
    model="eachsense/beta",
    messages=[{"role": "user", "content": "Generate a logo for a coffee brand"}]
)

### Prediction API (for specific models)

[](https://github.com/awesome-genmedia/skills#prediction-api-for-specific-models)
Direct model access:

curl -X POST https://api.eachlabs.ai/v1/prediction \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $EACHLABS_API_KEY" \
  -d '{
 "model": "flux-2-max",
 "version": "0.0.1",
 "input": {
 "prompt": "A professional headshot, studio lighting",
 "aspect_ratio": "1:1"
 }
 }'

## Documentation

[](https://github.com/awesome-genmedia/skills#documentation)
*   [each::sense Overview](https://docs.eachlabs.ai/sense/overview)
*   [API Reference](https://docs.eachlabs.ai/api/overview)
*   [Models Directory](https://docs.eachlabs.ai/models/overview)
*   [Workflows](https://docs.eachlabs.ai/workflows/overview)

## Contributing

[](https://github.com/awesome-genmedia/skills#contributing)
See [CONTRIBUTING.md](https://github.com/awesome-genmedia/skills/blob/main/CONTRIBUTING.md) for guidelines.

## License

[](https://github.com/awesome-genmedia/skills#license)
[MIT](https://github.com/awesome-genmedia/skills/blob/main/LICENSE)
