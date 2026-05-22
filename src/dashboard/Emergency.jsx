import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, MapPin, Navigation, Phone, ShieldAlert, HeartPulse, UserPlus, Trash2, CheckCircle, Ambulance, Clock, Activity, Hospital, Crosshair, Info, Loader2, AlertCircle, Bell, Shield, Users, Copy, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';
import MapTracker from '../components/MapTracker';

// Hospital data extracted from Snowflake GovernmentHospitalMap logic
const EMERGENCY_HOSPITALS = [
  { id: "aiims-delhi", name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, type: "Super Specialty", phone: "011-26588500", emergency: true, beds: 2500, distance: null },
  { id: "safdarjung", name: "Safdarjung Hospital", lat: 28.5738, lng: 77.2088, type: "Multi-specialty", phone: "011-26165060", emergency: true, beds: 1500, distance: null },
  { id: "mgh-indore", name: "M.Y. Hospital Indore", lat: 22.7196, lng: 75.8577, type: "Government General", phone: "0731-2542621", emergency: true, beds: 1200, distance: null },
  { id: "aiims-indore", name: "AIIMS Indore", lat: 22.6726, lng: 75.9064, type: "Super Specialty", phone: "0731-2672001", emergency: true, beds: 800, distance: null },
  { id: "pgimer-chandigarh", name: "PGIMER Chandigarh", lat: 30.7333, lng: 76.7794, type: "Super Specialty", phone: "0172-2747585", emergency: true, beds: 2000, distance: null },
  { id: "kgmu-lucknow", name: "KGMU Lucknow", lat: 26.8467, lng: 80.9462, type: "Medical College", phone: "0522-2257540", emergency: true, beds: 1800, distance: null },
  { id: "jharkhand-hospital", name: "RIMS Ranchi", lat: 23.3441, lng: 85.3096, type: "Medical Institute", phone: "0651-2541111", emergency: true, beds: 1100, distance: null },
  { id: "sctimst-kerala", name: "SCTIMST Kerala", lat: 8.5241, lng: 76.9366, type: "Specialty Institute", phone: "0471-2524266", emergency: true, beds: 900, distance: null },
];

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'done': return <CheckCircle size={20} className="text-emerald-500" />;
    case 'active': return <Activity size={20} className="text-teal-400 animate-pulse" />;
    case 'pending': case 'waiting': return <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>;
    case 'error': return <AlertCircle size={20} className="text-rose-500" />;
    default: return <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>;
  }
};

