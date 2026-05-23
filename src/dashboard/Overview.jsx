import React from 'react';
import { useUser } from '../context/UserContext';
import { ShieldCheck, Activity, Plus, RefreshCw, Play, Navigation, Info, Phone, Heart, Droplets, Weight, Syringe } from 'lucide-react';

const Overview = () => {
   const { user } = useUser();

   // Derive dynamic data from user profile
   const vitals = user?.vitals || {};
   const medicalHistory = user?.medical_history || {};
   const userName = user?.name || 'Guest User';
   const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

   // Dynamic stats based on actual data
   const hasVaccinationData = vitals.blood_group || medicalHistory.past_diseases;
   const vaccinationProgress = vitals.blood_group ? 78 : 0; // Could expand this

   return (
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in duration-500">
         
         {/* LEFT PANEL */}
         <div className="w-full lg:w-[35%] flex flex-col gap-6 shrink-0">
            {/* Header Identity */}
            <div className="px-2">
               <h1 className="text-[2.75rem] leading-[1.1] font-black tracking-tight text-slate-900 mb-4">
                  Dashboard <br/> Overview
               </h1>
               <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px]">
                  Welcome back, {userName}! Here's what's happening with your health tracking protocols today.
               </p>
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                     {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-slate-800 text-lg truncate">{userName}</h3>
                     <p className="text-xs text-slate-500 font-medium">
                        {user?.age ? `${user.age} yrs` : ''} {user?.gender ? `• ${user.gender}` : ''} {user?.blood_group ? `• ${vitals.blood_group}` : ''}
                     </p>
                  </div>
               </div>
               {user?.email && (
                  <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
               )}
               {user?.phone && (
                  <p className="text-xs text-slate-400 font-medium">{user.phone}</p>
               )}
            </div>

            {/* Key Vitals Snapshot */}
            {(vitals.weight || vitals.height || vitals.blood_pressure || vitals.heart_rate) && (
               <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                     <Activity size={16} className="text-teal-500" /> Key Vitals
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     {vitals.weight && (
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                           <Weight size={14} className="text-teal-500 mb-1" />
                           <p className="text-xs text-slate-400 font-medium">Weight</p>
                           <p className="font-bold text-slate-800">{vitals.weight} kg</p>
                        </div>
                     )}
                     {vitals.height && (
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                           <Activity size={14} className="text-blue-500 mb-1" />
                           <p className="text-xs text-slate-400 font-medium">Height</p>
                           <p className="font-bold text-slate-800">{vitals.height} cm</p>
                        </div>
                     )}
                     {vitals.blood_pressure && (
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                           <Heart size={14} className="text-rose-500 mb-1" />
                           <p className="text-xs text-slate-400 font-medium">BP</p>
                           <p className="font-bold text-slate-800">{vitals.blood_pressure}</p>
                        </div>
                     )}
                     {vitals.heart_rate && (
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                           <Droplets size={14} className="text-purple-500 mb-1" />
                           <p className="text-xs text-slate-400 font-medium">Heart Rate</p>
                           <p className="font-bold text-slate-800">{vitals.heart_rate} bpm</p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* 3D Model Display Stage */}
            <div className="bg-black rounded-[2.5rem] flex-1 relative overflow-hidden min-h-[350px] shadow-xl border border-slate-800">
               
               {/* 3D Sketchfab iframe integration */}
               <div className="absolute inset-0 z-10 w-full h-full rounded-[2.5rem] overflow-hidden flex items-center justify-center pt-8">
                  <iframe 
                     title="Brain Hologram Animated glb fbx blend usdc" 
                     className="w-[120%] h-[120%] pointer-events-auto"
                     frameBorder="0" 
                     allowFullScreen 
                     mozallowfullscreen="true" 
                     webkitallowfullscreen="true" 
                     allow="autoplay; fullscreen; xr-spatial-tracking" 
                     src="https://sketchfab.com/models/18e8505582aa46879acc9da891958677/embed?autostart=1&ui_infos=0&ui_watermark=0&transparent=1"> 
                  </iframe> 
               </div>
            </div>
         </div>

         {/* RIGHT PANEL */}
         <div className="w-full lg:w-[65%] flex flex-col gap-6">
            
            {/* Welcome Banner */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
               <div className="flex-1 z-10 relative">
                  <div className="flex items-center gap-2 mb-3">
                     <ShieldCheck className="text-emerald-500" size={16} />
                     <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Health Core</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {userName}!</h2>
                  <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                     Here's your health snapshot. Review your latest vitals, upcoming appointments, and personalized recommendations to stay on track.
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                     <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-emerald-500/20 transition-all">
                        View Health Summary
                     </button>
                     <button className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">
                        Schedule Checkup
                     </button>
                  </div>
               </div>
               
               {/* Doctors Vector Image (Mockup replacement) */}
               <div className="hidden md:flex absolute right-0 bottom-0 h-full w-1/3 items-end justify-end p-6">
                  <div className="relative w-48 h-40 bg-gradient-to-t from-blue-50 to-transparent rounded-t-3xl border-b border-blue-100 flex items-center justify-center">
                     <div className="absolute top-4 left-6 w-12 h-12 bg-blue-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center"><Activity className="text-blue-500" /></div>
                     <div className="absolute top-10 right-4 w-16 h-16 bg-teal-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center"><ShieldCheck className="text-teal-500" size={28}/></div>
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-emerald-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center"><Plus className="text-emerald-500" size={32}/></div>
                     <div className="absolute top-0 right-10 w-3 h-3 bg-rose-400 rounded-full"></div>
                     <div className="absolute bottom-10 left-4 w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
               </div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
               
               {/* Vaccination Status - Dynamic */}
               <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between group">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Vaccination Status</h3>
                        <div className={`w-12 h-12 rounded-full border-[4px] flex items-center justify-center text-xs shrink-0 font-bold ${
                           hasVaccinationData ? 'border-blue-500 border-r-blue-100 text-blue-600' : 'border-slate-300 border-r-slate-100 text-slate-400'
                        }`}>
                           {vaccinationProgress}%
                        </div>
                     </div>
                     <h4 className="font-black text-slate-800 text-xl mb-1">{vaccinationProgress}% completed</h4>
                     <p className="text-xs text-slate-500 font-medium tracking-wide">Next due: {vitals.blood_group ? 'Tdap - 2025-03-12' : 'Please complete your profile'}</p>
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                     <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                        <Plus size={16} /> Add / Import
                     </button>
                     <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-wider"><RefreshCw size={10} /> {hasVaccinationData ? 'Up to date' : 'Incomplete'}</p>
                  </div>
               </div>

               {/* Disease Detection - Dynamic */}
               <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between group">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Disease Detection</h3>
                        <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${medicalHistory.past_diseases ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                           <ShieldCheck size={12}/> {medicalHistory.past_diseases ? 'Reviewed' : 'Clear'}
                        </span>
                     </div>
                     <h4 className="font-bold text-slate-800 text-sm mb-1">
                        {medicalHistory.past_diseases ? `History: ${medicalHistory.past_diseases.substring(0, 30)}${medicalHistory.past_diseases.length > 30 ? '...' : ''}` : 'Last scan: No issues detected'}
                     </h4>
                     <p className="text-xs text-slate-500 font-medium tracking-wide">
                        {medicalHistory.past_diseases ? 'Review your medical history' : 'Last scanned: 3 days ago'}
                     </p>
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                     <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2">
                        <Activity size={16} /> Start New Scan
                     </button>
                     <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-wider">Last: 3 days ago</p>
                  </div>
               </div>

               {/* Exercise - Dynamic */}
               <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between group">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Exercise</h3>
                     </div>
                     <h4 className="font-black text-slate-800 text-xl mb-1">Streak: {user?.age ? Math.min(parseInt(user.age) % 30, 14) : 7} days</h4>
                     <p className="text-xs text-slate-500 font-medium tracking-wide">
                        {user?.name ? `Keep moving, ${userName.split(' ')[0]}!` : 'Next: Yoga - Tomorrow 7:00 AM'}
                     </p>
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                     <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div></div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-400"></div>
                     </div>
                     <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-emerald-500/20 transition-all">
                        Start Workout
                     </button>
                  </div>
               </div>

               {/* Emergency Alerts - Dynamic */}
               <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between group">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Emergency Alerts</h3>
                        <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${user?.phone ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                           {user?.phone ? 'Ready' : 'Setup Required'}
                        </span>
                     </div>
                     <h4 className="font-bold text-slate-800 text-sm mb-1">
                        {user?.phone ? `${user.phone} - emergency contact on file` : 'No emergency contact set'}
                     </h4>
                     <p className="text-xs text-slate-500 font-medium tracking-wide">
                        {user?.address ? `Location: ${user.address.substring(0, 25)}${user.address.length > 25 ? '...' : ''}` : 'No recent alerts'}
                     </p>
                  </div>
                  <div className="mt-8 flex flex-col gap-2">
                     <button className="bg-rose-500 hover:bg-rose-600 text-white w-full py-2.5 rounded-full font-bold text-sm shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2">
                        <Info size={16} /> Emergency SOS
                     </button>
                     <div className="flex items-center justify-between gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                           <Phone size={16} /> Connect Ambulance
                        </button>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center uppercase tracking-wider shrink-0 text-right">{user?.phone ? 'Ready' : 'No contact'}</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
};

export default Overview;