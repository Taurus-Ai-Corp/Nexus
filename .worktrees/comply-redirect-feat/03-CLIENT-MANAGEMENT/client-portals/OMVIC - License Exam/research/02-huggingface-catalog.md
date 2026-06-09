# HuggingFace Asset Catalog — AI-Native Licensing Exam Tutor

**Target**: OMVIC (Ontario Motor Vehicle Industry Council) license exam
**Strategic reuse**: Real estate (RECO), insurance (LLQP/RIBO), paralegal (LSO), securities (CSC), mortgage (FSRA)
**Budget posture**: Free / permissive licenses, single-GPU (≤24GB VRAM) inference, Claude/Gemini as orchestration layer calling HF models as specialized tools.
**Date**: 2026-04-24 | Authenticated as: Q-GRID (HF)

---

## Executive Summary

1. **Question generation is a solved, commodity capability on HF.** Dozens of T5/BART/Flan-T5 fine-tunes exist (Valhalla, LMQG, potsawee, mrm8488) under Apache-2.0 / MIT. We do NOT need to train our own QG model for v1 — we call `potsawee/t5-large-generation-race-QuestionAnswer` or `lmqg/flan-t5-base-squad-qag` as a tool.
2. **Distractor generation is the weakest link.** Only one mature, permissively-licensed option exists at scale: `potsawee/t5-large-generation-race-Distractor` (Apache-2.0, 2.6K downloads/mo). Everything else is research-code or tiny LoRAs. This is the #1 area where we'll likely need to fine-tune on OMVIC-style banks ourselves.
3. **No Canadian-law-specific LLM exists in useful form on HF.** `Equall/Saul-7B-Instruct-v1` (MIT, Mistral-based, US/EU common law) is the closest and is our v1 fallback. Canadian licensing-exam content is NOT available as public datasets — this is a moat-building opportunity.
4. **Retrieval stack is world-class and free.** BAAI/bge-m3 (embeddings) + BAAI/bge-reranker-v2-m3 (reranker) + colbert-ir/colbertv2.0 together dominate legal-RAG leaderboards and ship under MIT. This is our retrieval spine across all verticals.
5. **Answer grading uses NLI models, not purpose-built graders.** `MoritzLaurer/deberta-v3-large-zeroshot-v2.0` + `facebook/bart-large-mnli` are the de-facto open-text graders — score student answer vs. reference as entailment/contradiction.

---

## Recommended v1 Stack (OMVIC Tutor)

| Layer | Model/Dataset | License | Size | Why |
|---|---|---|---|---|
| **Orchestrator** | Claude 4.7 / Gemini 2.5 Flash | commercial API | — | Tool-calling layer, not HF |
| **Embeddings** | `BAAI/bge-m3` | MIT | 568M | Multilingual, 8K context, dense+sparse+colbert in one model |
| **Reranker** | `BAAI/bge-reranker-v2-m3` | MIT | 568M | Best-in-class open reranker, 8M+ downloads/mo |
| **Question generation** | `potsawee/t5-large-generation-race-QuestionAnswer` | Apache-2.0 | 770M | Generates Q+A pair from passage, designed for multiple-choice |
| **Distractor generation** | `potsawee/t5-large-generation-race-Distractor` | Apache-2.0 | 770M | Only mature OSS distractor model, paired with above |
| **Open-text grading** | `MoritzLaurer/deberta-v3-large-zeroshot-v2.0` | MIT | 435M | NLI-based entailment scoring of free-text answers |
| **Legal domain prior** | `Equall/Saul-7B-Instruct-v1` | MIT | 7B | When RAG needs a legal-aware generator for explanations |
| **Fallback QG** | `lmqg/flan-t5-base-squad-qag` | Apache-2.0 | 250M | Smaller, faster, end-to-end QA generation |
| **Seed training data** | `allenai/sciq` + `openlifescienceai/medmcqa` + `cais/mmlu` + `TIGER-Lab/MMLU-Pro` | mixed CC/Apache | — | MCQ format supervision; real-estate/securities analogies |
| **Legal corpus seed** | `nguha/legalbench` + `pile-of-law/pile-of-law` | CC-BY-NC / research | — | Legal-task coverage; NC restricts commercial — use for eval only |
| **Statute-text QA** | `casehold/casehold` | Apache-2.0 | — | US caselaw MCQ-style — analogue for training/eval transfer |

