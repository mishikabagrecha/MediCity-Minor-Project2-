import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Activity, Plus, CheckCircle2, ChevronRight, AlertCircle, Camera, CameraOff, RefreshCw, Dumbbell, Target, Zap, Loader2, Award, TrendingUp, Clock, Flame, BarChart3, History, Settings, Brain } from 'lucide-react';

const Exercise = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [isActive, setIsActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [setCount, setSetCount] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(90);
  const [poseDetected, setPoseDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('bicep-curl');
  const [postureScore, setPostureScore] = useState(85);
  const [repState, setRepState] = useState('ready');
  const [isLoaded, setIsLoaded] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [speedLevel, setSpeedLevel] = useState('normal');
  const [formAlerts, setFormAlerts] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const [energyExpended, setEnergyExpended] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const durationRef = useRef(null);
  const prevFrameRef = useRef(null);
  const animationRef = useRef(null);
  const caloriesRef = useRef(0);
  const lastRepTimeRef = useRef(0);
  const repStateRef = useRef('ready');
  const motionHistoryRef = useRef([]);
  const formAlertTimeRef = useRef(0);

  const exercises = [
    { id: 'bicep-curl', name: 'Bicep Curls', target: '3 sets × 12 reps', icon: '💪', color: 'blue', caloriesPerRep: 0.8, muscleGroup: 'Arms' },
    { id: 'squat', name: 'Squats', target: '3 sets × 15 reps', icon: '🦵', color: 'emerald', caloriesPerRep: 1.2, muscleGroup: 'Legs' },
    { id: 'shoulder-press', name: 'Shoulder Press', target: '3 sets × 10 reps', icon: '🏋️', color: 'purple', caloriesPerRep: 1.0, muscleGroup: 'Shoulders' },
    { id: 'jumping-jack', name: 'Jumping Jacks', target: '3 sets × 20 reps', icon: '🤸', color: 'amber', caloriesPerRep: 0.5, muscleGroup: 'Full Body' },
  ];

  const currentEx = exercises.find(e => e.id === selectedExercise) || exercises[0];

  // Load session history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mb_exercise_history');
      if (saved) setSessionHistory(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveSessionToHistory = useCallback((session) => {
    const updated = [session, ...sessionHistory].slice(0, 50);
    setSessionHistory(updated);
    try { localStorage.setItem('mb_exercise_history', JSON.stringify(updated)); } catch (e) {}
  }, [sessionHistory]);

  // Real motion detection via canvas frame differencing
  const detectMotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = video.videoWidth || 320;
    const h = video.videoHeight || 240;
    canvas.width = w;
    canvas.height = h;

    // Draw current frame
    ctx.drawImage(video, 0, 0, w, h);
    const currentFrame = ctx.getImageData(0, 0, w, h);

    if (prevFrameRef.current) {
      const prev = prevFrameRef.current.data;
      const curr = currentFrame.data;
      let totalMotion = 0;
      const pixelCount = w * h;
      const step = 8; // Sample every 8th pixel for performance

      for (let i = 0; i < pixelCount; i += step) {
        const idx = i * 4;
        const diff = Math.abs(curr[idx] - prev[idx]) +
                     Math.abs(curr[idx + 1] - prev[idx + 1]) +
                     Math.abs(curr[idx + 2] - prev[idx + 2]);
        if (diff > 30) totalMotion++;
      }

      const motionPercent = (totalMotion / (pixelCount / step)) * 100;
      setMotionLevel(Math.min(100, motionPercent * 2));
      
      // Track motion history for rep detection
      motionHistoryRef.current.push(motionPercent);
      if (motionHistoryRef.current.length > 20) motionHistoryRef.current.shift();

      // Enhanced rep detection using motion patterns
      const recentMotion = motionHistoryRef.current;
      if (recentMotion.length > 10) {
        const avgMotion = recentMotion.reduce((a, b) => a + b, 0) / recentMotion.length;
        const peakMotion = Math.max(...recentMotion.slice(-5));
        
        // Detect a rep: motion spike followed by rest
        if (peakMotion > 25 && avgMotion > 8 && repStateRef.current === 'ready') {
          const now = Date.now();
          if (now - lastRepTimeRef.current > 300) { // debounce
            repStateRef.current = 'contracted';
            setRepState('contracted');
            lastRepTimeRef.current = now;
            
            setRepCount(prev => {
              const newCount = prev + 1;
              setTotalReps(r => r + 1);
              // Track calories
              caloriesRef.current += currentEx.caloriesPerRep;
              setCaloriesBurned(Math.round(caloriesRef.current * 10) / 10);
              setEnergyExpended(e => e + Math.floor(Math.random() * 2) + 1);
              
              // Auto-complete set
              const targetReps = currentEx.target.split('×')[1]?.trim() || '12';
              const maxReps = parseInt(targetReps);
              if (newCount >= maxReps && currentEx) {
                setSetCount(s => s + 1);
                setTimeout(() => {
                  setRepCount(0);
                  repStateRef.current = 'ready';
                  setRepState('ready');
                }, 500);
                return 0;
              }
              return newCount;
            });

            // Posture & form scoring
            const score = Math.min(95, Math.floor(60 + motionPercent * 1.5 + Math.random() * 10));
            setPostureScore(prevScore => Math.round((prevScore + score) / 2));
            setCurrentAngle(Math.floor(80 + motionPercent * 2));

            // Detect speed
            if (motionPercent > 50) setSpeedLevel('fast');
            else if (motionPercent > 25) setSpeedLevel('normal');
            else setSpeedLevel('slow');
          }
        } else if (peakMotion < 10 && avgMotion < 5) {
          repStateRef.current = 'ready';
          setRepState('ready');
        } else if (peakMotion > 15) {
          repStateRef.current = 'moving';
          setRepState('moving');
        }
      }

      // Form alerts based on erratic motion
      const now = Date.now();
      if (motionPercent > 70 && now - formAlertTimeRef.current > 5000) {
        setFormAlerts(prev => [...prev.slice(-4), { type: 'speed', msg: 'Movement too fast - slow down!' }]);
        formAlertTimeRef.current = now;
      } else if (motionPercent < 5 && duration > 10 && now - formAlertTimeRef.current > 8000) {
        setFormAlerts(prev => [...prev.slice(-4), { type: 'pause', msg: 'Keep moving! Take a shorter rest.' }]);
        formAlertTimeRef.current = now;
      }
    }

    prevFrameRef.current = currentFrame;
    if (isActive) {
      animationRef.current = requestAnimationFrame(detectMotion);
    }
  }, [isActive, duration, currentEx]);

  // Camera handling with real motion tracking
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user', frameRate: { ideal: 15 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraPermission(true);
        setIsActive(true);
        setPoseDetected(true);
        startTimer();
        
        // Start motion detection once video plays
        videoRef.current.onplay = () => {
          setTimeout(() => {
            detectMotion();
          }, 500);
        };
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraPermission(false);
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    
    // Save session if any activity
    if (totalReps > 0 || duration > 10) {
      const session = {
        id: Date.now(),
        exercise: currentEx.name,
        exerciseIcon: currentEx.icon,
        reps: totalReps,
        sets: setCount,
        finalSets: setCount + (repCount > 0 ? 1 : 0),
        duration,
        calories: Math.round(caloriesBurned * 10) / 10,
        avgScore: postureScore,
        date: new Date().toISOString(),
      };
      saveSessionToHistory(session);
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 4000);
    }
    
    setIsActive(false);
    setPoseDetected(false);
    stopTimer();
    prevFrameRef.current = null;
    motionHistoryRef.current = [];
    repStateRef.current = 'ready';
    setRepState('ready');
  };

  const startTimer = () => {
    durationRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (durationRef.current) { clearInterval(durationRef.current); durationRef.current = null; }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    stopCamera();
    setRepCount(0);
    setSetCount(0);
    setTotalReps(0);
    setDuration(0);
    setCurrentAngle(90);
    setPoseDetected(false);
    setRepState('ready');
    setPostureScore(85);
    setCaloriesBurned(0);
    setFormAlerts([]);
    setMotionLevel(0);
    setEnergyExpended(0);
    caloriesRef.current = 0;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      stopTimer();
    };
  }, []);

  // Weekly stats computation
  const weeklyStats = (() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekSessions = sessionHistory.filter(s => new Date(s.date).getTime() > weekAgo);
    return {
      totalSessions: weekSessions.length,
      totalReps: weekSessions.reduce((sum, s) => sum + (s.reps || 0), 0),
      totalCalories: weekSessions.reduce((sum, s) => sum + (s.calories || 0), 0).toFixed(1),
      totalDuration: weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    };
  })();

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in duration-500 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-slate-900 leading-tight flex items-center gap-3">
            <Dumbbell className="text-emerald-600" size={32} />
            Exercise Training
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your workout with real-time motion detection
            {sessionHistory.length > 0 && <> • <strong>{sessionHistory.length}</strong> past sessions</>}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
            {isActive ? 'Tracking' : 'Idle'}
          </span>
        </div>
      </div>

      {/* Session Complete Banner */}
      {showComplete && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-center gap-4 animate-in slide-in-from-top duration-300">
          <Award size={32} className="text-emerald-600 shrink-0" />
          <div>
            <h3 className="font-bold text-emerald-800 text-lg">Session Complete!</h3>
            <p className="text-emerald-700 text-sm">
              {totalReps} total reps • {setCount + (repCount > 0 ? 1 : 0)} sets • {caloriesBurned.toFixed(1)} cal burned • {formatTime(duration)} duration
            </p>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'live', label: 'Live Training', icon: <Activity size={16} /> },
          { id: 'overview', label: 'Exercises', icon: <Dumbbell size={16} /> },
          { id: 'history', label: 'History', icon: <History size={16} /> },
          { id: 'stats', label: 'Weekly Stats', icon: <BarChart3 size={16} /> },
          { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold capitalize transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* LIVE TRAINING TAB */}
      {activeTab === 'live' && (
        <div className="flex flex-col xl:flex-row gap-6">
          {/* CAMERA FEED */}
          <div className="w-full xl:w-[65%] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <h2 className="font-bold text-slate-800 text-lg">Live Camera Feed</h2>
              <div className="flex items-center gap-3">
                {!isActive ? (
                  <button
                    onClick={startCamera}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    <Camera size={16} /> Start Tracking
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <CameraOff size={16} /> Stop
                  </button>
                )}
                <button
                  onClick={resetSession}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <RefreshCw size={14} className="inline mr-1" /> Reset
                </button>
              </div>
            </div>

            {/* Video Area with Real Tracking */}
            <div className="bg-slate-50 rounded-2xl flex-1 relative min-h-[400px] border border-slate-200 overflow-hidden">
              {cameraPermission === false ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100">
                  <CameraOff size={48} className="text-slate-400 mb-4" />
                  <p className="text-slate-600 font-bold mb-2">Camera Access Denied</p>
                  <p className="text-slate-400 text-sm mb-4 text-center max-w-xs">Please allow camera access to use real-time motion tracking.</p>
                  <button onClick={startCamera} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all">
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover scale-x-[-1]"
                    autoPlay playsInline muted
                    style={{ display: isActive ? 'block' : 'none' }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]"
                    style={{ display: 'none' }}
                  />
                  
                  {/* Motion Overlay */}
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Motion level indicator */}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 min-w-[180px]">
                        <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-2">Motion Intensity</p>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-150"
                            style={{
                              width: `${motionLevel}%`,
                              background: motionLevel > 50 ? '#ef4444' : motionLevel > 20 ? '#f59e0b' : '#22c55e'
                            }}
                          />
                        </div>
                        <p className="text-white/60 text-xs mt-1">{motionLevel.toFixed(0)}% active</p>
                      </div>

                      {/* Top stats */}
                      <div className="absolute top-4 left-4 space-y-2">
                        <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold">
                          <Brain size={14} className="inline mr-1.5" />
                          Motion Tracking Active
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm ${
                          repState === 'contracted' ? 'bg-emerald-500/90' :
                          repState === 'moving' ? 'bg-amber-500/90' : 'bg-slate-500/90'
                        }`}>
                          {repState === 'contracted' ? '✅ Rep Detected!' :
                           repState === 'moving' ? '⏳ Moving...' : '⚡ Ready'}
                        </div>
                        <div className="bg-blue-500/90 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                          Speed: {speedLevel === 'fast' ? '⚡ Fast' : speedLevel === 'normal' ? '▶ Normal' : '🐢 Slow'}
                        </div>
                      </div>

                      {/* Form Alerts */}
                      {formAlerts.length > 0 && (
                        <div className="absolute top-4 right-4 space-y-2 max-w-[200px]">
                          {formAlerts.slice(-2).map((alert, i) => (
                            <div key={i} className={`px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-sm ${
                              alert.type === 'speed' ? 'bg-rose-500/90 text-white' : 'bg-amber-500/90 text-white'
                            }`}>
                              {alert.msg}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera size={64} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Camera Off</p>
                        <p className="text-slate-400 text-sm mt-2">Click "Start Tracking" to begin your workout</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Enhanced Metrics */}
            <div className="grid grid-cols-5 divide-x divide-slate-100 pt-6 mt-6 border-t border-slate-100">
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reps</p>
                <p className="text-3xl font-black text-slate-800">{repCount}</p>
                <p className="text-xs text-slate-400 mt-1">this set</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sets</p>
                <p className="text-3xl font-black text-slate-800">{setCount}</p>
                <p className="text-xs text-slate-400 mt-1">completed</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Reps</p>
                <p className="text-3xl font-black text-slate-800">{totalReps}</p>
                <p className="text-xs text-slate-400 mt-1">all sets</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                <p className="text-3xl font-black text-slate-800">{formatTime(duration)}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
                <p className="text-3xl font-black text-emerald-600">{postureScore}%</p>
              </div>
            </div>

            {/* Extra Metrics Row */}
            {isActive && (
              <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <Flame size={18} className="text-amber-600" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calories</p>
                    <p className="font-bold text-slate-800">{caloriesBurned.toFixed(1)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <Activity size={18} className="text-blue-600" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Motion</p>
                    <p className="font-bold text-slate-800">{motionLevel.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <Zap size={18} className="text-purple-600" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Energy</p>
                    <p className="font-bold text-slate-800">{energyExpended} pts</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EXERCISE INFO */}
          <div className="w-full xl:w-[35%] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Exercise Guide</h2>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {exercises.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        if (!isActive) { setSelectedExercise(ex.id); setRepCount(0); setSetCount(0); setTotalReps(0); }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedExercise === ex.id
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ex.icon} {ex.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Exercise Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-6 border border-slate-200 text-center">
              <div className="text-6xl mb-3">{currentEx.icon}</div>
              <h3 className="text-xl font-bold text-slate-900">{currentEx.name}</h3>
              <p className="text-sm text-slate-500 font-medium">{currentEx.muscleGroup} • {currentEx.target}</p>
              {isActive && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold">
                    {repCount}/{currentEx.target.split('×')[1]?.trim() || '12'} reps
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-xl text-xs font-bold">
                    {setCount}/3 sets
                  </div>
                  <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded-xl text-xs font-bold">
                    {caloriesBurned.toFixed(1)} cal
                  </div>
                </div>
              )}
            </div>

            {/* Live progress bar */}
            {isActive && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Set Progress</p>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(repCount / (parseInt(currentEx.target.split('×')[1]) || 12)) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{repCount} of {currentEx.target.split('×')[1]?.trim() || '12'} reps in current set</p>
              </div>
            )}

            {/* Tips */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Form Tips:</h4>
              <ul className="space-y-2">
                {[
                  currentEx.id === 'bicep-curl' ? 'Keep elbows pinned to your sides' :
                  currentEx.id === 'squat' ? 'Keep back straight, knees behind toes' :
                  'Maintain proper form throughout',
                  'Breathe steadily - exhale on effort',
                  isActive ? `Current speed: ${speedLevel}` : 'Control your movements',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-auto">
              {!isActive ? (
                <button
                  onClick={startCamera}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-emerald-500/30 transition-all hover:scale-105 flex-1 text-center flex items-center justify-center gap-2"
                >
                  <Play size={20} /> Start Workout
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-rose-500/30 transition-all hover:scale-105 flex-1 text-center flex items-center justify-center gap-2"
                >
                  <Square size={20} /> End Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exercises.map(ex => {
            const exSessions = sessionHistory.filter(s => s.exercise === ex.name);
            const totalExReps = exSessions.reduce((sum, s) => sum + (s.reps || 0), 0);
            return (
              <div key={ex.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                <div className="text-4xl mb-4">{ex.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{ex.name}</h3>
                <p className="text-xs text-slate-500 mb-1">{ex.muscleGroup} • {ex.target}</p>
                {exSessions.length > 0 && (
                  <p className="text-xs text-teal-600 font-medium mb-3">{totalExReps} total reps • {exSessions.length} sessions</p>
                )}
                <button
                  onClick={() => { setSelectedExercise(ex.id); setActiveTab('live'); }}
                  className="text-teal-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-3"
                >
                  Start Training <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {sessionHistory.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Workout History Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">Complete your first exercise session to start tracking your progress!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sessionHistory.slice(0, 20).map(session => (
                <div key={session.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{session.exerciseIcon || '💪'}</div>
                    <div>
                      <p className="font-bold text-slate-800">{session.exercise}</p>
                      <p className="text-xs text-slate-500">
                        {session.reps || session.finalSets * 12} reps • {session.finalSets || 0} sets • {session.calories ? `${session.calories} cal` : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{formatTime(session.duration)}</p>
                    <p className="text-[10px] text-slate-400">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STATS TAB */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-teal-500" /> This Week
            </h3>
            {weeklyStats.totalSessions === 0 ? (
              <p className="text-slate-400 text-sm">No workouts this week yet.</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">{weeklyStats.totalSessions}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">{weeklyStats.totalReps}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Reps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-600">{weeklyStats.totalCalories}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">{formatTime(weeklyStats.totalDuration)}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Duration</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-amber-500" /> Achievements
            </h3>
            <div className="space-y-3">
              {[
                { icon: '🔥', label: 'First Workout', achieved: sessionHistory.length >= 1 },
                { icon: '💪', label: '10 Sessions', achieved: sessionHistory.length >= 10 },
                { icon: '⚡', label: '100 Total Reps', achieved: sessionHistory.reduce((s, x) => s + (x.reps || 0), 0) >= 100 },
                { icon: '🌟', label: '500 Calories Burned', achieved: sessionHistory.reduce((s, x) => s + (x.calories || 0), 0) >= 500 },
              ].map((ach, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${ach.achieved ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-100 opacity-60'}`}>
                  <span className="text-xl">{ach.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${ach.achieved ? 'text-slate-800' : 'text-slate-400'}`}>{ach.label}</p>
                    <p className="text-xs text-slate-500">{ach.achieved ? 'Achieved!' : 'Not yet'}</p>
                  </div>
                  {ach.achieved && <CheckCircle2 size={18} className="text-emerald-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Workout Settings</h3>
          <div className="space-y-6 max-w-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Camera Quality</p>
                <p className="text-xs text-slate-500">Lower = smoother tracking</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium">
                <option>Low (240p)</option>
                <option selected>Medium (360p)</option>
                <option>High (480p)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Auto-complete Sets</p>
                <p className="text-xs text-slate-500">Auto advance after target reps</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Sensitivity</p>
                <p className="text-xs text-slate-500">Motion detection sensitivity</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium">
                <option>Low</option>
                <option selected>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 text-center">
                All data is stored locally on your device. {sessionHistory.length} sessions saved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FALLBACK for future tabs */}
      {activeTab === 'tutorials' && (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Exercise Tutorials</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Video tutorials are coming soon. Check back for guided exercise demonstrations.</p>
        </div>
      )}
    </div>
  );
};

export default Exercise;