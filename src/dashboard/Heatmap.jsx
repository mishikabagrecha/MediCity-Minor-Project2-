import React from 'react';
import { Map, Zap, Layers, AlertTriangle } from 'lucide-react';

const Heatmap = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Healthcare Access Heatmap</h2>
          <p className="text-slate-500 text-sm">Smart mapping of medical facilities and access levels.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Layers size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[500px]">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Map Legend</h3>
             <div className="space-y-3">
               <div className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 text-slate-600"><span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-600"></span> High Access</div>
                 <span className="font-mono text-slate-400">80-100</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 text-slate-600"><span className="w-4 h-4 rounded bg-amber-400 border border-amber-500"></span> Moderate Access</div>
                 <span className="font-mono text-slate-400">40-80</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 text-slate-600"><span className="w-4 h-4 rounded bg-red-500 border border-red-600"></span> Low Access</div>
                 <span className="font-mono text-slate-400">0-40</span>
               </div>
             </div>
             
             <div className="mt-6 pt-4 border-t border-slate-100">
               <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 flex items-start gap-2 text-sm">
                 <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                 <p>Area 'South District' is currently experiencing a shortage of critical care beds.</p>
               </div>
             </div>
          </div>
          
          <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100">
            <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2"><Zap size={18} className="text-teal-600" /> AI Insights</h3>
            <p className="text-sm text-teal-800">Based on recent data, adding a mobile clinic in the designated red zones could improve overall access score by 15%.</p>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl overflow-hidden relative shadow-md border border-slate-200">
          {/* Base Map Graphic (Mockup using gradients and simple shapes) */}
          <div className="absolute inset-0 bg-[#1e293b] opacity-90" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <svg className="absolute inset-0 w-full h-full opacity-60">
            {/* Topography Lines Mock */}
            <path d="M 0 100 Q 150 50 300 200 T 600 100" stroke="#475569" strokeWidth="2" fill="none" />
            <path d="M 0 200 Q 200 100 400 300 T 800 200" stroke="#475569" strokeWidth="2" fill="none" />
            
            {/* Heatmap Blobs Filter */}
            <defs>
              <filter id="blurFilter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
              </filter>
            </defs>
            
            {/* High Access Areas (Green) */}
            <circle cx="30%" cy="40%" r="80" fill="#10b981" filter="url(#blurFilter)" opacity="0.6" />
            <circle cx="70%" cy="30%" r="100" fill="#10b981" filter="url(#blurFilter)" opacity="0.6" />
            
            {/* Moderate Access Areas (Yellow) */}
            <circle cx="50%" cy="60%" r="70" fill="#fbbf24" filter="url(#blurFilter)" opacity="0.6" />
            
            {/* Low Access Areas (Red) */}
            <circle cx="20%" cy="75%" r="100" fill="#ef4444" filter="url(#blurFilter)" opacity="0.6" />
            <circle cx="80%" cy="70%" r="90" fill="#ef4444" filter="url(#blurFilter)" opacity="0.6" />
          </svg>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur border border-white/20 p-2 rounded-lg flex flex-col gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-white text-slate-800 rounded shadow hover:bg-slate-100 font-bold">+</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-slate-800 rounded shadow hover:bg-slate-100 font-bold">-</button>
          </div>

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow font-medium text-sm text-slate-800 border border-slate-200">
            Current View: City Limits
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
