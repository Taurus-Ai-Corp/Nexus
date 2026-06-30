import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL = os.getenv("OPENROUTER_MODEL", "anthropic/claude-sonnet-4")

AUDIO_SAMPLE_RATE = 16000
AUDIO_CHANNELS = 1
AUDIO_CHUNK_SIZE = 1024
AUDIO_FORMAT = "int16"

VIDEO_WIDTH = 640
VIDEO_HEIGHT = 480
VIDEO_FPS = 10
JPEG_QUALITY = 70

WHISPER_MODEL = "base"
WHISPER_DEVICE = "cpu"
WHISPER_COMPUTE_TYPE = "int8"

EDGE_TTS_VOICE = "en-US-AriaNeural"

SYSTEM_PROMPT = """You are a real-time AI assistant that can see through a camera and hear through a microphone.
Respond naturally and conversationally. Keep responses concise (1-2 sentences)."""

VISION_PROMPT = "Describe what you see in this image briefly (1 sentence)."