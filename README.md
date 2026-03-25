# SignWave-Research

## Overview
SignWave-Research documents the complete development journey of the SignWave solution - a comprehensive audio transcription and sign language annotation system. This repository contains the structured progression from initial prototyping through to the enhanced production-ready implementation.

---

## 📍 Step 1: Whisper Local - Audio Transcription & Translation

### What It Does
Implements local audio processing using OpenAI's Whisper model. Captures and transcribes audio files into text, with the ability to translate non-English audio to English.

### Architecture
- **GPU/CPU Detection**: Automatically detects CUDA availability, falls back to CPU
- **Whisper Model Loading**: Pre-trained models (tiny, base, small, medium, large)
- **Audio Transcription**: Converts audio files to text
- **Translation Support**: Non-English speech → English text

### Tech Stack
- Python 3.8+
- OpenAI Whisper
- PyTorch (CUDA 11.8 optional)
- FFmpeg for audio processing

### Key Features
- Multiple model sizes for performance/accuracy trade-offs
- Support for various audio formats (m4a, mp3, wav, flac, ogg, aac)
- Fast execution on GPU or CPU

---

## 🎨 Step 2: User Interface - React Frontend

### What It Does
Builds a TypeScript + React + Vite frontend application providing an accessible interface for the SignWave system.

### Architecture
Modern web application with responsive design and component-based structure.

### Tech Stack
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **ESLint** - Code linting

### Key Features
- Hot Module Replacement (HMR) for fast development
- TypeScript strict mode for type safety
- Production-optimized build output
- Responsive and accessible UI

---

## 🔗 Step 3: Frontend & Backend Integration

### What It Does
Full-stack integration of backend API and frontend UI into a complete application. SignWave operates as an end-to-end system: audio capture → transcription → NLP processing → database storage → web display.

### System Architecture
```
Frontend (React)              Backend (FastAPI)
  - Audio UI          ←→      - Audio Capture
  - Real-time Feed            - Whisper Service
  - Results Display           - Gloss Service
                              - Database Layer
                    HTTP/WebSocket
```

### Backend Components
- **main.py** - FastAPI entry point with CORS + startup events
- **Api/** - REST endpoints (routes.py) + WebSocket (ws.py)
- **Database** - SQLAlchemy ORM (Sessions, Utterances)
- **Services** - Whisper transcription, NLP glossing, file storage

### Frontend Structure
- React TypeScript components
- Tailwind CSS styling
- WebSocket integration for real-time updates

### Key Features
- RESTful API for CRUD operations
- WebSocket for real-time communication
- Database persistence with SQLAlchemy
- Audio file management
- NLP processing with glossing service

---

## ⚡ Step 4: Enhanced Implementation - Production Ready

### What It Does
Current **production implementation** with significant improvements over Step 3. Incorporates modern async patterns, dual transcription models, and enhanced error handling.

### Key Improvements

#### Backend Enhancements
- **Modern Async/Await**: Uses `@asynccontextmanager` with `lifespan` (FastAPI 0.93+)
- **Dual Model Support**: 
  - Whisper ASR (OpenAI)
  - CTC ASR (Custom trained model)
  - Model selection via query parameter
- **Confidence Scoring**: Both models provide confidence metrics
- **Simplified Architecture**: Consolidated WebSocket handling, removed database dependency
- **Better Error Handling**: Try/except blocks with descriptive logging
- **WebM/Opus Support**: Enhanced audio format compatibility

#### Frontend Enhancements
- **React 19** - Latest features and optimizations
- **3D Avatar Integration** - React Three Fiber for real-time animation
- **Real-time Visualization** - Audio level visualization
- **Model Selection UI** - Toggle between Whisper/CTC
- **Processing Indicators** - Stage-based feedback (IDLE, PROCESSING, SPEAKING)
- **Emoji Visual Feedback** - Enhanced UX with visual cues

### Tech Stack
- **Backend**: FastAPI, PyTorch (both models), async/await
- **Frontend**: React 19, TypeScript, Tailwind CSS, React Three Fiber
- **Storage**: JSON-based file storage (no database)
- **Audio**: FFmpeg integration with format detection

### Production Features
- Simplified deployment (no database required)
- Dual transcription model support
- Real-time WebSocket communication
- Confidence scoring for quality assurance
- Interactive 3D avatar with animation
- Robust error handling and logging

---

## 📊 Development Progression

| Step | Focus | Key Technology | Output |
|------|-------|-----------------|--------|
| 1 | AI Model | Whisper + PyTorch | Text transcription |
| 2 | Frontend | React + Vite | Web interface |
| 3 | Integration | FastAPI + WebSocket | Full-stack system |
| 4 | Production | Enhanced async + CTC | Production-ready app |

---

## 📝 Contents
- Staged development experiments
- Jupyter Notebooks for model validation
- Model checkpoints and weights
- Integration patterns and best practices
- Frontend/backend architecture evolution
- Stress tests and validation scripts