Everything in the v1 stack fits on a single 24GB GPU (bge-m3 + reranker + T5-large QG + DeBERTa grader ≈ 5–6GB active memory; Saul-7B in 4-bit ≈ 5GB).

---

## 1. Question Generation Models

Source-text → (MCQ stem, correct answer). Best candidates:

| Model | URL | DL (30d) | License | Purpose / Integration |
|---|---|---|---|---|
| `potsawee/t5-large-generation-race-QuestionAnswer` | https://hf.co/potsawee/t5-large-generation-race-QuestionAnswer | 2,570 | Apache-2.0 | T5-large trained on RACE (reading comprehension MCQ). Input: passage → Output: Q + A. Use as OMVIC's "given a paragraph of the Ontario MVDA, generate one question." |
| `potsawee/t5-large-generation-squad-QuestionAnswer` | https://hf.co/potsawee/t5-large-generation-squad-QuestionAnswer | 2,340 | Apache-2.0 | Same family, SQuAD-trained. Better for factoid short-answer style. |
| `mrm8488/t5-base-finetuned-question-generation-ap` | https://hf.co/mrm8488/t5-base-finetuned-question-generation-ap | 2,073 | Apache-2.0 | T5-base (220M). Cheapest inference. Answer-aware — give it (context, answer), it returns the question. |
| `valhalla/t5-base-e2e-qg` | https://hf.co/valhalla/t5-base-e2e-qg | 7,346 | MIT | End-to-end — passage in, list of questions out. No answer needed upfront. |
| `lmqg/flan-t5-base-squad-qag` | https://hf.co/lmqg/flan-t5-base-squad-qag | 2,370 | Apache-2.0 | Flan-T5 base fine-tuned for question-answer generation. Modern base, better instruction following. Part of the academic LMQG suite (`asahi417/lmqg`). |
| `allenai/t5-small-squad2-question-generation` | https://hf.co/allenai/t5-small-squad2-question-generation | 67 | Apache-2.0 | T5-small (60M) — for edge/offline tutor app or mobile fallback. |

**OMVIC integration**: Chunk MVDA regulation text + OMVIC Code of Ethics into 300-token passages → call `potsawee/t5-large-generation-race-QuestionAnswer` with each chunk → collect (passage, Q, A) triples → pass to distractor model.

---

## 2. Distractor Generation

Given (Q, correct answer), produce 3 plausible wrong answers. This is the **rarest** capability on the Hub.

| Model | URL | DL (30d) | License | Purpose / Integration |
|---|---|---|---|---|
| `potsawee/t5-large-generation-race-Distractor` | https://hf.co/potsawee/t5-large-generation-race-Distractor | 2,636 | Apache-2.0 | **ONLY production-grade OSS option.** T5-large. Input: `question <sep> context <sep> answer` → generates 3 distractors. Pairs natively with the same-family QG model above. Paper: arxiv 2301.12307 (Manakul et al.). |
| `MasterControlAIML/Qwen2.5-7b-Answer-Distractor-MCQ-Generation-GGUF` | https://hf.co/MasterControlAIML/Qwen2.5-7b-Answer-Distractor-MCQ-Generation-GGUF | 64 | apache-2.0 (inherited) | Modern Qwen2.5-7B fine-tune, GGUF-quantized for Ollama. Unproven but architecturally current. Worth benchmarking vs. T5 baseline. |
| `voidful/bart-distractor-generation-pm` | https://hf.co/voidful/bart-distractor-generation-pm | 15 | — | BART-based research artifact. Low downloads but cited in distractor-generation literature. Code-reference quality only. |
| `sandywong/distractor-lora-*` (8+ variants) | https://hf.co/sandywong | 13–20 each | — | Recent LoRA adapters for Llama-1B/8B and Qwen2.5-1.5B/9B. "clean-only" vs "noisy-only" vs "clean-noisy" training variants. Academic probe of distractor-quality-vs-data-noise. Useful as a training-recipe reference — we could replicate on Llama-3.1-8B with OMVIC distractors. |

