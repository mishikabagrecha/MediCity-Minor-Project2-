import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { VoiceOrb } from './components/VoiceOrb';
import { MessageSquare, HelpCircle, Code, Lightbulb, Play, MoreHorizontal, Mic, FileText, Send, Zap } from 'lucide-react';

const VoiceAssistant = () => {
   const [chat] = useState([
      { sender: 'ai', time: '22:04', text: "Hello! I'm your AI assistant. I can help you with various tasks, answer questions, and have conversations. You can type your message below or use the voice assistant panel on the right to talk with me. How can I assist you today?" }
   ]);

   return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in duration-500 flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
         
         {/* MAIN CHAT AREA */}
         <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            {/* Chat History Header (Implicit in mockup, but good to have context) */}
            <div className="flex items-center gap-2 p-6 pb-2">
               <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">D</div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
               {chat.map((msg, i) => (
                  <div key={i} className="flex items-start gap-4 max-w-3xl">
                     <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mt-1 shrink-0">
                        <Zap size={16} className="fill-white" />
                     </div>
                     <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl rounded-tl-sm shadow-sm relative">
                        <p className="text-slate-700 text-sm leading-relaxed">{msg.text}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-3 flex items-center gap-1"><Clock10 size={12} /> {msg.time}</p>
                     </div>
                  </div>
               ))}
            </div>

            {/* Chat Input Container */}
            <div className="p-6 pt-2 bg-gradient-to-t from-white via-white to-transparent">
               {/* Quick Action Chips */}
               <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {[
                     { icon: HelpCircle, text: "Get Help" },
                     { icon: FileText, text: "Explain" },
                     { icon: Search, text: "Research" },
                     { icon: Code, text: "Code" },
                     { icon: Lightbulb, text: "Ideas" }
                  ].map((chip, idx) => (
                     <button key={idx} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap shadow-sm">
                        <chip.icon size={14} className="text-slate-400" /> {chip.text}
                     </button>
                  ))}
               </div>

               {/* Input Field */}
               <div className="relative flex items-center">
                  <input 
                     type="text" 
                     placeholder="Type your message or use voice..." 
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-32 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                     <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors">
                        <Mic size={18} />
                     </button>
                     <div className="w-8 h-1 bg-slate-200 rounded-full overflow-hidden mr-2">
                        <div className="w-1/2 h-full bg-blue-500"></div>
                     </div>
                     <span className="text-xs font-bold text-slate-400 mr-3">200s</span>
                     <button className="w-10 h-10 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center cursor-not-allowed">
                        <Send size={18} />
                     </button>
                  </div>
               </div>

               {/* Terminal Output Stream Mock */}
               <div className="mt-4 font-mono text-[10px] text-slate-400 space-y-1">
                  <p><span className="text-emerald-500">[13:54:08]</span> Unrestricted environment - Vapi API available</p>
                  <p><span className="text-blue-500">[13:54:08]</span> Initializing Vapi instance...</p>
                  <p><span className="text-red-500">[13:54:08]</span> ✗ No Vapi instance available</p>
                  <p><span className="text-blue-500">[13:54:08]</span> Setting up Vapi event listeners...</p>
               </div>
            </div>
         </div>

         {/* VOICE ACTIVITY PANEL (Right Column) */}
         <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
            {/* Status Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex items-center gap-3">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                  <Mic size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-sm">Voice Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     <span className="text-slate-500 text-xs font-bold tracking-wide">Ready to talk</span>
                  </div>
               </div>
            </div>

            {/* Glowing Orb Canvas Display */}
            <div className="bg-slate-100 rounded-3xl p-6 relative flex flex-col items-center justify-center border border-slate-200 h-64 overflow-hidden border-t-4 border-t-blue-500">
               <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm z-20">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Ready</span>
               </div>
               
               <div className="absolute inset-0 z-10 w-full h-full scale-[1.5]">
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                     <ambientLight intensity={1} />
                     <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
                     <pointLight position={[-5, -5, -5]} intensity={1} color="#3b82f6" />
                     <VoiceOrb />
                     <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                  </Canvas>
               </div>
            </div>

            {/* Voice Metrics Panel */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-center mb-6">
                     <h4 className="font-bold text-slate-800 text-sm">Voice Activity</h4>
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(dot => <div key={dot} className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>)}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Duration</p>
                        <p className="font-bold text-slate-800 text-xl">0:00</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Quality</p>
                        <p className="font-bold text-blue-600 text-xl">HD</p>
                     </div>
                  </div>
               </div>

               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Mic size={18} /> Start Voice Chat
               </button>
            </div>
         </div>
      </div>
   );
};

// SVG component missing from lucide for clock in mapping
const Clock10 = ({size=24}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 10"/></svg>
);
const Search = ({size=24}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

export default VoiceAssistant;
