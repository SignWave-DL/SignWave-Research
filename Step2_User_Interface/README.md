# Step 2: User Interface

The user interface component of SignWave-Research. This is a React-based web application called **sign_wave** that provides an accessible interface for the SignWave system.

## Overview

Step 2 builds a TypeScript + React + Vite frontend application with Tailwind CSS styling. This UI layer interfaces with the Whisper-based backend from Step 1 to create a complete end-to-end system.
<img width="1607" height="976" alt="image" src="https://github.com/user-attachments/assets/08d081fa-8db5-4eb1-9ed4-363ff6e121b9" />


## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Start the development server with hot module replacement (HMR):
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build

Build the project for production:
```bash
npm run build
```

The optimized build output will be in the `dist/` directory.

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Linting

Check code quality with ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── App.tsx           # Main application component
├── App.css           # Application styles
├── main.tsx          # Entry point
├── index.css         # Global styles
├── assets/           # Static assets
└── components/       # Reusable components
```

## Integration with Step 1

This UI connects to the Whisper-based backend from Step 1. Ensure the backend is running before using this interface in production.

## Development Notes

- HMR is enabled for fast development feedback
- TypeScript strict mode is configured for type safety
- Tailwind CSS v4 is configured with Vite plugin for optimal performance