**Gap**: There is no domain-specific legal-distractor model. Our v1 path: use `potsawee` off-the-shelf → manually curate 300–500 OMVIC distractors → LoRA fine-tune Llama-3.1-8B on our set (24GB fits easily) using the `sandywong` recipes as a template.

---

## 3. Answer Verification / Open-Text Grading

No purpose-built "grader" models exist at scale. The de-facto pattern is **NLI entailment** — check whether the student's answer is entailed by the reference answer.

| Model | URL | DL (30d) | License | Purpose / Integration |
|---|---|---|---|---|
| `facebook/bart-large-mnli` | https://hf.co/facebook/bart-large-mnli | 2.7M | MIT | BART-large on MultiNLI. The classic zero-shot classifier. Use: `premise=reference_answer, hypothesis=student_answer` → entailment probability = grade. |
| `MoritzLaurer/deberta-v3-large-zeroshot-v2.0` | https://hf.co/MoritzLaurer/deberta-v3-large-zeroshot-v2.0 | 314K | MIT | DeBERTa-v3 (state of the art NLI). Commercial-friendly — purposefully retrained to avoid non-commercial data contamination. **Best pick for grading.** |
| `MoritzLaurer/DeBERTa-v3-large-mnli-fever-anli-ling-wanli` | https://hf.co/MoritzLaurer/DeBERTa-v3-large-mnli-fever-anli-ling-wanli | 179K | MIT | Multi-dataset NLI. More robust on adversarial free-text answers. |
| `cross-encoder/nli-deberta-v3-base` | https://hf.co/cross-encoder/nli-deberta-v3-base | 177K | Apache-2.0 | Lighter (184M) — use for mobile/edge grading. |
| `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7` | https://hf.co/MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7 | 344K | MIT | Multilingual — essential for Quebec LLQP exam (French) and future India/UAE expansion. |
| `cross-encoder/stsb-roberta-large` | https://hf.co/cross-encoder/stsb-roberta-large | 118K | Apache-2.0 | Semantic similarity (0–5 score) — complementary signal for partial credit. |

**OMVIC integration**: For short-answer questions, compute `P(entailment | ref, student)`; for essay-style (rare on OMVIC, common on LSO paralegal), ensemble `stsb-roberta-large` similarity + NLI entailment → claude explains the grade.

---

## 4. Legal-Domain LLMs

