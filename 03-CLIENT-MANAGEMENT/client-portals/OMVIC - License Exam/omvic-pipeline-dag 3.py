"""
OMVIC License Exam - Agentic Pipeline DAG
==========================================
NeoVibe Agentic RAG Orchestrator (NARO)

Uses HEDERA multi_agent_pipeline for:
- DAG-based orchestration with topological ordering
- Parallel execution of independent steps
- Exponential backoff retry logic
- Conditional execution with interpolation
- Checkpoint/resume capability

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
# PIPELINE DEFINITION
# ============================================================================

def create_omvic_pipeline() -> Pipeline:
    """
    Creates the OMVIC QBank generation pipeline.
    
    DAG Structure:
    Level 0: [ingest-mvda-2002, ingest-cpa-2002, ingest-omvic-about, ...] (parallel)
    Level 1: [chunk-all-sources]
    Level 2: [generate-mcqs-batch]
    Level 3: [review-mcqs]
    Level 4: [index-supabase]
    Level 5: [deploy-b2b-api]
    """

    pipeline = Pipeline(
        pipeline_id="omvic-qbank-v1",
        name="OMVIC License Exam QBank Generator"
    )

    # ========================================================================
    # LEVEL 0: INGESTION (All sources in parallel)
    # ========================================================================

    # Source 1: MVDA 2002 (Motor Vehicle Dealers Act)
    pipeline.add_step(PipelineStep(
        step_id="ingest-mvda-2002",
        agent_type="IngestAgent",
        input_data={
            "url": "https://www.ontario.ca/laws/statute/02m30",
            "source_name": "MVDA 2002",
            "tool": "firecrawl_firecrawl_agent",
            "prompt": "Extract FULL TEXT of Ontario e-Laws Motor Vehicle Dealers Act 2002. Include ALL sections, subsections, definitions, and schedules. Return structured JSON with section_number, section_title, section_text."
        },
        retry_count=3,
        timeout_seconds=600
    ))

    # Source 2: MVDA Reg 333/08 (General)
    pipeline.add_step(PipelineStep(
        step_id="ingest-mvda-reg-333",
        agent_type="IngestAgent",
        input_data={
            "url": "https://www.ontario.ca/laws/regulation/080333",
            "source_name": "MVDA Reg 333/08",
            "tool": "firecrawl_firecrawl_agent",
            "prompt": "Extract full text of MVDA Regulation 333/08 (General). Include all sections."
        },
        retry_count=3,
        timeout_seconds=600
    ))

    # Source 3: MVDA Reg 332/08 (Code of Ethics)
    pipeline.add_step(PipelineStep(
        step_id="ingest-mvda-reg-332",
        agent_type="IngestAgent",
        input_data={
            "url": "https://www.ontario.ca/laws/regulation/080332",
            "source_name": "MVDA Reg 332/08",
            "tool": "firecrawl_firecrawl_agent",
            "prompt": "Extract full text of MVDA Regulation 332/08 (Code of Ethics)."
        },
        retry_count=3,
        timeout_seconds=600
    ))

    # Source 4: CPA 2002 (Consumer Protection Act)
    pipeline.add_step(PipelineStep(
        step_id="ingest-cpa-2002",
        agent_type="IngestAgent",
        input_data={
            "url": "https://www.ontario.ca/laws/statute/02c30",
            "source_name": "CPA 2002",
            "tool": "firecrawl_firecrawl_agent",
            "prompt": "Extract FULL TEXT of Ontario Consumer Protection Act 2002."
        },
        retry_count=3,
        timeout_seconds=600
    ))

    # Source 5: CPA Reg 17/05
    pipeline.add_step(PipelineStep(
        step_id="ingest-cpa-reg-17",
        agent_type="IngestAgent",
        input_data={
            "url": "https://www.ontario.ca/laws/regulation/050017",
            "source_name": "CPA Reg 17/05",
            "tool": "firecrawl_firecrawl_agent",
            "prompt": "Extract full text of CPA Regulation 17/05 (General)."
        },
        retry_count=3,
        timeout_seconds=600
    ))

    # Source 6: OMVIC About
    pipeline.add_step(PipelineStep(
        step_id="ingest-omvic-about",
        agent_type="IngestAgent",
        input_data={
            "url": "https://www.omvic.ca/about/",
            "source_name": "OMVIC About",
            "tool": "firecrawl_scrape",
            "formats": ["markdown"]
        },
        retry_count=2,
        timeout_seconds=300
    ))

    # Source 7: OMVIC Registration
    pipeline.add_step(PipelineStep(
        step_id="ingest-omvic-registration",
        agent_type="IngestAgent",
        input_data={
            "url": "https://www.omvic.ca/selling/register/becoming-a-dealer-or-salesperson/",
            "source_name": "OMVIC Registration",
            "tool": "firecrawl_scrape",
            "formats": ["markdown"]
        },
        retry_count=2,
        timeout_seconds=300
    ))

    # ========================================================================
    # LEVEL 1: CHUNKING (After all ingestion complete)
    # ========================================================================

    pipeline.add_step(PipelineStep(
        step_id="chunk-all-sources",
        agent_type="ChunkAgent",
        input_data={
            "tool": "rlm_rlm_auto_analyze",
            "goal": "chunk_regulatory_text",
            "provider": "claude-sdk",
            "sources": [
                "{{ingest-mvda-2002.result.extracted_text}}",
                "{{ingest-mvda-reg-333.result.extracted_text}}",
                "{{ingest-mvda-reg-332.result.extracted_text}}",
                "{{ingest-cpa-2002.result.extracted_text}}",
                "{{ingest-cpa-reg-17.result.extracted_text}}",
                "{{ingest-omvic-about.result.markdown}}",
                "{{ingest-omvic-registration.result.markdown}}"
            ]
        },
        depends_on=[
            "ingest-mvda-2002", "ingest-mvda-reg-333", "ingest-mvda-reg-332",
            "ingest-cpa-2002", "ingest-cpa-reg-17",
            "ingest-omvic-about", "ingest-omvic-registration"
        ],
        retry_count=2,
        timeout_seconds=900
    ))

    # ========================================================================
    # LEVEL 2: MCQ GENERATION (Parallel per chunk)
    # ========================================================================

    pipeline.add_step(PipelineStep(
        step_id="generate-mcqs",
        agent_type="MCQGenAgent",
        input_data={
            "tool": "rlm_rlm_sub_query",
            "query": """
            Generate 3 multiple-choice questions from this regulatory text chunk.
            Follow OMVIC exam pattern:
            - Question stem references specific section
            - 4 options (A, B, C, D)
            - Only one correct answer
            - Explanation cites section number
            - Difficulty: Easy/Medium/Hard based on text complexity
            
            Return JSON with questions array using MCQSchema format.
            """,
            "provider": "ollama",
            "model": "t5-large",
            "chunks": "{{chunk-all-sources.result.chunks}}"
        },
        depends_on=["chunk-all-sources"],
        retry_count=3,
        timeout_seconds=1200
    ))

    # ========================================================================
    # LEVEL 3: REVIEW (Human-in-the-loop)
    # ========================================================================

    pipeline.add_step(PipelineStep(
        step_id="review-mcqs",
        agent_type="ReviewAgent",
        input_data={
            "tool": "memorix_memorix_store_reasoning",
            "mcqs": "{{generate-mcqs.result.questions}}",
            "review_mode": "human-in-loop",
            "acceptance_threshold": 0.80
        },
        depends_on=["generate-mcqs"],
        condition="review-mcqs.result.acceptance_rate < 0.80 ? regenerate-from-chunk : proceed",
        timeout_seconds=1800
    ))

    # ========================================================================
    # LEVEL 4: INDEX TO SUPABASE (After review passes)
    # ========================================================================

    pipeline.add_step(PipelineStep(
        step_id="index-supabase",
        agent_type="IndexAgent",
        input_data={
            "tool": "supabase_execute_sql",
            "project_id": "narooo-omvic-prod",
            "table": "mcqs",
            "records": "{{review-mcqs.result.approved_mcqs}}",
            "embedding_model": "BAAI/bge-m3"
        },
        depends_on=["review-mcqs"],
        retry_count=2,
        timeout_seconds=600
    ))

    # ========================================================================
    # LEVEL 5: DEPLOY B2B API (Final step)
    # ========================================================================

    pipeline.add_step(PipelineStep(
        step_id="deploy-b2b-api",
        agent_type="IndexAgent",
        input_data={
            "tool": "supabase_deploy_edge_function",
            "project_id": "narooo-omvic-prod",
            "function_name": "generate-qbank",
            "verify_jwt": True
        },
        depends_on=["index-supabase"],
        timeout_seconds=300
    ))

    return pipeline


# ============================================================================
# EXECUTION
# ============================================================================

if __name__ == "__main__":
    # Create pipeline
    pipeline = create_omvic_pipeline()

    # Validate
    errors = pipeline.validate()
    if errors:
        print("VALIDATION ERRORS:")
        for err in errors:
            print(f"  - {err}")
        exit(1)

    # Visualize
    print(pipeline.visualize())

    # Set up registry and config
    registry = AgentRegistry()
    config = PipelineConfig(
        max_parallel=3,
        retry_delay_ms=1000,
        checkpoint_enabled=True
    )

    # Execute
    executor = PipelineExecutor(registry, config)
    report = executor.execute(pipeline)

    # Save report
    report.save(Path("omvic-pipeline-report.json"))

    print(f"\nPipeline completed: {'SUCCESS' if report.success else 'FAILED'}")
    print(f"Duration: {report.total_duration_seconds:.2f}s")

    if not report.success:
        print(f"Error: {report.error}")
        exit(1)
