import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { HeartPulse, Activity, Bookmark, MapPin, Pill, ActivitySquare, AlertCircle, Phone, User, Calendar, Weight, Ruler, Heart, Upload, Download, QrCode, Stethoscope, Hospital } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, contacts } = useUser();
  
  const getHospitalName = () => {
    if (!user?.preferred_hospital) return '';
    if (typeof user.preferred_hospital === 'string') return user.preferred_hospital;
    return user.preferred_hospital.name || '';
  };

  const defaultProfile = {
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    address: user?.address || '',
    dateOfBirth: '',
    blood_group: user?.vitals?.blood_group || '',
    weight: user?.vitals?.weight || '',
    height: user?.vitals?.height || '',
    past_diseases: user?.medical_history?.past_diseases || '',
    chronic_conditions: user?.medical_history?.chronic_conditions || '',
    family_history: user?.medical_history?.family_history || '',
    surgeries: user?.medical_history?.surgeries || '',
    medications: user?.medications || '',
    allergies: user?.allergies || '',
    income: user?.scheme_data?.income || '',
    category: user?.scheme_data?.category || '',
    state: user?.scheme_data?.state || '',
    smoking: 'Never',
    alcohol: 'Never',
    exerciseFrequency: '3 times per week',
    dietPreference: 'Vegetarian',
    sleepPattern: '7 hours per night',
    preferred_hospital_name: getHospitalName(),
    preferred_hospital_city: user?.preferred_hospital?.city || '',
    preferred_hospital_phone: user?.preferred_hospital?.phone || '',
    family_doctor_name: user?.family_doctor?.name || '',
    family_doctor_specialization: user?.family_doctor?.specialization || '',
    family_doctor_phone: user?.family_doctor?.phone || '',
    family_doctor_clinic: user?.family_doctor?.clinic || '',
  };

  const [formData, setFormData] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('view');

  if (!user) return <div className="p-10 font-bold text-slate-500 text-center animate-pulse">Loading Context...</div>;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    localStorage.setItem('medicity_profile', JSON.stringify(formData));
    updateProfile({
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      address: formData.address,
      vitals: {
        blood_group: formData.blood_group,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
      },
      medical_history: {
        past_diseases: formData.past_diseases,
        chronic_conditions: formData.chronic_conditions,
        family_history: formData.family_history,
        surgeries: formData.surgeries
      },
      medications: formData.medications,
      allergies: formData.allergies,
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
        state: formData.state
      }
    });
    setIsEditing(false);
    setActiveTab('view');
  };

  const calculateBMI = () => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return '';
  };

  // Parse family history into structured rows for display
  const familyHistoryRows = formData.family_history ? formData.family_history.split('; ').filter(Boolean).map(entry => {
    const match = entry.match(/^(.+?)\s\((.+?)\):\s(.+)$/);
    if (match) return { name: match[1], relationship: match[2], disease: match[3] };
    return null;
  }).filter(Boolean) : [];

  const SectionHeader = ({ icon: Icon, title, color = 'teal' }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
      <div className={`w-8 h-8 rounded-full bg-${color}-50 flex items-center justify-center`}>
        <Icon size={16} className={`text-${color}-600`} />
      </div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
  );

  const InfoField = ({ label, value, editing, name, type = 'text', children, onChange }) => (
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{label}</label>
      {editing ? (
        type === 'select' ? (
          <select name={name} value={formData[name]} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500">
            {children}
          </select>
        ) : (
          <input name={name} type={type} value={formData[name]} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
        )
      ) : (
        <p className="font-medium text-slate-800">{value || '--'}</p>
      )}
    </div>
  );

  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Veteran (CGHS bound)'];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-bottom">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{formData.name || 'User'}</h1>
            <p className="text-sm text-slate-500">{formData.age} yrs • {formData.gender} • {formData.blood_group || '--'}</p>
            <p className="text-xs text-slate-400">BMI: {calculateBMI() || '--'} • H: {formData.height}cm • W: {formData.weight}kg</p>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={() => { setIsEditing(false); setActiveTab('view'); }} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-sm">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/30 rounded-xl transition-all text-sm">Save Profile</button>
            </>
          ) : (
            <button onClick={() => { setIsEditing(true); setActiveTab('edit'); }} className="px-5 py-2.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg transition-all text-sm">Edit Profile</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm">
        {[
          { id: "view", label: "View Profile", icon: User },
          { id: "edit", label: "Edit Profile", icon: Activity }
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

      {activeTab === 'view' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={HeartPulse} title="Personal Info" />
            <div className="space-y-3">
              <InfoField label="Name" value={formData.name} />
              <InfoField label="Age & Gender" value={`${formData.age} yrs • ${formData.gender}`} />
              <InfoField label="DOB" value={formData.dateOfBirth} />
              <InfoField label="Address" value={formData.address} editable={false} />
            </div>
          </div>

          {/* Vitals (BP and HR removed) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={Activity} title="Current Vitals" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Blood Group</p>
                <p className="font-black text-rose-600 text-2xl">{formData.blood_group || '--'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Weight / Height</p>
                <p className="font-bold text-slate-800 text-lg">{formData.weight}kg / {formData.height}cm</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">BMI</p>
                <p className="font-bold text-slate-800 text-xl">{calculateBMI() || '--'}</p>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={Heart} title="Lifestyle" />
            <div className="space-y-3">
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Smoking</p><p className="font-medium text-slate-800">{formData.smoking}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Alcohol</p><p className="font-medium text-slate-800">{formData.alcohol}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Exercise</p><p className="font-medium text-slate-800">{formData.exerciseFrequency}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Diet</p><p className="font-medium text-slate-800">{formData.dietPreference}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sleep</p><p className="font-medium text-slate-800">{formData.sleepPattern}</p></div>
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <SectionHeader icon={ActivitySquare} title="Medical History" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Past Diseases</p>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[50px]">{formData.past_diseases || 'Nil'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Chronic Conditions</p>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[50px]">{formData.chronic_conditions || 'Nil'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Family Medical History</p>
                {familyHistoryRows.length > 0 ? (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                        <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Relationship</th><th className="p-3 text-left">Condition</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {familyHistoryRows.map((row, i) => (
                          <tr key={i} className="hover:bg-white">
                            <td className="p-3 font-medium text-slate-800">{row.name}</td>
                            <td className="p-3 text-slate-600">{row.relationship}</td>
                            <td className="p-3 text-slate-600">{row.disease}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">{formData.family_history || 'No family history recorded'}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Surgeries</p>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[50px]">{formData.surgeries || 'Nil'}</p>
              </div>
            </div>
          </div>

          {/* Preferred Hospital */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={MapPin} title="Preferred Hospital" color="blue" />
            <div className="space-y-2">
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Hospital</p><p className="font-medium text-slate-800">{formData.preferred_hospital_name || 'Not specified'}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">City</p><p className="font-medium text-slate-800">{formData.preferred_hospital_city || '--'}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Emergency Contact</p><p className="font-medium text-slate-800">{formData.preferred_hospital_phone || '--'}</p></div>
            </div>
          </div>

          {/* Family Doctor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={Stethoscope} title="Family Doctor" color="purple" />
            <div className="space-y-2">
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Name</p><p className="font-medium text-slate-800">{formData.family_doctor_name || 'Not specified'}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Specialization</p><p className="font-medium text-slate-800">{formData.family_doctor_specialization || '--'}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone</p><p className="font-medium text-slate-800">{formData.family_doctor_phone || '--'}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Clinic</p><p className="font-medium text-slate-800">{formData.family_doctor_clinic || '--'}</p></div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={Pill} title="Medications & Allergies" />
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Medications</p>
                <p className="text-slate-700 bg-teal-50 p-4 border border-teal-100 rounded-xl">{formData.medications || 'No active medications.'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Allergies</p>
                <p className="text-amber-800 bg-amber-50 font-medium p-4 border border-amber-200 rounded-xl">{formData.allergies || 'No known allergies.'}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact Panel */}
          <div className="lg:col-span-3 bg-slate-900 border-4 border-slate-800 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <AlertCircle size={100} className="absolute -bottom-6 -right-6 text-slate-700/50" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold border-b border-slate-700 pb-3 mb-4 text-rose-400 flex items-center gap-2"><AlertCircle size={20} /> Emergency Contacts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {contacts.length > 0 ? contacts.map((c, i) => (
                  <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors">
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-teal-400 font-mono text-xs mt-1 flex items-center gap-1"><Phone size={12} /> {c.phone}</p>
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm">No emergency contacts saved.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Full Name" value={formData.name} editing={true} name="name" />
              <InfoField label="Date of Birth" value={formData.dateOfBirth} editing={true} name="dateOfBirth" type="date" />
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <InfoField label="Height (cm)" value={formData.height} editing={true} name="height" type="number" />
              <InfoField label="Weight (kg)" value={formData.weight} editing={true} name="weight" type="number" />
              <InfoField label="Blood Group" value={formData.blood_group} editing={true} name="blood_group" />
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" rows="2" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={Activity} title="Medical History" />
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Past Diseases</label>
                <textarea name="past_diseases" value={formData.past_diseases} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" rows="2" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Chronic Conditions</label>
                <textarea name="chronic_conditions" value={formData.chronic_conditions} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" rows="2" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Family History</label>
                <textarea name="family_history" value={formData.family_history} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" rows="2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Medications</label>
                  <textarea name="medications" value={formData.medications} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" rows="2" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Allergies</label>
                  <textarea name="allergies" value={formData.allergies} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" rows="2" />
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Hospital (Edit) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={MapPin} title="Preferred Hospital" color="blue" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Hospital Name</label>
                <input name="preferred_hospital_name" value={formData.preferred_hospital_name} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">City</label>
                <input name="preferred_hospital_city" value={formData.preferred_hospital_city} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Emergency Contact</label>
                <input name="preferred_hospital_phone" value={formData.preferred_hospital_phone} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>

          {/* Family Doctor (Edit) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <SectionHeader icon={Stethoscope} title="Family Doctor" color="purple" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Doctor Name</label>
                <input name="family_doctor_name" value={formData.family_doctor_name} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Specialization</label>
                <input name="family_doctor_specialization" value={formData.family_doctor_specialization} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Contact Number</label>
                <input name="family_doctor_phone" value={formData.family_doctor_phone} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Clinic / Hospital</label>
                <input name="family_doctor_clinic" value={formData.family_doctor_clinic} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>

          {/* Government Schemes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <SectionHeader icon={Bookmark} title="Government Scheme Filters" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Annual Income</label>
                <select name="income" value={formData.income} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500">
                  <option value="">Select</option>
                  <option value="Below 8 Lakh">Below ₹8 Lakh</option>
                  <option value="8 Lakh - 15 Lakh">₹8 Lakh - ₹15 Lakh</option>
                  <option value="Above 15 Lakh">Above ₹15 Lakh</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500">
                  <option value="">Select</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">State</label>
                <input name="state" value={formData.state} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex gap-4">
            <button onClick={handleSave} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg">
              💾 Save Profile
            </button>
            <button onClick={() => { setIsEditing(false); setActiveTab('view'); }} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;