| Model | URL | DL (30d) | License | Purpose / Integration |
|---|---|---|---|---|
| `Equall/Saul-7B-Instruct-v1` | https://hf.co/Equall/Saul-7B-Instruct-v1 | 2,681 | **MIT** | Mistral-7B continued-pretrained on 30B legal tokens, then instruction-tuned. US/EU common law focus. **Best open legal LLM under a commercial license.** arxiv 2403.03883. |
| `Equall/SaulLM-54B-Instruct` | https://hf.co/Equall/SaulLM-54B-Instruct | 216 | MIT | Mixtral-8x7B based. Needs 2×A100 — overkill for v1 but a future moat. |
| `Equall/SaulLM-141B-Instruct` | https://hf.co/Equall/SaulLM-141B-Instruct | 79 | MIT | Mixtral-8x22B based. Serverless-only (HF Pro). |
| `nlpaueb/legal-bert-base-uncased` | https://hf.co/nlpaueb/legal-bert-base-uncased | 114,543 | CC-BY-SA-4.0 | BERT-base pretrained on EU/US legal corpora. Encoder only — use for legal-clause classification, NER, embedding warmstart. |
| `casehold/custom-legalbert` | https://hf.co/casehold/custom-legalbert | 12,401 | Apache-2.0 | US caselaw LegalBERT variant. Benchmarked on CaseHOLD MCQ task. |
| `lexlms/legal-roberta-large` | https://hf.co/lexlms/legal-roberta-large | 413 | CC-BY-SA-4.0 | Modern RoBERTa-large on LexGLUE corpus. Good encoder baseline. |
| `lexlms/legal-longformer-large` | https://hf.co/lexlms/legal-longformer-large | 90 | CC-BY-SA-4.0 | 4096-token context — essential for statute chunks. |
| `isaacus/open-australian-legal-llm` | https://hf.co/isaacus/open-australian-legal-llm | 210 | Apache-2.0 | GPT-2-XL continued-pretrained on Australian law. Common-law analogue usable for Ontario fine-tuning as a base. |

**Canadian-law gap**: No credible Canadian-law model exists on HF. `Albiemark/matlock-canadian-law` and `djlord-it/Canadian_laws_350M` are empty/zero-download research uploads. **We should consider building one** — continued-pretrain Saul-7B on 5B tokens of CanLII + Ontario regs + OMVIC MVDA bulletins, then fine-tune. Downstream value: asset for RECO, LSO, FSRA, CSC verticals.

---

## 5. RAG-for-Legal Building Blocks

### Embedding models (ranked by legal suitability)

| Model | URL | DL (30d) | License | Notes |
|---|---|---|---|---|
| `BAAI/bge-m3` | https://hf.co/BAAI/bge-m3 | 17.6M | MIT | **Top pick.** 8K context, multilingual, unified dense+sparse+multi-vector. |
| `sentence-transformers/all-mpnet-base-v2` | https://hf.co/sentence-transformers/all-mpnet-base-v2 | 34M | Apache-2.0 | Workhorse for short-form retrieval. |
| `nomic-ai/nomic-embed-text-v1.5` | https://hf.co/nomic-ai/nomic-embed-text-v1.5 | 13M | Apache-2.0 | Matryoshka embeddings — truncate to 256/512 dims for cheap storage. |
| `intfloat/multilingual-e5-base` | https://hf.co/intfloat/multilingual-e5-base | 2.9M | MIT | Excellent on multilingual legal benchmarks. |
| `Alibaba-NLP/gte-multilingual-base` | https://hf.co/Alibaba-NLP/gte-multilingual-base | 2.4M | Apache-2.0 | 8K context multilingual. |

### Rerankers

| Model | URL | DL (30d) | License |
|---|---|---|---|
| `BAAI/bge-reranker-v2-m3` | https://hf.co/BAAI/bge-reranker-v2-m3 | 7.97M | MIT |
| `BAAI/bge-reranker-v2.5-gemma2-lightweight` | https://hf.co/BAAI/bge-reranker-v2.5-gemma2-lightweight | 77K | Gemma license |
| `cross-encoder/ms-marco-MiniLM-L6-v2` | https://hf.co/cross-encoder/ms-marco-MiniLM-L6-v2 | 27M | Apache-2.0 |

### Late-interaction / multi-vector

| Model | URL | DL (30d) | License |
|---|---|---|---|
| `colbert-ir/colbertv2.0` | https://hf.co/colbert-ir/colbertv2.0 | 15.2M | MIT |
| `answerdotai/answerai-colbert-small-v1` | https://hf.co/answerdotai/answerai-colbert-small-v1 | 1.96M | Apache-2.0 |
| `jinaai/jina-colbert-v2` | https://hf.co/jinaai/jina-colbert-v2 | 557K | CC-BY-NC-4.0 (⚠️ non-commercial) |

