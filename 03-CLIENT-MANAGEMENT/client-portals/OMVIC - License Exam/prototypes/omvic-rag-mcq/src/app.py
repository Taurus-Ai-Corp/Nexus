""Gradio UI for OMVIC RAG + MCQ."""

from pathlib import Path
from typing import List
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import gradio as gr

BASE_DIR = Path("..").parent.parent
DATA_DIR = BASE_DIR / "data"

def load_index():
    meta_path = DATA_DIR / "index" / "metadata.json"
    idx_path = DATA_DIR / "index" / "faiss.index"
    index = faiss.read_index(str(idx_path))
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    return index, meta

def search(query: str, index, meta, k: int = 5) -> List[dict]:
    model = SentenceTransformer("BAAI/bge-m3")
    query_vec = model.encode([query], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(query_vec)
    distances, indices = index.search(query_vec, k)
    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx == -1 or dist == -1:
            break
        chunk = meta["chunks"][idx]
        src_slug = meta["chunk_to_source"][idx]
        results.append({
            "source_slug": src_slug,
            "text": chunk,
            "score": float(dist),
        })
    return results

def load_mcq():
    path = DATA_DIR / "mcq" / "generated.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return None

def build_pipeline(query: str):
    index, meta = load_index()
    results = search(query, index, meta, k=5)
    
    response = {
        "retrieved_sources": [r["source_slug"] for r in results],
        "context": " | ".join([r["text"] for r in results]),
    }
    
    mcq = load_mcq()
    if mcq:
        response["mcq"] = mcq
    else:
        response["mcq"] = {"status": "Not generated yet"}
    
    return json.dumps(response, ensure_ascii=False, indent=2)

with gr.Blocks(title="OMVIC RAG + MCQ") as demo:
    gr.Markdown("# OMVIC RAG + MCQ Pipeline")
    with gr.Row():
        query = gr.Textbox(label="Query", lines=3)
    btn = gr.Button("Run Pipeline")
    output = gr.JSON(label="Pipeline Output")
    
    btn.click(
        fn=build_pipeline,
        inputs=query,
        outputs=output,
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
