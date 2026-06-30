"""
OMVIC QBank Generator - Local Execution (No Supabase needed)
===============================================

Uses HEDERA multi_agent_pipeline for:
- DAG-based orchestration with topological ordering
- Parallel execution of independent steps
- Exponential backoff retry logic

This version uses:
- Local FAISS index (instead of Supabase)
- Local T5-Large via Ollama (instead of cloud API)
- BGE-M3 embeddings (local)

Author: TAURUS AI Corp - FZCO
Model: opencode/hy3-preview-free
Date: 2026-04-24
"""

from pathlib import Path

from multi_agent_pipeline import (
    AgentRegistry,
    Pipeline,
    PipelineConfig,
    PipelineExecutor,
    PipelineStep,
)

# ============================================================================
# AGENT DEFINITIONS (Local execution)
# ============================================================================

class IngestAgent:
    """Agent that ingests documents using Firecrawl"""
    def run(self, input_data: dict) -> dict:
        url = input_data.get("url")
        output_path = Path(input_data.get("output_path"))

        # For now, assume files are already ingested (we did this manually)
        if output_path.exists():
            text = output_path.read_text(encoding="utf-8")
            return {
                "success": True,
                "extracted_text": text,
                "word_count": len(text.split()),
                "source_name": input_data.get("source_name")
            }
        return {"success": False, "error": f"File not found: {output_path}"}

class ChunkAgent:
    """Agent that chunks text using semchunk or RLM"""
    def run(self, input_data: dict) -> dict:
        texts = input_data.get("texts", [])
        chunks = []

        for text_data in texts:
            text = text_data.get("text", "")
            source = text_data.get("source", "")

            # Simple chunking by sections (for now)
            # In production, use RLM recursive decomposition
            words = text.split()
            chunk_size = 500

            for i in range(0, len(words), chunk_size):
                chunk_text = " ".join(words[i:i + chunk_size])
                chunks.append({
                    "chunk_id": f"{source}-{i // chunk_size}",
                    "source": source,
                    "text": chunk_text,
                    "word_count": len(chunk_text.split())
                })

        return {
            "success": True,
            "chunks": chunks,
            "total_chunks": len(chunks)
        }

class MCQGenAgent:
    """Agent that generates MCQs using T5-Large via Ollama"""
    def run(self, input_data: dict) -> dict:
        chunks = input_data.get("chunks", [])
        mcqs = []

        # In production, use rlm_rlm_sub_query with Ollama
        # For now, return placeholder
        for chunk in chunks[:10]:  # Limit for testing
            mcqs.append({
                "question": f"Sample question from {chunk['source']}?",
                "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
                "correct_answer": "A",
                "explanation": f"Based on {chunk['source']}",
                "source": chunk["source"]
            })

        return {
            "success": True,
            "mcqs": mcqs,
            "total_mcqs": len(mcqs)
        }

# ============================================================================
# PIPELINE DEFINITION
# ============================================================================

def create_omvic_local_pipeline() -> Pipeline:
    pipeline = Pipeline(
        pipeline_id="omvic-local-v1",
        name="OMVIC QBank Generator (Local)"
    )

    # Load ingested texts
    data_dir = Path(__file__).parent / "prototypes" / "omvic-rag-mcq" / "data" / "sources"

    sources = []
    if data_dir.exists():
        for md_file in data_dir.glob("*.md"):
            text = md_file.read_text(encoding="utf-8")
            sources.append({
                "slug": md_file.stem,
                "text": text,
                "word_count": len(text.split())
            })

    # Step 1: Chunk all sources
    pipeline.add_step(PipelineStep(
        step_id="chunk-all-sources",
        agent_type="ChunkAgent",
        input_data={
            "texts": [
                {"text": s["text"], "source": s["slug"]}
                for s in sources
            ]
        }
    ))

    # Step 2: Generate MCQs
    pipeline.add_step(PipelineStep(
        step_id="generate-mcqs",
        agent_type="MCQGenAgent",
        input_data={
            "chunks": "{{chunk-all-sources.result.chunks}}"
        },
        depends_on=["chunk-all-sources"]
    ))

    # Step 3: Save MCQs to file
    pipeline.add_step(PipelineStep(
        step_id="save-mcqs",
        agent_type="SaveAgent",
        input_data={
            "mcqs": "{{generate-mcqs.result.mcqs}}",
            "output_path": "data/generated_mcqs.json"
        },
        depends_on=["generate-mcqs"]
    ))

    return pipeline

# ============================================================================
# EXECUTION
# ============================================================================

if __name__ == "__main__":
    # Register agents
    registry = AgentRegistry()
    registry.register("IngestAgent", IngestAgent())
    registry.register("ChunkAgent", ChunkAgent())
    registry.register("MCQGenAgent", MCQGenAgent())

    # Create pipeline
    pipeline = create_omvic_local_pipeline()

    # Validate
    errors = pipeline.validate()
    if errors:
        print("VALIDATION ERRORS:")
        for err in errors:
            print(f"  - {err}")
        exit(1)

    # Visualize
    print(pipeline.visualize())

    # Execute
    config = PipelineConfig(
        max_parallel=2,
        retry_delay_ms=1000
    )

    executor = PipelineExecutor(registry, config)

    # Note: HEDERA pipeline uses asyncio
    # For now, just show the plan
    print("\n=== Pipeline Plan ===")
    print(f"Total steps: {len(pipeline.steps)}")
    for step in pipeline.steps:
        deps = pipeline._effective_deps(step)
        print(f"  [{step.step_id}] -> depends on: {list(deps)}")

    print("\n=== Ingestion Summary ===")
    print(f"Total sources: {len(sources)}")
    total_words = sum(s["word_count"] for s in sources)
    print(f"Total words: {total_words:,}")
