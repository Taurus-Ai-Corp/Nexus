# OMVIC Exam Prep Platform — Open-Source GitHub Catalog

**Research date:** 2026-04-24
**Prepared by:** TAURUS AI Corp research agent
**Target product:** AI-powered OMVIC (Ontario Motor Vehicle Industry Council) license exam prep, extensible to real estate, insurance, paralegal, securities.

---

## Executive Summary

1. **The FSRS ecosystem is production-ready.** `open-spaced-repetition/ts-fsrs` (MIT, 639 stars, actively released 2026) is a drop-in TypeScript scheduler matching our Next.js 16 stack. Anki-quality review scheduling is a 1-day integration, not a 6-month build. Sister libs exist in Python (`py-fsrs`), Rust (`fsrs-rs`), Go, Swift, Kotlin — so a future Expo mobile app is covered.
2. **Adaptive testing is academic-grade but usable.** `douglasrizzo/catsim` (BSD-3, 145 stars, released 2026-04) plus `bigdata-ustc/EduCAT` (MIT) give us IRT 1PL/2PL/3PL + neural cognitive diagnosis. Both are importable Python modules — glue them behind a FastAPI service.
3. **Avoid forking a whole LMS.** ClassroomIO and Frappe LMS are both AGPL-3.0 — dangerous for a proprietary SaaS. Open edX is Python/Django monolith with 10 years of tech debt. Better path: build our own thin Next.js shell and cherry-pick the `openedx/edx-ora2` assessment XBlock if we need peer review.
4. **Question generation is a solved problem at the component level.** `patil-suraj/question_generation` (MIT, 1.1k stars, T5-based) and `KristiyanVachev/Leaf-Question-Generation` (MIT, T5 + distractors) are ready-made Python microservices. Combined with Claude/Gemini for quality-gating, we can turn the OMVIC Handbook PDF into thousands of MCQs overnight.
5. **The real moat is legal-text RAG + AI tutor.** `isaacus-dev/semchunk` (MIT) + Kanon embedder + LexNLP statute parser give us jurisdiction-aware retrieval. This is the defensible layer — pair it with a LangGraph tutor agent, and the entire competitive offering (ILC, OnlineOMVIC, AutoTrainer) is technologically obsolete within 90 days.

---

## Top 10 Must-Investigate Repos (Ranked)