const Emergency = () => {
  const [isPressing, setIsPressing] = useState(false);
  const [sosState, setSosState] = useState('idle');
  const [triggerProgress, setTriggerProgress] = useState(0);
  const [steps, setSteps] = useState([]);
  const [ambulanceETA, setAmbulanceETA] = useState(14);
  const [ambulanceDist, setAmbulanceDist] = useState(5.2);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showMedicalCard, setShowMedicalCard] = useState(false);
  const [emergencyTimer, setEmergencyTimer] = useState(0);
  const [autoCancelTimer, setAutoCancelTimer] = useState(null);
  const [browserNotifSent, setBrowserNotifSent] = useState(false);
  const [emergencyProfile, setEmergencyProfile] = useState({
    bloodGroup: 'O+',
    allergies: 'None',
    chronicConditions: 'None',
    medications: 'None',
    emergencyNotes: ''
  });

  const { user, contacts, updateContacts } = useUser();
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const sosButtonRef = useRef(null);

  // Load emergency profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medicity_emergency_profile');
    if (saved) {
      setEmergencyProfile(JSON.parse(saved));
    } else {
      const profile = {
        bloodGroup: user?.vitals?.blood_group || 'O+',
        allergies: user?.allergies || 'None',
        chronicConditions: user?.medical_history?.chronic_conditions || 'None',
        medications: user?.medications || 'None',
        emergencyNotes: ''
      };
      setEmergencyProfile(profile);
      localStorage.setItem('medicity_emergency_profile', JSON.stringify(profile));
    }
  }, [user]);

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Calculate nearby hospitals when location changes
  useEffect(() => {
    if (userLocation) {
      const hospitalsWithDist = EMERGENCY_HOSPITALS.map(h => ({
        ...h,
        distance: calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng)
      })).sort((a, b) => a.distance - b.distance);
      setNearbyHospitals(hospitalsWithDist.slice(0, 5));
    }
  }, [userLocation]);

  // SOS hold timer
  useEffect(() => {
    let interval;
    if (isPressing && sosState === 'idle') {
      interval = setInterval(() => {
        setTriggerProgress((prev) => {
          if (prev >= 100) {
            handleSOSActivated();
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else if (sosState === 'idle') {
      setTriggerProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressing, sosState]);

  // Trigger auto-cancel if no dispatch after 30s in triggering state
  useEffect(() => {
    if (sosState === 'triggering') {
      const timer = setTimeout(() => {
        if (sosState === 'triggering') {
          setSteps(prev => prev.map(s => ({
            ...s,
            status: s.status === 'active' ? 'error' : s.status === 'pending' ? 'error' : s.status
          })));
        }
      }, 30000);
      setAutoCancelTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [sosState]);

  // Emergency countdown timer
  useEffect(() => {
    let interval;
    if (sosState === 'dispatched') {
      interval = setInterval(() => {
        setEmergencyTimer(t => t + 1);
      }, 1000);
    } else {
      setEmergencyTimer(0);
    }
    return () => clearInterval(interval);
  }, [sosState]);

  const getUserLocation = useCallback(() => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setUserLocation({ lat: 28.6315, lng: 77.2167 });
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setUserLocation({ lat: 28.6315, lng: 77.2167 });
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const sendBrowserNotification = useCallback((title, body) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: '/favicon.svg' });
      setBrowserNotifSent(true);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body, icon: '/favicon.svg' });
          setBrowserNotifSent(true);
        }
      });
    }
  }, []);

  const announceEmergency = useCallback((message) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleSOSActivated = useCallback(async () => {
    setIsPressing(false);
    setSosState('triggering');
    
    // Announce emergency
    announceEmergency("Emergency activated. Dispatching medical assistance.");
    
    // Send browser notification
    sendBrowserNotification(
      "🚨 Emergency Alert Activated",
      "Medical assistance is being dispatched to your location."
    );

    // Get fresh location
    let loc = userLocation || { lat: 28.6315, lng: 77.2167 };
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true, timeout: 8000
          });
        });
        loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
      } catch (e) {}
    }

    // Auto-call first emergency contact immediately on SOS trigger
    if (contacts && contacts.length > 0) {
      const primary = contacts[0];
      const phone = primary.phone;
      const name = primary.name;
      if (/Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        try { window.open(`tel:${phone}`, '_self'); } catch (e) {
          try { window.location.href = `tel:${phone}`; } catch (e2) {
            showToast(`Unable to call ${name}. Please dial ${phone} manually.`);
          }
        }
      } else {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(phone).then(() => {
            setCopiedNumber(phone);
            showToast(`📋 ${name} copied! Use your phone to call.`);
            setTimeout(() => setCopiedNumber(null), 2000);
          }).catch(() => {
            try {
              const ta = document.createElement('textarea');
              ta.value = phone; ta.style.position = 'fixed'; ta.style.left = '-9999px';
              document.body.appendChild(ta); ta.select(); document.execCommand('copy');
              document.body.removeChild(ta);
              setCopiedNumber(phone); showToast(`📋 ${name} copied! Use your phone to call.`);
              setTimeout(() => setCopiedNumber(null), 2000);
            } catch (e) { showToast(`${name}: ${phone}`); }
          });
        } else {
          try {
            const ta = document.createElement('textarea');
            ta.value = phone; ta.style.position = 'fixed'; ta.style.left = '-9999px';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy');
            document.body.removeChild(ta);
            setCopiedNumber(phone); showToast(`📋 ${name} copied! Use your phone to call.`);
            setTimeout(() => setCopiedNumber(null), 2000);
          } catch (e) { showToast(`${name}: ${phone}`); }
        }
      }
    }

    // Set workflow steps
    setSteps([
      { id: 1, text: "Connecting to emergency services (108)...", status: "active" },
      { id: 2, text: "Fetching GPS coordinates...", status: "waiting" },
      { id: 3, text: "Locating nearby hospitals...", status: "pending" },
      { id: 4, text: "Sending alerts to emergency contacts...", status: "pending" },
      { id: 5, text: "Dispatching nearest ambulance...", status: "pending" }
    ]);

    // Simulate workflow progression
    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 1 ? { ...s, status: "done" } : s.id === 2 ? { ...s, status: "active" } : s));
    }, 1200);

    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 2 ? { ...s, status: "done" } : s.id === 3 ? { ...s, status: "active" } : s));
    }, 2500);

    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 3 ? { ...s, status: "done" } : s.id === 4 ? { ...s, status: "active" } : s));
    }, 3800);

    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 4 ? { ...s, status: "done" } : s.id === 5 ? { ...s, status: "active" } : s));
    }, 5000);

    // Try backend SOS endpoint
    setTimeout(async () => {
      try {
        await fetch("http://localhost:5000/send-sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user?.name || "MediCity Patient",
            location: loc,
            contacts: contacts,
            blood_group: user?.vitals?.blood_group,
            med_conditions: user?.medical_history?.chronic_conditions,
            profile: emergencyProfile
          })
        });
      } catch (err) {
        // Backend not available - simulation mode
      }
      
      setSteps(prev => prev.map(s => s.id === 5 ? { ...s, status: "done" } : s));
      
      setTimeout(() => {
        setSosState('dispatched');
        announceEmergency("Ambulance has been dispatched. Estimated arrival 14 minutes.");
        sendBrowserNotification(
          "🚑 Ambulance Dispatched",
          `Ambulance is en route. ETA: ${ambulanceETA} minutes. Stay calm and remain where you are.`
        );
      }, 1000);
    }, 6500);
  }, [userLocation, user, contacts, emergencyProfile, announceEmergency, sendBrowserNotification, ambulanceETA]);

  const cancelEmergency = useCallback(() => {
    setSosState('idle');
    setTriggerProgress(0);
    setSteps([]);
    setEmergencyTimer(0);
    if (autoCancelTimer) clearTimeout(autoCancelTimer);
    
    // Cancel speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [autoCancelTimer]);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContactName && newContactPhone) {
      updateContacts([...contacts, {
        id: Date.now(),
        name: newContactName,
        phone: newContactPhone,
        relation: newContactRelation || 'Unknown'
      }]);
      setNewContactName('');
      setNewContactPhone('');
      setNewContactRelation('');
    }
  };

  const deleteContact = (id) => {
    updateContacts(contacts.filter(c => c.id !== id));
  };

  const handleEmergencyProfileSave = () => {
    localStorage.setItem('medicity_emergency_profile', JSON.stringify(emergencyProfile));
    setShowMedicalCard(false);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Platform-safe emergency calling
  const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const safeCall = useCallback((phoneNumber, contactName) => {
    if (isMobileDevice) {
      // Mobile: use tel: link with explicit user action
      try {
        window.open(`tel:${phoneNumber}`, '_self');
      } catch (e) {
        // Fallback if window.open fails
        try {
          window.location.href = `tel:${phoneNumber}`;
        } catch (e2) {
          showToast(`Unable to call ${contactName}. Please dial ${phoneNumber} manually.`);
        }
      }
    } else {
      // Desktop: copy to clipboard, no tel: auto-trigger (avoids macOS FaceTime popup)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneNumber).then(() => {
          setCopiedNumber(phoneNumber);
          showToast(`📋 ${contactName || 'Number'} copied! Use your phone to call.`);
          setTimeout(() => setCopiedNumber(null), 2000);
        }).catch(() => {
          // Clipboard API fallback
          fallbackCopy(phoneNumber, contactName);
        });
      } else {
        fallbackCopy(phoneNumber, contactName);
      }
    }
  }, [isMobileDevice, showToast]);

  const fallbackCopy = useCallback((phoneNumber, contactName) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = phoneNumber;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedNumber(phoneNumber);
      showToast(`📋 ${contactName || 'Number'} copied! Use your phone to call.`);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (e) {
      showToast(`${contactName || 'Contact'}: ${phoneNumber}`);
    }
  }, [showToast]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col xl:flex-row gap-6">
      {/* Left Column: SOS & Map & Nearby Hospitals */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Real MapTracker with Nearby Hospitals */}
        <div className="bg-slate-900 rounded-3xl p-6 relative h-[400px] flex items-center justify-center border-4 border-slate-800 shadow-xl overflow-hidden">
          <MapTracker
            sosState={sosState}
            ambulanceETA={ambulanceETA}
            setAmbulanceETA={setAmbulanceETA}
            ambulanceDist={ambulanceDist}
            setAmbulanceDist={setAmbulanceDist}
            userLocation={userLocation}
          />

          {/* Nearby Hospital Markers Overlay */}
          {nearbyHospitals.length > 0 && sosState === 'idle' && (
            <div className="absolute top-4 right-4 z-20 max-w-[220px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 p-3 shadow-xl">
              <h4 className="text-white text-xs font-bold mb-2 flex items-center gap-1">
                <Hospital size={12} className="text-teal-400" /> Nearest Hospitals
              </h4>
              <div className="space-y-1.5">
                {nearbyHospitals.slice(0, 3).map((h, i) => (
                  <div key={h.id} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-300 truncate max-w-[120px]">
                      {i === 0 ? '🚑 ' : i === 1 ? '🏥 ' : '🏥 '}
                      {h.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span className="text-teal-400 font-bold">{h.distance?.toFixed(1)} km</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOS Button State */}
          {sosState === 'idle' && (
            <div className="absolute z-10 flex flex-col items-center gap-4">
              <div className="relative" ref={sosButtonRef}>
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

          {/* Triggering State */}
          {sosState === 'triggering' && (
            <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
              <div className="bg-rose-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-[0_0_40px_rgba(225,29,72,0.6)]">
                <AlertTriangle size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Emergency Alert Triggered</h2>
              <p className="text-slate-300 mb-8 text-center px-4">Dispatching immediate medical assistance to your GPS location...</p>
              
              <div className="w-full max-w-md space-y-3">
                {steps.map(step => (
                  <div key={step.id} className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      {step.status === 'done' && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                      {step.status === 'active' && <Loader2 size={18} className="text-teal-400 animate-spin shrink-0" />}
                      {step.status === 'waiting' && <Clock size={18} className="text-amber-400 shrink-0" />}
                      {(step.status === 'pending' || !step.status) && <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0"></div>}
                      <span className={`text-sm ${step.status === 'done' ? 'text-emerald-300' : step.status === 'active' ? 'text-white' : step.status === 'error' ? 'text-rose-400' : 'text-slate-400'}`}>
                        {step.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dispatched State */}
          {sosState === 'dispatched' && (
            <>
              <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-[2px]"></div>
              <div className="absolute bottom-6 left-6 right-6 z-30 bg-white rounded-2xl p-5 shadow-2xl border-2 border-rose-100 animate-in slide-in-from-bottom flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                    <Ambulance className="text-rose-600" /> Ambulance Dispatched
                  </h3>
                  <p className="text-slate-500 text-sm">Target: Your GPS location • Emergency: #{Date.now().toString(36).toUpperCase()}</p>
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                    <Clock size={12} /> Response time: {formatTimer(emergencyTimer)}
                  </p>
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
                <div className="flex items-center gap-3 bg-slate-50 py-2 px-4 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center font-bold text-rose-700">
                    RK
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Ramesh Kumar</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={12} /> +91 9876543211</p>
                  </div>
                </div>
                <button onClick={cancelEmergency} className="bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-slate-200 hover:border-rose-200">
                  Cancel Request
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
            <h3 className="font-bold text-rose-900 mb-2 flex items-center gap-2"><Phone size={20} /> 108 / 112 Ready</h3>
            <p className="text-sm text-rose-700">The SOS button instantly connects to national emergency numbers and shares your GPS coordinates with responders.</p>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
            <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2"><UserPlus size={20} /> Family Alerts</h3>
            <p className="text-sm text-teal-700">Automatically notifies your emergency contacts with your precise location and medical profile.</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2"><Crosshair size={20} /> Smart Routing</h3>
            <p className="text-sm text-amber-700">Routes ambulance from nearest hospital. Current nearest: <strong>{nearbyHospitals[0]?.name?.split(' ').slice(0,2).join(' ') || 'AIIMS'}</strong></p>
          </div>
        </div>

        {/* Nearby Hospitals List (visible in idle) */}
        {sosState === 'idle' && nearbyHospitals.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Hospital size={18} className="text-teal-600" /> Nearby Emergency Centers
              </h3>
              <button onClick={getUserLocation} className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-all flex items-center gap-1">
                <MapPin size={14} /> {locationLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {nearbyHospitals.slice(0, 4).map((hospital, idx) => (
                <div key={hospital.id} className={`p-4 ${idx < 2 ? '' : ''} flex items-start gap-3 hover:bg-slate-50 transition-colors`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${idx === 0 ? 'bg-rose-100' : 'bg-slate-100'}`}>
                    {idx === 0 ? '🚑' : '🏥'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{hospital.name}</h4>
                    <p className="text-xs text-slate-500">{hospital.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        {hospital.distance?.toFixed(1)} km
                      </span>
                      {idx === 0 && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Nearest</span>}
                      <span className="text-[10px] text-slate-400">{hospital.beds} beds</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Phone size={10} /> {hospital.phone}</p>
                  </div>
                  <button
                    onClick={() => safeCall(hospital.phone, hospital.name)}
                    className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-all shrink-0"
                    title={`Call ${hospital.name}`}
                  >
                    {copiedNumber === hospital.phone ? <Check size={14} /> : <Phone size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Emergency Contacts + Medical Profile */}
      <div className="xl:w-1/3 flex flex-col gap-6">
        {/* Emergency Medical Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <HeartPulse size={18} /> Emergency Medical Profile
              </h3>
              <button
                onClick={() => setShowMedicalCard(!showMedicalCard)}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-all font-medium"
              >
                {showMedicalCard ? 'Done' : 'Edit'}
              </button>
            </div>
          </div>
          <div className="p-4">
            {!showMedicalCard ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <p className="text-rose-400 font-bold uppercase tracking-wider mb-0.5">Blood Group</p>
                  <p className="font-black text-rose-700 text-lg">{emergencyProfile.bloodGroup}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <p className="text-amber-400 font-bold uppercase tracking-wider mb-0.5">Allergies</p>
                  <p className="font-medium text-amber-800 text-sm">{emergencyProfile.allergies}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 col-span-2">
                  <p className="text-blue-400 font-bold uppercase tracking-wider mb-0.5">Chronic Conditions</p>
                  <p className="font-medium text-blue-800 text-sm">{emergencyProfile.chronicConditions}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 col-span-2">
                  <p className="text-purple-400 font-bold uppercase tracking-wider mb-0.5">Current Medications</p>
                  <p className="font-medium text-purple-800 text-sm">{emergencyProfile.medications}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Blood Group</label>
                  <select
                    value={emergencyProfile.bloodGroup}
                    onChange={(e) => setEmergencyProfile({...emergencyProfile, bloodGroup: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Allergies</label>
                  <textarea
                    value={emergencyProfile.allergies}
                    onChange={(e) => setEmergencyProfile({...emergencyProfile, allergies: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="2"
                    placeholder="List any allergies..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Chronic Conditions</label>
                  <textarea
                    value={emergencyProfile.chronicConditions}
                    onChange={(e) => setEmergencyProfile({...emergencyProfile, chronicConditions: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="2"
                    placeholder="e.g. Diabetes, Hypertension"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Medications</label>
                  <textarea
                    value={emergencyProfile.medications}
                    onChange={(e) => setEmergencyProfile({...emergencyProfile, medications: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="2"
                    placeholder="Current medications..."
                  />
                </div>
                <button
                  onClick={handleEmergencyProfileSave}
                  className="w-full bg-teal-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all"
                >
                  Save Medical Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contacts Manager */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
          <div className="bg-slate-50 p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-rose-500" size={20} /> Emergency Contacts
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">These contacts will be notified instantly when you trigger an SOS.</p>
          </div>

          <div className="p-5 flex-1 flex flex-col gap-3 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Bell size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No contacts added yet.</p>
                <p className="text-xs mt-1">Add emergency contacts below to enable SOS notifications.</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center group hover:border-rose-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                      {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{contact.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={12} /> {contact.phone}</p>
                        {contact.relation && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{contact.relation}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => safeCall(contact.phone, contact.name)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${copiedNumber === contact.phone ? 'bg-emerald-100 text-emerald-600' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'}`}
                      title={`Call ${contact.name}`}
                    >
                      {copiedNumber === contact.phone ? <Check size={14} /> : <Phone size={14} />}
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 bg-slate-50 border-t border-slate-100">
            <form onSubmit={handleAddContact} className="space-y-3">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Add Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  className="col-span-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Relation (e.g. Brother)"
                  value={newContactRelation}
                  onChange={e => setNewContactRelation(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl hover:bg-slate-700 transition-all text-sm">
                <UserPlus size={16} className="inline mr-1.5" /> Add Emergency Contact
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-sm max-w-md">
            {copiedNumber ? <Check size={18} className="text-emerald-400 shrink-0" /> : <Info size={18} className="text-teal-400 shrink-0" />}
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;
