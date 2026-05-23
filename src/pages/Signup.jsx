import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Activity, HeartPulse, User, MapPin, Pill, ShieldAlert, Landmark, CheckCircle, AlertCircle, X, ChevronDown } from 'lucide-react';

const DISEASES_OPTIONS = ['Dengue', 'Jaundice', 'Tuberculosis', 'Malaria', 'Asthma', 'Typhoid', 'COVID-19', 'Pneumonia', 'Chickenpox', 'Other'];
const CHRONIC_OPTIONS = ['Diabetes', 'Hypertension', 'Arthritis', 'Thyroid Disorder', 'Heart Disease', 'Asthma', 'Migraine', 'PCOS', 'Kidney Disease', 'Other'];
const RELATIONSHIPS = ['Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Veteran (CGHS bound)'];

const Signup = () => {
  const navigate = useNavigate();
  const { loginUser, updateContacts } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '', lastName: '', age: '', gender: '', phone: '', address: '',
    selectedDiseases: [], otherDisease: '',
    selectedChronic: [], otherChronic: '',
    surgeries: '',
    familyMembers: [{ name: '', relationship: '', disease: '' }],
    blood_group: '', weight: '', height: '',
    medications: '', allergies: '',
    emergency_contacts: [{ name: '', phone: '' }],
    preferred_hospital_name: '', preferred_hospital_city: '', preferred_hospital_phone: '',
    family_doctor_name: '', family_doctor_specialization: '', family_doctor_phone: '', family_doctor_clinic: '',
    income: '', category: '', state_province: '',
    email: '', password: ''
  });

  const passwordErrors = [];
  if (formData.password) {
    if (formData.password.length < 8) passwordErrors.push('At least 8 characters');
    if (!/[A-Z]/.test(formData.password)) passwordErrors.push('One uppercase letter');
    if (!/[a-z]/.test(formData.password)) passwordErrors.push('One lowercase letter');
    if (!/[0-9]/.test(formData.password)) passwordErrors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) passwordErrors.push('One special character');
  }

  const validate = () => {
    const errs = {};
    if (step === 1) {
      if (!formData.phone) errs.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) errs.phone = 'Phone number must contain exactly 10 digits';
      if (!formData.name.trim()) errs.name = 'First name is required';
      if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
      if (!formData.age || parseInt(formData.age) < 1) errs.age = 'Valid age required';
      if (!formData.gender) errs.gender = 'Gender required';
      if (!formData.address.trim()) errs.address = 'Address required';
    }
    if (step === 7) {
      if (!formData.email) errs.email = 'Email required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format';
      if (!formData.password) errs.password = 'Password required';
      else if (passwordErrors.length > 0) errs.password = 'Password does not meet all requirements';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMultiSelect = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== value), [`other${field.replace('selected', '')}`]: '' });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleFamilyChange = (index, field, value) => {
    const members = [...formData.familyMembers];
    members[index][field] = value;
    setFormData({ ...formData, familyMembers: members });
  };

  const addFamilyMember = () => setFormData({ ...formData, familyMembers: [...formData.familyMembers, { name: '', relationship: '', disease: '' }] });
  const removeFamilyMember = (idx) => setFormData({ ...formData, familyMembers: formData.familyMembers.filter((_, i) => i !== idx) });

  const handleContactChange = (index, field, value) => {
    const contacts = [...formData.emergency_contacts];
    contacts[index][field] = value;
    setFormData({ ...formData, emergency_contacts: contacts });
  };
  const addContact = () => setFormData({ ...formData, emergency_contacts: [...formData.emergency_contacts, { name: '', phone: '' }] });
  const removeContact = (idx) => setFormData({ ...formData, emergency_contacts: formData.emergency_contacts.filter((_, i) => i !== idx) });

  const getCleanPhone = (phone) => phone.replace(/[^0-9]/g, '').slice(0, 10);

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (step < 7) { setStep(step + 1); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const pastDiseasesStr = [...formData.selectedDiseases, formData.otherDisease ? `Other: ${formData.otherDisease}` : ''].filter(Boolean).join(', ');
      const chronicStr = [...formData.selectedChronic, formData.otherChronic ? `Other: ${formData.otherChronic}` : ''].filter(Boolean).join(', ');
      const familyStr = formData.familyMembers.filter(m => m.name && m.relationship).map(m => `${m.name} (${m.relationship}): ${m.disease || 'None'}`).join('; ');

      updateContacts(formData.emergency_contacts.map(c => ({ ...c, phone: `+91 ${getCleanPhone(c.phone)}` })));
      loginUser({
        name: `${formData.name} ${formData.lastName}`,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: `+91 ${getCleanPhone(formData.phone)}`,
        address: formData.address,
        email: formData.email,
        medical_history: {
          past_diseases: pastDiseasesStr,
          chronic_conditions: chronicStr,
          surgeries: formData.surgeries,
          family_history: familyStr
        },
        vitals: {
          blood_group: formData.blood_group,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height)
        },
        medications: formData.medications,
        allergies: formData.allergies,
        contacts: formData.emergency_contacts.map(c => ({ ...c, phone: `+91 ${getCleanPhone(c.phone)}` })),
        preferred_hospital: {
          name: formData.preferred_hospital_name,
          city: formData.preferred_hospital_city,
          phone: formData.preferred_hospital_phone
        },
        family_doctor: {
          name: formData.family_doctor_name,
          specialization: formData.family_doctor_specialization,
          phone: formData.family_doctor_phone,
          clinic: formData.family_doctor_clinic
        },
        scheme_data: {
          income: formData.income,
          category: formData.category,
          state: formData.state_province
        }
      });
      navigate('/dashboard');
    }, 1500);
  };

  const steps = [
    { num: 1, title: "Personal", icon: <User size={18} /> },
    { num: 2, title: "Medical", icon: <HeartPulse size={18} /> },
    { num: 3, title: "Vitals", icon: <Activity size={18} /> },
    { num: 4, title: "Rx", icon: <Pill size={18} /> },
    { num: 5, title: "SOS", icon: <ShieldAlert size={18} /> },
    { num: 6, title: "Govt", icon: <Landmark size={18} /> },
    { num: 7, title: "Account", icon: <CheckCircle size={18} /> }
  ];

  const ErrMsg = ({ field }) => errors[field] ? <p className="text-rose-600 text-xs font-medium mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors[field]}</p> : null;

  const MultiSelect = ({ options, selected, field, label, otherField, otherPlaceholder }) => (
    <div>
      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => handleMultiSelect(field, opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selected.includes(opt) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}>
            {opt} {selected.includes(opt) ? '✓' : ''}
          </button>
        ))}
      </div>
      {selected.includes('Other') && <input name={otherField} value={formData[otherField]} onChange={handleChange} placeholder={otherPlaceholder} className="w-full border border-slate-200 bg-slate-50 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" />}
    </div>
  );

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Build Your Comprehensive Health Profile</h2>
          <p className="text-slate-500">Provide accurate details to supercharge MediCity's AI and matchmaking features.</p>
        </div>

        <div className="mb-10 pb-4">
          <div className="flex justify-between items-center relative min-w-[600px] px-4">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 mx-6" />
            <div className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500 mx-6" style={{ width: `${((step - 1) / 6) * 100}%` }} />
            {steps.map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center group cursor-default">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${step > s.num ? 'bg-teal-500 border-teal-100 text-white shadow-lg' : step === s.num ? 'bg-white border-teal-500 text-teal-600 shadow-xl scale-110' : 'bg-white border-slate-100 text-slate-300'}`}>
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
                    <ErrMsg field="name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow" placeholder="Last Name" />
                    <ErrMsg field="lastName" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Age</label>
                    <input name="age" value={formData.age} onChange={handleChange} required type="number" min="0" max="150" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                    <ErrMsg field="age" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                    <ErrMsg field="gender" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} required type="tel" className={`w-full border bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow ${errors.phone ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`} placeholder="10 digit number" maxLength={10} />
                    <ErrMsg field="phone" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Full Address <span className="text-xs font-normal text-slate-400 normal-case">(For Ambulance Routing)</span></label>
                  <div className="relative">
                    <MapPin className="absolute top-3 left-3 text-slate-400" size={20} />
                    <input name="address" value={formData.address} onChange={handleChange} required type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="123 Example Street, City, State" />
                    <ErrMsg field="address" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 2: Medical History</h3>
                <MultiSelect options={DISEASES_OPTIONS} selected={formData.selectedDiseases} field="selectedDiseases" label="Past Diseases (select all that apply)" otherField="otherDisease" otherPlaceholder="Specify other disease..." />
                <MultiSelect options={CHRONIC_OPTIONS} selected={formData.selectedChronic} field="selectedChronic" label="Chronic Conditions (select all that apply)" otherField="otherChronic" otherPlaceholder="Specify other condition..." />
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Past Surgeries (Include Year)</label>
                  <input name="surgeries" value={formData.surgeries} onChange={handleChange} type="text" className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="E.g. Appendectomy (2018)" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Family Medical History</label>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                      <div className="col-span-4">Name</div>
                      <div className="col-span-3">Relationship</div>
                      <div className="col-span-4">Disease/Condition</div>
                      <div className="col-span-1"></div>
                    </div>
                    {formData.familyMembers.map((member, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-3 mb-3 items-center">
                        <div className="col-span-4">
                          <input value={member.name} onChange={(e) => handleFamilyChange(idx, 'name', e.target.value)} placeholder="e.g. Rajesh" className="w-full border border-slate-300 bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="col-span-3">
                          <select value={member.relationship} onChange={(e) => handleFamilyChange(idx, 'relationship', e.target.value)} className="w-full border border-slate-300 bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500">
                            <option value="">Select</option>
                            {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div className="col-span-4">
                          <input value={member.disease} onChange={(e) => handleFamilyChange(idx, 'disease', e.target.value)} placeholder="e.g. Diabetes" className="w-full border border-slate-300 bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="col-span-1">
                          {idx > 0 && <button type="button" onClick={() => removeFamilyMember(idx)} className="text-rose-400 hover:text-rose-600 p-1"><X size={16} /></button>}
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={addFamilyMember} className="text-teal-600 font-bold text-sm mt-1 hover:underline">+ Add Family Member</button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-slate-700">Section 3: Current Health Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="3" className="w-full border border-slate-200 bg-rose-50 border-rose-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" placeholder="Identify food or medicine allergies (E.g. Penicillin, Peanuts)"></textarea>
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
                        <input required value={contact.phone} onChange={(e) => handleContactChange(idx, 'phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} type="tel" className="w-full border border-slate-300 bg-white rounded-lg p-2 focus:ring-2 focus:ring-teal-500" placeholder="10 digits" maxLength={10} />
                      </div>
                      {idx > 0 && <button type="button" onClick={() => removeContact(idx)} className="bg-rose-50 text-rose-500 p-2.5 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors font-bold text-sm">Remove</button>}
                    </div>
                  ))}
                  <button type="button" onClick={addContact} className="text-teal-600 font-bold text-sm mt-2 hover:underline">+ Add another contact</button>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2"><MapPin size={18} /> Preferred Hospital</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Hospital Name</label>
                      <input name="preferred_hospital_name" value={formData.preferred_hospital_name} onChange={handleChange} type="text" className="w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" placeholder="E.g. Apollo Hospital" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">City</label>
                      <input name="preferred_hospital_city" value={formData.preferred_hospital_city} onChange={handleChange} type="text" className="w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Emergency Contact</label>
                      <input name="preferred_hospital_phone" value={formData.preferred_hospital_phone} onChange={(e) => setFormData({ ...formData, preferred_hospital_phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} type="tel" className="w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" placeholder="10 digits" maxLength={10} />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-purple-700 mb-4 flex items-center gap-2"><HeartPulse size={18} /> Family Doctor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Doctor Name</label>
                      <input name="family_doctor_name" value={formData.family_doctor_name} onChange={handleChange} type="text" className="w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" placeholder="Dr. Name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Specialization</label>
                      <input name="family_doctor_specialization" value={formData.family_doctor_specialization} onChange={handleChange} type="text" className="w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" placeholder="E.g. General Physician" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Contact Number</label>
                      <input name="family_doctor_phone" value={formData.family_doctor_phone} onChange={(e) => setFormData({ ...formData, family_doctor_phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })} type="tel" className="w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" placeholder="10 digits" maxLength={10} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Clinic / Hospital</label>
                      <input name="family_doctor_clinic" value={formData.family_doctor_clinic} onChange={handleChange} type="text" className="w-full border border-slate-300 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500" placeholder="Clinic / Hospital name" />
                    </div>
                  </div>
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
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  <input name="email" value={formData.email} onChange={handleChange} required type="email" className={`w-full border bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`} placeholder="you@example.com" />
                  <ErrMsg field="email" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Secure Password</label>
                  <input name="password" value={formData.password} onChange={handleChange} required type="password" className={`w-full border bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`} placeholder="••••••••" />
                  <ErrMsg field="password" />
                  {formData.password && (
                    <div className="mt-3 space-y-1.5">
                      {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number', 'One special character'].map((rule, i) => {
                        const passed = [
                          formData.password.length >= 8,
                          /[A-Z]/.test(formData.password),
                          /[a-z]/.test(formData.password),
                          /[0-9]/.test(formData.password),
                          /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                        ][i];
                        return (
                          <div key={i} className="flex items-center gap-2 text-xs font-medium">
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                              {passed ? '✓' : '○'}
                            </span>
                            <span className={passed ? 'text-emerald-700' : 'text-slate-500'}>{rule}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
              <button type="button" onClick={() => { setStep(step - 1); setErrors({}); }} className="px-8 py-3.5 border-2 border-slate-200 text-base font-bold rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
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