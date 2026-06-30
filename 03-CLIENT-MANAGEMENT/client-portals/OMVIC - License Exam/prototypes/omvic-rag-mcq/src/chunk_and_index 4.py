import json
from pathlib import Path

BASE_DIR = Path.cwd().parent  # goes from src/ to omvic-rag-mcq/
DATA_DIR = BASE_DIR / "data"

print(f"DEBUG: CWD={Path.cwd()}", flush=True)
print(f"DEBUG: BASE_DIR={BASE_DIR}", flush=True)
print(f"DEBUG: DATA_DIR={DATA_DIR}", flush=True)
print(f"DEBUG: sources.json exists={(DATA_DIR / 'sources.json').exists()}", flush=True)

raw = (DATA_DIR / "sources.json").read_text(encoding="utf-8")
print(f"DEBUG: raw first 200: {repr(raw[:200])}", flush=True)
sources = json.loads(raw)

def load_chunks(src_path: Path) -> list[str]:
    txt = src_path.read_text(encoding="utf-8")
    chunks = [c.strip() for c in txt.split(chr(10) + chr(10)) if c.strip()]
    return chunks if chunks else [txt]

def build_index():
    for s in sources:
        print(f"DEBUG source: {s}", flush=True)
        sp = DATA_DIR / s["path"]
        print(f"DEBUG: sp={sp}", flush=True)
        print(f"DEBUG: sp.exists()={sp.exists()}", flush=True)
        if not sp.exists():
            print(f"Warning: {sp} not found, skipping", flush=True)
            continue
        for c in load_chunks(sp):
            pass
    print("Done checking sources", flush=True)

build_index()
