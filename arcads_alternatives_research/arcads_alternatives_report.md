# Open-Source / Free AI Video Generation Alternatives to Arcads

Prepared for PetPawSphere (UAE market, vertical 9:16 video ads).

## Methodology
Searched Hugging Face Hub models/spaces and GitHub for:
1. UGC/testimonial-style talking-head video generators
2. Product showcase / premium reveal video generators
3. Text-to-video models with 9:16 vertical capability
4. Image-to-video / character-consistent video models

Evaluation criteria: cost (free/open first), 9:16 vertical support, character/face consistency, hardware requirements, setup difficulty, output quality, license.

---

## 1. WAN 2.1 / 2.2 (Alibaba Wan-AI)
- **Category:** Text-to-Video (T2V) + Image-to-Video (I2V)
- **Repo:** https://github.com/Wan-Video/Wan2.1 (16.3k stars)
- **HF models:**
  - T2V: https://huggingface.co/Wan-AI/Wan2.1-T2V-1.3B
  - T2V 14B: https://huggingface.co/Wan-AI/Wan2.1-T2V-14B
  - I2V 14B: https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-480P
  - Wan2.2 I2V: https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B
- **License:** Apache-2.0 (free commercial use allowed)
- **Hardware:** 1.3B model runs on ~8GB VRAM; 14B needs ~40–80GB or CPU offloading.
- **Setup difficulty:** Medium (pip install + diffusers; ComfyUI nodes also available).
- **Output quality:** State-of-the-art open-source motion coherence and prompt following.
- **9:16 vertical:** Yes — accepts arbitrary width/height in pixels, generate 480×848, 576×1024, etc.
- **Character/face consistency:** Fair-to-good with I2V; best when using character reference image and face LoRAs.
- **Verdict:** Best free/open balance for vertical ads. 1.3B is consumer-GPU friendly; 14B is top quality if you have VRAM or use CPU offloading. Apache license is safe for commercial UAE use.

## 2. CogVideoX (THUDM / Zhipu AI)
- **Category:** Text-to-Video + Image-to-Video
- **Repo:** https://github.com/zai-org/CogVideo (12.8k stars)
- **HF models:**
  - 2B T2V: https://huggingface.co/zai-org/CogVideoX-2b (Apache-2.0)
  - 5B T2V: https://huggingface.co/zai-org/CogVideoX-5b (CogVideoX custom license)
  - 5B I2V: https://huggingface.co/zai-org/CogVideoX-5b-I2V (CogVideoX custom license)
- **License:** 2B = Apache-2.0; 5B = custom CogVideoX License (commercial use generally permitted for generated content, but review license text).
- **Hardware:** 2B runs on GTX 1080 Ti+; 5B diffusers ~5GB VRAM minimum with quantization.
- **Setup difficulty:** Medium; diffusers pipeline available; has free HF Space.
- **Output quality:** Good for short clips; slightly behind Wan 2.1 on motion.
- **9:16 vertical:** Yes — supports arbitrary resolutions.
- **Character/face consistency:** Moderate; I2V helps anchor first frame.
- **Verdict:** Solid runner-up. 2B is fully Apache-2.0 and easy to run locally; 5B has better quality but custom license. Free HF Space is a fast no-GPU test path.

## 3. HunyuanVideo 1.5 (Tencent)
- **Category:** Text-to-Video + Image-to-Video
- **Repo:** https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5 (4.5k stars)
- **HF model:** https://huggingface.co/tencent/HunyuanVideo-1.5
- **License:** Tencent Hunyuan Community License (commercial use restricted for large commercial entities; generated content rights to user; not for EU/UK/KR).
- **Hardware:** Minimum 14GB VRAM with offloading; recommended 24GB+.
- **Setup difficulty:** Medium-Hard (conda env + flash attention; xDiT for multi-GPU).
- **Output quality:** Near-SOTA, strong motion and text rendering.
- **9:16 vertical:** Yes — configurable height/width.
- **Character/face consistency:** Good with I2V mode and reference images.
- **Verdict:** Top quality but license is more restrictive than Apache. Best if you already have a 24GB+ GPU and are comfortable with community-license terms. Not ideal for cost-sensitive zero-budget use without GPU.

## 4. LTX-Video / LTX-2 (Lightricks)
- **Category:** Image-to-Video + Text-to-Video
- **Repo:** https://github.com/Lightricks/LTX-Video (10.5k stars) and https://github.com/Lightricks/LTX-2 (7.4k stars)
- **HF models:**
  - LTX-Video: https://huggingface.co/Lightricks/LTX-Video
  - LTX-2: https://huggingface.co/Lightricks/LTX-2
