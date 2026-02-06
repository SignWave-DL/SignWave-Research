# Step 3: Merging Frontend & Backend

## Overview

This is the integration step where the standalone **Backend API** and **Frontend UI** are brought together into a complete full-stack application. SignWave now operates as an end-to-end system that captures audio, transcribes it using Whisper, processes it with NLP services, stores results in a database, and displays everything through a responsive web interface.

The architecture follows a classic separation of concerns:
- **Backend**: FastAPI server handling audio processing, API endpoints, and WebSocket connections
- **Frontend**: React TypeScript application providing the user interface
- **Communication**: REST API + WebSocket for real-time updates

## System Architecture

```
┌─────────────────────┐
│  Frontend (React)   │
│  - Audio UI         │
│  - Real-time Feed   │
│  - Results Display  │
└──────────┬──────────┘
           │ HTTP/WebSocket
┌──────────▼──────────┐
│  Backend (FastAPI)  │
│  - Audio Capture    │
│  - Whisper Service  │
│  - Gloss Service    │
│  - Database Layer   │
└─────────────────────┘
```

## Project Structure

### Backend (`SignWave-Backend/`)

#### Core Files
- **`main.py`** - FastAPI application entry point with CORS middleware and startup events
- **`Audiocapter.py`** - Audio capture and stream management

#### API Layer (`Api/`)
- **`routes.py`** - REST API endpoints for CRUD operations
- **`ws.py`** - WebSocket endpoints for real-time communication

#### Database Layer (`db/`)
- **`database.py`** - SQLAlchemy engine, base models, and session management
- **`models.py`** - SQLAlchemy ORM models (Sessions, Utterances)
- **`schema.py`** - Pydantic validation schemas
- **`session_repos.py`** - Repository pattern for session operations
- **`utterance_repo.py`** - Repository pattern for utterance operations

#### Services (`services/`)
- **`whisper_service.py`** - Audio transcription using OpenAI Whisper
- **`gloss_service.py`** - NLP processing for glossing/annotation
- **`storage_service.py`** - File storage and management

#### Data
- **`recordings/`** - Directory for storing audio files

### Frontend (`SIgnWave-Frontend/`)

#### Configuration Files
- **`package.json`** - Node.js dependencies and build scripts
- **`vite.config.ts`** - Vite bundler configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`eslint.config.js`** - Code linting rules

#### Source Code (`src/`)
- **`main.tsx`** - Application entry point
- **`App.tsx`** - Root React component
- **`App.css`** - Application styles
- **`index.css`** - Global styles with TailwindCSS
- **`assets/`** - Static assets (images, icons, etc.)

#### Build Output
- **`dist/`** - Production-ready compiled files (generated after build)
- **`public/`** - Static files served directly

## Prerequisites

### System Requirements
- Python 3.8+
- Node.js 18+
- FFmpeg (for audio processing)
- CUDA 11.8+ (optional, for GPU acceleration)

### Windows Installation
```bash
# Install FFmpeg
winget install "FFmpeg (Essentials Build)"

# Add FFmpeg to PATH (if needed)
# Environment Variables → System Variables → Add FFmpeg\bin to PATH
```

### Linux Installation
```bash
sudo apt-get install ffmpeg python3-dev nodejs npm
```

## Setup & Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd SignWave-Backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables (if needed):**
   ```bash
   # Create .env file for database URL, API keys, etc.
   cp .env.example .env
   ```

5. **Initialize database (optional):**
   ```bash
   python -m db.database  # or custom migration script
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd SIgnWave-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   ```typescript
   // src/config.ts (create if needed)
   export const API_URL = "http://localhost:8000"
   export const WS_URL = "ws://localhost:8000"
   ```

## Running the Application

### Start Backend Server

```bash
cd SignWave-Backend
python main.py
```

The FastAPI server will start on `http://localhost:8000`

**Features:**
- Automatic database table creation on startup
- CORS enabled for frontend communication
- WebSocket support for real-time updates
- Interactive API documentation at `http://localhost:8000/docs`

### Start Frontend Development Server

