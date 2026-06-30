# Real-Time AI Agent - Camera & Voice Enabled

A Python-based real-time AI agent that sees through your webcam and talks to you using Google's Gemini Live API. Built in ~150 lines of code.

## Features

- 🎥 **Live Vision**: Real-time webcam streaming to Gemini
- 🎤 **Voice Input**: Microphone audio streaming via WebSocket
- 🔊 **Voice Output**: Natural-sounding AI voice responses
- ⚡ **Real-time**: Sub-second latency, interruptible conversations
- 🆓 **Free Tier**: Uses Gemini Live API free tier

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Webcam     │     │                  │     │  Gemini Live    │
│  (OpenCV)   │────▶│  WebSocket       │────▶│  API            │
└─────────────┘     │  (Single Conn)   │     │  (Multimodal)   │
                    │                  │     └────────┬────────┘
┌─────────────┐     │  Audio + Video   │              │
│  Microphone │────▶│  Streams         │              ▼
│  (PyAudio)  │     │                  │     ┌─────────────────┐
└─────────────┘     └──────────────────┘     │  Speaker        │
                                              │  (PyAudio)      │
                                              └─────────────────┘
```

### Four Concurrent Loops

1. **Audio Send Loop** - Captures microphone → sends PCM audio to Gemini
2. **Video Send Loop** - Captures webcam frames → sends JPEG to Gemini  
3. **Receive Loop** - Gets audio/text responses → plays audio, prints text
4. **Main Loop** - Coordinates all loops, handles shutdown

## Prerequisites

- Python 3.10+
- Google Gemini API Key (get from [Google AI Studio](https://aistudio.google.com/))
- Webcam and microphone
- macOS/Linux (Windows may need additional audio setup)

## Installation

```bash
# Clone or navigate to project
cd realtime-ai-agent

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| google-genai | 2.8.0 | Gemini Live API client |
| opencv-python | 4.10.0.84 | Webcam capture |
| pillow | 10.4.0 | Image processing (JPEG encoding) |
| python-dotenv | 1.0.1 | Environment variable loading |
| pyaudio | 0.2.14 | Audio I/O |
| numpy | 2.0.1 | Array operations |

### macOS Audio Setup

```bash
brew install portaudio
pip install pyaudio
```

### Linux Audio Setup

```bash
sudo apt-get install portaudio19-dev python3-pyaudio
pip install pyaudio
```

## Usage

```bash
# Activate venv
source venv/bin/activate

# Run the agent
python agent.py
```

### Controls

- **Speak naturally** - The agent listens continuously
- **Show objects** - Hold items up to the webcam
- **Interrupt** - Just start speaking while agent is talking
- **Ctrl+C** - Clean shutdown

## Configuration

Edit `config.py` to adjust:

```python
VIDEO_WIDTH = 640
VIDEO_HEIGHT = 480
VIDEO_FPS = 30
JPEG_QUALITY = 80

AUDIO_SAMPLE_RATE = 16000
AUDIO_CHANNELS = 1
AUDIO_CHUNK_SIZE = 1024
```

## Common Issues

| Error | Solution |
|-------|----------|
| `GEMINI_API_KEY not found` | Add key to `.env` file |
| `PortAudio error` | Install portaudio system dependency |
| `Camera not found` | Check webcam index (try `cv2.VideoCapture(1)`) |
| `WebSocket connection failed` | Verify API key and network access |
| `Audio choppy` | Reduce `AUDIO_CHUNK_SIZE` or `VIDEO_FPS` |

## Project Structure

```
realtime-ai-agent/
├── agent.py          # Main agent with 4 concurrent loops
├── config.py         # All constants and settings
├── requirements.txt  # Python dependencies
├── .env.example      # Environment template
└── README.md         # This file
```

## How It Works

1. **Connection**: Establishes WebSocket to Gemini Live API
2. **Audio Stream**: PyAudio captures 16kHz PCM → base64 → WebSocket
3. **Video Stream**: OpenCV captures frames → PIL JPEG → base64 → WebSocket
4. **Response**: Gemini returns audio (PCM) + text → PyAudio plays audio, terminal prints text
5. **Interruption**: New user audio automatically interrupts current response

## Credits

Based on the Instagram guide by [@datasciencebrain](https://instagram.com/datasciencebrain) - "Build a Real-Time AI Agent That Sees Through Your Camera and Talks to You in 30 Minutes"

## License

MIT