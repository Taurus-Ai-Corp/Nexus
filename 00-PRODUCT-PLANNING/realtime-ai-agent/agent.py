import asyncio
import base64
import json
import os
import sys
import threading
import time
from typing import Optional

import cv2
import numpy as np
import pyaudio
from google import genai
from google.genai import types
from PIL import Image

from config import (
    GEMINI_API_KEY,
    MODEL,
    AUDIO_SAMPLE_RATE,
    AUDIO_CHANNELS,
    AUDIO_CHUNK_SIZE,
    AUDIO_FORMAT,
    VIDEO_WIDTH,
    VIDEO_HEIGHT,
    VIDEO_FPS,
    JPEG_QUALITY,
    WEBSOCKET_URL,
    SYSTEM_PROMPT,
)


class RealTimeAgent:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY, http_options={"api_version": "v1beta"})
        self.session: Optional[genai.aio.LiveSession] = None
        
        self.audio = pyaudio.PyAudio()
        self.stream_in: Optional[pyaudio.Stream] = None
        self.stream_out: Optional[pyaudio.Stream] = None
        
        self.cap: Optional[cv2.VideoCapture] = None
        
        self.running = False
        self.audio_queue = asyncio.Queue()
        self.video_queue = asyncio.Queue()
        self.response_queue = asyncio.Queue()
        
    async def setup_audio(self):
        self.stream_in = self.audio.open(
            format=pyaudio.paInt16,
            channels=AUDIO_CHANNELS,
            rate=AUDIO_SAMPLE_RATE,
            input=True,
            frames_per_buffer=AUDIO_CHUNK_SIZE,
        )
        self.stream_out = self.audio.open(
            format=pyaudio.paInt16,
            channels=AUDIO_CHANNELS,
            rate=AUDIO_SAMPLE_RATE,
            output=True,
            frames_per_buffer=AUDIO_CHUNK_SIZE,
        )
        
    def setup_video(self):
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, VIDEO_WIDTH)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, VIDEO_HEIGHT)
        self.cap.set(cv2.CAP_PROP_FPS, VIDEO_FPS)
        
    async def connect(self):
        config = types.LiveConnectConfig(
            response_modalities=["AUDIO"],
            system_instruction=SYSTEM_PROMPT,
        )
        self._connect_cm = self.client.aio.live.connect(model=MODEL, config=config)
        self.session = await self._connect_cm.__aenter__()
        
    async def send_audio_loop(self):
        while self.running:
            try:
                data = self.stream_in.read(AUDIO_CHUNK_SIZE, exception_on_overflow=False)
                audio_b64 = base64.b64encode(data).decode("utf-8")
                await self.session.send_realtime_input(
                    audio=types.Blob(data=audio_b64, mime_type=f"audio/{AUDIO_FORMAT};rate={AUDIO_SAMPLE_RATE}")
                )
                await asyncio.sleep(0.01)
            except Exception as e:
                print(f"Audio send error: {e}")
                await asyncio.sleep(0.1)
                
    async def send_video_loop(self):
        while self.running:
            try:
                ret, frame = self.cap.read()
                if not ret:
                    await asyncio.sleep(0.033)
                    continue
                    
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_img = Image.fromarray(frame_rgb)
                
                import io
                buf = io.BytesIO()
                pil_img.save(buf, format="JPEG", quality=JPEG_QUALITY)
                img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                
                await self.session.send_realtime_input(
                    video=types.Blob(data=img_b64, mime_type="image/jpeg")
                )
                await asyncio.sleep(1.0 / VIDEO_FPS)
            except Exception as e:
                print(f"Video send error: {e}")
                await asyncio.sleep(0.1)
                
    async def receive_loop(self):
        while self.running:
            try:
                async for response in self.session.receive():
                    if hasattr(response, 'server_content') and response.server_content:
                        content = response.server_content
                        if hasattr(content, 'audio_transcription') and content.audio_transcription:
                            print(f"\n🤖 Agent (transcribed): {content.audio_transcription.text}", flush=True)
                        if hasattr(content, 'model_turn') and content.model_turn:
                            for part in content.model_turn.parts:
                                if hasattr(part, 'inline_data') and part.inline_data:
                                    audio_data = part.inline_data.data
                                    if isinstance(audio_data, str):
                                        audio_data = base64.b64decode(audio_data)
                                    self.stream_out.write(audio_data)
                                if hasattr(part, 'text') and part.text:
                                    print(f"\n🤖 Agent: {part.text}", flush=True)
                    elif hasattr(response, 'audio') and response.audio:
                        audio_data = response.audio.data
                        if isinstance(audio_data, str):
                            audio_data = base64.b64decode(audio_data)
                        self.stream_out.write(audio_data)
                    elif hasattr(response, 'text') and response.text:
                        print(f"\n🤖 Agent: {response.text}", flush=True)
            except Exception as e:
                print(f"Receive error: {e}")
                await asyncio.sleep(0.1)
                
    async def cleanup(self):
        await self.shutdown()

    async def run(self):
        print("🚀 Starting Real-Time AI Agent...")
        print("📷 Initializing webcam...")
        self.setup_video()
        
        print("🎤 Initializing audio...")
        await self.setup_audio()
        
        print("🔌 Connecting to Gemini Live API...")
        await self.connect()
        
        self.running = True
        print("\n✅ Agent is live! Speak to it or show objects to the camera.")
        print("Press Ctrl+C to stop.\n")
        
        try:
            await asyncio.gather(
                self.send_audio_loop(),
                self.send_video_loop(),
                self.receive_loop(),
            )
        except KeyboardInterrupt:
            print("\n\n🛑 Stopping agent...")
        finally:
            await self.shutdown()
            
    async def shutdown(self):
        self.running = False
        if self.stream_in:
            self.stream_in.stop_stream()
            self.stream_in.close()
        if self.stream_out:
            self.stream_out.stop_stream()
            self.stream_out.close()
        if self.cap:
            self.cap.release()
        self.audio.terminate()
        cv2.destroyAllWindows()
        if hasattr(self, '_connect_cm') and self._connect_cm:
            await self._connect_cm.__aexit__(None, None, None)
        print("✅ Cleanup complete.")


async def main():
    if not GEMINI_API_KEY:
        print("❌ Error: GEMINI_API_KEY not found in environment variables.")
        print("Please create a .env file with your API key.")
        sys.exit(1)
        
    agent = RealTimeAgent()
    await agent.run()


if __name__ == "__main__":
    asyncio.run(main())