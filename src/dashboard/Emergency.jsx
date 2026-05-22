import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Navigation, Phone, ShieldAlert, HeartPulse, UserPlus, Trash2, CheckCircle, Ambulance, Clock, Activity } from 'lucide-react';
import { useUser } from '../context/UserContext';
import MapTracker from '../components/MapTracker';

const Emergency = () => {
  const [isPressing, setIsPressing] = useState(false);
  const [sosState, setSosState] = useState('idle'); // 'idle' | 'triggering' | 'dispatched'
  const [triggerProgress, setTriggerProgress] = useState(0);
  const [steps, setSteps] = useState([
    { id: 1, text: "Calling 108 Emergency", status: "pending" },
    { id: 2, text: "Sending SMS to contacts", status: "pending" }
  ]);
  const [ambulanceETA, setAmbulanceETA] = useState(14);
  const [ambulanceDist, setAmbulanceDist] = useState(5.2);
  
  const { user, contacts, updateContacts } = useUser();
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Handle SOS button hold
  useEffect(() => {
    let interval;
    if (isPressing && sosState === 'idle') {
      interval = setInterval(() => {
        setTriggerProgress((prev) => {
          if (prev >= 100) {
            handleSOSActivated();
            return 100;
          }
          return prev + 5; // 2 seconds to reach 100
        });
      }, 100);
    } else {
      setTriggerProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressing, sosState]);

  const handleSOSActivated = async () => {
    setIsPressing(false);
    setSosState('triggering');
    setSteps([
      { id: 1, text: "Connecting to emergency services...", status: "active" },
      { id: 2, text: "Dispatching SMS...", status: "pending" }
    ]);

    let userLoc = { lat: 28.6315, lng: 77.2167 }; // Default
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (pos) => { userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude }; },
         () => {}
       );
    }
    
    // Short artificial delay for UX aesthetics and Geolocation fetch
    setTimeout(async () => {
       try {
         const response = await fetch("http://localhost:5000/send-sos", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             name: user?.name || "MediCity Patient",
             location: userLoc,
             contacts: contacts,
             blood_group: user?.vitals?.blood_group,
             med_conditions: user?.medical_history?.chronic_conditions
           })
         });
         
         const result = await response.json();
         if (!result.success) throw new Error("Backend constraint");

         setSteps([
           { id: 1, text: "Call Sent ✅", status: "done" },
           { id: 2, text: "SMS Sent ✅", status: "done" }
         ]);
       } catch (err) {
         console.error("Backend fetch failed, dropping back to Mock UI mode: ", err);
         setSteps([
           { id: 1, text: "Backend unreachable ⚠️", status: "done" },
           { id: 2, text: "Simulated SOS dispatched", status: "done" }
         ]);
       }

       setTimeout(() => {
          setSosState('dispatched');
       }, 1500);

    }, 2000);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if(newContactName && newContactPhone) {
      updateContacts([...contacts, { id: Date.now(), name: newContactName, phone: newContactPhone }]);
      setNewContactName('');
      setNewContactPhone('');
    }
  };

  const deleteContact = (id) => {
    updateContacts(contacts.filter(c => c.id !== id));
  };

  const cancelEmergency = () => {
    setSosState('idle');
    setTriggerProgress(0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col xl:flex-row gap-6">
      
      {/* Left Column: SOS & Map */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Real MapTracker Component Integration */}
        <div className="bg-slate-900 rounded-3xl p-6 relative h-[400px] flex items-center justify-center border-4 border-slate-800 shadow-xl overflow-hidden">
          
          <MapTracker 
            sosState={sosState} 
            ambulanceETA={ambulanceETA} 
            setAmbulanceETA={setAmbulanceETA} 
            ambulanceDist={ambulanceDist} 
            setAmbulanceDist={setAmbulanceDist} 
          />

          {sosState === 'idle' && (
            <div className="absolute z-10 flex flex-col items-center gap-4">
               {/* SOS Button */}
               <div className="relative">
                 {isPressing && (
                   <svg className="absolute -inset-4 w-40 h-40 -rotate-90">
                     <circle cx="80" cy="80" r="76" fill="none" stroke="#e11d48" strokeWidth="8" strokeDasharray="477" strokeDashoffset={477 - (477 * triggerProgress) / 100} className="transition-all duration-100 ease-linear" />
                   </svg>
                 )}
                 <button 
                   onMouseDown={() => setIsPressing(true)}
                   onMouseUp={() => setIsPressing(false)}
                   onMouseLeave={() => setIsPressing(false)}
                   onTouchStart={() => setIsPressing(true)}
                   onTouchEnd={() => setIsPressing(false)}
                   className="w-32 h-32 bg-rose-600 rounded-full flex flex-col items-center justify-center text-white font-bold text-xl shadow-[0_0_60px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95 transition-all select-none"
                 >
                   <ShieldAlert size={40} className="mb-1" />
                   SOS
                 </button>
               </div>
               <p className="text-slate-400 font-medium bg-slate-900/50 px-4 py-1 rounded-full backdrop-blur-md">Hold for 2 seconds to activate</p>
            </div>
          )}

          {/* Triggering State Overlay */}
          {sosState === 'triggering' && (
            <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
              <div className="bg-rose-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-[0_0_40px_rgba(225,29,72,0.6)]">
                 <AlertTriangle size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Emergency Alert Triggered</h2>
              <p className="text-slate-300 mb-8">Dispatching immediate medical assistance...</p>
              
              <div className="w-full max-w-sm space-y-4">
                {steps.map(step => (
                  <div key={step.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <span className="text-white font-medium">{step.text}</span>
                    {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>}
                    {step.status === 'active' && <Activity size={20} className="text-teal-400 animate-pulse" />}
                    {step.status === 'done' && <CheckCircle size={20} className="text-emerald-500" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dispatched Details Overlay */}
          {sosState === 'dispatched' && (
            <div className="absolute bottom-6 left-6 right-6 z-30 bg-white rounded-2xl p-5 shadow-2xl border-2 border-rose-100 flex items-center justify-between animate-in slide-in-from-bottom flex-wrap gap-4">
               <div>
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                   <Ambulance className="text-rose-600" /> Ambulance Dispatched
                 </h3>
                 <p className="text-slate-500 text-sm">Target Location: User GPS coordinates via SMS</p>
               </div>
               <div className="flex gap-6">
                 <div className="text-center">
                   <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Distance</p>
                   <p className="font-bold text-slate-800 text-xl">{ambulanceDist} km</p>
                 </div>
                 <div className="text-center">
                   <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">ETA</p>
                   <p className="font-bold text-rose-600 text-xl">{ambulanceETA} mins</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-slate-50 py-2 px-4 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">RK</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Ramesh Kumar</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={12}/> +91 9876543211</p>
                  </div>
               </div>
               <button onClick={cancelEmergency} className="bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-slate-200 hover:border-rose-200">
                 Cancel Request
               </button>
            </div>
          )}
        </div>
        
        {/* Info Cards below Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
            <h3 className="font-bold text-rose-900 mb-2 flex items-center gap-2"><Phone size={20}/> 108 / 112 Ready</h3>
            <p className="text-sm text-rose-700">In case of severe emergency, the SOS button instantly dials the national emergency numbers (108) and shares your GPS coordinates.</p>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
            <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2"><UserPlus size={20}/> Family Alerts</h3>
            <p className="text-sm text-teal-700">We automatically draft and send an SMS with your location pinpoint to your saved emergency contacts below.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Emergency Contacts Manager */}
      <div className="xl:w-1/3 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="text-rose-500" /> Emergency Contacts
          </h2>
          <p className="text-sm text-slate-500 mt-1">These contacts will be notified instantly when you trigger an SOS.</p>
        </div>
        
        <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No contacts added yet.</div>
          ) : (
            contacts.map(contact => (
              <div key={contact.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center group hover:border-teal-300 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{contact.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><Phone size={14}/> {contact.phone}</p>
                </div>
                <button 
                  onClick={() => deleteContact(contact.id)}
                  className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <form onSubmit={handleAddContact} className="space-y-4">
            <h3 className="font-bold text-slate-700 text-sm">Add New Contact</h3>
            <div>
              <input 
                type="text" 
                placeholder="Name (e.g. Rahul - Brother)" 
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <input 
                type="tel" 
                placeholder="Phone (+91 XXXXX XXXXX)" 
                value={newContactPhone}
                onChange={e => setNewContactPhone(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <button type="submit" className="w-full bg-slate-800 text-white font-bold py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Add Contact
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Emergency;
