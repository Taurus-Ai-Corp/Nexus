import os
from contextlib import asynccontextmanager

import dotenv
from fastapi import FastAPI
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

dotenv.load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

@asynccontextmanager
async def lifespan(_: FastAPI):
    redis_client = None

    try:
        redis_client = aioredis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
        FastAPICache.init(RedisBackend(redis_client), prefix="fastapi-cache")
        print("✅ Redis cache initialized successfully!")
        yield

    except Exception as e:
        print(f"❌ Redis Connection Error: {e}")
        yield
    finally:
        try:
            await FastAPICache.clear()
            if redis_client:
                await redis_client.close()
                print("🔴 Redis connection closed!")
        except Exception as e:
            print(f"❌ Error while closing Redis: {e}")

def get_cache():
    return FastAPICache.get_backend()
