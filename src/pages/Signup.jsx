import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Activity, HeartPulse, User, MapPin, Pill, ShieldAlert, Landmark, CheckCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { loginUser, updateContacts } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', lastName: '', age: '', gender: '', phone: '', address: '',
    past_diseases: '', chronic_conditions: '', surgeries: '', family_history: '',
    blood_group: '', weight: '', height: '', blood_pressure: '', heart_rate: '',
    medications: '', allergies: '',
    emergency_contacts: [{ name: '', phone: '' }], preferred_hospital: '',
    income: '', category: '', state_province: '',
    email: '', password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.emergency_contacts];
    newContacts[index][field] = value;
    setFormData({...formData, emergency_contacts: newContacts});
  };
  const addContact = () => setFormData({...formData, emergency_contacts: [...formData.emergency_contacts, {name: '', phone: ''}]});
  const removeContact = (idx) => {
    const newContacts = formData.emergency_contacts.filter((_, i) => i !== idx);
    setFormData({...formData, emergency_contacts: newContacts});
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 7) setStep(step + 1);
    else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Persist via Context & LocalStorage globally with expanded shape
        updateContacts(formData.emergency_contacts);
        loginUser({
          name: `${formData.name} ${formData.lastName}`,
          age: parseInt(formData.age),
          gender: formData.gender,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,
          
          medical_history: {
             past_diseases: formData.past_diseases,
             chronic_conditions: formData.chronic_conditions,
             surgeries: formData.surgeries,
             family_history: formData.family_history
          },
          vitals: {
             blood_group: formData.blood_group,
             weight: parseFloat(formData.weight),
             height: parseFloat(formData.height),
             blood_pressure: formData.blood_pressure,
             heart_rate: parseInt(formData.heart_rate),
          },
          medications: formData.medications,
          allergies: formData.allergies,
          contacts: formData.emergency_contacts,
          preferred_hospital: formData.preferred_hospital,
          
          scheme_data: { 
             income: formData.income, 
             category: formData.category, 
             state: formData.state_province 
          }
        });
        navigate('/dashboard');
      }, 1500);
    }
  };

  const steps = [
    { num: 1, title: "Personal", icon: <User size={18}/> },
    { num: 2, title: "Medical", icon: <HeartPulse size={18}/> },
    { num: 3, title: "Vitals", icon: <Activity size={18}/> },
    { num: 4, title: "Rx", icon: <Pill size={18}/> },
    { num: 5, title: "SOS", icon: <ShieldAlert size={18}/> },
    { num: 6, title: "Govt", icon: <Landmark size={18}/> },
    { num: 7, title: "Account", icon: <CheckCircle size={18}/> }
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Build Your Comprehensive Health Profile</h2>
          <p className="text-slate-500">Provide accurate details to supercharge Medina's AI and matchmaking features.</p>
        </div>

        {/* Improved Top Progress Layout */}
        <div className="mb-10 pb-4">
          <div className="flex justify-between items-center relative min-w-[600px] px-4">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 mx-6" />
            <div className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500 mx-6" style={{ width: `${((step - 1) / 6) * 100}%` }} />
            
            {steps.map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center group cursor-default">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${
                  step > s.num ? 'bg-teal-500 border-teal-100 text-white shadow-lg' : 
                  step === s.num ? 'bg-white border-teal-500 text-teal-600 shadow-xl scale-110' : 
                  'bg-white border-slate-100 text-slate-300'
                }`}>
                  {s.icon}
                </div>
                <span className={`text-xs mt-3 font-semibold absolute -bottom-6 w-24 text-center transition-colors ${step >= s.num ? 'text-teal-700' : 'text-slate-400'}`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleNext} className="mt-12 space-y-6 min-h-[350px] flex flex-col">
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                 <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 1: Personal Details</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">First Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow" placeholder="First Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow" placeholder="Last Name" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Age</label>
                    <input name="age" value={formData.age} onChange={handleChange} required type="number" min="0" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="+91" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Full Address <span className="text-xs font-normal text-slate-400 normal-case">(For Ambulance Routing)</span></label>
                  <div className="relative">
                     <MapPin className="absolute top-3 left-3 text-slate-400" size={20} />
                     <input name="address" value={formData.address} onChange={handleChange} required type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="123 Example Street, City, State" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 2: Medical History</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Past Diseases</label>
                  <input name="past_diseases" value={formData.past_diseases} onChange={handleChange} type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="E.g. Jaundice, Dengue, TB..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Chronic Conditions</label>
                  <input name="chronic_conditions" value={formData.chronic_conditions} onChange={handleChange} type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="E.g. Hypertension, Diabetes Type 2..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Past Surgeries (Include Year)</label>
                  <input name="surgeries" value={formData.surgeries} onChange={handleChange} type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="E.g. Appendectomy (2018)" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Family Medical History</label>
                  <input name="family_history" value={formData.family_history} onChange={handleChange} type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="E.g. Mother has Alzheimer's" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 3: Current Health Stats</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Blood Group</label>
                    <select name="blood_group" value={formData.blood_group} onChange={handleChange} required className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500">
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Weight (kg)</label>
                    <input name="weight" value={formData.weight} onChange={handleChange} required type="number" step="0.1" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500" placeholder="65.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Height (cm)</label>
                    <input name="height" value={formData.height} onChange={handleChange} required type="number" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500" placeholder="175" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Heart Rate (bpm)</label>
                    <input name="heart_rate" value={formData.heart_rate} onChange={handleChange} type="number" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500" placeholder="72" />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Latest Blood Pressure</label>
                   <input name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500" placeholder="120/80" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                 <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 4: Medications & Allergies</h3>
                 <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Current Active Medications</label>
                  <textarea name="medications" value={formData.medications} onChange={handleChange} rows="3" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="List medications explicitly (E.g. Metformin 500mg daily)"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Known Allergies</label>
                  <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="3" className="w-full border border-slate-200 bg-rose-50 border-rose-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" placeholder="Identify food or medicine allergies (E.g. Penicillin, Peanuts) to assist AI warnings."></textarea>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 5: Emergency Details</h3>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                   <h4 className="font-bold text-slate-600 mb-4 flex items-center gap-2"><ShieldAlert size={18} /> Emergency SOS Contacts</h4>
                   {formData.emergency_contacts.map((contact, idx) => (
                     <div key={idx} className="flex gap-4 mb-3 items-end">
                       <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Name / Relation</label>
                          <input required value={contact.name} onChange={(e) => handleContactChange(idx, 'name', e.target.value)} type="text" className="w-full border border-slate-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-teal-500" placeholder="Name" />
                       </div>
                       <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Phone</label>
                          <input required value={contact.phone} onChange={(e) => handleContactChange(idx, 'phone', e.target.value)} type="tel" className="w-full border border-slate-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-teal-500" placeholder="+91 XXXXX" />
                       </div>
                       {idx > 0 && <button type="button" onClick={() => removeContact(idx)} className="bg-rose-50 text-rose-500 p-2.5 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors font-bold text-sm">Remove</button>}
                     </div>
                   ))}
                   <button type="button" onClick={addContact} className="text-teal-600 font-bold text-sm mt-2 hover:underline">+ Add another contact</button>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Preferred Hospital / Family Doctor</label>
                   <input name="preferred_hospital" value={formData.preferred_hospital} onChange={handleChange} type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500" placeholder="E.g. Apollo Hospital / Dr. Sharma Clinic" />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 6: Government Scheme Sync</h3>
                <p className="text-sm text-slate-500 mb-6 bg-blue-50 p-4 border border-blue-100 rounded-xl">This determines eligibility for <strong>Ayushman Bharat (PM-JAY)</strong>, <strong>CGHS</strong>, and <strong>ESI</strong>.</p>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Annual Household Income</label>
                  <select name="income" value={formData.income} onChange={handleChange} required className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    <option value="">Select Range</option>
                    <option value="Below 8 Lakh">Below ₹8 Lakh (Govt threshold)</option>
                    <option value="8 Lakh - 15 Lakh">₹8 Lakh - ₹15 Lakh</option>
                    <option value="Above 15 Lakh">Above ₹15 Lakh</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Category / Group</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option value="">Select</option>
                      <option value="General">General</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                      <option value="obc">OBC</option>
                      <option value="veteran">Veteran (CGHS bound)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">State / UT</label>
                    <input name="state_province" value={formData.state_province} onChange={handleChange} required type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="State name" />
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Final Step: Account Setup</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Secure Password</label>
                  <input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500" placeholder="••••••••" />
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mt-4 text-sm text-amber-800">
                   <strong>Data Privacy Notice:</strong> By finalizing registration, you agree to store this medical profile securely in your device state. It will be used transparently across the Dashboard UI.
                </div>
                <div className="mt-4 flex items-start">
                  <input required id="terms" type="checkbox" className="mt-1 h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 shadow-sm" />
                  <label htmlFor="terms" className="ml-3 block text-sm font-medium text-slate-600 mt-0.5">
                    I explicitly consent to my medical data being utilized locally for diagnostic algorithms and SOS endpoints. 
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 flex justify-between gap-4 pt-8">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-3.5 border-2 border-slate-200 text-base font-bold rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                Back
              </button>
            ) : <div />}
            
            <button type="submit" disabled={loading} className={`px-10 py-3.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-teal-500/20 transition-all ${step === 7 ? 'flex-1' : ''}`}>
              {loading ? "Generating Profile..." : (step === 7 ? "Complete Registry" : "Continue to Next Section")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