| # | Repo | License | Why it's #1-10 for us |
|---|------|---------|----------------------|
| 1 | [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | MIT | FSRS-6 scheduler in TypeScript — our review engine, zero rewrite |
| 2 | [open-spaced-repetition/py-fsrs](https://github.com/open-spaced-repetition/py-fsrs) | MIT | Python sibling with optimizer — for the ML tuning microservice |
| 3 | [patil-suraj/question_generation](https://github.com/patil-suraj/question_generation) | MIT | 1.1k-star T5 QG pipeline — seed question bank from OMVIC PDF |
| 4 | [KristiyanVachev/Leaf-Question-Generation](https://github.com/KristiyanVachev/Leaf-Question-Generation) | MIT | MCQ + distractor generator — the "wrong answers" problem solved |
| 5 | [douglasrizzo/catsim](https://github.com/douglasrizzo/catsim) | BSD-3 | CAT simulator for IRT-based adaptive testing |
| 6 | [bigdata-ustc/EduCAT](https://github.com/bigdata-ustc/EduCAT) | MIT | Neural cognitive diagnosis — next-gen adaptive algorithm |
| 7 | [isaacus-dev/semchunk](https://github.com/isaacus-dev/semchunk) | MIT | Best-in-class semantic chunker, AI-mode wins Legal RAG Bench |
| 8 | [LexPredict/lexpredict-lexnlp](https://github.com/LexPredict/lexpredict-lexnlp) | Affero GPL | Statute parsing — FLAG, copyleft risk, use as isolated service |
| 9 | [gpoore/text2qti](https://github.com/gpoore/text2qti) | BSD-3 | Markdown → QTI converter; portable question-bank format |
| 10 | [openedx/edx-ora2](https://github.com/openedx/edx-ora2) | AGPL-3.0 | Peer-review assessment XBlock — reference implementation only |

---

## 1. Spaced-Repetition Engines

| Repo | Stars | Last Commit | License | Purpose | OMVIC Integration |
|------|-------|-------------|---------|---------|-------------------|
| [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | 639 | 2026-03-31 | MIT | FSRS-6 scheduler, ESM/CJS/UMD | Import directly in Next.js 16 server actions; store card state in Postgres |
| [open-spaced-repetition/py-fsrs](https://github.com/open-spaced-repetition/py-fsrs) | ~1k | 2026 active | MIT | Python FSRS-6 + optimizer | FastAPI microservice for nightly parameter retuning per user |
| [open-spaced-repetition/fsrs-rs](https://github.com/open-spaced-repetition/fsrs-rs) | active | 2026 | MIT/BSD | Rust FSRS-6 reference | Future: WASM edge function for offline mobile review |
| [open-spaced-repetition/go-fsrs](https://github.com/open-spaced-repetition/go-fsrs) | active | 2026 | MIT | Go FSRS-5 | N/A — not in our stack |
| [open-spaced-repetition/fsrs4anki](https://github.com/open-spaced-repetition/fsrs4anki) | 3k+ | 2026 | MIT | Anki scheduler + optimizer | Reference for how to tune FSRS weights on real review data |
| [RickCarlino/femto-fsrs](https://github.com/RickCarlino/femto-fsrs) | low | 2024 | MIT | 100-line TS implementation | Useful to read, understand the algorithm; don't ship |

**Verdict:** `ts-fsrs` (frontend) + `py-fsrs` (ML backend) is the winning combo. MIT-licensed, maintained by the same org that publishes the algorithm.

## 2. Adaptive Testing (IRT / CAT)

| Repo | Stars | Last Commit | License | Purpose | OMVIC Integration |
|------|-------|-------------|---------|---------|-------------------|
| [douglasrizzo/catsim](https://github.com/douglasrizzo/catsim) | 145 | 2026-04-08 | BSD-3 | CAT simulator, IRT item selection + ability estimation | FastAPI wrapper — "what question next?" endpoint |
| [bigdata-ustc/EduCAT](https://github.com/bigdata-ustc/EduCAT) | 75 | 2024-01 | MIT | IRT + MIRT + Neural Cognitive Diagnosis | Use for v2 neural adaptive testing once we have >10k user-attempt data |
| [philchalmers/mirtCAT](https://github.com/philchalmers/mirtCAT) | — | active | GPL-3 | R package for multidimensional IRT | Reference only — not Python/TS |
| [condecon/adaptivetesting](https://github.com/condecon/adaptivetesting) | low | 2024 | MIT | Bayesian CAT in Python | Backup option if catsim doesn't fit |
| [bigdata-ustc/CAT4AI](https://github.com/bigdata-ustc/CAT4AI) | low | 2024 | MIT | Psychometric CAT for LLM evaluation | Interesting but tangential — skip for v1 |

**Verdict:** Ship `catsim` in a Python FastAPI service. The OMVIC exam has ~200 questions in the blueprint — CAT can compress to 40 targeted questions per practice session.

## 3. Question-Bank Schemas + Standards

| Repo | Stars | Last Commit | License | Purpose | OMVIC Integration |
|------|-------|-------------|---------|---------|-------------------|
| [oat-sa/qti-sdk](https://github.com/oat-sa/qti-sdk) | 86 | 2025-12 | GPL-2.0 | QTI 2/3 PHP SDK | Reference only (PHP + GPL-2.0) — port schema to our Drizzle/Prisma |
| [gpoore/text2qti](https://github.com/gpoore/text2qti) | — | active | BSD-3 | Markdown → QTI converter | Let subject-matter experts author questions in Markdown, compile to QTI for portability |
| [tremby/questionbank](https://github.com/tremby/questionbank) | low | 2020 | MIT | QTI item collection + derivation | Stale — inspiration only |
| [atomicjolt/open_assessments](https://github.com/atomicjolt/open_assessments) | low | active | MIT | LTI/Caliper assessment | Useful if we sell into schools that have LMS |
| [KI-Campus/h5p-lti-1p0-provider](https://github.com/KI-Campus/h5p-lti-1p0-provider) | low | active | MIT | H5P → LTI bridge | Phase 2 — only if we target Open edX / Moodle resellers |
| [oat-sa](https://github.com/oat-sa) (TAO) | — | — | GPL-2/3 | Enterprise open-source assessment platform | AVOID as dependency — GPL poison, but *steal* their QTI schema ideas |

**Verdict:** Define our own Postgres schema inspired by QTI 3 but not conformant (skip the XML mess). Use `text2qti` for import/export so questions are portable.

## 4. Open LMS / Assessment Platforms

| Repo | Stars | Last Commit | License | Tech | OMVIC Integration |
|------|-------|-------------|---------|------|-------------------|
| [classroomio/classroomio](https://github.com/classroomio/classroomio) | 1.5k | 2026 active | **AGPL-3.0** | Svelte + TS + Postgres | AVOID fork — AGPL poisons SaaS. Use for feature inspiration |
| [frappe/lms](https://github.com/frappe/lms) | 2.8k | 2026-04-18 | **AGPL-3.0** | Vue + Python (Frappe) | AVOID fork — AGPL |
| [openedx/openedx-platform](https://github.com/openedx/openedx-platform) | 7k+ | 2026 active | AGPL-3.0 | Django monolith | AVOID — ops overhead + AGPL |
| [openedx/edx-ora2](https://github.com/openedx/edx-ora2) | 65 | 2026-04-08 | AGPL-3.0 | Django XBlock | Reference architecture for peer-graded open-response questions |
| [openedx/edx-proctoring](https://github.com/openedx/edx-proctoring) | — | active | AGPL-3.0 | Proctoring subsystem | Useful as a *spec* for building our own proctoring layer |
| [FOSSEE/online_test](https://github.com/FOSSEE/online_test) | — | active | BSD | Django online quiz app | Safe license, but old architecture. Skim code, don't fork |

**Verdict:** **Do not fork any LMS.** Every serious candidate is AGPL. Build our own Next.js + FastAPI thin shell. Only *look at* Open edX for peer-review and proctoring design patterns.

## 5. AI Tutor Frameworks

| Repo | Stars | Last Commit | License | Purpose | OMVIC Integration |
|------|-------|-------------|---------|---------|-------------------|
| [langchain-ai/langchain-teacher](https://github.com/langchain-ai/langchain-teacher) | — | 2024 | MIT | Streamlit tutor, prompt-template patterns | Steal the prompt templates — "instructional" vs "interactive" modes |
| [hqanhh/EduGPT](https://github.com/hqanhh/EduGPT) | low | 2024 | MIT | CAMEL-style dual-agent tutor | Pattern: student-agent + teacher-agent critique loop |
| [CAHLR/OATutor-LLM-Learner](https://github.com/CAHLR/OATutor-LLM-Learner) | 2 | 2024 active | MIT | Bayesian Knowledge Tracing + LLM tutor, React/Firebase | Strong — BKT skill mastery estimation we can port |
| [langchain-ai/langchain-ai (core)](https://github.com/langchain-ai/langchain) | 90k+ | 2026 active | MIT | LangChain framework | Our orchestration layer. Pair with LangGraph for agent state |
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | 40k+ | 2026 active | MIT | RAG framework | Use for OMVIC Handbook ingestion + retrieval |

**Verdict:** Build the tutor as a LangGraph agent with three tools: (1) question-generator, (2) FSRS reviewer, (3) RAG retriever over the OMVIC Handbook. Use OATutor's BKT concept for skill mastery. All MIT.

## 6. Automated Question Generation from Text/PDF

| Repo | Stars | Last Commit | License | Purpose | OMVIC Integration |
|------|-------|-------------|---------|---------|-------------------|
| [patil-suraj/question_generation](https://github.com/patil-suraj/question_generation) | 1.1k | 2023 | MIT | T5-based QG, answer-aware + end-to-end | Seed QG pipeline for initial bootstrapping |
| [KristiyanVachev/Leaf-Question-Generation](https://github.com/KristiyanVachev/Leaf-Question-Generation) | 138 | 2022 | MIT | T5 QG + distractor generation | **Distractor generation** is the hard part — Leaf solves it |
| [renatoviolin/Multiple-Choice-Question-Generation-T5-and-Text2Text](https://github.com/renatoviolin/Multiple-Choice-Question-Generation-T5-and-Text2Text) | low | 2021 | MIT | T5 + Sense2Vec distractors | Sense2Vec trick for plausible distractors |
| [csv610/mcq_generator](https://github.com/csv610/mcq_generator) | low | active | MIT | LiteLLM + Ollama CLI MCQ gen | Useful CLI pattern — plug into qwen3-coder for local gen |
| [nalinrajendran/synthetic-LLM-QA-dataset-generator](https://github.com/nalinrajendran/synthetic-LLM-QA-dataset-generator) | low | active | MIT | OLLAMA-based synthetic QA | Local-first, free, batch-generate thousands |

**Verdict:** 2-tier pipeline: (1) `Leaf-Question-Generation` for bulk generation, (2) Claude-quality-gate that re-ranks and discards low-quality questions. OMVIC Handbook + MVDA + Consumer Protection Act → 10k+ MCQs in a weekend.

## 7. Legal-Document RAG Pipelines

| Repo | Stars | Last Commit | License | Purpose | OMVIC Integration |
|------|-------|-------------|---------|---------|-------------------|
| [isaacus-dev/semchunk](https://github.com/isaacus-dev/semchunk) | 1k+ | 2026 active | MIT | Semantic chunker, AI-chunking mode, #1 on Legal RAG Bench | **Core** chunker for OMVIC Handbook + MVDA statute |
| [LexPredict/lexpredict-lexnlp](https://github.com/LexPredict/lexpredict-lexnlp) | 700+ | 2024 active | **AGPL** | Legal text parser (clauses, dates, jurisdictions) | FLAG AGPL — run as isolated microservice with API boundary |
| [lixx21/legal-document-assistant](https://github.com/lixx21/legal-document-assistant) | low | 2024 | MIT | Postgres + Elasticsearch + LLM legal RAG | Reference stack (matches ours) |
| [arulkumarann/legalRAG](https://github.com/arulkumarann/legalRAG) | low | 2024 | MIT | FastAPI + Pinecone + Llama 3 legal RAG | Reference impl — port to pgvector |
| Kanon-2 Embedder (HuggingFace) | — | 2025-10 | model weights | Legal embedding model, tops MLEB benchmark | Use as domain-tuned embedder in our RAG |

**Verdict:** Pipeline = Kanon-2 embedder → semchunk AI mode → pgvector → retrieval-augmented prompt to Claude. LexNLP only if we need clause-level structure extraction — keep it behind an API to isolate AGPL.

## 8. Modern Anki Alternatives

| Repo | Stars | Last Commit | License | Purpose | OMVIC Integration |
|------|-------|-------------|---------|---------|-------------------|
| [logseq/logseq](https://github.com/logseq/logseq) | 34k+ | 2026 active | AGPL-3.0 | Outliner + FSRS plugin | Reference only — AGPL, and we're not building a PKM tool |
| [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) | 20k+ | 2026 active | AGPL-3.0 | Self-hosted PKM + flashcards | Reference for block-level learning UX |
| [antigluten/amgi](https://github.com/antigluten/amgi) | low | 2025 | MIT | iOS Anki-compatible client via Rust FFI | Future mobile — they ship Anki sync server compat |
| [st3v3nmw/obsidian-spaced-repetition-recall](https://github.com/st3v3nmw/obsidian-spaced-repetition-recall) | — | 2026 | MIT | FSRS-6 Obsidian plugin | Proof that FSRS-6 ships in real products |
| ZKMemo | — | 2025 | open | Offline FSRS + incremental reading | UX reference — incremental reading for OMVIC Handbook |

**Verdict:** We are NOT Anki. But the flashcard UX patterns (rate 1-4, SM-style again/hard/good/easy) are table stakes. Copy the UX from Anki Web and the FSRS rating dialog from `fsrs4anki`.

## 9. Flashcard / Study Apps Built on LLMs (2024+)

| Repo | Stars | Last Commit | License | Tech | OMVIC Integration |
|------|-------|-------------|---------|------|-------------------|
| [ECuiDev/obsidian-quiz-generator](https://github.com/ECuiDev/obsidian-quiz-generator) | — | 2026 active | MIT | OpenAI/Gemini/Ollama plugin | Read the code for multi-provider LLM switching |
| [quentin-mckay/AI-Quiz-Generator](https://github.com/quentin-mckay/AI-Quiz-Generator) | low | 2024 | MIT | Next.js + GPT | Starter scaffold |
| [bhaveek424/quizter](https://github.com/bhaveek424/quizter) | low | 2024 | MIT | Next.js + TS + Prisma + OpenAI | **Closest tech-match** to our stack — fork-or-copy |
| [Alstudd/Questify-AI](https://github.com/Alstudd/Questify-AI) | low | 2024 | MIT | Next.js + Prisma + MongoDB + OpenAI | Reference — the course-gen flow |
| [saatviknagpal/ai-flashcards](https://github.com/saatviknagpal/ai-flashcards) | low | 2024 | MIT | Next.js + Tailwind + Clerk | Auth pattern with Clerk |
| [Human-Logic-Software-LLC/moodle-local_hlai_quizgen](https://github.com/Human-Logic-Software-LLC/moodle-local_hlai_quizgen) | low | active | GPL-3 | Moodle plugin | Phase 3 — if we white-label into Moodle |

**Verdict:** None of these are production-quality enough to fork wholesale. They're reference scaffolds — use them to accelerate our Week 1 MVP, then replace.

---

## License Risk Flags

| License | Risk Level | Action |
|---------|------------|--------|
| **AGPL-3.0** | HIGH — network-use clause poisons SaaS | Never import into monorepo. Acceptable ONLY as isolated black-box microservice with separate repo and API boundary (e.g., LexNLP, edx-ora2). Document the isolation. |
| **GPL-2.0 / GPL-3.0** | MEDIUM — copyleft on derivatives | Don't link as library. OK as standalone binary invoked via subprocess/HTTP. Applies to: `qti-sdk`, `mirtCAT`, `moodle-local_hlai_quizgen`, TAO. |
| **MIT / BSD / Apache-2.0** | LOW — permissive | Safe for direct inclusion. Attribution required. All of ts-fsrs, py-fsrs, catsim, semchunk, question_generation, Leaf, LangChain, LlamaIndex. |
| **Model weights (Kanon-2, etc.)** | REVIEW | Check each model's license card on HuggingFace. Kanon-2 is permissive for most cases but confirm commercial use. |

**Explicit "do not import" list:** classroomio, frappe/lms, openedx-platform, edx-ora2 (if AGPL), logseq, siyuan, TAO. These can be *studied* but never vendored.

---

## Gaps (Build Ourselves)

1. **OMVIC-specific question bank curation UI.** No OSS handles Ontario dealer law — we need an admin panel for SMEs (Praveen's network of dealer principals) to review/approve AI-generated questions. Build in Next.js + tRPC, 1 week.
2. **Regulator-grade audit trail.** OMVIC and equivalent regulators care about provenance. No OSS repo gives us "which statute section generated which question, when, by which model version." Build it — probably on Heiro/Hedera HCS for immutable log (tie in to our existing infra).
3. **Multi-jurisdiction content routing.** To extend to real estate (RECO) / insurance (FSRA) / paralegal (LSO), we need a rules engine that says "user is prepping for RECO in Ontario" → serve Ontario questions. No OSS repo does this. ~500 lines of TypeScript.
4. **Proctoring without vendor lock-in.** `edx-proctoring` exists but AGPL. Build our own with WebRTC + browser-tab-focus detection + optional ID scan. ~2 weeks.
5. **Spanish/French/Mandarin localization pipeline for questions.** OMVIC serves a diverse Ontario newcomer population. No OSS handles LLM-based locale-aware legal question translation with SME sign-off. Build with Claude + human-in-loop.
6. **Payments + license verification.** Open-source layer we already have (Hyperswitch + Lago per TAURUS stack) covers payments. License-number validation with OMVIC's registry is a custom scraper.
7. **Mobile offline-first review.** `fsrs-rs` → WASM is plausible but no out-of-the-box Expo SDK exists. ~3 weeks for React Native + WatermelonDB + FSRS-rs-wasm.

---

## Recommended 90-Day Build Order

- **Week 1-2:** Next.js 16 shell + Drizzle schema (questions, attempts, FSRS card state) + Clerk auth. Fork `bhaveek424/quizter` patterns.
- **Week 3-4:** Python FastAPI microservice = `py-fsrs` + `catsim` + `semchunk` + Kanon-2 embedder. pgvector on Postgres.
- **Week 5-6:** Question-gen pipeline = `Leaf-Question-Generation` → Claude quality gate → SME approval UI. Ingest OMVIC Handbook + MVDA + Consumer Protection Act.
- **Week 7-8:** LangGraph tutor agent with RAG + FSRS tool + question-select tool.
- **Week 9-10:** Adaptive test mode using `catsim`; detailed analytics dashboard.
- **Week 11-12:** Stripe-alternative billing (Hyperswitch + Lago from TAURUS stack) + launch.

---

## Sources

- [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)
- [open-spaced-repetition/awesome-fsrs](https://github.com/open-spaced-repetition/awesome-fsrs)
- [douglasrizzo/catsim](https://github.com/douglasrizzo/catsim)
- [bigdata-ustc/EduCAT](https://github.com/bigdata-ustc/EduCAT)
- [patil-suraj/question_generation](https://github.com/patil-suraj/question_generation)
- [KristiyanVachev/Leaf-Question-Generation](https://github.com/KristiyanVachev/Leaf-Question-Generation)
- [isaacus-dev/semchunk](https://github.com/isaacus-dev/semchunk)
- [LexPredict/lexpredict-lexnlp](https://github.com/LexPredict/lexpredict-lexnlp)
- [classroomio/classroomio](https://github.com/classroomio/classroomio)
- [frappe/lms](https://github.com/frappe/lms)
- [openedx/edx-ora2](https://github.com/openedx/edx-ora2)
- [oat-sa/qti-sdk](https://github.com/oat-sa/qti-sdk)
- [gpoore/text2qti](https://github.com/gpoore/text2qti)
- [CAHLR/OATutor-LLM-Learner](https://github.com/CAHLR/OATutor-LLM-Learner)
- [Legal RAG Bench — Isaacus](https://huggingface.co/blog/isaacus/legal-rag-bench)
- [Kanon-2 Legal Embedder](https://huggingface.co/blog/isaacus/kanon-2-embedder)
