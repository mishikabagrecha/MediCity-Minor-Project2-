import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VoiceOrb } from './components/VoiceOrb';
import { MessageSquare, HelpCircle, Lightbulb, Play, MoreHorizontal, Mic, MicOff, FileText, Send, Zap, Bot, X, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';

const VoiceAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: "Hello! I'm your AI health assistant. I can help you with medical queries, symptom checking, appointment booking, and general health advice. You can type your message below or use the voice button to speak with me. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vapiStatus, setVapiStatus] = useState('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulated Vapi status check
  useEffect(() => {
    const checkVapi = async () => {
      setVapiStatus('connecting');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVapiStatus('ready');
    };
    checkVapi();
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
        
        if (event.results[0].isFinal) {
          const finalTranscript = event.results[0][0].transcript;
          handleSend(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Simulate audio level for visual effect
  useEffect(() => {
    let interval;
    if (isListening || isSpeaking) {
      interval = setInterval(() => {
        setAudioLevel(Math.random());
      }, 200);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  }, [isListening]);

  const handleSend = useCallback((text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'user', time, text: messageText }]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI response with realistic health advice
    setTimeout(() => {
      const responses = {
        'hello': "Hello! I'm your MediCity AI health assistant. How can I help you today? You can ask me about symptoms, medications, appointment scheduling, or general health tips.",
        'symptom': "I understand you're concerned about your symptoms. While I can provide general guidance, please remember I'm not a substitute for professional medical advice. Could you describe your symptoms in more detail? When did they start?",
        'appointment': "I can help you book an appointment! You can browse our available doctors in the Consultation section. Would you like me to help you find a specific specialist?",
        'default': "Thank you for your question. Based on general medical knowledge, here's some information that might help. However, I strongly recommend consulting with a healthcare professional for personalized medical advice. Would you like me to help you find a doctor or schedule a consultation?"
      };

      const lowerText = messageText.toLowerCase();
      let response = responses.default;
      if (lowerText.includes('hello') || lowerText.includes('hi')) response = responses.hello;
      else if (lowerText.includes('symptom') || lowerText.includes('pain') || lowerText.includes('hurt')) response = responses.symptom;
      else if (lowerText.includes('appointment') || lowerText.includes('doctor') || lowerText.includes('consult')) response = responses.appointment;

      setMessages(prev => [...prev, { sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: response }]);
      setIsProcessing(false);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1500 + Math.random() * 1500);
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: HelpCircle, text: "Get Help" },
    { icon: FileText, text: "Explain" },
    { icon: Lightbulb, text: "Health Tips" },
    { icon: Bot, text: "Symptoms" },
    { icon: MessageSquare, text: "Appointment" }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in duration-500 flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* MAIN CHAT AREA */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">MediCity AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${vapiStatus === 'ready' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className="text-xs text-slate-400 font-medium">{vapiStatus === 'ready' ? 'Online' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 shrink-10 ${
                msg.sender === 'ai' 
                  ? 'bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {msg.sender === 'ai' ? <Bot size={16} /> : <div className="text-xs font-bold">U</div>}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
                msg.sender === 'ai' 
                  ? 'bg-slate-50 border border-slate-100 rounded-tl-sm'
                  : 'bg-teal-600 text-white rounded-tr-sm'
              }`}>
                <p className={`text-sm leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-slate-700'}`}>{msg.text}</p>
                <p className={`text-[10px] font-medium tracking-wider mt-2 flex items-center gap-1 ${
                  msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                }`}>
                  <span>🕐</span> {msg.time}
                </p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                <Bot size={16} />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Container */}
        <div className="p-6 pt-2 bg-gradient-to-t from-white via-white to-transparent border-t border-slate-100">
          {/* Quick Action Chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {quickActions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.text)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all whitespace-nowrap shadow-sm"
              >
                <chip.icon size={14} /> {chip.text}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or use voice..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-36 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
              disabled={isProcessing}
            />
            <div className="absolute right-3 flex items-center gap-1">
              <button
                onClick={toggleListening}
                disabled={isProcessing}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse' 
                    : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden mr-1">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-200"
                  style={{ width: `${audioLevel * 100}%` }}
                ></div>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isProcessing
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VOICE ACTIVITY PANEL */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        {/* Status Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
            isListening ? 'bg-rose-600 shadow-rose-500/30' : 'bg-teal-600 shadow-teal-500/30'
          } text-white`}>
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Voice Assistant</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="text-slate-500 text-xs font-bold tracking-wide">
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : vapiStatus === 'ready' ? 'Ready to talk' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Glowing Orb Canvas */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-6 relative flex flex-col items-center justify-center border border-slate-200 h-64 overflow-hidden border-t-4 border-t-teal-500">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm z-20">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-teal-500'} `}></span>
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
              {isListening ? 'Live' : vapiStatus === 'ready' ? 'Ready' : 'Init'}
            </span>
          </div>
          
          <div className="absolute inset-0 z-10 w-full h-full scale-[1.5]">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={1} />
              <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
              <pointLight position={[-5, -5, -5]} intensity={1} color="#14b8a6" />
              <VoiceOrb />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          </div>
        </div>

        {/* Voice Metrics */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-800 text-sm">Voice Activity</h4>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(dot => (
                  <div
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      audioLevel * 5 >= dot ? 'bg-teal-500' : 'bg-slate-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</p>
                <p className="font-bold text-slate-800 text-sm capitalize">{vapiStatus}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Audio</p>
                <p className="font-bold text-teal-600 text-sm">{isListening ? 'Streaming' : 'Idle'}</p>
              </div>
            </div>

            {/* Vapi Status Info */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-4">
              <h5 className="font-bold text-teal-800 text-xs mb-2 flex items-center gap-1">
                <Zap size={14} /> Vapi AI Status
              </h5>
              <div className="space-y-1 font-mono text-[10px] text-teal-700">
                <p><span className="text-emerald-600">[OK]</span> Unrestricted environment</p>
                <p><span className={vapiStatus === 'ready' ? 'text-emerald-600' : 'text-amber-600'}>[{vapiStatus === 'ready' ? 'CONNECTED' : 'INIT'}]</span> Vapi SDK loaded</p>
                <p><span className="text-emerald-600">[OK]</span> Event listeners active</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleListening}
              className={`flex-1 font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/30'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/30'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              {isListening ? 'Stop' : 'Start Voice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SVG fallback components if lucide icons missing
const Search = ({size=24}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

export default VoiceAssistant;