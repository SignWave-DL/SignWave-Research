# Step 1: Whisper Local - Audio Transcription & Translation

## Overview

This step implements local audio processing using OpenAI's Whisper model. It captures and transcribes audio files into text, with the ability to translate non-English audio to English. This is the first stage of the SignWave research pipeline for converting audio input into text for further processing.

<img width="499" height="184" alt="image" src="https://github.com/user-attachments/assets/a0c92fd5-3f12-4676-b46f-4a6114ab3da8" />


## How It Works

### Architecture
1. **GPU/CPU Detection**: Automatically detects available GPU (CUDA) and falls back to CPU if unavailable
2. **Whisper Model Loading**: Loads a pre-trained Whisper model from OpenAI
3. **Audio Transcription**: Processes audio files and converts them to text
4. **Translation Support**: Can translate non-English speech to English text

### Model Options
Whisper offers different model sizes for various performance/accuracy trade-offs:
- **tiny** - Fastest, lowest accuracy
- **base** - Small, good for quick testing
- **small** - Balanced, recommended for most use cases
- **medium** - Better accuracy (default in this step)
- **large** - Best accuracy, slowest, requires significant memory

### Execution Flow
1. System checks for GPU availability
2. Whisper model is loaded into memory
3. Audio file (e.g., `test.m4a`) is transcribed
4. Results are displayed with processing time

## Installation & Configuration

### Prerequisites
- Python 3.8 or higher
- FFmpeg (required for audio processing)
- CUDA 11.8 (optional, for GPU acceleration)

### Step 1: Install FFmpeg
**Windows:**
```bash
winget install "FFmpeg (Essentials Build)"
```
Then add the FFmpeg `bin` folder to your Windows PATH environment variable.

**Linux:**
```bash
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: GPU Setup (Optional but Recommended)
If you have an NVIDIA GPU, ensure CUDA 11.8 is installed. The dependencies include:
- `torch==2.7.1+cu118`
- `torchvision==0.22.1+cu118`
- `torchaudio==2.7.1+cu118`

If you don't have CUDA or have a different version, the script will automatically fall back to CPU mode (slower but functional).

## Usage

### Basic Usage
1. Place your audio file in the `SignWave-Research/Step1_Whisper_Local/` directory
2. Update the `audio_file` variable in `main.py` if needed (default: `test.m4a`)
3. Run the script:
   ```bash
   python main.py
   ```

### Configuration Options

#### Change Model Size
Edit `main.py` line 19:
```python
model = whisper.load_model("medium", device=device)  # Change "medium" to desired model
```

#### Audio Format
The script supports most audio formats via FFmpeg:
- `.m4a` (AAC audio)
- `.mp3` (MPEG audio)
- `.wav` (Waveform audio)
- `.flac` (Free lossless audio)
- `.ogg` (Ogg Vorbis)
- `.aac` (Advanced Audio Coding)

#### Transcription Options
In `main.py`, the `transcribe()` method accepts:
```python
result = model.transcribe(
    audio_file,
    fp16=False,           # Set to True if system supports it (faster on GPU)
    task="translate",     # "transcribe" for original language, "translate" for English
    language="en"         # Optional: specify language code
)
```

## Troubleshooting

### Common Issues

**Error: "FFmpeg not found"**
- Ensure FFmpeg is installed and added to your Windows PATH
- Restart your terminal/IDE after adding to PATH

**Error: "You forgot to put the audio file in the folder!"**
- Check that the audio file exists in the same directory as `main.py`
- Verify the filename matches the `audio_file` variable in the script

**GPU Not Detected (CUDA)**
- Falls back to CPU automatically
- For GPU support, ensure NVIDIA drivers are installed: [NVIDIA Driver Downloads](https://www.nvidia.com/Download/driverDetails.aspx)

**Memory Error on Large Files**
- Use a smaller model (`"base"` or `"small"`) instead of `"medium"` or `"large"`
- Or reduce audio length before transcription

**"fp16 not supported" Error**
- The script already handles this with `fp16=False`
- This is especially common on CPU or older GPUs

## Performance Notes

### Speed by Device
- **GPU (CUDA)**: 2-10x faster than CPU (varies by model size)
- **CPU**: Slower but functional, typically takes several seconds per minute of audio

### Memory Requirements
- **tiny**: ~1GB RAM
- **base**: ~1.5GB RAM
- **small**: ~2GB RAM
- **medium**: ~5GB RAM (default)
- **large**: ~10GB RAM

## Output
The script prints:
- GPU availability and device name
- Model loading status
- Processing time in seconds
- Transcribed/translated text

Example output:
```
--- AUDIO SYSTEM STARTUP ---
✅ POWER DETECTED: NVIDIA GeForce RTX 3080
Loading the brain (Whisper)...
✅ Brain loaded and ready.

🗣️ AI HAS HEARD (12.45s):
Operation completed. Text: 
>> The transcribed or translated text appears here...
```

## Next Steps

After successfully transcribing audio with Whisper, the text can be:
1. Stored for further processing
2. Passed to NLP models for analysis
3. Used in downstream SignWave pipeline steps
4. Integrated into the full SignWave-Backend application

## References

- [OpenAI Whisper GitHub](https://github.com/openai/whisper)
- [Whisper Documentation](https://platform.openai.com/docs/guides/speech-to-text)
- [PyTorch Installation Guide](https://pytorch.org/get-started/locally/)
- [FFmpeg Documentation](https://ffmpeg.org/)

## License

This is part of the SignWave research project. Follow the project's main license for usage terms.