**OMVIC stack**: bge-m3 (dense) → top-50 → bge-reranker-v2-m3 → top-5 → Claude/Saul generates answer with citations. All MIT-licensed, no legal risk.

---

## 6. Public Datasets

### Licensing-exam question banks
**None exist as public HF datasets.** OMVIC, RECO, LSAT-style bars, CSC, LLQP question banks are all proprietary/paid. This is a structural fact — it's the supply-constraint that creates our business.

### Legal Q&A / benchmarks

| Dataset | URL | DL | License | Use |
|---|---|---|---|---|
| `nguha/legalbench` | https://hf.co/datasets/nguha/legalbench | 38K | CC-BY-4.0 (subtasks vary) | 162 legal-reasoning tasks. **Eval harness for our tutor.** |
| `pile-of-law/pile-of-law` | https://hf.co/datasets/pile-of-law/pile-of-law | 2.9K | CC-BY-NC-SA-4.0 ⚠️ | 256GB legal text. Pretraining corpus — NC license means **eval/research only**, not commercial fine-tune. |
| `casehold/casehold` | https://hf.co/datasets/casehold/casehold | 1.1K | Apache-2.0 | 53K US-caselaw MCQs — perfect format analogue for OMVIC. |
| `dennlinger/eur-lex-sum` | https://hf.co/datasets/dennlinger/eur-lex-sum | 3.2K | CC-BY-4.0 | EU legislation summarization. Statute-text chunking examples. |
| `coastalcph/multi_eurlex` | https://hf.co/datasets/coastalcph/multi_eurlex | 867 | CC-BY-SA-4.0 | Multilingual legal classification. |
| `HFforLegal/case-law` | https://hf.co/datasets/HFforLegal/case-law | 3.3K | varies | Curated caselaw aggregator. |
| `common-pile/caselaw_access_project` | https://hf.co/datasets/common-pile/caselaw_access_project | 2.7K | public domain | **Commercially safe** — Harvard CAP dump. |

### Educational / MCQ corpora

| Dataset | URL | DL | License | Use |
|---|---|---|---|---|
| `cais/mmlu` | https://hf.co/datasets/cais/mmlu | 440K | MIT | 57 subjects, MCQ format. Train question-classifier baseline. |
| `TIGER-Lab/MMLU-Pro` | https://hf.co/datasets/TIGER-Lab/MMLU-Pro | 113K | MIT | Harder MMLU with 10-option questions — closer to real licensing difficulty. |
| `allenai/sciq` | https://hf.co/datasets/allenai/sciq | 80K | CC-BY-NC-3.0 ⚠️ | 13K science MCQs with distractors. Eval/research only. |
| `openlifescienceai/medmcqa` | https://hf.co/datasets/openlifescienceai/medmcqa | 29K | Apache-2.0 | 194K med-exam MCQs. **Best template for licensing-exam MCQ fine-tuning.** |
| `hails/agieval-*` (LSAT-AR, LSAT-LR, SAT-math, etc.) | https://hf.co/datasets/hails/agieval-lsat-ar | 4–8K each | MIT | LSAT/SAT-style reasoning MCQs. LSAT-LR ≈ closest analogue to LSO paralegal reasoning questions. |
| `rajpurkar/squad` | https://hf.co/datasets/rajpurkar/squad | 139K | CC-BY-SA-4.0 | Reading-comprehension QA. Backbone for QG training. |
| `lmqg/qg_squad` | https://hf.co/datasets/lmqg/qg_squad | 1,567 | CC-BY-SA-4.0 | Pre-formatted for question-generation training. |

---

## 7. Working Spaces (demos we can fork)

