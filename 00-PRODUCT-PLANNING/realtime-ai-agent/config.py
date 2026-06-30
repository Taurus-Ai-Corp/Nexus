import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-3.1-flash-live-preview"

AUDIO_SAMPLE_RATE = 24000
AUDIO_CHANNELS = 1
AUDIO_CHUNK_SIZE = 1024
AUDIO_FORMAT = "pcm"

VIDEO_WIDTH = 640
VIDEO_HEIGHT = 480
VIDEO_FPS = 30
JPEG_QUALITY = 80

WEBSOCKET_URL = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={GEMINI_API_KEY}"

SYSTEM_PROMPT = """You are a real-time AI assistant that can see through a camera and hear through a microphone. 
Respond naturally and conversationally. Keep responses concise. You can interrupt and be interrupted."""