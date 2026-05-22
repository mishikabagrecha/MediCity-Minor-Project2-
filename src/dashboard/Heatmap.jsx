import React, { useEffect, useState } from 'react';
import { Map, Zap, Layers, AlertTriangle, Navigation, Search, Crosshair, Loader2 } from 'lucide-react';

const Heatmap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState('access');

  // Load Leaflet dynamically
  useEffect(() => {
    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        setMapLoaded(true);
      } catch (error) {
        console.warn('Leaflet load failed, using fallback:', error);
        setMapLoaded(true);
      }
    };
    loadMap();
  }, []);

  useEffect(() => {
    if (mapLoaded && window.L && !document.getElementById('leaflet-styles')) {
      const link = document.createElement('link');
      link.id = 'leaflet-styles';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, [mapLoaded]);

  const layers = [
    { id: 'access', label: 'Access Score', color: 'from-emerald-500 to-green-600' },
    { id: 'emergency', label: 'Emergency Services', color: 'from-red-500 to-rose-600' },
    { id: 'hospitals', label: 'Hospital Density', color: 'from-blue-500 to-indigo-600' },
    { id: 'pharmacies', label: 'Pharmacy Access', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Map className="text-teal-600" size={28} /> Healthcare Access Heatmap
          </h2>
          <p className="text-slate-500 text-sm">Smart mapping of medical facilities and access levels.</p>
        </div>
        <div className="flex gap-2">
          {layers.map(layer => (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedLayer === layer.id
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[600px]">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Map Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded bg-emerald-500 border border-emerald-600"></span> High Access
                </div>
                <span className="font-mono text-slate-400">80-100</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded bg-amber-400 border border-amber-500"></span> Moderate
                </div>
                <span className="font-mono text-slate-400">40-80</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded bg-red-500 border border-red-600"></span> Low Access
                </div>
                <span className="font-mono text-slate-400">0-40</span>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100">
            <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2">
              <Zap size={18} className="text-teal-600" /> AI Insights
            </h3>
            <p className="text-sm text-teal-800 leading-relaxed">
              Based on recent data, adding a mobile clinic in the designated red zones could improve overall access score by 15%.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">Nearby Facilities</h3>
            <div className="space-y-3">
              {[
                { name: "City General Hospital", distance: "1.2 km", type: "Hospital", status: "Active" },
                { name: "HealthPlus Clinic", distance: "0.8 km", type: "Clinic", status: "Active" },
                { name: "MedLife Pharmacy", distance: "0.3 km", type: "Pharmacy", status: "Active" },
              ].map((facility, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{facility.name}</p>
                    <p className="text-xs text-slate-500">{facility.type} • {facility.distance}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{facility.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl overflow-hidden relative shadow-md border border-slate-200 min-h-[500px]">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[#1e293b]" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          {/* Heatmap Overlay SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="blurFilter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
              </filter>
              <radialGradient id="gradHigh" cx="30%" cy="40%" r="25%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="gradMod" cx="60%" cy="55%" r="20%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="gradLow1" cx="20%" cy="75%" r="20%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="gradLow2" cx="80%" cy="70%" r="18%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Contour Lines */}
            <path d="M 0 120 Q 200 60 400 180 T 800 120" stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M 0 220 Q 250 120 500 280 T 800 220" stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M 0 350 Q 200 250 450 400 T 800 350" stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M 0 480 Q 300 380 550 500 T 800 480" stroke="#475569" strokeWidth="1" fill="none" opacity="0.3" />

            {/* Heatmap Blobs */}
            <circle cx="30%" cy="35%" r="120" fill="url(#gradHigh)" />
            <circle cx="65%" cy="30%" r="100" fill="url(#gradHigh)" />
            <circle cx="55%" cy="55%" r="90" fill="url(#gradMod)" />
            <circle cx="20%" cy="75%" r="100" fill="url(#gradLow1)" />
            <circle cx="80%" cy="70%" r="90" fill="url(#gradLow2)" />
            <circle cx="45%" cy="80%" r="80" fill="url(#gradLow1)" />

            {/* Hospital Markers */}
            <circle cx="30%" cy="35%" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
            <circle cx="65%" cy="30%" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
            <circle cx="20%" cy="75%" r="5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <circle cx="55%" cy="55%" r="5" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
          </svg>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur border border-white/20 p-2 rounded-xl flex flex-col gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-white text-slate-800 rounded-lg shadow hover:bg-slate-100 font-bold text-lg">+</button>
            <button className="w-9 h-9 flex items-center justify-center bg-white text-slate-800 rounded-lg shadow hover:bg-slate-100 font-bold text-lg">−</button>
          </div>

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-xl shadow font-medium text-sm text-slate-800 border border-slate-200 flex items-center gap-2">
            <Crosshair size={16} className="text-teal-600" />
            View: {selectedLayer === 'access' ? 'Healthcare Access' : selectedLayer === 'emergency' ? 'Emergency Services' : selectedLayer === 'hospitals' ? 'Hospital Density' : 'Pharmacy Access'}
          </div>

          {/* Location Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-xl shadow">
            <p className="text-xs font-bold text-slate-600">📍 Indore Region</p>
            <p className="text-[10px] text-slate-400">12 facilities mapped</p>
          </div>

          {/* Data Summary Overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="bg-white/90 backdrop-blur rounded-xl p-3 shadow border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Coverage</p>
              <p className="font-bold text-emerald-600 text-lg">73%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Hospitals", value: "12", color: "text-blue-600" },
          { label: "Clinics", value: "8", color: "text-emerald-600" },
          { label: "Pharmacies", value: "15", color: "text-purple-600" },
          { label: "Emergency Units", value: "6", color: "text-rose-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;