```bash
cd SIgnWave-Frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is in use)

**Development Features:**
- Hot module replacement (HMR) for instant code updates
- TypeScript checking
- Vite's fast bundling

## Production Build

### Backend Deployment

```bash
# Using uvicorn
uvicorn SignWave-Backend.main:app --host 0.0.0.0 --port 8000 --workers 4

# Or using Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker SignWave-Backend.main:app
```

### Frontend Deployment

```bash
cd SIgnWave-Frontend
npm run build
```

This generates optimized files in the `dist/` directory for production serving.

## API Endpoints

### REST Endpoints
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /openapi.json` - OpenAPI schema

Session Management:
- `POST /sessions` - Create new session
- `GET /sessions/{session_id}` - Get session details
- `GET /sessions` - List all sessions

Utterance Management:
- `POST /sessions/{session_id}/utterances` - Add utterance
- `GET /sessions/{session_id}/utterances` - Get session utterances

### WebSocket Endpoints
- `WS /ws` - Real-time audio stream and status updates

## Key Features

### Audio Processing Pipeline
1. **Capture** → Audio input from user
2. **Transcribe** → Whisper converts audio to text
3. **Process** → Gloss service performs NLP analysis
4. **Store** → Results saved to database
5. **Display** → Frontend updates in real-time

### Real-time Communication
- WebSocket connections for live streaming
- Immediate feedback during processing
- Status updates without polling

### Data Persistence
- SQLAlchemy ORM for type-safe database operations
- Repository pattern for clean data access
- Pydantic schemas for validation

### UI Components
- React 19.2 with TypeScript for type safety
- TailwindCSS for modern styling
- Lucide React for consistent iconography
- Vite for lightning-fast development experience

## Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Web framework |
| **Uvicorn** | ASGI server |
| **SQLAlchemy** | ORM |
| **Pydantic** | Data validation |
| **Whisper** | Audio transcription |
| **PyTorch** | Deep learning |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **TailwindCSS** | Styling |
| **Lucide React** | Icons |

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find and kill process using port 8000
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows
```

**FFmpeg not found:**
- Verify FFmpeg installation: `ffmpeg -version`
- Check PATH environment variable

**CUDA/GPU issues:**
- Falls back to CPU automatically
- Check PyTorch installation: `python -c "import torch; print(torch.cuda.is_available())"`

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000  # Use different port
```

**Dependencies not installing:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Making Changes

**Backend:**
1. Modify Python files in `SignWave-Backend/`
2. Restart server (uvicorn has auto-reload in development)
3. Test via API docs at `http://localhost:8000/docs`

**Frontend:**
1. Modify React/TypeScript files in `SIgnWave-Frontend/`
2. Changes automatically reload via HMR
3. Browser updates instantly

### Debugging

**Backend:**
```python
# Add print statements or use debugger
import pdb; pdb.set_trace()

# Or use logging
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

**Frontend:**
- Use browser DevTools (F12)
- React Developer Tools browser extension
- TypeScript provides compile-time error checking

## Next Steps for Production

1. **Environment Configuration**
   - Move API secrets to environment variables
   - Configure database for production (PostgreSQL recommended)
   - Set CORS origins to specific domains

2. **Error Handling**
   - Implement comprehensive error boundaries in React
   - Add proper error logging in FastAPI

3. **Performance Optimization**
   - Add caching for Whisper models
   - Implement request rate limiting
   - Optimize database queries

4. **Security**
   - Authentication/Authorization
   - Input validation
   - SQL injection prevention (SQLAlchemy handles this)
   - HTTPS enforcement

5. **Monitoring & Logging**
   - Application performance monitoring
   - Error tracking and alerts
   - User analytics

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

## Common Commands

```bash
# Backend
python main.py                    # Start server
python -m pytest                  # Run tests
python -c "from db import ..."   # Quick imports

# Frontend
npm run dev                       # Development server
npm run build                     # Production build
npm run lint                      # Lint code
npm run preview                   # Preview production build
```

---

**Created**: Step 3 of SignWave Research Pipeline
**Status**: Integration Complete - Ready for Development/Production