| Space | URL | Likes | SDK | Use |
|---|---|---|---|---|
| `narra-ai/quiz-maker` | https://hf.co/spaces/narra-ai/quiz-maker | 15 | Gradio | Most-liked quiz-maker demo. Reference architecture. |
| `pragnakalp/Question_Generation_T5` | https://hf.co/spaces/pragnakalp/Question_Generation_T5 | 19 | Gradio | T5-based QG demo — direct fork candidate. |
| `BilalSardar/YoutubeVideoLink-To-MCQs-Generation` | https://hf.co/spaces/BilalSardar/YoutubeVideoLink-To-MCQs-Generation | 4 | Gradio | YouTube→MCQ pipeline. Useful for ingesting OMVIC training videos. |
| `Avinash250325/Question_Generation_with_RAG` | https://hf.co/spaces/Avinash250325/Question_Generation_with_RAG | 1 | Gradio | QG+RAG combo demo — closest to our v1 shape. |
| `mou3az/MCQA-Quiz` | https://hf.co/spaces/mou3az/MCQA-Quiz | 3 | Docker | Dockerized MCQ app — easier to graft onto Next.js. |
| `towardsai-tutors/ai-tutor-chatbot` | https://hf.co/spaces/towardsai-tutors/ai-tutor-chatbot | 14 | Docker | Full AI-tutor reference implementation. |
| `pseudolab/AI_Tutor_BERT` | https://hf.co/spaces/pseudolab/AI_Tutor_BERT | 13 | Gradio | BERT-based tutor. |
| `parsi-ai-nlpclass/Legal_RAG` | https://hf.co/spaces/parsi-ai-nlpclass/Legal_RAG | 7 | Gradio | Legal-RAG reference. |
| `FredBML/rag_quiz_app.py` | https://hf.co/spaces/FredBML/rag_quiz_app.py | 4 | Gradio | RAG+quiz combo. |
| `Agents-MCP-Hackathon/Quizy` | https://hf.co/spaces/Agents-MCP-Hackathon/Quizy | 4 | Gradio | MCP-agent quiz (relevant since we're using Claude-as-orchestrator). |

**Fork target**: `narra-ai/quiz-maker` for UI baseline + `Avinash250325/Question_Generation_with_RAG` for the retrieval pattern.

---

## 8. Training Recipes / Model Cards with LoRA Configs

Suitable for 24GB-VRAM consumer GPU fine-tuning:

1. **LMQG framework** (`lmqg/*` model family, arxiv 2305.17002) — T5-base/large QG fine-tuning on SQuAD-formatted pairs. Codebase: `asahi417/lmqg` on GitHub. Recipe published with every dataset card. **Direct path**: format OMVIC QA pairs into SQuAD JSON → run `lmqg_train --model google/flan-t5-base --dataset ./omvic_qa.jsonl`. Fits in 12GB.
2. **potsawee recipe** (arxiv 2301.12307) — T5-large QG+Distractor co-training on RACE. Model cards cite hparams: batch=8, lr=1e-4, 5 epochs. Reproducible on single 24GB card.
3. **sandywong distractor LoRAs** (8 configs on Llama-1B/8B + Qwen2.5-1.5B/9B) — r=16, alpha=32, target all-linear. Training data variants (clean-only / noisy-only / clean-noisy) give us a data-quality ablation template.
4. **Equall/Saul-7B recipe** (arxiv 2403.03883) — Mistral-7B → 30B-token legal continued-pretraining → SFT. Full recipe public. LoRA-variant attainable: freeze base, 8B-parameter adapters on 5B Canadian-law tokens ≈ 3 days on A100 (cheap via Lambda/Runpod).
5. **MoritzLaurer zeroshot-v2.0** model card — full training script for commercial-clean NLI. Recipe for re-training our own grader if needed.
6. **Phi-medmcqa LoRAs** (`mradermacher/Phi_medmcqa_question_generation-*-lora-i1-GGUF`) — Phi-2 (2.7B) QLoRA adapters per medical specialty. Template for "Phi-3-mini LoRA per licensing vertical" (OMVIC, RECO, etc.) — each adapter ≈ 50MB, hot-swap at inference time.

---

## Risk Flags

