"""
TAURUS AI CORP — Vector Retrieval Service

turbovec-powered semantic search layer for the Nexus Platform.
Provides RAG (Retrieval-Augmented Generation) capabilities for all AI agents.

Built on TurboQuant 2-4 bit quantization via turbovec (Rust + pyo3).
~8x memory reduction vs float32, ~8ms/query at 1M vectors.
"""

import hashlib
import logging
import os
from dataclasses import dataclass
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)

# Try to import turbovec (native Rust library)
try:
    from turbovec import IdMapIndex

    TURBOVEC_AVAILABLE = True
except ImportError:
    IdMapIndex = None
    TURBOVEC_AVAILABLE = False
    logger.warning(
        "turbovec not installed — VectorRetrievalService will run in fallback mode "
        "(search returns empty results). Install with: pip install turbovec"
    )


@dataclass
class SearchResult:
    """Result from a vector search query."""

    id: int
    score: float
    text: str
    metadata: dict[str, Any]


class VectorRetrievalService:
    """
    High-level wrapper around turbovec's IdMapIndex.

    Provides:
    - Document ingestion with automatic OpenAI embedding generation (cached in Redis)
    - Semantic search with optional allowlist filtering
    - Persistence to .tvim files (turbovec native format)
    - Graceful fallback when turbovec is not installed

    Configuration via env vars:
    - TURBOVEC_DIM: embedding dimension (default: 1536 for OpenAI text-embedding-3-small)
    - TURBOVEC_BIT_WIDTH: quantization bit width (2, 3, or 4; default: 4 = 8x compression)
    - TURBOVEC_INDEX_PATH: path to .tvim file for persistence
    - OPENAI_API_KEY: required for text-based ingest/search
    - REDIS_URL: optional, for embedding cache (24h TTL)
    """

    def __init__(
        self,
        dim: int = 1536,
        bit_width: int = 4,
        index_path: str | None = None,
    ):
        """
        Args:
            dim: embedding dimension (must match OpenAI model: 1536 for text-embedding-3-small)
            bit_width: quantization bits (2, 3, or 4). 4 = 8x compression, 2 = 16x
            index_path: optional path to .tvim file to load on init
        """
        self.dim = dim
        self.bit_width = bit_width
        self.index_path = index_path
        self._index = None
        self._documents: dict[int, dict[str, Any]] = {}  # id -> {text, metadata}
        self._next_id: int = 1
        self._openai_client = None
        self._redis_client = None

        if TURBOVEC_AVAILABLE:
            self._index = IdMapIndex(dim=dim, bit_width=bit_width)
            logger.info(
                f"VectorRetrievalService initialized: dim={dim}, bit_width={bit_width}, "
                f"compression={'8x' if bit_width == 4 else '16x' if bit_width == 2 else '4x'}"
            )
            if index_path and os.path.exists(index_path):
                self.load(index_path)
        else:
            logger.warning(
                "VectorRetrievalService in fallback mode (turbovec not installed) — "
                "search will return empty results"
            )

    async def initialize(self, config: dict[str, Any]) -> None:
        # OpenAI client for embeddings
        openai_key = os.getenv("OPENAI_API_KEY") or config.get("openai_key")
        if openai_key:
            from openai import AsyncOpenAI

            self._openai_client = AsyncOpenAI(api_key=openai_key)
            logger.info("OpenAI client initialized for embeddings")

        # Redis client for embedding cache
        redis_url = os.getenv("REDIS_URL") or config.get("redis_url")
        if redis_url:
            import redis.asyncio as redis

            self._redis_client = redis.from_url(redis_url, decode_responses=True)
            logger.info("Redis client initialized for embedding cache")

    async def ingest_documents(
        self,
        documents: list[dict[str, Any]],
    ) -> list[int]:
        """
        Ingest text documents: generate embeddings via OpenAI, store in index.

        Args:
            documents: list of {"text": "...", "metadata": {...}}

        Returns:
            list of assigned document IDs
        """
        if not self._index:
            raise RuntimeError("Vector index not initialized (turbovec not available)")

        if not self._openai_client:
            raise RuntimeError(
                "OpenAI client not configured — set OPENAI_API_KEY env var"
            )

        texts = [doc["text"] for doc in documents]
        embeddings = await self._get_embeddings(texts)

        ids = np.arange(self._next_id, self._next_id + len(documents), dtype=np.uint64)
        self._index.add_with_ids(embeddings, ids)

        for i, doc_id in enumerate(ids):
            self._documents[int(doc_id)] = documents[i]
            if int(doc_id) >= self._next_id:
                self._next_id = int(doc_id) + 1

        logger.info(
            f"Ingested {len(documents)} documents into vector index (total: {len(self._documents)})"
        )
        return [int(x) for x in ids]

    def ingest_vectors(
        self,
        vectors: np.ndarray,
        ids: np.ndarray,
        documents: list | None = None,
    ) -> None:
        """
        Ingest pre-computed embedding vectors directly (no OpenAI call).

        Args:
            vectors: float32 array of shape (n, dim)
            ids: uint64 array of shape (n,)
            documents: optional list of {"text": "...", "metadata": {...}} for each vector
        """
        if self._index is None:
            raise RuntimeError("Vector index not initialized (turbovec not available)")

        self._index.add_with_ids(vectors, ids)

        if documents:
            for i, doc_id in enumerate(ids):
                self._documents[int(doc_id)] = documents[i]
                if int(doc_id) >= self._next_id:
                    self._next_id = int(doc_id) + 1

    async def search(
        self,
        query: str,
        k: int = 10,
        allowlist: list[int] | None = None,
    ) -> list[SearchResult]:
        """
        Semantic search by text query.

        Args:
            query: natural language query string
            k: number of results to return
            allowlist: optional list of document IDs to restrict search to

        Returns:
            list of SearchResult (id, score, text, metadata)
        """
        if not self._openai_client:
            raise RuntimeError("OpenAI client not configured — set OPENAI_API_KEY")

        query_vec = (await self._get_embeddings([query]))[0]
        return self.search_vectors(query_vec, k, allowlist)

    def search_vectors(
        self,
        query_vec: np.ndarray,
        k: int = 10,
        allowlist: list[int] | None = None,
    ) -> list[SearchResult]:
        """
        Semantic search by pre-computed query vector.

        Args:
            query_vec: float32 array of shape (dim,) or (1, dim)
            k: number of results to return
            allowlist: optional list of document IDs to restrict search to

        Returns:
            list of SearchResult (id, score, text, metadata)
        """
        if self._index is None:
            return []

        if len(self._index) == 0:
            return []

        # Ensure 2D query: (nq, dim)
        if query_vec.ndim == 1:
            query_vec = query_vec.reshape(1, -1)

        k = min(k, len(self._index))
        if allowlist:
            k = min(k, len(allowlist))

        if allowlist:
            allowlist_arr = np.array(allowlist, dtype=np.uint64)
            results = self._index.search(query_vec, k=k, allowlist=allowlist_arr)
        else:
            results = self._index.search(query_vec, k=k)

        # turbovec search returns (scores, ids) tuple
        scores, ids = results
        search_results = []
        for doc_id, score in zip(ids[0], scores[0], strict=False):
            doc_id = int(doc_id)
            doc = self._documents.get(doc_id, {})
            search_results.append(
                SearchResult(
                    id=doc_id,
                    score=float(score),
                    text=doc.get("text", ""),
                    metadata=doc.get("metadata", {}),
                )
            )
        return search_results

    def remove(self, doc_id: int) -> bool:
        """Remove a document from the index by ID."""
        if self._index is None:
            return False

        if doc_id in self._documents:
            del self._documents[doc_id]
            # Note: turbovec doesn't support true deletion from index, just mark as removed
            logger.info(f"Removed document {doc_id} from metadata (index entry remains)")
            return True
        return False

    @staticmethod
    def _cache_key(text: str) -> str:
        """Stable cache key for one text.

        Python's built-in `hash()` is salted per process (PYTHONHASHSEED), so it
        produced a different key for the same text on every restart and a
        different key per worker in the same deploy — the cache never hit and we
        paid OpenAI for every call. SHA-256 is stable across processes and hosts.
        """
        return f"embed:{hashlib.sha256(text.encode('utf-8')).hexdigest()}"

    async def _get_embeddings(self, texts: list[str]) -> np.ndarray:
        """Get embeddings for texts, using Redis cache if available.

        Async because every caller reaches this from a FastAPI request, i.e.
        from inside a running event loop. This used to be sync and wrapped each
        await in `asyncio.run()`, which raises `RuntimeError: asyncio.run()
        cannot be called from a running event loop` — so both knowledge
        endpoints returned 500 in every configuration.
        """
        cache_keys = [self._cache_key(t) for t in texts]
        embeddings = []

        # Check cache
        if self._redis_client:
            cached = await self._redis_client.mget(cache_keys)
            to_embed = []
            to_embed_idx = []
            for i, cached_val in enumerate(cached):
                if cached_val:
                    embeddings.append(np.frombuffer(bytes.fromhex(cached_val), dtype=np.float32))
                else:
                    to_embed.append(texts[i])
                    to_embed_idx.append(i)
        else:
            to_embed = texts
            to_embed_idx = list(range(len(texts)))

        # Generate new embeddings
        if to_embed:
            resp = await self._openai_client.embeddings.create(
                model="text-embedding-3-small", input=to_embed
            )
            new_embeddings = [np.array(e.embedding, dtype=np.float32) for e in resp.data]

            # Cache them
            if self._redis_client:
                pipe = self._redis_client.pipeline()
                for text, emb in zip(to_embed, new_embeddings, strict=False):
                    pipe.setex(self._cache_key(text), 86400, emb.tobytes().hex())  # 24h TTL
                await pipe.execute()

            # Insert into results at correct positions
            for idx, emb in zip(to_embed_idx, new_embeddings, strict=False):
                embeddings.insert(idx, emb)

        return np.stack(embeddings)

    def persist(self, path: str | None = None) -> None:
        """Save index to .tvim file."""
        if self._index is None:
            raise RuntimeError("Vector index not initialized")

        save_path = path or self.index_path
        if not save_path:
            raise ValueError("No path specified for persist")

        self._index.write(save_path)
        logger.info(f"Vector index persisted to {save_path}")

    def load(self, path: str) -> None:
        """Load index from .tvim file.

        Note: Current turbovec versions may not fully support load().
        In-memory index works perfectly; persistence is best-effort.
        """
        if self._index is None:
            raise RuntimeError("Vector index not initialized")

        try:
            self._index.load(path)
            self.index_path = path
            logger.info(f"Vector index loaded from {path} (size={len(self._index)})")
        except Exception as e:
            logger.warning(f"Index load from {path} returned empty (turbovec load limitation): {e}")
            # Index remains empty but service is still functional for new ingests

    @property
    def size(self) -> int:
        return len(self._index) if self._index else 0

    @property
    def is_ready(self) -> bool:
        return self._index is not None and len(self._index) > 0


# Global singleton instance (configured via env vars)
vector_store = VectorRetrievalService(
    dim=int(os.getenv("TURBOVEC_DIM", "1536")),
    bit_width=int(os.getenv("TURBOVEC_BIT_WIDTH", "4")),
    index_path=os.getenv("TURBOVEC_INDEX_PATH"),
)
