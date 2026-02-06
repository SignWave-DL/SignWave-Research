import React, { useRef, useState, useEffect } from "react";
import { Mic, MicOff, Radio, Home, Settings, Info, Github, Twitter, Mail, Heart, Loader2, FileText, User } from "lucide-react";

export default function DeafTranslator() {
  const [isRecording, setIsRecording] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [processingStage, setProcessingStage] = useState(null); // 'processing', 'text', 'avatar'
  const [transcribedText, setTranscribedText] = useState("");
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const analyzeAudio = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    microphone.connect(analyser);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detectLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.min(100, average));
      animationRef.current = requestAnimationFrame(detectLevel);
    };

    detectLevel();
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      analyzeAudio(stream);
      
      const ws = new WebSocket("ws://localhost:8000/ws/audio");
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = mr;

        mr.ondataavailable = async (event) => {
          if (event.data && event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            const buf = await event.data.arrayBuffer();
            ws.send(buf);
          }
        };

        mr.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };

        mr.start(250);
        setIsRecording(true);
      };

      ws.onmessage = (event) => {
        // Handle backend responses
        const data = JSON.parse(event.data);
        if (data.stage === 'text') {
          setTranscribedText(data.text);
          setProcessingStage('text');
        } else if (data.stage === 'avatar') {
          setProcessingStage('avatar');
        }
      };

      ws.onerror = (e) => console.error("WS error:", e);
      ws.onclose = () => console.log("WS closed");
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stop = () => {
    const ws = wsRef.current;
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    if (ws && ws.readyState === WebSocket.OPEN) ws.send("STOP");
    if (ws) ws.close();
    setIsRecording(false);
    setAudioLevel(0);
    
    // Start processing
    setProcessingStage('processing');
    
    // Simulate processing stages (replace with actual backend responses)
    setTimeout(() => {
      setTranscribedText("Hello, how are you today? I hope you're having a wonderful day!");
      setProcessingStage('text');
    }, 2000);
    
    setTimeout(() => {
      setProcessingStage('avatar');
    }, 4000);
  };

  const reset = () => {
    setProcessingStage(null);
    setTranscribedText("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-blue-900/20"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0.8; }
        }
      `}</style>

      {/* Navbar */}
      <nav className={`relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="backdrop-blur-xl bg-slate-900/50 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Radio className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Deaf Translator
                  </h1>
                  <p className="text-xs text-slate-500">Voice to Sign Language</p>
                </div>
              </div>

              {/* Nav Links */}
              <div className="flex items-center gap-1">
                <button className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Home</span>
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">About</span>
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>

              {/* CTA Button */}
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={`relative transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Dynamic glow effect */}
          <div 
            className={`absolute inset-0 blur-3xl rounded-full transition-all duration-300`}
            style={{
              background: isRecording 
                ? `radial-gradient(circle, rgba(239, 68, 68, ${0.3 + audioLevel / 200}) 0%, transparent 70%)`
                : processingStage 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)'
            }}
          ></div>
          
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-purple-500/20 min-w-[580px]">
            {/* Header */}
            <div className={`text-center mb-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-3">
                Deaf Translator
              </h1>
              <p className="text-slate-400 text-lg">Voice to Sign Language Interpreter</p>
            </div>

            {/* Content based on stage */}
            {!processingStage && (
              <>
                {/* Visualizer */}
                <div className={`flex justify-center mb-10 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="relative w-48 h-48">
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                      isRecording ? 'border-red-500/30' : 'border-purple-500/30'
                    }`}></div>
                    <div className={`absolute inset-4 rounded-full border-2 transition-all duration-300 ${
                      isRecording ? 'border-red-500/20' : 'border-purple-500/20'
                    }`}></div>

                    {isRecording && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                        <div className="absolute inset-0 rounded-full bg-red-400/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                      </>
                    )}

                    {isRecording && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full border-2 border-red-400 transition-all duration-100"
                            style={{
                              inset: `${8 + i * 12}px`,
                              opacity: Math.max(0, (audioLevel - i * 30) / 100),
                              transform: `scale(${1 + (audioLevel / 500) * (3 - i)})`,
                            }}
                          ></div>
                        ))}
                      </>
                    )}
                    
                    <div 
                      className={`absolute inset-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isRecording 
                          ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl' 
                          : 'bg-gradient-to-br from-purple-500 to-blue-600 shadow-2xl'
                      }`}
                      style={{
                        boxShadow: isRecording 
                          ? `0 0 ${30 + audioLevel / 2}px rgba(239, 68, 68, 0.6)`
                          : '0 0 30px rgba(168, 85, 247, 0.5)'
                      }}
                    >
                      <div className={`absolute inset-2 rounded-full ${
                        isRecording ? 'bg-red-400/20' : 'bg-purple-400/20'
                      } blur-xl`}></div>
                      
                      <div className="relative">
                        {isRecording ? (
                          <Radio 
                            className="w-16 h-16 text-white drop-shadow-lg" 
                            strokeWidth={2}
                            style={{
                              transform: `scale(${1 + audioLevel / 300})`
                            }}
                          />
                        ) : (
                          <Mic className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={2} />
                        )}
                      </div>
                    </div>

                    {isRecording && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-red-500 to-pink-500 rounded-full transition-all duration-100"
                            style={{
                              height: `${8 + Math.sin(Date.now() / 100 + i) * (audioLevel / 10)}px`,
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className={`text-center mb-10 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500/20 text-red-300 border-2 border-red-500/40 shadow-lg shadow-red-500/20' 
                      : 'bg-slate-700/50 text-slate-400 border-2 border-slate-600/30'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-slate-500'}`}></div>
                    <span className="text-base font-semibold tracking-wide">
                      {isRecording ? 'RECORDING' : 'READY'}
                    </span>
                  </div>
                  
                  {isRecording && (
                    <div className="mt-3 text-sm text-slate-500">
                      Audio Level: <span className="text-red-400 font-mono">{Math.round(audioLevel)}%</span>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className={`flex gap-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <button
                    onClick={start}
                    disabled={isRecording}
                    className={`flex-1 py-5 px-8 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                      isRecording
                        ? 'bg-slate-700/50 cursor-not-allowed opacity-40'
                        : 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-700 shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 active:scale-100'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                    Start Recording
                  </button>
                  
                  <button
                    onClick={stop}
                    disabled={!isRecording}
                    className={`flex-1 py-5 px-8 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                      !isRecording
                        ? 'bg-slate-700/50 cursor-not-allowed opacity-40'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-xl shadow-red-500/40 hover:shadow-red-500/60 hover:scale-105 active:scale-100'
                    }`}
                  >
                    <MicOff className="w-6 h-6" />
                    Stop & Process
                  </button>
                </div>
              </>
            )}

            {/* Processing Stage */}
            {processingStage === 'processing' && (
              <div className="text-center py-12 animate-in fade-in duration-500">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Processing Voice</h3>
                <p className="text-slate-400">Converting speech to text...</p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}

            {/* Text Stage */}
            {processingStage === 'text' && (
              <div className="py-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Transcribed Text</h3>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
                  <p className="text-lg text-slate-200 leading-relaxed text-center">
                    "{transcribedText}"
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating sign language animation...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Avatar Stage */}
            {processingStage === 'avatar' && (
              <div className="py-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Sign Language Avatar</h3>
                </div>

                {/* 3D Avatar Container */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-8 mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                  
                  {/* Placeholder for 3D Avatar */}
                  <div className="relative h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                        <User className="w-16 h-16 text-white" />
                      </div>
                      <p className="text-slate-400 text-sm">3D Avatar performing sign language</p>
                      <p className="text-slate-500 text-xs mt-2">(3D model will be rendered here)</p>
                    </div>
                  </div>
                </div>

                {/* Transcribed text below */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-slate-300 text-center italic">
                    "{transcribedText}"
                  </p>
                </div>

                <button
                  onClick={reset}
                  className="w-full py-4 px-8 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 active:scale-100 transition-all duration-300"
                >
                  Start New Translation
                </button>
              </div>
            )}

            {/* Connection info */}
            {!processingStage && (
              <div className={`mt-8 text-center transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  <span className="text-xs text-slate-400 font-mono">
                    ws://localhost:8000/ws/audio
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="backdrop-blur-xl bg-slate-900/50 border-t border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Radio className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Deaf Translator
                  </h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Breaking communication barriers with AI-powered voice to sign language translation. Empowering the deaf community.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-purple-400 text-sm transition-colors duration-200">Documentation</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-purple-400 text-sm transition-colors duration-200">API Reference</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-purple-400 text-sm transition-colors duration-200">Accessibility</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-purple-400 text-sm transition-colors duration-200">Support</a></li>
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
                <div className="flex gap-3 mb-4">
                  <a href="#" className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-all duration-200 hover:scale-110">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-all duration-200 hover:scale-110">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-all duration-200 hover:scale-110">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-slate-400 text-sm">
                  Join our mission to make communication accessible to everyone.
                </p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                © 2026 Deaf Translator. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for accessibility
              </div>
              <div className="flex gap-4">
                <a href="#" className="text-slate-500 hover:text-purple-400 text-sm transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-purple-400 text-sm transition-colors duration-200">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}