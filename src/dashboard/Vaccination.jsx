import React, { useState, useMemo } from 'react';
import { Syringe, Plus, Calendar as CalendarIcon, Check, Clock, AlertCircle, Loader2, Shield, Heart, Users, ChevronRight, Bell } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Vaccination = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('personal');
  const [personalForm, setPersonalForm] = useState({ name: '', age: '', gender: 'any' });
  const [personalSchedule, setPersonalSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyForm, setFamilyForm] = useState({ name: '', age: '', gender: 'any' });

  const history = [
    { id: 1, name: "COVID-19 (Pfizer)", dose: "Booster 1", date: "Jan 10, 2023", status: "Completed", facility: "City Center Clinic" },
    { id: 2, name: "Influenza", dose: "Annual 2022", date: "Oct 15, 2022", status: "Completed", facility: "Main Street Pharmacy" },
    { id: 3, name: "Tetanus, Diphtheria, Pertussis (Tdap)", dose: "Dose 1", date: "Mar 05, 2018", status: "Completed", facility: "General Hospital" },
  ];

  const upcoming = useMemo(() => {
    let base = [
      { id: 4, name: "Influenza (Annual)", dose: "Annual 2024", dueDate: "Oct 15, 2024", priority: "High" },
      { id: 5, name: "Hepatitis B", dose: "Dose 3", dueDate: "Dec 10, 2024", priority: "Medium" },
    ];
    if (user?.age >= 60) {
      base.push({ id: 6, name: "Pneumococcal Polysaccharide", dose: "PPSV23", dueDate: "Immediate", priority: "Critical" });
      base.push({ id: 7, name: "Shingles (Zoster)", dose: "Shingrix 1", dueDate: "Immediate", priority: "High" });
    }
    return base;
  }, [user]);

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const age = parseInt(personalForm.age);
    // Simulate API call
    setTimeout(() => {
      setPersonalSchedule({
        upcoming: [
          { id: 'p1', vaccine: 'Influenza (Annual)', dueDate: '2024-10-15', dose: 'Annual' },
          { id: 'p2', vaccine: 'Hepatitis B', dueDate: '2024-12-10', dose: 'Dose 3' },
        ],
        recent: [
          { id: 'r1', vaccine: 'Tetanus', dueDate: '2023-05-20', dose: 'Booster', status: 'Completed' },
          { id: 'r2', vaccine: 'COVID-19', dueDate: '2023-01-15', dose: 'Booster', status: 'Completed' },
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    const newMember = { id: Date.now(), ...familyForm, age: parseInt(familyForm.age) };
    setFamilyMembers([...familyMembers, newMember]);
    setFamilyForm({ name: '', age: '', gender: 'any' });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Syringe className="text-teal-600" size={28} /> Vaccination Tracker
          </h2>
          <p className="text-slate-500 text-sm">Manage personal and family vaccination schedules.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all text-sm">
          <Plus size={18} /> Add Record
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm">
        {[
          { id: "personal", label: "Personal", icon: Shield },
          { id: "family", label: "Family", icon: Users }
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

      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Details Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Personal Details</h3>
              <p className="text-xs text-slate-500 mb-6">Enter your information to generate a personalised vaccination schedule.</p>
              
              <form onSubmit={handlePersonalSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Name</label>
                  <input
                    value={personalForm.name}
                    onChange={(e) => setPersonalForm({...personalForm, name: e.target.value})}
                    placeholder="e.g. Riya Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Age (years)</label>
                  <input
                    type="number"
                    value={personalForm.age}
                    onChange={(e) => setPersonalForm({...personalForm, age: e.target.value})}
                    placeholder="e.g. 30"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Gender</label>
                  <select
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm({...personalForm, gender: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="any">Any / Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isLoading ? 'Generating...' : 'Generate Schedule'}
                </button>
              </form>
            </div>
          </div>

          {/* Schedule Display */}
          <div className="lg:col-span-2 space-y-6">
            {!personalSchedule && !isLoading && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg mb-4">Your Vaccination Plan</h3>
                <p className="text-slate-500 text-sm">Enter your age and gender above to generate a tailored vaccination schedule.</p>
              </div>
            )}
            
            {isLoading && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 size={32} className="text-teal-500 animate-spin mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Generating personalised vaccination plan...</p>
                </div>
              </div>
            )}

            {personalSchedule && !isLoading && (
              <>
                {/* Upcoming Vaccines */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-amber-500" /> Upcoming Vaccines
                  </h3>
                  <div className="space-y-4">
                    {personalSchedule.upcoming.map(v => (
                      <div key={v.id} className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="bg-amber-100 text-amber-600 p-2 rounded-xl mt-1">
                          <Syringe size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{v.vaccine}</h4>
                          <p className="text-sm text-slate-500">{v.dose}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-amber-600 bg-amber-100 inline-flex px-3 py-1 rounded-full">
                            <CalendarIcon size={12} /> Due: {v.dueDate}
                          </div>
                        </div>
                        <button className="text-teal-600 hover:bg-teal-50 p-2 rounded-xl transition-all">
                          <Bell size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Vaccines */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <Check size={20} className="text-emerald-500" /> Recent Vaccines (Past 2 Years)
                  </h3>
                  <div className="space-y-4">
                    {personalSchedule.recent.map(v => (
                      <div key={v.id} className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl mt-1">
                          <Check size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{v.vaccine}</h4>
                          <p className="text-sm text-slate-500">{v.dose} • {v.dueDate}</p>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">Completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Vaccination History */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Immunization History</h3>
              <div className="space-y-0">
                {history.map((record, index) => (
                  <div key={record.id} className={`flex items-start gap-4 p-4 ${index !== history.length - 1 ? 'border-b border-slate-100' : ''}`}>
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
        </div>
      )}

      {activeTab === 'family' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg mb-2">Add Family Member</h3>
              <p className="text-xs text-slate-500 mb-6">Track vaccinations for everyone in your family.</p>
              <form onSubmit={handleAddFamilyMember} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Name</label>
                  <input
                    value={familyForm.name}
                    onChange={(e) => setFamilyForm({...familyForm, name: e.target.value})}
                    placeholder="e.g. Aarav"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Age (years)</label>
                  <input
                    type="number"
                    value={familyForm.age}
                    onChange={(e) => setFamilyForm({...familyForm, age: e.target.value})}
                    placeholder="e.g. 11"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Gender</label>
                  <select
                    value={familyForm.gender}
                    onChange={(e) => setFamilyForm({...familyForm, gender: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="any">Any</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all text-sm">
                  Add Member
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            {familyMembers.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
                <Users size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700 text-lg mb-2">No Family Members Yet</h3>
                <p className="text-slate-500 text-sm">Add your loved ones to manage everyone's vaccinations in one place.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {familyMembers.map(member => (
                  <div key={member.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{member.name}</h3>
                        <p className="text-xs text-slate-500">Age: {member.age} • {member.gender}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Schedule will appear when backend is connected.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smart Predictions Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Heart size={20} className="text-blue-600" /> Smart Predictions
        </h3>
        <p className="text-slate-600 text-sm">
          Your profile is synced. Our predictive algorithms adjust CDC-bound recommendations based on your age and medical history.
          {user?.age >= 60 && " Age 60+ vaccines (Pneumococcal, Shingles) have been automatically added."}
        </p>
      </div>
    </div>
  );
};

export default Vaccination;