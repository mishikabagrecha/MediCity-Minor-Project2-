import React, { useState } from 'react';
import { Camera, Image as ImageIcon, CheckCircle, Save, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIDiagnosis = () => {
   const [file, setFile] = useState(null);
   const [analyzing, setAnalyzing] = useState(false);
   const [sliderPos, setSliderPos] = useState(50);
   const [result, setResult] = useState(null);
   const [category, setCategory] = useState("Skin");

   const handleUpload = (e) => {
      e.preventDefault();
      if (!file) return;
      
      setAnalyzing(true);
      setResult(null);

      // Mock API sequence matching exact dashboard requirements
      setTimeout(() => {
         setAnalyzing(false);
         setResult(true);
      }, 2500);
   };

   return (
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in duration-500 space-y-6">
         
         {/* HEADER */}
         <div className="px-2">
            <h1 className="text-[2rem] font-bold text-slate-900 leading-tight">AI Disease Diagnosis</h1>
            <p className="text-slate-500 text-sm mt-1">Upload an image to detect possible diseases instantly with AI.</p>
         </div>

         {/* MAIN TOP SECTION (2 COLUMNS) */}
         <div className="flex flex-col lg:flex-row gap-6">
            
            {/* UPLOAD FORM (Left Column) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-slate-800 text-lg">Upload Your Image</h2>
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Category: {category}</span>
               </div>
               <p className="text-slate-500 text-xs mb-6 max-w-sm">Drag & drop or choose files (1-5). Select a category and analyze.</p>

               <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Category</label>
                     <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow appearance-none"
                        style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                     >
                        <option value="Skin">Skin</option>
                        <option value="Eye">Eye</option>
                        <option value="Dental">Dental</option>
                     </select>
                  </div>

                  <div className="border-2 border-dashed border-slate-200 hover:border-purple-300 bg-slate-50 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors relative cursor-pointer group">
                     <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="text-slate-400" size={24} />
                     </div>
                     {!file ? (
                        <>
                           <p className="text-sm font-bold text-slate-700">Drag & drop images here or</p>
                           <button type="button" className="mt-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors pointer-events-none">
                              Choose File
                           </button>
                           <p className="text-xs text-slate-400 mt-4 font-medium tracking-wide">0/5 uploaded</p>
                        </>
                     ) : (
                        <div className="flex flex-col items-center pointer-events-none text-purple-700">
                           <ImageIcon size={32} className="mb-2 text-purple-400" />
                           <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                           <p className="text-[10px] uppercase font-bold mt-2 tracking-wider bg-purple-100 px-2 py-0.5 rounded">Ready to Scan</p>
                        </div>
                     )}
                  </div>

                  <button 
                     type="submit" 
                     disabled={!file || analyzing}
                     className={`w-full py-4 rounded-2xl font-bold transition-all shadow-md flex justify-center items-center gap-2 ${!file || analyzing ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed' : 'bg-[#c084fc] hover:bg-[#a855f7] text-white shadow-purple-500/30'}`}
                  >
                     {analyzing ? <span className="animate-pulse">Analyzing Vectors...</span> : 'Analyze Now'}
                  </button>
               </form>
            </div>

            {/* IMAGE COMPARISON (Right Column) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-slate-800 text-lg">Image Comparison</h2>
                  <span className="text-slate-400 text-xs font-semibold tracking-wider">Before | After</span>
               </div>

               {!result && !analyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
                     <p className="font-medium text-sm">Ready to analyze.</p>
                     <div className="w-48 h-1 bg-slate-100 rounded-full mt-10 relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-1/2 w-4 h-4 -mt-1.5 -ml-2 bg-slate-300 rounded-full shadow-sm"></div>
                     </div>
                  </div>
               ) : analyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                     <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
                     <p className="text-purple-600 font-bold mt-4 animate-pulse">Running Neural Networks...</p>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col relative h-full min-h-[300px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                     <p className="absolute inset-0 flex items-center justify-center font-bold text-slate-300 uppercase tracking-widest text-2xl z-0">Comparison Map</p>
                     {/* The slider logic visually */}
                     <div className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.2)] z-20" style={{ left: `${sliderPos}%` }}>
                        <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                           <div className="w-3 h-3 bg-[#c084fc] rounded-full"></div>
                        </div>
                     </div>
                     <input type="range" min="0" max="100" value={sliderPos} onChange={(e)=>setSliderPos(e.target.value)} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 z-30 opacity-0 cursor-ew-resize h-10" />
                     {/* Visual Slide Thumb Fallback to match screenshot */}
                     <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-slate-200 rounded-full z-10">
                        <div className="h-full bg-blue-500 rounded-l-full" style={{width: `${sliderPos}%`}}></div>
                     </div>
                  </div>
               )}
            </div>

         </div>

         {/* BOTTOM ROW (3 CARDS) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Treatment Options */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">Treatment Options</h3>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Choose a tab</span>
               </div>
               <div className="flex gap-2 mb-6 border-b border-slate-100 overflow-hidden text-sm">
                  <button className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-t-xl text-center shadow-md shadow-purple-500/20 relative">
                     <span className="flex items-center justify-center gap-1"><span className="text-[10px]">🌿</span> Organic</span>
         <div className="absolute -bottom-[1px] left-0 w-full h-[3px] bg-purple-600"></div>
                  </button>
                  <button className="flex-1 bg-white text-slate-500 font-bold py-2 rounded-t-xl hover:text-slate-700 transition-colors text-center border-b-[3px] border-transparent hover:border-slate-200">
                     <span className="flex items-center justify-center gap-1"><span className="text-[10px]">💊</span> Medical</span>
                  </button>
               </div>
               <ul className="space-y-4">
                  <li className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                     <p>Keep the area clean and dry. Avoid prolonged exposure to moisture.</p>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></div>
                     <p>Avoid known irritants and allergens mapped to your profile.</p>
                  </li>
               </ul>
            </div>

            {/* Next Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
               <h3 className="font-bold text-slate-800 text-lg mb-6">Next Actions</h3>
               <div className="flex-1 flex flex-col gap-4">
                  <button className="w-full py-4 border-2 border-slate-100 hover:border-slate-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-slate-700 transition-colors">
                     <Save size={18} /> Save to History
                  </button>
                  <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/30 rounded-2xl flex items-center justify-center gap-2 font-bold transition-transform hover:scale-[1.02]">
                     <Search size={18} /> Find Nearby Doctor
                  </button>
               </div>
            </div>

            {/* Community Insight */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col overflow-hidden relative group">
               <h3 className="font-bold text-slate-800 text-lg mb-2 relative z-10">Community Insight</h3>
               <p className="text-sm font-medium text-slate-500 mb-6 relative z-10 leading-relaxed">
                  10 similar cases detected near <span className="font-bold text-slate-700">Indore</span> this week.
               </p>
               {/* Visual Abstract Map mimicking screenshot bottom right corner graphic */}
               <div className="absolute bottom-0 left-0 right-0 h-24 w-full opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-full rounded-t-[100px] bg-gradient-to-t from-pink-100 via-orange-50 to-transparent absolute bottom-0 left-10 scale-150 transform translate-y-10"></div>
                  <div className="absolute bottom-4 left-1/4 w-3 h-3 bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse"></div>
                  <div className="absolute bottom-8 right-1/3 w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.8)]"></div>
               </div>
            </div>
            
         </div>
      </div>
   );
};

export default AIDiagnosis;
