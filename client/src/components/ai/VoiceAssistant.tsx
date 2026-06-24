import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, Bot, User } from 'lucide-react';
import api from '../../lib/api';
import { ChatMessage } from '../../types';

// Extend window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I am Glow, your voice concierge. Tap the mic and ask me anything about salons, beauty tips, or style matches in Chennai! 💅✨" }
  ]);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthesisUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll chat history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Set to English (India) to understand local accents/areas

    recognition.onstart = () => {
      setIsListening(true);
      stopSpeaking();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        handleSubmitMessage(transcript.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionSupported) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis || isMuted) return;

    stopSpeaking();

    // Clean up text a bit (remove markdown formatting for clearer speech)
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/₹/g, 'Rupees ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose a pleasant female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      v.name.includes('Samantha') || 
      v.name.includes('Zira') ||
      v.lang.startsWith('en')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setTextInput('');

    try {
      const response = await api.post('/ai/concierge', { messages: updatedMessages });
      const replyText = response.data.reply;
      setMessages([...updatedMessages, { role: 'assistant', content: replyText }]);
      speakText(replyText);
    } catch (err: any) {
      console.error(err);
      const errorMsg = "I couldn't process that request. Please try again! ✨";
      setMessages([...updatedMessages, { role: 'assistant', content: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleSubmitMessage(textInput.trim());
    }
  };

  return (
    <>
      {/* Floating Toggle Button — only visible when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full text-white cursor-pointer shadow-lg transition-transform duration-300 hover:scale-110 flex items-center justify-center border border-white/20 animate-glow-pulse"
          style={{
            background: 'linear-gradient(135deg, #1a0533 0%, #3d0d6b 50%, #6b1a4a 100%)',
          }}
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Slide-out Glass Panel */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[420px] bg-dark/70 backdrop-blur-xl border-l border-white/10 z-[60] shadow-2xl flex flex-col text-white animate-fade-in">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between"
               style={{ background: 'linear-gradient(90deg, #1a0533 0%, #3d0d6b 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-rose flex items-center justify-center animate-pulse-slow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-wide bg-gold-rose bg-clip-text text-transparent">Glow Assistant</h3>
                <span className="text-[10px] text-gray-400 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full inline-block ${isListening ? 'bg-red-500 animate-pulse' : isSpeaking ? 'bg-amber-400 animate-ping' : 'bg-green-500'}`} />
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Online'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) stopSpeaking();
                }}
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  stopSpeaking();
                }} 
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Soundwave/Microphone Interaction Area */}
          <div className="py-8 bg-black/20 flex flex-col items-center justify-center gap-4 shrink-0">
            <div className="h-12 flex items-center justify-center gap-1.5 w-full">
              {isListening ? (
                <>
                  <div className="w-1 bg-red-400 rounded-full animate-soundwave" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 bg-red-500 rounded-full animate-soundwave" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1 bg-pink-500 rounded-full animate-soundwave" style={{ animationDelay: '0.5s' }} />
                  <div className="w-1 bg-rose-500 rounded-full animate-soundwave" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 bg-pink-600 rounded-full animate-soundwave" style={{ animationDelay: '0.4s' }} />
                </>
              ) : isSpeaking ? (
                <>
                  <div className="w-1 bg-gold rounded-full animate-soundwave" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 bg-amber-400 rounded-full animate-soundwave" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1 bg-rose rounded-full animate-soundwave" style={{ animationDelay: '0.5s' }} />
                  <div className="w-1 bg-gold rounded-full animate-soundwave" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 bg-amber-500 rounded-full animate-soundwave" style={{ animationDelay: '0.4s' }} />
                </>
              ) : (
                <div className="text-xs text-gray-400 tracking-wider font-medium font-sans">
                  {recognitionSupported ? 'TAP THE MIC TO SPEAK' : 'VOICE CAPTURE NOT SUPPORTED'}
                </div>
              )}
            </div>

            <button
              onClick={toggleListening}
              disabled={!recognitionSupported}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 scale-105 shadow-red-500/50 shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/20'
              } disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
            >
              {isListening ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-gold" />}
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-gold" />
                  </div>
                )}
                <div className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-gold-rose text-white rounded-tr-sm' 
                    : 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-sm'
                }`}>
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-rose" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 justify-start animate-pulse">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>

          {/* Text Input Panel (Fallback/Hybrid) */}
          <div className="p-4 bg-black/40 border-t border-white/10 pb-safe">
            <form onSubmit={handleTextSubmit} className="relative flex items-center">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type a question..."
                className="w-full bg-white/5 border border-white/10 text-white rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50 text-xs transition-all placeholder-gray-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!textInput.trim() || loading}
                className="absolute right-1.5 w-9 h-9 rounded-full bg-gold text-dark flex items-center justify-center hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
