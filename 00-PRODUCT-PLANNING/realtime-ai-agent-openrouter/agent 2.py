import asyncio
import base64
import io
import os
import sys
import tempfile
from typing import Optional

import cv2
import numpy as np
import pyaudio
import pyttsx3
from edge_tts import Communicate
from faster_whisper import WhisperModel
from openai import AsyncOpenAI
from PIL import Image

from config import (
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    MODEL,
    AUDIO_SAMPLE_RATE,
    AUDIO_CHANNELS,
    AUDIO_CHUNK_SIZE,
    VIDEO_WIDTH,
    VIDEO_HEIGHT,
    VIDEO_FPS,
    JPEG_QUALITY,
    WHISPER_MODEL,
    WHISPER_DEVICE,
    WHISPER_COMPUTE_TYPE,
    EDGE_TTS_VOICE,
    SYSTEM_PROMPT,
    VISION_PROMPT,
)


class OpenRouterAgent:
    def __init__(self):
        if not OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY not set in .env")
        
        self.client = AsyncOpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url=OPENROUTER_BASE_URL,
        )
        
        self.audio = pyaudio.PyAudio()
        self.stream_in: Optional[pyaudio.Stream] = None
        self.stream_out: Optional[pyaudio.Stream] = None
        
        self.cap: Optional[cv2.VideoCapture] = None
        
        self.running = False
        
        print("🔧 Loading Whisper (STT)...")
        self.whisper = WhisperModel(
            WHISPER_MODEL,
            device=WHISPER_DEVICE,
            compute_type=WHISPER_COMPUTE_TYPE,
            local_files_only=False,
        )
        
        print("🔧 Loading pyttsx3 (TTS fallback)...")
        self.tts_engine = pyttsx3.init()
        self.tts_engine.setProperty('rate', 180)
        self.tts_engine.setProperty('volume', 0.9)
        
        print("🔧 Edge TTS ready (primary)")
        
        self.conversation_history = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
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
        
    def transcribe_audio(self, audio_data: bytes) -> str:
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
        segments, _ = self.whisper.transcribe(audio_np, language="en", vad_filter=True)
        return " ".join([seg.text for seg in segments]).strip()
    
    def encode_frame(self, frame: np.ndarray) -> str:
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(frame_rgb)
        buf = io.BytesIO()
        pil_img.save(buf, format="JPEG", quality=JPEG_QUALITY)
        return base64.b64encode(buf.getvalue()).decode("utf-8")
    
    async def analyze_frame(self, frame_b64: str) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": VISION_PROMPT},
                    {
                        "role": "user",
                        "content": [
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{frame_b64}"}}
                        ]
                    }
                ],
                max_tokens=100,
                temperature=0.3,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            print(f"Vision error: {e}")
            return ""
    
    async def get_llm_response(self, user_text: str, vision_context: str = "") -> str:
        messages = self.conversation_history.copy()
        
        if vision_context:
            user_text = f"[Vision: {vision_context}] {user_text}"
        
        messages.append({"role": "user", "content": user_text})
        
        try:
            response = await self.client.chat.completions.create(
                model=MODEL,
                messages=messages,
                max_tokens=200,
                temperature=0.7,
            )
            reply = response.choices[0].message.content or ""
            self.conversation_history.append({"role": "user", "content": user_text})
            self.conversation_history.append({"role": "assistant", "content": reply})
            
            if len(self.conversation_history) > 11:
                self.conversation_history = [self.conversation_history[0]] + self.conversation_history[-10:]
            
            return reply
        except Exception as e:
            print(f"LLM error: {e}")
            return "Sorry, I couldn't process that."
    
    async def speak_edge_tts(self, text: str):
        try:
            communicate = Communicate(text, EDGE_TTS_VOICE)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                await communicate.save(tmp.name)
                import wave
                with wave.open(tmp.name, 'rb') as wf:
                    audio_data = wf.readframes(wf.getnframes())
                    self.stream_out.write(audio_data)
                os.unlink(tmp.name)
        except Exception as e:
            print(f"Edge TTS error: {e}")
            raise
    
    def speak_pyttsx3(self, text: str):
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                self.tts_engine.save_to_file(text, tmp.name)
                self.tts_engine.runAndWait()
                import wave
                with wave.open(tmp.name, 'rb') as wf:
                    audio_data = wf.readframes(wf.getnframes())
                    self.stream_out.write(audio_data)
                os.unlink(tmp.name)
        except Exception as e:
            print(f"pyttsx3 TTS error: {e}")
            raise
    
    async def speak(self, text: str):
        try:
            self.speak_pyttsx3(text)
        except Exception:
            try:
                await self.speak_edge_tts(text)
            except Exception:
                print("Both TTS engines failed")
    
    async def audio_capture_loop(self):
        silence_threshold = 300
        silence_duration = 0
        max_silence_chunks = int(0.8 * AUDIO_SAMPLE_RATE / AUDIO_CHUNK_SIZE)
        recording = False
        audio_buffer = bytearray()
        
        VISION_KEYWORDS = ["look", "see", "what do you see", "describe", "camera", "vision", "watch"]
        
        while self.running:
            try:
                data = self.stream_in.read(AUDIO_CHUNK_SIZE, exception_on_overflow=False)
                audio_level = np.abs(np.frombuffer(data, dtype=np.int16)).mean()
                
                if audio_level > silence_threshold:
                    if not recording:
                        recording = True
                        print("🎤 Listening...", flush=True)
                    audio_buffer.extend(data)
                    silence_duration = 0
                elif recording:
                    silence_duration += 1
                    audio_buffer.extend(data)
                    if silence_duration >= max_silence_chunks:
                        if len(audio_buffer) > AUDIO_SAMPLE_RATE * 0.5:
                            print("🔄 Transcribing...", flush=True)
                            text = self.transcribe_audio(bytes(audio_buffer))
                            if text:
                                print(f"👤 You: {text}", flush=True)
                                
                                # Check if vision needed
                                need_vision = any(kw in text.lower() for kw in VISION_KEYWORDS)
                                vision_context = ""
                                
                                if need_vision and self.cap:
                                    ret, frame = self.cap.read()
                                    if ret:
                                        frame_b64 = self.encode_frame(frame)
                                        try:
                                            vision_context = await asyncio.wait_for(
                                                self.analyze_frame(frame_b64), timeout=10.0
                                            )
                                            print(f"👁️ Vision: {vision_context}", flush=True)
                                        except asyncio.TimeoutError:
                                            print("👁️ Vision timeout (10s)", flush=True)
                                
                                reply = await self.get_llm_response(text, vision_context)
                                print(f"🤖 Agent: {reply}", flush=True)
                                await self.speak(reply)
                        
                        recording = False
                        audio_buffer = bytearray()
                        silence_duration = 0
                        
            except Exception as e:
                print(f"Audio capture error: {e}")
                await asyncio.sleep(0.1)
    
    async def run(self):
        print("🚀 Starting OpenRouter Real-Time AI Agent...")
        print("📷 Initializing webcam...")
        self.setup_video()
        
        print("🎤 Initializing audio...")
        await self.setup_audio()
        
        self.running = True
        print("\n✅ Agent is live! Speak to it or show objects to the camera.")
        print("Press Ctrl+C to stop.\n")
        
        try:
            await self.audio_capture_loop()
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
        print("✅ Cleanup complete.")


async def main():
    if not OPENROUTER_API_KEY:
        print("❌ Error: OPENROUTER_API_KEY not found in environment variables.")
        print("Please create a .env file with your OpenRouter API key.")
        sys.exit(1)
        
    agent = OpenRouterAgent()
    await agent.run()


if __name__ == "__main__":
    asyncio.run(main())