import React, { useState, useRef } from 'react';
import { Video, Calendar, Star, FileText, Download, PhoneOff, Mic, MicOff, Camera, CameraOff, Search, Clock, MapPin, CheckCircle, Users, Plus, Trash2, User, Phone, Mail, BadgeCheck, Filter, ChevronRight, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Consultation = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [activeCall, setActiveCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [category, setCategory] = useState("All");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const reportRef = useRef(null);

  const categories = ["All", "Pediatrician", "Dermatologist", "Cardiologist", "General Physician", "Gynecologist", "Orthopedic"];

  const doctors = [
    { id: 1, name: "Dr. Sarah Jenkins", spec: "Cardiologist", exp: "15 yrs", rating: 4.9, reviews: 128, img: "https://i.pravatar.cc/150?img=5", available: true, hospital: "City Heart Institute", education: "AIIMS Delhi", languages: ["English", "Hindi"] },
    { id: 2, name: "Dr. Alan Smith", spec: "General Physician", exp: "8 yrs", rating: 4.7, reviews: 95, img: "https://i.pravatar.cc/150?img=11", available: true, hospital: "MediCare General Hospital", education: "PGI Chandigarh", languages: ["English"] },
    { id: 3, name: "Dr. Emily Chen", spec: "Dermatologist", exp: "12 yrs", rating: 4.8, reviews: 210, img: "https://i.pravatar.cc/150?img=9", available: false, hospital: "Skin & Laser Clinic", education: "KEM Mumbai", languages: ["English", "Chinese"] },
    { id: 4, name: "Dr. Meera Sharma", spec: "Dermatologist", exp: "10 yrs", rating: 4.9, reviews: 180, img: "https://i.pravatar.cc/150?img=10", available: true, hospital: "Advanced Dermatology Center", education: "MAHE Manipal", languages: ["English", "Hindi", "Marathi"] },
    { id: 5, name: "Dr. Rajesh Kumar", spec: "Pediatrician", exp: "14 yrs", rating: 4.8, reviews: 250, img: "https://i.pravatar.cc/150?img=12", available: true, hospital: "Children's Health Institute", education: "CMC Vellore", languages: ["English", "Hindi"] },
    { id: 6, name: "Dr. Priya Patel", spec: "Gynecologist", exp: "11 yrs", rating: 4.9, reviews: 195, img: "https://i.pravatar.cc/150?img=20", available: true, hospital: "Women's Care Center", education: "AIIMS Delhi", languages: ["English", "Hindi", "Gujarati"] },
  ];

  const filteredDoctors = category === "All" ? doctors : doctors.filter(d => d.spec === category);

  const handleEndCall = () => {
    setActiveCall(false);
    setShowSummary(true);
  };

  const handleBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    setShowBookingModal(false);
    alert("Appointment confirmed! A confirmation has been sent to your email.");
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Medical_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (activeCall) {
    return (
      <div className="h-[80vh] bg-slate-900 rounded-3xl overflow-hidden relative flex flex-col shadow-2xl border border-slate-800">
        <div className="flex-1 bg-slate-800 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950"></div>
          <div className="z-10 text-white text-center">
            <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-900 overflow-hidden shadow-2xl shadow-teal-500/20">
              <img src={selectedDoctor?.img || "https://i.pravatar.cc/150?img=5"} alt="Doctor" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{selectedDoctor?.name || "Dr. Sarah Jenkins"}</h2>
            <p className="text-teal-400 font-medium">{selectedDoctor?.spec || "Cardiology"}</p>
          </div>
        </div>
        <div className="absolute top-6 right-6 w-48 h-64 bg-slate-700 rounded-2xl border-2 border-slate-600 overflow-hidden shadow-2xl">
          {camOn ? (
            <div className="w-full h-full bg-slate-600 flex items-center justify-center"><span className="text-slate-400">You</span></div>
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500"><CameraOff size={32} /></div>
          )}
        </div>
        <div className="h-28 bg-gradient-to-t from-slate-950 to-slate-900 flex items-center justify-center gap-6 border-t border-slate-800/50">
          <button onClick={() => setMicOn(!micOn)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${micOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-rose-500 text-white'}`}>
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button onClick={() => setCamOn(!camOn)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${camOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-rose-500 text-white'}`}>
            {camOn ? <Camera size={24} /> : <CameraOff size={24} />}
          </button>
          <button onClick={handleEndCall} className="w-16 h-16 rounded-full flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white ml-8 shadow-xl shadow-rose-600/30 transition-transform hover:scale-105">
            <PhoneOff size={28} />
          </button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-t-3xl shadow-sm overflow-hidden border border-slate-200">
          <div className="bg-gradient-to-r from-teal-600 to-blue-700 p-8 text-white relative">
            <h2 className="text-3xl font-bold mb-2">Consultation Report</h2>
            <p className="text-teal-100 text-lg">Your consultation with {selectedDoctor?.name || 'Dr. Sarah Jenkins'} has concluded.</p>
            <div className="absolute top-8 right-8">
              <button onClick={downloadPDF} disabled={isGeneratingPdf} className="flex items-center gap-2 bg-white text-teal-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                {isGeneratingPdf ? <Loader2 size={20} className="animate-spin" /> : <><Download size={20} /> Download PDF</>}
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
          <div ref={reportRef} className="p-[20mm] bg-white text-slate-800 font-sans">
            <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Medi<span className="text-teal-600">City</span></h1>
                <p className="text-sm text-slate-500 font-mono tracking-widest uppercase">Medical Consultation Report</p>
              </div>
              <div className="text-right text-sm text-slate-600">
                <p className="font-bold text-slate-900">{selectedDoctor?.name || "Dr. Sarah Jenkins"}</p>
                <p>{selectedDoctor?.spec || "Cardiology"}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 flex flex-wrap gap-8">
              <div><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Patient</p><p className="text-lg font-bold text-slate-800">Patient Name</p></div>
              <div><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Date</p><p className="text-lg font-bold text-slate-800">{new Date().toISOString().split('T')[0]}</p></div>
              <div><p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Consultation ID</p><p className="text-lg font-bold text-slate-800">MC-{Date.now().toString(36)}</p></div>
            </div>
            <div className="space-y-6">
              <section><h3 className="text-sm font-bold text-teal-700 uppercase tracking-widest border-b border-teal-200 pb-2 mb-4">Consultation Summary</h3>
                <p className="text-slate-700 leading-relaxed">This summary was generated based on the consultation transcript. The patient presented with health concerns and received professional medical advice from the attending physician.</p>
              </section>
              <section><h3 className="text-sm font-bold text-teal-700 uppercase tracking-widest border-b border-teal-200 pb-2 mb-4">Diagnosis & Recommendations</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Initial assessment completed</li>
                  <li>Recommended follow-up tests as discussed</li>
                  <li>Prescription provided for immediate symptoms</li>
                  <li>Follow-up appointment scheduled if needed</li>
                </ul>
              </section>
            </div>
            <div className="mt-24 pt-8 flex justify-end border-t border-slate-100">
              <div className="text-center">
                <div className="w-48 border-t border-slate-800 pt-2">
                  <p className="font-bold text-slate-900 mt-2">{selectedDoctor?.name || "Dr. Sarah Jenkins"}</p>
                  <p className="text-sm text-slate-500">{selectedDoctor?.spec || "Cardiology"}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
              <p>Digitally generated document. For discrepancies, contact MediCity Support.</p>
              <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center py-6">
          <button onClick={() => setShowSummary(false)} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm">
            Return to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Video className="text-teal-600" size={32} /> Doctor Consultation
          </h2>
          <p className="text-slate-500 mt-2">Browse by specialization and book appointments instantly.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <Users size={16} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600">{doctors.filter(d => d.available).length} Available</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm">
        {[
          { id: "browse", label: "Browse Doctors", icon: User },
          { id: "appointments", label: "My Appointments", icon: Calendar }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'browse' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex space-x-2 overflow-x-auto w-full scrollbar-hide py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all ${
                    category === cat ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search doctors..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img src={doctor.img} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${doctor.available ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{doctor.name}</h3>
                      <p className="text-sm font-semibold text-teal-600 mb-1">{doctor.spec}</p>
                      <p className="text-xs text-slate-400 mb-2 truncate">{doctor.hospital}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500" /> {doctor.rating}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{doctor.reviews} reviews</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{doctor.exp}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => { if(doctor.available) { setSelectedDoctor(doctor); setActiveCall(true); } }}
                    disabled={!doctor.available}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      doctor.available ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Video size={18} /> Join Now
                  </button>
                  <button
                    onClick={() => handleBooking(doctor)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 shadow-sm"
                  >
                    <Calendar size={18} /> Book Later
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
          <Calendar size={64} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Appointments Scheduled</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't booked any appointments yet. Browse doctors and book your first consultation.</p>
          <button onClick={() => setActiveTab('browse')} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all">
            Browse Doctors
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowBookingModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl relative z-10 w-full max-w-md overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Confirm Appointment</h3>
                <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
              </div>
              <div className="px-6 py-4 bg-white flex items-center gap-3">
                <img src={selectedDoctor?.img} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-xs text-slate-500">{selectedDoctor?.spec} • {selectedDoctor?.exp}</p>
                  <p className="font-bold text-slate-900">{selectedDoctor?.name}</p>
                </div>
              </div>
              <form onSubmit={confirmBooking} className="p-6 pt-2 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['10:00 AM', '12:00 PM', '04:30 PM'].map((slot, i) => (
                      <button key={slot} type="button" className={`py-2 text-sm font-bold rounded-lg border transition-all ${i === 1 ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-500'}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                  <input required type="text" defaultValue="Patient Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input required type="email" defaultValue="patient@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-sm" />
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-colors mt-2">
                  Confirm Appointment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Consultation;