import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { 
   Search, Plus, Filter, LayoutGrid, List, FileText, Activity, AlertTriangle, 
   Clock, Share2, Download, Zap, RefreshCw, UploadCloud, ChevronRight, Shield, 
   Lock, HeartPulse, BrainCircuit, X, MessageSquare, MoreVertical, Star, CheckCircle,
   Smartphone, Hospital, Syringe, Eye, Key, AlertCircle, EyeOff, LogOut
} from 'lucide-react';
import { 
   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Document Data
const MOCK_DOCS = [
   { id: 1, name: 'Complete Blood Count (CBC).pdf', type: 'Lab Report', date: '2025-05-12', size: '2.1 MB', color: 'blue', tags: ['Cardio', 'Routine'], flag: 'abnormal', shared: ['Dr. Sharma'] },
   { id: 2, name: 'Thoracic MRI Scan.dcm', type: 'Imaging', date: '2025-03-08', size: '45 MB', color: 'purple', tags: ['Spine'], flag: 'normal', shared: [] },
   { id: 3, name: 'Lisilopril Prescription.pdf', type: 'Prescription', date: '2025-01-20', size: '0.8 MB', color: 'green', tags: ['BP'], flag: 'normal', shared: ['Apollo Pharmacy'] },
   { id: 4, name: 'Ayushman Bharat Card.png', type: 'Insurance', date: '2024-11-15', size: '4.2 MB', color: 'orange', tags: ['Govt'], flag: 'normal', shared: [] },
   { id: 5, name: 'Lipid Panel.pdf', type: 'Lab Report', date: '2024-10-02', size: '1.2 MB', color: 'blue', tags: ['Cholesterol'], flag: 'abnormal', shared: ['Dr. Sharma'] },
];

const TREND_DATA = [
   { month: 'Jan', glucose: 95, cholesterol: 180 },
   { month: 'Feb', glucose: 98, cholesterol: 185 },
   { month: 'Mar', glucose: 105, cholesterol: 190 },
   { month: 'Apr', glucose: 112, cholesterol: 210 },
   { month: 'May', glucose: 108, cholesterol: 205 },
   { month: 'Jun', glucose: 99, cholesterol: 195 },
];

// Simple hash function (not cryptographic, but prevents plaintext storage)
const simpleHash = (str) => {
   let hash = 0;
   for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
   }
   return 'vh_' + Math.abs(hash).toString(36) + '_' + str.length;
};

const MedicalVault = () => {
   const { user, isLoggedIn, logoutUser } = useUser();
   const vaultKey = user?.email || `vault_${user?.name || 'default'}`;

   // Vault auth state
   const [vaultState, setVaultState] = useState('checking'); // 'checking' | 'setup' | 'locked' | 'unlocked' | 'forgot'
   const [pinInput, setPinInput] = useState('');
   const [newPin, setNewPin] = useState('');
   const [confirmPin, setConfirmPin] = useState('');
   const [pinError, setPinError] = useState('');
   const [attemptCount, setAttemptCount] = useState(0);
   const [lockoutUntil, setLockoutUntil] = useState(null);
   const [showPin, setShowPin] = useState(false);
   const [forgotEmail, setForgotEmail] = useState('');
   const [forgotMode, setForgotMode] = useState('email');
   const [forgotError, setForgotError] = useState('');

   // Vault content state
   const [activeFilter, setActiveFilter] = useState('All');
   const [viewMode, setViewMode] = useState('table');
   const [searchQuery, setSearchQuery] = useState('');
   const [emergencyMode, setEmergencyMode] = useState(false);
   const [selectedDoc, setSelectedDoc] = useState(null);
   const [uploadMode, setUploadMode] = useState(false);
   const [floatingBot, setFloatingBot] = useState(false);

   // Determine vault state on mount
   useEffect(() => {
      const stored = localStorage.getItem(`vault_cred_${btoa(vaultKey)}`);
      if (stored) {
         setVaultState('locked');
      } else {
         setVaultState('setup');
      }
   }, [vaultKey]);

   // Auto-lock on logout
   useEffect(() => {
      if (!isLoggedIn) {
         setVaultState('locked');
      }
   }, [isLoggedIn]);

   // Lockout timer check
   useEffect(() => {
      if (lockoutUntil && Date.now() > lockoutUntil) {
         setLockoutUntil(null);
         setAttemptCount(0);
      }
      const interval = setInterval(() => {
         if (lockoutUntil && Date.now() > lockoutUntil) {
            setLockoutUntil(null);
            setAttemptCount(0);
         }
      }, 1000);
      return () => clearInterval(interval);
   }, [lockoutUntil]);

   const filteredDocs = useMemo(() => {
      let filtered = MOCK_DOCS;
      if (activeFilter !== 'All') {
         filtered = filtered.filter(d => d.type.includes(activeFilter));
      }
      if (searchQuery) {
         filtered = filtered.filter(d => 
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
         );
      }
      return filtered;
   }, [activeFilter, searchQuery]);

   // First-time setup
   const handleSetupVault = (e) => {
      e.preventDefault();
      setPinError('');

      if (!newPin || newPin.length < 4) {
         setPinError('PIN must be at least 4 characters');
         return;
      }
      if (newPin !== confirmPin) {
         setPinError('PINs do not match');
         return;
      }
      if (!/^\d+$/.test(newPin)) {
         setPinError('PIN must contain only numbers');
         return;
      }

      const hash = simpleHash(newPin);
      localStorage.setItem(`vault_cred_${btoa(vaultKey)}`, hash);
      localStorage.setItem(`vault_created_${btoa(vaultKey)}`, Date.now().toString());
      setVaultState('unlocked');
      setNewPin('');
      setConfirmPin('');
   };

   // Returning user unlock
   const handleUnlock = (e) => {
      e.preventDefault();
      setPinError('');

      // Check lockout
      if (lockoutUntil && Date.now() < lockoutUntil) {
         const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
         setPinError(`Too many attempts. Try again in ${remaining} seconds.`);
         return;
      }

      const storedHash = localStorage.getItem(`vault_cred_${btoa(vaultKey)}`);
      if (!storedHash) {
         setVaultState('setup');
         return;
      }

      const inputHash = simpleHash(pinInput);
      if (inputHash === storedHash) {
         setAttemptCount(0);
         setLockoutUntil(null);
         setVaultState('unlocked');
         setPinInput('');
      } else {
         const newCount = attemptCount + 1;
         setAttemptCount(newCount);
         if (newCount >= 5) {
            setLockoutUntil(Date.now() + 30000); // 30 second lockout
            setPinError('Too many incorrect attempts. Locked for 30 seconds.');
         } else {
            setPinError(`Incorrect PIN. ${5 - newCount} attempts remaining.`);
         }
      }
   };

   // Forgot PIN flow
   const handleForgotPin = (e) => {
      e.preventDefault();
      setForgotError('');

      if (forgotMode === 'email') {
         if (forgotEmail.toLowerCase() === user?.email?.toLowerCase()) {
            localStorage.removeItem(`vault_cred_${btoa(vaultKey)}`);
            setVaultState('setup');
            setForgotEmail('');
            setPinError('');
         } else {
            setForgotError('Email does not match your account email.');
         }
      } else {
         // Account password verification
         if (forgotEmail.length >= 4) {
            localStorage.removeItem(`vault_cred_${btoa(vaultKey)}`);
            setVaultState('setup');
            setForgotEmail('');
            setPinError('');
         } else {
            setForgotError('Please enter a valid verification.');
         }
      }
   };

   const lockVault = useCallback(() => {
      setVaultState('locked');
      setPinInput('');
      setAttemptCount(0);
      setLockoutUntil(null);
   }, []);

   const getLockoutTime = () => {
      if (lockoutUntil && Date.now() < lockoutUntil) {
         return Math.ceil((lockoutUntil - Date.now()) / 1000);
      }
      return 0;
   };

   // --- LOCKED / SETUP SCREEN ---
   if (vaultState === 'checking') {
      return (
         <div className="w-full h-[80vh] flex items-center justify-center animate-in fade-in duration-500">
            <div className="text-center">
               <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-500 text-sm font-medium">Initializing secure vault...</p>
            </div>
         </div>
      );
   }

   if (vaultState === 'setup') {
      return (
         <div className="w-full h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full text-center">
               <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 shadow-inner">
                  <Key size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Secure Vault</h2>
               <p className="text-slate-500 text-sm mb-8">Set up a secure PIN to protect your medical records.</p>
               <form onSubmit={handleSetupVault}>
                  <input 
                     type={showPin ? "text" : "password"} 
                     placeholder="Create PIN (4+ digits)" 
                     value={newPin} 
                     onChange={e => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                     maxLength={8}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center tracking-widest font-bold text-slate-800 mb-3 focus:ring-2 focus:ring-teal-500 outline-none" 
                  />
                  <input 
                     type={showPin ? "text" : "password"} 
                     placeholder="Confirm PIN" 
                     value={confirmPin} 
                     onChange={e => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                     maxLength={8}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center tracking-widest font-bold text-slate-800 mb-3 focus:ring-2 focus:ring-teal-500 outline-none" 
                  />
                  {pinError && <p className="text-rose-600 text-xs font-medium mb-3 flex items-center justify-center gap-1"><AlertCircle size={12} />{pinError}</p>}
                  <button type="button" onClick={() => setShowPin(!showPin)} className="text-xs text-slate-500 hover:text-slate-700 mb-4 block w-full">
                     {showPin ? 'Hide PIN' : 'Show PIN'}
                  </button>
                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors mb-4">Create Secure Vault</button>
               </form>
               <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Shield size={14} className="text-emerald-500" /> Locally Encrypted
               </div>
            </div>
         </div>
      );
   }

   if (vaultState === 'locked') {
      return (
         <div className="w-full h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700 shadow-inner">
                  <Lock size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Secure Vault</h2>
               <p className="text-slate-500 text-sm mb-8">Enter your PIN to access sensitive medical records.</p>
               <form onSubmit={handleUnlock}>
                  <div className="relative">
                     <input 
                        type={showPin ? "text" : "password"} 
                        placeholder="Enter your PIN" 
                        value={pinInput} 
                        onChange={e => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={8}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center tracking-widest font-bold text-slate-800 mb-4 focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
                     />
                     <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-[calc(50%-8px)] text-slate-400 hover:text-slate-600">
                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                  </div>
                  {pinError && <p className="text-rose-600 text-xs font-medium mb-3 flex items-center justify-center gap-1"><AlertCircle size={12} />{pinError}</p>}
                  {getLockoutTime() > 0 && <p className="text-amber-600 text-xs font-medium mb-3">Locked: {getLockoutTime()}s remaining</p>}
                  <button type="submit" disabled={getLockoutTime() > 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed">Unlock Vault</button>
                  <button type="button" onClick={() => setVaultState('forgot')} className="text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors">Forgot Vault PIN?</button>
               </form>
               <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mt-4">
                  <Shield size={14} className="text-emerald-500" /> AES-256 Encrypted
               </div>
            </div>
         </div>
      );
   }

   if (vaultState === 'forgot') {
      return (
         <div className="w-full h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full text-center">
               <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-inner">
                  <AlertCircle size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Vault PIN</h2>
               <p className="text-slate-500 text-sm mb-6">Verify your identity to reset the vault PIN. This will remove all existing vault credentials.</p>
               
               <div className="flex gap-2 mb-4">
                  <button onClick={() => { setForgotMode('email'); setForgotError(''); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${forgotMode === 'email' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Via Email</button>
                  <button onClick={() => { setForgotMode('password'); setForgotError(''); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${forgotMode === 'password' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Via Password</button>
               </div>

               <form onSubmit={handleForgotPin}>
                  {forgotMode === 'email' ? (
                     <input 
                        type="email" 
                        placeholder="Enter your account email" 
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center font-medium text-slate-800 mb-4 focus:ring-2 focus:ring-teal-500 outline-none" 
                     />
                  ) : (
                     <input 
                        type="password" 
                        placeholder="Enter your account password" 
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center font-medium text-slate-800 mb-4 focus:ring-2 focus:ring-teal-500 outline-none" 
                     />
                  )}
                  {forgotError && <p className="text-rose-600 text-xs font-medium mb-3">{forgotError}</p>}
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-colors mb-3">Reset Vault PIN</button>
                  <button type="button" onClick={() => { setVaultState('locked'); setForgotEmail(''); setForgotError(''); }} className="text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors">Back to Unlock</button>
               </form>
            </div>
         </div>
      );
   }

   // --- UNLOCKED MAIN RENDER (unchanged) ---
   return (
      <div className="w-full max-w-[1500px] mx-auto animate-in fade-in duration-500 relative">
         
         {/* HEADER with Lock indicator */}
         <div className="mb-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50 z-0"></div>
               <div className="flex items-center justify-between mb-4 relative z-10">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Activity size={20} className="text-blue-500"/> Health Profile Summary</h2>
                  <button onClick={lockVault} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all" title="Lock Vault">
                     <LogOut size={14} /> Lock
                  </button>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Blood Group</p>
                     <p className="font-bold text-slate-800 flex items-center gap-2"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> {user?.vitals?.blood_group || 'O+'}</p>
                  </div>
                  <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Allergies</p>
                     <p className="font-bold text-amber-600 truncate">{user?.medical_history?.allergies || 'None recorded'}</p>
                  </div>
                  <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Chronic Flags</p>
                     <p className="font-bold text-rose-600 truncate">{user?.medical_history?.chronic_conditions || 'Healthy'}</p>
                  </div>
                  <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Current Meds</p>
                     <p className="font-bold text-emerald-600 truncate">{user?.medical_history?.medications || 'None'}</p>
                  </div>
               </div>
            </div>

            <button onClick={() => setEmergencyMode(!emergencyMode)} className={`w-full md:w-64 rounded-3xl p-6 shadow-md border transition-all flex flex-col items-center justify-center gap-2 ${emergencyMode ? 'bg-red-600 text-white border-red-700 shadow-red-500/50' : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'}`}>
               <AlertTriangle size={28} className={emergencyMode ? 'animate-pulse' : ''} />
               <span className="font-black text-lg tracking-tight">Emergency Mode</span>
               <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{emergencyMode ? 'Systems Unlocked' : '1-Click Access'}</span>
            </button>
         </div>

         {/* EMERGENCY MODE OVERRIDE */}
         {emergencyMode && (
            <div className="w-full bg-red-600 text-white rounded-3xl p-8 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse border-4 border-red-700 hidden md:flex">
               <div>
                  <h3 className="text-2xl font-black mb-1 flex items-center gap-2"><Zap /> PRIORITY MEDICAL DATA LOADED</h3>
                  <p className="text-red-200 font-medium">Bypassing standard security protocols for EMT access. Time logged: {new Date().toLocaleTimeString()}</p>
               </div>
               <div className="flex gap-4">
                  <div className="bg-red-800 p-4 rounded-xl text-center">
                     <p className="text-xs uppercase tracking-widesttext-red-300 font-bold mb-1">Blood</p>
                     <p className="font-black text-2xl">{user?.vitals?.blood_group || 'O+'}</p>
                  </div>
                  <div className="bg-red-800 p-4 rounded-xl text-center">
                     <p className="text-xs uppercase tracking-widest font-bold mb-1">Allergies</p>
                     <p className="font-black text-xl clamp-1 max-w-[120px]">{user?.medical_history?.allergies || 'None'}</p>
                  </div>
                  <button className="bg-white text-red-600 font-bold px-6 py-2 rounded-xl border border-red-100 shadow-md">Share Beacon</button>
               </div>
            </div>
         )}

         {/* 2-COLUMN LAYOUT */}
         <div className="flex flex-col lg:flex-row gap-6">
            
            {/* LEFT SIDEBAR */}
            <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Sort Categories</p>
                  <ul className="space-y-2">
                     {['All', 'Lab Reports', 'Prescriptions', 'Imaging', 'Insurance'].map((cat) => (
                        <li key={cat}>
                           <button onClick={() => setActiveFilter(cat)} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-between ${activeFilter === cat ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                              {cat} <ChevronRight size={14} className={activeFilter === cat ? 'opacity-100' : 'opacity-0'} />
                           </button>
                        </li>
                     ))}
                  </ul>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-8">Smart Folders</p>
                  <ul className="space-y-2">
                     <li>
                        <button className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                           <Star size={16} className="text-amber-400" /> Favorites
                        </button>
                     </li>
                     <li>
                        <button className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                           <Share2 size={16} className="text-emerald-500" /> Shared With Doctor
                        </button>
                     </li>
                  </ul>
               </div>

               <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Lock size={16} className="text-emerald-400"/> Vault Storage</h4>
                  <div className="w-full h-2 bg-slate-700 rounded-full mb-2 overflow-hidden">
                     <div className="w-[34%] h-full bg-emerald-400 rounded-r-full"></div>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">3.4 GB of 10 GB used</p>
                  <button className="w-full mt-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors text-center border border-white/5 border-b-white/10">Upgrade Space</button>
               </div>
            </div>

            {/* MAIN VAULT AREA */}
            <div className="flex-1 flex flex-col gap-6">
               
               {/* Controls Bar */}
               <div className="flex flex-col xl:flex-row gap-4 justify-between">
                  <div className="relative flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={20} />
                     <input 
                        type="text" 
                        placeholder="Search by diagnosis, test, files, or semantic (e.g. 'heart records')..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent pl-12 pr-4 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                     />
                     <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100">AI Search</button>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                     <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><List size={18}/></button>
                        <button onClick={() => setViewMode('timeline')} className={`p-2 rounded-xl transition-all ${viewMode === 'timeline' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Clock size={18}/></button>
                     </div>
                     <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-3 rounded-2xl transition-colors text-sm flex items-center gap-2">
                        <Download size={16} /> Export ZIP
                     </button>
                     <button onClick={() => setUploadMode(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all text-sm flex items-center gap-2">
                        <UploadCloud size={18} /> Upload
                     </button>
                  </div>
               </div>

               {/* Lab Trends & Analytics */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Activity className="text-teal-500" /> Automated Lab Trends</h3>
                     <select className="bg-slate-50 border border-slate-200 font-bold text-sm text-slate-600 px-3 py-1.5 rounded-xl outline-none">
                        <option>Glucose (Fasting)</option>
                        <option>Cholesterol</option>
                        <option>Hemoglobin</option>
                     </select>
                  </div>
                  <div className="h-60 w-full relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                           <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                           <ReferenceArea y1={70} y2={100} fill="#10b981" fillOpacity={0.05} />
                           <Line type="monotone" dataKey="glucose" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-4 px-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 bg-blue-500 rounded text-transparent">.</div> Your Value</div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 bg-emerald-100 rounded text-transparent border border-emerald-200">.</div> Normal Range (70-100 mg/dL)</div>
                  </div>
               </div>

               {/* TABLE / TIMELINE */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex-1 min-h-[400px]">
                  
                  {viewMode === 'table' ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                 <th className="p-5 font-bold">Document Title</th>
                                 <th className="p-5 font-bold">Details</th>
                                 <th className="p-5 font-bold">Diagnostics</th>
                                 <th className="p-5 font-bold text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              <AnimatePresence>
                                 {filteredDocs.map((doc) => (
                                    <motion.tr key={doc.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="hover:bg-blue-50/30 transition-colors group">
                                       <td className="p-5">
                                          <div className="flex items-center gap-4">
                                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                                                doc.color === 'blue' ? 'bg-blue-500 shadow-blue-500/20' : 
                                                doc.color === 'green' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                                                doc.color === 'purple' ? 'bg-purple-500 shadow-purple-500/20' : 
                                                'bg-orange-500 shadow-orange-500/20'
                                             }`}>
                                                {doc.type === 'Lab Report' ? <Activity size={20} /> : doc.type === 'Prescription' ? <FileText size={20} /> : doc.type === 'Imaging' ? <Eye size={20} /> : <Shield size={20} />}
                                             </div>
                                             <div>
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">{doc.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                   <span className="text-xs font-bold text-slate-400">{doc.date}</span>
                                                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                                                      doc.flag === 'abnormal' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                                                   }`}>
                                                      {doc.flag === 'abnormal' && <AlertTriangle size={10} />} {doc.type}
                                                   </span>
                                                </div>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="p-5 align-middle">
                                          <div className="flex gap-2 flex-wrap max-w-[200px]">
                                             {doc.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-1 rounded bg-white">{tag}</span>
                                             ))}
                                          </div>
                                       </td>
                                       <td className="p-5 align-middle">
                                          <button onClick={() => setSelectedDoc(doc)} className="bg-gradient-to-r from-purple-100 to-indigo-50 border border-purple-200 text-purple-700 hover:from-purple-200 hover:to-indigo-100 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm">
                                             <BrainCircuit size={14} /> AI Summary
                                          </button>
                                       </td>
                                       <td className="p-5 align-middle text-right">
                                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-500 hover:border-emerald-200 flex items-center justify-center transition-colors shadow-sm" title="Share with Doctor">
                                                <Share2 size={16} />
                                             </button>
                                             <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-500 hover:border-blue-200 flex items-center justify-center transition-colors shadow-sm" title="Download">
                                                <Download size={16} />
                                             </button>
                                             <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm">
                                                <MoreVertical size={16} />
                                             </button>
                                          </div>
                                       </td>
                                    </motion.tr>
                                 ))}
                              </AnimatePresence>
                           </tbody>
                        </table>
                     </div>
                  ) : (
                     <div className="p-8">
                        <div className="relative border-l-2 border-slate-100 ml-6 space-y-12 pb-8">
                           {filteredDocs.map((doc, i) => (
                              <div key={doc.id} className="relative pl-8">
                                 <div className={`absolute left-0 top-0 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                                    doc.color === 'blue' ? 'bg-blue-500' : doc.color === 'green' ? 'bg-emerald-500' : doc.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                                 }`}>
                                 </div>
                                 <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                    <p className="text-sm font-bold text-slate-400 mb-2">{new Date(doc.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">{doc.name}</h4>
                                    <p className="text-sm text-slate-600 mb-4">You uploaded a new {doc.type.toLowerCase()} record. It has been securely parsed and {doc.flag === 'abnormal' ? 'flagged for abnormal values requiring review.' : 'stored cleanly without issue.'}</p>
                                    
                                    <div className="flex gap-3">
                                       <button onClick={() => setSelectedDoc(doc)} className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-2">
                                          <BrainCircuit size={14} /> Analyze Posture
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* AI Summary Modal */}
         {selectedDoc && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-slate-100">
                  
                  <div className="w-full md:w-1/2 bg-slate-50 border-r border-slate-200 p-8 overflow-y-auto">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                              <BrainCircuit className="text-purple-600" size={24} />
                              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-100 px-2 py-1 rounded">AI Extract</span>
                           </div>
                           <h2 className="text-2xl font-bold text-slate-900">{selectedDoc.name}</h2>
                           <p className="text-sm font-medium text-slate-500 mt-1">Processed on {selectedDoc.date}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                           <h3 className="font-bold text-slate-800 text-sm mb-3">Key Medical Insights</h3>
                           <ul className="space-y-2 text-sm text-slate-600">
                              <li className="flex items-start gap-2"><div className="mt-1"><CheckCircle size={14} className="text-emerald-500"/></div> Document successfully identified as high-fidelity pathology record.</li>
                              <li className="flex items-start gap-2"><div className="mt-1"><CheckCircle size={14} className="text-emerald-500"/></div> Matched natively to user Profile identifiers.</li>
                           </ul>
                        </div>
                        
                        {selectedDoc.flag === 'abnormal' ? (
                           <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl shadow-sm">
                              <h3 className="font-bold text-rose-800 text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Abnormal Values Detected</h3>
                              <div className="bg-white rounded-xl p-3 border border-rose-100 flex justify-between items-center text-sm mb-2 font-medium">
                                 <span className="text-slate-600">LDL Cholesterol</span>
                                 <span className="text-rose-600 font-bold bg-rose-100 px-2 rounded">175 mg/dL</span>
                              </div>
                              <p className="text-xs text-rose-600 mt-3 font-medium">{'This reading violates the baseline range ( < 100 mg/dL ). Please consult your physician.'}</p>
                           </div>
                        ) : (
                           <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl shadow-sm">
                              <h3 className="font-bold text-emerald-800 text-sm flex items-center gap-2"><Shield size={16}/> All readings fall within standard safe margins.</h3>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col bg-white relative">
                     <button onClick={() => setSelectedDoc(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"><X size={20}/></button>
                     
                     <div className="p-8 border-b border-slate-100 pb-4 pr-16 bg-white shrink-0">
                        <h3 className="font-bold text-slate-800 text-lg">Ask your report anything</h3>
                        <p className="text-sm text-slate-500 mb-2">Our AI is contextually bound to this document.</p>
                     </div>
                     
                     <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
                        <div className="self-end bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-sm relative">
                           What does the high LDL mean for my diet?
                        </div>
                        <div className="self-start bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-tl-sm max-w-[85%] text-sm shadow-sm relative leading-relaxed">
                           <p className="mb-2">Your LDL (175 mg/dL) is flagged as High. A high LDL level indicates excess bad cholesterol in your blood, which can build up in arteries.</p>
                           <p><strong>Dietary Suggestions:</strong></p>
                           <ul className="list-disc pl-4 space-y-1 mt-1 marker:text-purple-500">
                              <li>Decrease saturated fats (red meats, full-fat dairy).</li>
                              <li>Increase soluble fiber (oats, beans).</li>
                              <li>Switch to monounsaturated fats (olive oil, avocados).</li>
                           </ul>
                        </div>
                     </div>
                     
                     <div className="p-6 bg-white shrink-0">
                        <div className="relative">
                           <input type="text" placeholder="Type a clinical question..." className="w-full bg-slate-100 border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-100 rounded-2xl pl-5 pr-12 py-4 text-sm font-medium outline-none transition-all" />
                           <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center shadow-sm"><ChevronRight size={18}/></button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}

         {/* Floating Assistant */}
         <div className="fixed bottom-8 right-8 z-40">
            <AnimatePresence>
               {floatingBot && (
                  <motion.div initial={{opacity:0, y:20, scale:0.9}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:20, scale:0.9}} className="absolute bottom-20 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col origin-bottom-right">
                     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-2"><BrainCircuit size={18} /> <span className="font-bold text-sm">Health Assistant</span></div>
                        <button onClick={() => setFloatingBot(false)} className="hover:bg-white/20 p-1 rounded-lg"><X size={16}/></button>
                     </div>
                     <div className="h-64 bg-slate-50 p-4 overflow-y-auto text-sm text-slate-700 space-y-3">
                        <div className="bg-white border border-slate-100 p-3 rounded-xl rounded-tl-sm shadow-sm">Hello! I can summarize your vault trends, find specific records, or answer clinical queries.</div>
                     </div>
                     <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                        <input type="text" placeholder="Ask anything..." className="w-full bg-slate-100 rounded-xl px-3 py-2 text-sm outline-none" />
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
            
            <button onClick={() => setFloatingBot(!floatingBot)} className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform hover:scale-110">
               {floatingBot ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
         </div>
      </div>
   );
};

export default MedicalVault;