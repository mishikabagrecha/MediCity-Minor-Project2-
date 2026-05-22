import React, { useState, useRef } from 'react';
import { Video, Calendar, Star, FileText, Download, PhoneOff, Mic, MicOff, Camera, CameraOff, Search, Clock, MapPin, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Consultation = () => {
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
    { id: 1, name: "Dr. Sarah Jenkins", spec: "Cardiologist", exp: "15 yrs", rating: 4.9, img: "https://i.pravatar.cc/150?img=5", available: true },
    { id: 2, name: "Dr. Alan Smith", spec: "General Physician", exp: "8 yrs", rating: 4.7, img: "https://i.pravatar.cc/150?img=11", available: true },
    { id: 3, name: "Dr. Emily Chen", spec: "Dermatologist", exp: "12 yrs", rating: 4.8, img: "https://i.pravatar.cc/150?img=9", available: false },
    { id: 4, name: "Dr. Meera Sharma", spec: "Dermatologist", exp: "10 yrs", rating: 4.9, img: "https://i.pravatar.cc/150?img=10", available: true },
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
    // mock success
    alert("Appointment confirmed!");
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    
    try {
      // Small delay to ensure state update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Medical_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (activeCall) {
    return (
      <div className="h-[80vh] bg-slate-900 rounded-3xl overflow-hidden relative flex flex-col">
        {/* Main Video Area (Doctor) */}
        <div className="flex-1 bg-slate-800 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40"></div>
          <div className="z-10 text-white text-center">
             <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-900 overflow-hidden shadow-2xl shadow-teal-500/20">
                <img src={selectedDoctor?.img || "https://i.pravatar.cc/150?img=5"} alt="Doctor" className="w-full h-full object-cover" />
             </div>
             <h2 className="text-3xl font-bold mb-2 shadow-sm">{selectedDoctor?.name || "Dr. Sarah Jenkins"}</h2>
             <p className="text-slate-300 font-medium tracking-widest text-lg bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm inline-block">04:12</p>
          </div>
        </div>

        {/* Self Video (PiP) */}
        <div className="absolute top-6 right-6 w-48 h-64 bg-slate-700 rounded-2xl border-2 border-slate-600 overflow-hidden shadow-2xl">
           {camOn ? (
             <div className="w-full h-full bg-slate-600 flex items-center justify-center">
                <span className="text-slate-400">Camera Active</span>
             </div>
           ) : (
             <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
               <CameraOff size={32} />
             </div>
           )}
        </div>

        {/* Controls */}
        <div className="h-28 bg-gradient-to-t from-slate-950 to-slate-900 flex items-center justify-center gap-6 border-t border-slate-800/50">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${micOn ? 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-900/50' : 'bg-rose-500 text-white shadow-rose-500/20'}`}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button 
            onClick={() => setCamOn(!camOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${camOn ? 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-900/50' : 'bg-rose-500 text-white shadow-rose-500/20'}`}
          >
            {camOn ? <Camera size={24} /> : <CameraOff size={24} />}
          </button>
          <button 
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white ml-8 shadow-xl shadow-rose-600/30 transition-transform hover:scale-105"
          >
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
            <h2 className="text-3xl font-bold mb-2">Automated Report Generated</h2>
            <p className="text-teal-100 text-lg">Your consultation with {selectedDoctor?.name || 'Dr. Sarah Jenkins'} has concluded.</p>
            <div className="absolute top-8 right-8">
               <button 
                 onClick={downloadPDF}
                 disabled={isGeneratingPdf}
                 className="flex items-center gap-2 bg-white text-teal-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
               >
                 {isGeneratingPdf ? 'Generating...' : <><Download size={20} /> Download PDF</>}
               </button>
            </div>
          </div>
        </div>

        {/* The PDF Container to be Captured */}
        <div className="bg-white shadow-xl max-w-[210mm] mx-auto hidden-scrollbar overflow-x-auto">
          <div 
             ref={reportRef} 
             className="w-[210mm] min-h-[297mm] p-[20mm] bg-white text-slate-800 font-sans"
             style={{ boxSizing: 'border-box' }}
          >
             {/* Report Header */}
             <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
               <div>
                 <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Medi<span className="text-teal-600">Bridge</span></h1>
                 <p className="text-sm text-slate-500 font-mono tracking-widest uppercase">Medical Consultation Report</p>
               </div>
               <div className="text-right text-sm text-slate-600">
                 <p className="font-bold text-slate-900">{selectedDoctor?.name || "Dr. Sarah Jenkins"}</p>
                 <p>{selectedDoctor?.spec || "Cardiology"}</p>
                 <p className="text-slate-400">Reg. No: 48921-MB</p>
               </div>
             </div>

             {/* Patient Info */}
             <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 flex flex-wrap gap-8">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Patient Name</p>
                  <p className="text-lg font-bold text-slate-800">Hemant Raghuwanshi</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Date</p>
                  <p className="text-lg font-bold text-slate-800">{new Date().toISOString().split('T')[0]}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Patient ID</p>
                  <p className="text-lg font-bold text-slate-800">MB-99321-HR</p>
                </div>
             </div>

             {/* Sections */}
             <div className="space-y-8">
               
               <section>
                 <h3 className="text-sm font-bold text-teal-700 uppercase tracking-widest border-b border-teal-200 pb-2 mb-4">Intelligent Summary</h3>
                 <p className="text-slate-700 leading-relaxed italic border-l-4 border-slate-200 pl-4 py-2">
                   "This summary was generated by AI based on the consultation transcript. The patient presented with abdominal discomfort triggered by recent dietary changes."
                 </p>
               </section>

               <section>
                 <h3 className="text-sm font-bold text-teal-700 uppercase tracking-widest border-b border-teal-200 pb-2 mb-4">Medical Consultation Summary</h3>
                 
                 <div className="space-y-6">
                   <div>
                     <h4 className="font-bold text-slate-900 mb-1 text-base flex items-center gap-2">Key Symptoms Presented</h4>
                     <p className="text-slate-700 leading-relaxed font-serif text-lg">
                       The patient is experiencing a stomach-related issue, likely abdominal pain or discomfort. The condition appears to be triggered or worsened by diet.
                     </p>
                   </div>

                   <div>
                     <h4 className="font-bold text-slate-900 mb-1 text-base flex items-center gap-2">Doctor's Diagnosis</h4>
                     <p className="text-slate-700 leading-relaxed font-serif text-lg">
                       The doctor attributes the patient's stomach problem directly to their dietary habits, specifically the consumption of "गलत सतत खाना" (improper/unhealthy food), such as overly spicy or fried items.
                     </p>
                   </div>

                   <div>
                     <h4 className="font-bold text-slate-900 mb-3 text-base flex items-center gap-2">Recommended Treatment Plan</h4>
                     <ul className="space-y-4">
                       <li className="flex items-start gap-4">
                         <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</div>
                         <div>
                           <span className="font-bold text-slate-900">Dietary Modification:</span>
                           <span className="text-slate-700 font-serif text-lg ml-2">The patient is advised to avoid spicy ("मसालेदार") and fried ("तला भुना") foods.</span>
                         </div>
                       </li>
                       <li className="flex items-start gap-4">
                         <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</div>
                         <div>
                           <span className="font-bold text-slate-900 mb-2 block">Medication:</span>
                           <div className="bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm space-y-3">
                              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <div>
                                  <span className="font-bold text-slate-900 text-base">Syrup Antacid Gel</span>
                                  <p className="text-slate-500 text-xs">For immediate relief of symptoms</p>
                                </div>
                                <span className="px-3 py-1 bg-slate-200 rounded font-bold text-slate-700">10ml - twice daily</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-bold text-slate-900 text-base">Homeopathy Alternative</span>
                                  <p className="text-slate-500 text-xs">Suggested as a possible line of treatment</p>
                                </div>
                                <span className="px-3 py-1 bg-slate-200 rounded font-bold text-slate-700">As prescribed</span>
                              </div>
                           </div>
                         </div>
                       </li>
                     </ul>
                   </div>
                 </div>
               </section>

             </div>

             {/* Signature Block */}
             <div className="mt-24 pt-8 flex justify-end">
                <div className="text-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-16 mx-auto mb-2 opacity-70" />
                  <div className="w-48 border-t border-slate-800 pt-2 mx-auto"></div>
                  <p className="font-bold text-slate-900 mt-2">{selectedDoctor?.name || "Dr. Sarah Jenkins"}</p>
                  <p className="text-sm text-slate-500">{selectedDoctor?.spec || "Cardiology"}</p>
                </div>
             </div>

             {/* Footer */}
             <div className="mt-16 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
               <p>This is a digitally generated document using AI assisted transcription. For any discrepancies, please reach out to MediCity India Support.</p>
               <p className="mt-1">Generated electronically on {new Date().toLocaleString()}</p>
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
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">MediCity India - Find Doctors</h2>
        <p className="text-slate-500 mt-2">Browse by specialisation and book appointments instantly.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex space-x-2 overflow-x-auto w-full hidden-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all ${
                category === cat 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search doctors..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
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
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{doctor.name}</h3>
                  <p className="text-sm font-semibold text-teal-600 mb-2">{doctor.spec}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium bg-slate-50 inline-flex px-2.5 py-1 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500" /> {doctor.rating}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{doctor.exp} experience</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => { if(doctor.available) { setSelectedDoctor(doctor); setActiveCall(true); } }}
                disabled={!doctor.available}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  doctor.available 
                    ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800 hover:shadow-lg' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Video size={18} /> Join Now
              </button>
              <button 
                onClick={() => handleBooking(doctor)}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 shadow-sm hover:shadow"
              >
                <Calendar size={18} /> Book Later
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowBookingModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl relative z-10 w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Confirm details</h3>
                <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
              </div>
              <div className="px-6 py-4 bg-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0"><img src={selectedDoctor?.img} alt="" className="w-full h-full object-cover" /></div>
                <div>
                  <p className="text-xs text-slate-500">{selectedDoctor?.spec} • {selectedDoctor?.exp}</p>
                  <p className="font-bold text-slate-900">{selectedDoctor?.name}</p>
                </div>
              </div>
              <form onSubmit={confirmBooking} className="p-6 pt-2 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Selected slot</label>
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-teal-500">10:00 AM</button>
                    <button type="button" className="flex-1 py-2 text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-600/20 border-blue-600 rounded-lg">12:00 PM</button>
                    <button type="button" className="flex-1 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-teal-500">04:30 PM</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                  <input required type="text" defaultValue="Hemant Raghuwanshi" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input required type="email" defaultValue="hemant@example.com" className="w-full px-4 py-3 rounded-xl border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors mt-2">
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