- **License:** LTX-Video Open Weights License (custom). Free for individuals/small businesses; commercial entities with ≥$10M annual revenue need a paid commercial license from Lightricks.
- **Hardware:** Very efficient — 1GB+ VRAM claimed; 720×480×121 on RTX 4060 8GB in under a minute.
- **Setup difficulty:** Easy-Medium; diffusers integration and desktop app (LTX-Desktop) available.
- **Output quality:** High-quality, fast, real-time capable with distilled models.
- **9:16 vertical:** Yes — supports arbitrary aspect ratios; works for vertical.
- **Character/face consistency:** Moderate with I2V; best for product motion/reveal clips.
- **Verdict:** Fastest and lowest hardware barrier. Custom license is fine for small UAE startup but watch the $10M revenue threshold. Excellent for product showcase/premium reveal clips.

## 5. LivePortrait (Kling/Kuaishou)
- **Category:** UGC / testimonial-style talking-head portrait animation
- **Repo:** https://github.com/KlingAIResearch/LivePortrait (18.6k stars)
- **HF model:** https://huggingface.co/KlingTeam/LivePortrait
- **License:** MIT (very permissive)
- **Hardware:** Runs on most NVIDIA GPUs; can run on CPU fallback/slower.
- **Setup difficulty:** Easy (pip install + gradio UI).
- **Output quality:** Excellent for single-face puppeteering / lip-sync / head motion from a source image + driving video.
- **9:16 vertical:** Yes — output resolution follows input image; use 9:16 source portrait.
- **Character/face consistency:** Excellent — face identity locked to source image.
- **Verdict:** Best for UGC selfie/testimonial talking-head ads. It does not synthesize full body motion from text; you need a source portrait + driving video/audio. Combine with TTS (e.g., Parler TTS / XTTS) for Arabic/English voiceover.

---

## Other Notable Options

### EchoMimic / EchoMimicV2 (Ant Group)
- **Repo:** https://github.com/antgroup/echomimic_v2 (4.6k stars)
- **Category:** Audio-driven portrait / half-body animation
- **License:** Not clearly Apache; check repo license file (typically Apache-2.0 for Ant projects).
- **Hardware:** RTX 4090 / A100 recommended; 16GB minimum.
- **9:16:** Yes with portrait input.
- **Face consistency:** Excellent (identity preserved).
- **Verdict:** Good alternative to LivePortrait for audio-driven avatar clips. Slightly heavier setup.

### AniPortrait
- **Repo:** https://github.com/Zejun-Yang/AniPortrait (5k stars)
- **Category:** Audio-driven photorealistic portrait video
- **License:** Apache-2.0 (likely; confirm in repo).
- **Hardware:** CUDA 11.7+, ~16–24GB VRAM.
- **9:16:** Yes.
- **Face consistency:** Excellent.
- **Verdict:** Great talking-head synthesis; setup more involved than LivePortrait.

### Hallo / Hallo2 / Hallo3 (Fudan)
- **Repo:** https://github.com/fudan-generative-vision/hallo2 (3.7k stars)
- **Category:** Audio-driven portrait animation
- **License:** Apache-2.0 (typical for Fudan generative vision repos).
- **Hardware:** A100 tested; ~16GB+ VRAM likely.
- **Verdict:** High quality but heavier; useful if LivePortrait quality is insufficient.

### MusePose (Tencent)
- **Repo:** https://github.com/TMElyralab/MusePose (2.7k stars)
- **Category:** Pose-driven image-to-video / dance / body motion
- **License:** CreativeML OpenRail-M.
- **Hardware:** 16GB VRAM (512×512×48) to 28GB VRAM (768×768×48).
- **Verdict:** Good for pet-human or product-model motion, but not a pure text-to-video generator.

### Open-Sora v2 (HPC-AI Tech)
- **Repo:** https://github.com/hpcaitech/Open-Sora (29k stars)
- **HF model:** https://huggingface.co/hpcai-tech/Open-Sora-v2
- **License:** Apache-2.0
- **Hardware:** H100/H800 best; multi-GPU for 768p.
- **Verdict:** Fully open and reproducible training, but needs heavy GPU infrastructure. More of a research/scale option than quick ad production.

### ModelScope Text-to-Video 1.7B (Alibaba)
- **HF model:** https://huggingface.co/ali-vilab/text-to-video-ms-1.7b
- **License:** CC-BY-NC-4.0 (non-commercial only)
- **Verdict:** Easy, but NC license blocks commercial UAE use. Skip for paid ads.

---

## Free Hugging Face Inference Spaces (No Local GPU Required)

These Spaces run on Hugging Face ZeroGPU/Free GPU hardware. You can generate videos in-browser without paying.