- **Non-commercial licenses to avoid in commercial product**:
  - `pile-of-law/pile-of-law` (CC-BY-NC-SA-4.0) — pretraining corpus, research/eval only
  - `allenai/sciq` (CC-BY-NC-3.0) — research/eval only
  - `jinaai/jina-colbert-v2` (CC-BY-NC-4.0) — use `colbert-ir/colbertv2.0` (MIT) instead
  - `BAAI/bge-reranker-v2.5-gemma2-lightweight` — inherits Gemma license (usage restrictions, still free but review)
- **CC-BY-SA-4.0 "share-alike" contagion**: `nlpaueb/legal-bert-base-uncased`, `lexlms/*`, SQuAD, multi_eurlex. Fine-tuned derivatives must also be CC-BY-SA — problem if we want closed-source IP on the weights. Mitigation: use these for research/benchmark, not the deployed weights.
- **Saul-7B heritage**: Saul is Mistral-7B continued-pretrained. Mistral's base weights are Apache-2.0, Saul is explicitly MIT. Safe. But `Saul-54B` and `Saul-141B` inherit from Mixtral — re-verify.
- **Distractor-generation research models (voidful, sandywong)** have no license declared on model card — treat as research-code until confirmed.
- **potsawee models** are Apache-2.0 but trained on RACE (CC-BY-SA-4.0 reading comprehension). Downstream outputs should be fine; training data license does not automatically contaminate derived weights per prevailing practice, but worth a legal review before monetizing generated MCQs at scale.
- **OMVIC/RECO/LSO exam question-bank copying** is a separate, independent legal risk — zero HF assets solve this. We must generate original questions, never ingest the actual exam banks.

---

## Gaps (what's NOT on HF — we'd have to build)

1. **Canadian licensing-exam question banks** — OMVIC, RECO, LLQP, LSO, FSRA, CSC. None public. Our moat: hand-curate 1,000 seed questions per vertical, use QG pipeline to expand 10×.
2. **Canadian-law LLM** — no Saul-equivalent exists for Canadian statute/caselaw. Opportunity: continued-pretrain Saul-7B on CanLII + Ontario Regs + OMVIC bulletins (≈5B tokens achievable) = `Q-GRID/CanLaw-Saul-7B`. Publishable asset + internal moat.
3. **OMVIC-style distractor model** — legal/regulatory distractors require knowing which *wrong-but-plausible* regulation clauses look similar. No domain-specific distractor model exists. Fine-tune on 300–500 hand-labeled OMVIC distractor triples.
4. **Regulatory-update freshness layer** — HF has no auto-updating legal index. We build this via Firecrawl → CanLII + OMVIC bulletin scrape → bge-m3 re-embed nightly → push to Supabase pgvector.
5. **Exam-difficulty calibration** — no HF dataset labels questions by difficulty. Build via item-response-theory (IRT) estimation from student response logs on our platform.
6. **French-Canadian legal embeddings** — multilingual bge-m3 is decent but not purpose-built for Quebec civil-law French. Eventual fine-tune target for LLQP-FR and Quebec real-estate (OACIQ) verticals.
7. **Proctoring / answer-confidence** — HF does not provide student-engagement or behavioral-biometric models suitable for exam-simulation proctoring. Adjacent — not on HF's radar.

---

## Bottom line

For OMVIC v1 we can stand up a credible tutor in weeks using **entirely MIT/Apache-2.0 HF models**: bge-m3 + bge-reranker + potsawee QG+Distractor pair + DeBERTa-zeroshot grader + Saul-7B for legal explanations, orchestrated by Claude. The real work is **data**: curating 1,000+ OMVIC seed questions, building a CanLII+MVDA corpus, and training a distractor LoRA on domain data. The `potsawee` duo and `Equall/Saul` family are the two load-bearing choices — both published under MIT/Apache with paper-backed training recipes we can extend.

File: `03-CLIENT-MANAGEMENT/client-portals/OMVIC - License Exam/research/02-huggingface-catalog.md`
