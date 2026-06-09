# OMVIC RAG + MCQ Generator — Prototype

Working demo of the v1 tech stack: ingest → chunk → embed → retrieve → generate MCQs with distractors, all over the seven primary-law sources for the OMVIC Automotive Certification Course exam.

## Stack (all MIT/Apache — no license risk)

| Layer | Library | License |
|---|---|---|
| Ingestion | `requests` + `beautifulsoup4` + `markdownify` | permissive |
| Chunking | `isaacus-dev/semchunk` | MIT |
| Embeddings | `BAAI/bge-m3` via `sentence-transformers` | MIT |
| Index | `faiss-cpu` | MIT |
| Reranker | `BAAI/bge-reranker-v2-m3` | MIT |
| MCQ | `potsawee/t5-large-generation-race-QuestionAnswer` | Apache-2.0 |
| Distractors | `potsawee/t5-large-generation-race-Distractor` | Apache-2.0 |
| Polish (optional) | Anthropic Claude Haiku | API |
| UI | `gradio>=4` | Apache-2.0 |

## Layout

```
prototypes/omvic-rag-mcq/
├── requirements.txt
├── .env.example
├── src/
│   ├── ingest.py          # step 1 — scrape 7 legal URLs
│   ├── chunk_and_index.py # step 2 — chunk + embed + FAISS (TBD)
│   ├── generate_mcq.py    # step 3 — MCQ generation (TBD)
│   └── app.py             # step 4 — Gradio UI (TBD)
├── data/
│   ├── sources/           # raw markdown (from ingest.py)
│   ├── chunks/            # jsonl of semchunked fragments
│   ├── index/             # FAISS index + metadata
│   └── mcq/               # generated question bank
└── deploy/
    └── hf-space/          # HF Spaces deploy config
```

## Run

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # optionally add ANTHROPIC_API_KEY for polish layer

python src/ingest.py
python src/chunk_and_index.py
python src/generate_mcq.py
python src/app.py     # launches Gradio on localhost
```