1. **Wan 2.2 I2V / T2V Fast (ZeroGPU A10G)**
   - https://huggingface.co/spaces/r3gm/wan2-2-fp8da-aoti-preview (2,772 likes, running on zero-a10g)
   - https://huggingface.co/spaces/zerogpu-aoti/wan2-2-fp8da-aoti-faster (3,220 likes, running on zero-a10g)
   - https://huggingface.co/spaces/multimodalart/wan2-1-fast (1,612 likes, running on zero-a10g)
   - https://huggingface.co/spaces/r3gm/wan2-2-fp8da-aoti-preview-2 (1,739 likes, running on zero-a10g)

2. **Wan 2.2 First-Last-Frame / Animate (ZeroGPU)**
   - https://huggingface.co/spaces/multimodalart/wan-2-2-first-last-frame (642 likes, zero-a10g)
   - https://huggingface.co/spaces/alexnasa/Wan2.2-Animate-ZEROGPU (292 likes, zero-a10g)

3. **CogVideoX 5B / 2B (ZeroGPU A10G)**
   - https://huggingface.co/spaces/zai-org/CogVideoX-5B-Space (1,038 likes, running)
   - https://huggingface.co/spaces/zai-org/CogVideoX-2B-Space (461 likes, running)

4. **LivePortrait (ZeroGPU A10G)**
   - https://huggingface.co/spaces/KlingTeam/LivePortrait (3,751 likes, running)

5. **LTX-Video / LTX-2 (ZeroGPU A10G)**
   - https://huggingface.co/spaces/Lightricks/ltx-video-distilled (1,512 likes, running)
   - https://huggingface.co/spaces/Lightricks/LTX-2-3 (372 likes, running)
   - https://huggingface.co/spaces/alexnasa/ltx-2-TURBO (510 likes, running)
   - https://huggingface.co/spaces/multimodalart/ltx2-audio-to-video (71 likes, running)

6. **CogVideoX-Fun 5B (CPU basic — slower)**
   - https://huggingface.co/spaces/alibaba-pai/CogVideoX-Fun-5b (129 likes, cpu-basic)

**Note:** Free Spaces may queue or sleep after inactivity. For production volume, self-host on a cloud GPU (RunPod, Vast.ai, Lambda Labs, etc.) using the same open weights.

---

## Top 5 Recommendation for PetPawSphere

| Rank | Option | Best For | Why |
|------|--------|----------|-----|
| 1 | **Wan 2.1 / 2.2** | All vertical ad types | Apache-2.0, free, great quality, consumer-GPU 1.3B option, easy 9:16 |
| 2 | **LivePortrait** | UGC testimonial talking-head | MIT license, locks face identity, lightweight, great for pet-owner selfie-style ads |
| 3 | **LTX-Video / LTX-2** | Product showcase / premium reveal | Very fast, low VRAM, high quality; just watch custom license revenue threshold |
| 4 | **CogVideoX 2B/5B** | Backup text-to-video | 2B fully Apache, 5B has free Space; slightly behind Wan but very usable |
| 5 | **HunyuanVideo 1.5** | High-end T2V/I2V | Top quality, but needs 24GB+ GPU and has restrictive Tencent community license |

---

## Suggested Workflow for PetPawSphere

1. **UGC selfie/testimonial ads:** Use LivePortrait on HF Space or self-hosted. Provide a 9:16 pet-owner portrait + a driving video/audio. Add voiceover with an open TTS model.
2. **Product showcase / premium reveal:** Use Wan 2.1 T2V/I2V or LTX-Video. Prompt e.g., "Slow-motion premium pet food reveal, glossy kibble pouring into ceramic bowl, warm studio lighting, vertical 9:16."
3. **Character-consistent pet/spokesperson:** Use Wan 2.1 I2V or LTX-Video I2V with a reference image. Fine-tune a LoRA on your brand mascot if needed (Wan/CogVideoX LoRA training possible).
4. **Scale without per-API fees:** Rent a cloud GPU (e.g., RTX 4090/24GB or A100/80GB) and run the same open pipelines via Diffusers or ComfyUI.

---

## Sources
- Wan 2.1 repo: https://github.com/Wan-Video/Wan2.1
- Wan 2.1 HF models: https://huggingface.co/Wan-AI
- CogVideo repo: https://github.com/zai-org/CogVideo
- CogVideo HF: https://huggingface.co/zai-org
- HunyuanVideo 1.5 repo: https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5
- HunyuanVideo 1.5 HF: https://huggingface.co/tencent/HunyuanVideo-1.5
- LTX-Video repo: https://github.com/Lightricks/LTX-Video
- LTX HF: https://huggingface.co/Lightricks/LTX-Video
- LivePortrait repo: https://github.com/KlingAIResearch/LivePortrait
- LivePortrait HF: https://huggingface.co/KlingTeam/LivePortrait
- Open-Sora v2 HF: https://huggingface.co/hpcai-tech/Open-Sora-v2
- Hugging Face Spaces discovered via Hub API (zero-a10g free GPU runtime) and model cards.

*Report generated: 2026-06-18*
