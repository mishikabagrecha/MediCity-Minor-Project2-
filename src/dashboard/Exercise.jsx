import React from 'react';
import { Play, Pause, Square, AudioWaveform, Plus, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

// Generic simple 3D standing male placeholder representation using boxes/cylinders
const DummyModel = () => {
   return (
      <group position={[0, -2, 0]}>
         {/* Torso */}
         <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[1.5, 2, 0.8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
         </mesh>
         {/* Head */}
         <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
         </mesh>
         {/* Arms (Left & Right) */}
         <mesh position={[-1.2, 2.5, 0]}>
            <boxGeometry args={[0.4, 1.8, 0.4]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
         </mesh>
         <mesh position={[1.2, 2.5, 0]}>
            <boxGeometry args={[0.4, 1.8, 0.4]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
         </mesh>
         {/* Legs */}
         <mesh position={[-0.4, 0.5, 0]}>
            <boxGeometry args={[0.5, 2, 0.5]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
         </mesh>
         <mesh position={[0.4, 0.5, 0]}>
            <boxGeometry args={[0.5, 2, 0.5]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
         </mesh>
      </group>
   );
};

const Exercise = () => {
   return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in duration-500 space-y-6">
         
         {/* HEADER & TABS */}
         <div>
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-[2rem] font-bold text-slate-900 leading-tight">Exercise Guidance</h1>
                  <p className="text-slate-500 text-sm mt-1">Follow along, track your posture, and stay fit!</p>
               </div>
               <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Session not started</span>
               </div>
            </div>
            
            <div className="flex gap-6 border-b border-slate-200">
               <button className="pb-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Overview</button>
               <button className="pb-3 text-sm font-bold text-slate-900 border-b-2 border-slate-900">Live</button>
               <button className="pb-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Tutorials</button>
               <button className="pb-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">History</button>
               <button className="pb-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Settings</button>
            </div>
         </div>

         {/* 2-COLUMN LAYOUT */}
         <div className="flex flex-col xl:flex-row gap-6">
            
            {/* LIVE CAMERA FEED (Left) */}
            <div className="w-full xl:w-[65%] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-slate-800 text-lg">Live Camera Feed</h2>
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Posture overlay + guidance</span>
                     <label className="flex items-center gap-2 cursor-pointer mr-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                        <span className="text-sm font-bold text-slate-600"><AudioWaveform size={14} className="inline mr-1"/> Audio</span>
                     </label>
                     <div className="flex items-center gap-1">
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Start</button>
                        <button className="bg-amber-400 hover:bg-amber-500 text-amber-900 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Pause</button>
                        <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">End</button>
                     </div>
                  </div>
               </div>

               {/* Video Placeholder Area */}
               <div className="bg-slate-50 rounded-2xl flex-1 relative min-h-[400px] border border-slate-200 flex flex-col justify-end p-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                     <p className="text-slate-400 font-bold uppercase tracking-widest">Webcam feed placeholder</p>
                  </div>
                  <div className="relative z-10 w-fit">
                     <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">
                        Good posture
                     </div>
                  </div>
               </div>

               {/* Bottom Metrics */}
               <div className="grid grid-cols-4 divide-x divide-slate-100 pt-6 mt-6 border-t border-slate-100">
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reps</p>
                     <p className="text-2xl font-black text-slate-800">0</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sets</p>
                     <p className="text-2xl font-black text-slate-800">0</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                     <p className="text-2xl font-black text-slate-800">0:00</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Posture Score</p>
                     <p className="text-2xl font-black text-emerald-600">84%</p>
                  </div>
               </div>
            </div>

            {/* EXERCISE INSTRUCTIONS (Right) */}
            <div className="w-full xl:w-[35%] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h2 className="font-bold text-slate-800 text-lg">Exercise Instructions</h2>
                     <h3 className="font-black text-slate-900 text-2xl mt-2 mb-1">Squats</h3>
                     <p className="text-slate-500 text-sm font-medium">Target: 3 sets × 12 reps</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded shadow-inner">Demo</span>
               </div>

               {/* 3D Demo Canvas Area */}
               <div className="bg-slate-50 rounded-2xl relative h-64 mb-6 border border-slate-200 overflow-hidden flex items-center justify-center cursor-move">
                  <div className="absolute inset-0 z-10 w-full h-full">
                     <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                        <ambientLight intensity={1.5} />
                        <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
                        <DummyModel />
                        <OrbitControls autoRotate autoRotateSpeed={2} />
                     </Canvas>
                  </div>
                  
                  {/* Action UI overlaying the canvas */}
                  <div className="absolute bottom-3 left-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-20">
                     <Activity size={16} className="text-blue-500" />
                  </div>
               </div>

               {/* Tips Box */}
               <div className="flex-1 flex flex-col justify-between">
                  <div className="mb-6">
                     <h4 className="text-sm font-bold text-slate-800 mb-3">Tips:</h4>
                     <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div> Engage your core.
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div> Keep back straight.
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div> Drive through heels.
                        </li>
                     </ul>
                  </div>

                  <div className="flex items-center gap-3">
                     <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-500/30 transition-transform hover:scale-105 flex-1 text-center">
                        Start Demo
                     </button>
                     <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-3 rounded-xl transition-colors text-center border border-slate-200">
                        More
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default Exercise;
