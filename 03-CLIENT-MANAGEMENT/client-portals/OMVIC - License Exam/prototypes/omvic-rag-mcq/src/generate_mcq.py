import json, numpy as np, faiss
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from pathlib import Path

BASE_DIR = Path("/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/OMVIC - License Exam")
DATA_DIR = BASE_DIR / "data"

def load_index():
    m = json.loads((DATA_DIR / "index" / "metadata.json").read_text(encoding="utf-8"))
    i = faiss.read_index(str(DATA_DIR / "index" / "faiss.index"))
    return i, m

def search(q, idx, meta, k=5):
    mdl = SentenceTransformer("BAAI/bge-m3")
    v = mdl.encode([q], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(v); d, ix = idx.search(v, k)
    return [{"source_slug": meta["chunk_to_source"][i], "text": meta["chunks"][i], "score": float(d[0][j])} for j,i in enumerate(ix[0]) if i != -1]

def gen_mcq(src_texts):
    try:
        tknzr = AutoTokenizer.from_pretrained("potsawee/t5-large-generation-race-QuestionAnswer")
        m = AutoModelForSeq2SeqLM.from_pretrained("potsawee/t5-large-generation-race-QuestionAnswer")
        inp = tknzr("question: " + " ".join(src_texts[:3]) + " </s> answer:", return_tensors="pt", max_length=512, truncation=True)
        out = m.generate(**inp, max_new_tokens=256)[0]
        ans = tknzr.decode(out, skip_special_tokens=True)
        dt = AutoTokenizer.from_pretrained("potsawee/t5-large-generation-race-Distractor")
        dm = AutoModelForSeq2SeqLM.from_pretrained("potsawee/t5-large-generation-race-Distractor")
        din = dt(f"distractors: {ans} </s> distractors:", return_tensors="pt", max_length=512, truncation=True)
        dout = dm.generate(**din, max_new_tokens=256)[0]
        distrs = [x.strip() for x in dt.decode(dout, skip_special_tokens=True).split("||") if x.strip()]
        return {"question": ans, "correct_answer": ans, "distractors": distrs}
    except Exception as e:
        return {"question": "What is stated?", "correct_answer": "[gen]", "distractors": ["A","B","C"]}

if __name__ == "__main__":
    idx, meta = load_index()
    r = search("What does the Motor Vehicle Dealers Act regulate?", idx, meta)
    mcq = gen_mcq([x["text"] for x in r])
    (DATA_DIR / "mcq").mkdir(exist_ok=True)
    (DATA_DIR / "mcq" / "generated.json").write_text(json.dumps({"mcq": mcq, "sources": [x["source_slug"] for x in r]}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(mcq, ensure_ascii=False, indent=2))
