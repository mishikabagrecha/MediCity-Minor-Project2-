import React, { useMemo } from 'react';
import { Syringe, Plus, Calendar as CalendarIcon, Check, Clock, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Vaccination = () => {
  const { user } = useUser();
  const history = [
    { id: 1, name: "COVID-19 (Pfizer)", dose: "Booster 1", date: "Jan 10, 2023", status: "Completed", facility: "City Center Clinic" },
    { id: 2, name: "Influenza", dose: "Annual 2022", date: "Oct 15, 2022", status: "Completed", facility: "Main Street Pharmacy" },
    { id: 3, name: "Tetanus, Diphtheria, Pertussis (Tdap)", dose: "Dose 1", date: "Mar 05, 2018", status: "Completed", facility: "General Hospital" },
  ];

  const upcoming = useMemo(() => {
    let base = [
      { id: 4, name: "Influenza (Annual Drop)", dose: "Annual 2024", dueDate: "Oct 15, 2024", priority: "High" },
      { id: 5, name: "Hepatitis B", dose: "Dose 3", dueDate: "Dec 10, 2024", priority: "Medium" },
    ];
    
    // Smart Predictor
    if (user?.age >= 60) {
      base.push({ id: 6, name: "Pneumococcal Polysaccharide", dose: "PPSV23 Base", dueDate: "Immediate", priority: "Critical Age Bound" });
      base.push({ id: 7, name: "Shingles (Zoster)", dose: "Shingrix 1", dueDate: "Immediate", priority: "High" });
    }
    
    if (user?.medical_history?.chronic_conditions?.toLowerCase().includes("diabetes")) {
      base.push({ id: 8, name: "Hepatitis B (Diabetes Bound)", dose: "Endo Track 1", dueDate: "Next Month", priority: "Critical Condition Bound" });
    }
    
    return base;
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vaccination Records</h2>
          <p className="text-slate-500 text-sm">Track your immunization history and upcoming doses.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
          <Plus size={20} />
          Add Record
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Immunization History</h3>
            </div>
            <div className="p-0">
              {history.map((record, index) => (
                <div key={record.id} className={`p-5 flex items-start gap-4 ${index !== history.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl mt-1">
                    <Check size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h4 className="font-bold text-slate-900">{record.name}</h4>
                      <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded-full text-slate-500">{record.date}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mt-1">{record.dose}</p>
                    <p className="text-xs text-slate-400 mt-1">{record.facility}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-orange-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-orange-500" /> Upcoming Doses
              </h3>
            </div>
            <div className="p-0">
              {upcoming.map((vaccine, index) => (
                <div key={vaccine.id} className={`p-5 flex items-start gap-3 ${index !== upcoming.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-xl mt-1">
                    <Syringe size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">{vaccine.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{vaccine.dose}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-bold text-orange-600 bg-orange-50 inline-flex px-2 py-1 rounded">
                      <CalendarIcon size={12} /> {vaccine.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-slate-800 mb-2">Age Bracket Synced</h3>
            <p className="text-slate-600 text-sm mb-4">Your profile lists you at exactly <strong>{user?.age || '--'} years old</strong>. Our predictive algorithms have adjusted the CDC-bound recommendations above accordingly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaccination;
