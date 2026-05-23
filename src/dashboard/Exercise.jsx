import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Activity, Plus, CheckCircle2, ChevronRight, AlertCircle, Camera, CameraOff, RefreshCw, Dumbbell, Target, Zap, Loader2, Award } from 'lucide-react';

const Exercise = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [isActive, setIsActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [setCount, setSetCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(90);
  const [poseDetected, setPoseDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('bicep-curl');
  const [postureScore, setPostureScore] = useState(92);
  const [repState, setRepState] = useState('detecting');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const lastRepTimeRef = useRef(0);
  const durationRef = useRef(null);
  const mockAngleRef = useRef(160);
  const angleDirectionRef = useRef(1);
  const repStateRef = useRef('detecting');
  
  const exercises = [
    { id: 'bicep-curl', name: 'Bicep Curls', target: '3 sets × 12 reps', icon: '💪', color: 'blue' },
    { id: 'squat', name: 'Squats', target: '3 sets × 15 reps', icon: '🦵', color: 'emerald' },
    { id: 'shoulder-press', name: 'Shoulder Press', target: '3 sets × 10 reps', icon: '🏋️', color: 'purple' },
    { id: 'jumping-jack', name: 'Jumping Jacks', target: '3 sets × 20 reps', icon: '🤸', color: 'amber' },
  ];

  // Load MediaPipe dynamically
  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        const scripts = [
          'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js'
        ];
        for (const src of scripts) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        setIsLoaded(true);
      } catch (error) {
        console.warn('MediaPipe CDN load failed, using fallback mode:', error);
        setIsLoaded(true);
      }
    };
    loadMediaPipe();
  }, []);

  // Calculate angle between three points
  const calculateAngle = useCallback((a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  }, []);

  // Camera handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraPermission(true);
        setIsActive(true);
        startTimer();
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraPermission(false);
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    stopTimer();
  };

  const startTimer = () => {
    durationRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (durationRef.current) {
      clearInterval(durationRef.current);
      durationRef.current = null;
    }
  };

  // Simulated rep detection for demo
  useEffect(() => {
    if (!isActive) return;
    
    mockAngleRef.current = 160;
    angleDirectionRef.current = 1;
    repStateRef.current = 'detecting';
    setRepState('detecting');
    
    const interval = setInterval(() => {
      mockAngleRef.current += angleDirectionRef.current * 3;
      if (mockAngleRef.current > 170) angleDirectionRef.current = -1;
      if (mockAngleRef.current < 30) angleDirectionRef.current = 1;
      
      setCurrentAngle(mockAngleRef.current);
      setPoseDetected(true);

      if (mockAngleRef.current < 50 && repStateRef.current !== 'down') {
        repStateRef.current = 'down';
        setRepState('down');
      } else if (mockAngleRef.current > 150 && repStateRef.current === 'down') {
        repStateRef.current = 'up';
        setRepState('up');
        setRepCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 12) {
            setSetCount(s => s + 1);
            return 0;
          }
          return newCount;
        });
        setTimeout(() => {
          repStateRef.current = 'detecting';
          setRepState('detecting');
        }, 300);
      }
      
      const score = Math.floor(70 + Math.random() * 25);
      setPostureScore(score);
    }, 200);

    return () => clearInterval(interval);
  }, [isActive]); // Only depend on isActive, not repState

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    stopCamera();
    setRepCount(0);
    setSetCount(0);
    setDuration(0);
    setCurrentAngle(90);
    setPoseDetected(false);
    setRepState('detecting');
    setPostureScore(92);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in duration-500 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-slate-900 leading-tight flex items-center gap-3">
            <Dumbbell className="text-emerald-600" size={32} />
            Exercise Guidance
          </h1>
          <p className="text-slate-500 text-sm mt-1">Follow along, track your posture, and stay fit!</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
            {isActive ? 'Session Active' : 'Session not started'}
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-slate-200">
        {['overview', 'live', 'tutorials', 'history', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold capitalize transition-colors ${
              activeTab === tab ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
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
                    <Camera size={16} /> Start Camera
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

            {/* Video Area */}
            <div className="bg-slate-50 rounded-2xl flex-1 relative min-h-[400px] border border-slate-200 overflow-hidden">
              {cameraPermission === false ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100">
                  <CameraOff size={48} className="text-slate-400 mb-4" />
                  <p className="text-slate-600 font-bold mb-2">Camera Access Denied</p>
                  <p className="text-slate-400 text-sm mb-4 text-center max-w-xs">Please allow camera access in your browser settings to use real-time pose detection.</p>
                  <button
                    onClick={startCamera}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay playsInline muted
                    style={{ display: isActive ? 'block' : 'none' }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ display: isActive && poseDetected ? 'block' : 'none', zIndex: 10 }}
                  />
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera size={64} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Camera Off</p>
                        <p className="text-slate-400 text-sm mt-2">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  )}
                  {isActive && !poseDetected && (
                    <div className="absolute top-4 left-4 bg-amber-500/90 text-white px-4 py-2 rounded-xl text-sm font-bold">
                      Position yourself in frame...
                    </div>
                  )}
                  {isActive && poseDetected && (
                    <div className="absolute top-4 left-4 space-y-2">
                      <div className="bg-emerald-500/90 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                        ✅ Pose Detected
                      </div>
                      <div className="bg-blue-500/90 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                        Angle: {currentAngle.toFixed(0)}°
                      </div>
                      <div className="bg-purple-500/90 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                        Stage: {repState}
                      </div>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-xl max-w-xs backdrop-blur-sm">
                      <div className="text-sm font-bold mb-1">💪 Instructions:</div>
                      <div className="text-xs opacity-80">
                        • Keep elbows at your sides<br/>
                        • Full extension to full curl<br/>
                        • Controlled movements
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 pt-6 mt-6 border-t border-slate-100">
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reps</p>
                <p className="text-3xl font-black text-slate-800">{repCount}</p>
                <p className="text-xs text-slate-400 mt-1">/ 12</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sets</p>
                <p className="text-3xl font-black text-slate-800">{setCount}</p>
                <p className="text-xs text-slate-400 mt-1">/ 3</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                <p className="text-3xl font-black text-slate-800">{formatTime(duration)}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Posture Score</p>
                <p className="text-3xl font-black text-emerald-600">{postureScore}%</p>
              </div>
            </div>
          </div>

          {/* EXERCISE INFO */}
          <div className="w-full xl:w-[35%] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Exercise Instructions</h2>
                <div className="flex gap-2 mt-2">
                  {exercises.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExercise(ex.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedExercise === ex.id
                          ? `bg-${ex.color}-100 text-${ex.color}-800 border border-${ex.color}-200`
                          : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ex.icon} {ex.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Exercise Details */}
            {exercises.filter(e => e.id === selectedExercise).map(ex => (
              <div key={ex.id}>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-6 border border-slate-200 text-center">
                  <div className="text-6xl mb-3">{ex.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900">{ex.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">Target: {ex.target}</p>
                  {isActive && (
                    <div className="mt-4 flex justify-center gap-4">
                      <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold">
                        <Target size={16} className="inline mr-1" /> {repCount}/{12} reps
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl text-sm font-bold">
                        <Award size={16} className="inline mr-1" /> {setCount}/3 sets
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Tips:</h4>
                  <ul className="space-y-3">
                    {ex.id === 'bicep-curl' && (
                      <>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Engage your core throughout</li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Keep elbows pinned to sides</li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Control the movement - no swinging</li>
                      </>
                    )}
                    {ex.id === 'squat' && (
                      <>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Keep back straight</li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Knees behind toes</li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Drive through heels</li>
                      </>
                    )}
                    {(ex.id !== 'bicep-curl' && ex.id !== 'squat') && (
                      <>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Maintain proper form</li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Breathe steadily throughout</li>
                        <li className="flex items-center gap-2 text-sm text-slate-600 font-medium"><div className="w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>Stop if you feel pain</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 mt-auto">
              {!isActive ? (
                <button
                  onClick={startCamera}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-emerald-500/30 transition-all hover:scale-105 flex-1 text-center flex items-center justify-center gap-2"
                >
                  <Play size={20} /> Start Demo
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-rose-500/30 transition-all hover:scale-105 flex-1 text-center flex items-center justify-center gap-2"
                >
                  <Square size={20} /> End Session
                </button>
              )}
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors text-center border border-slate-200">
                More
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exercises.map(ex => (
            <div key={ex.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="text-4xl mb-4">{ex.icon}</div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{ex.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{ex.target}</p>
              <button
                onClick={() => { setSelectedExercise(ex.id); setActiveTab('live'); }}
                className="text-teal-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Start Exercise <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tutorials' && (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Exercise Tutorials</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Video tutorials are coming soon. Check back for guided exercise demonstrations.</p>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Workout History</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Your exercise history will appear here after your first session.</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Exercise Settings</h3>
          <div className="space-y-6 max-w-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Audio Guidance</p>
                <p className="text-xs text-slate-500">Voice cues for rep counting</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Camera Mirror</p>
                <p className="text-xs text-slate-500">Mirror the camera view</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise;