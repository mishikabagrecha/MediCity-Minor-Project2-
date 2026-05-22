import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { HeartPulse, Activity, Bookmark, MapPin, Pill, ActivitySquare, AlertCircle, Phone } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, contacts, updateContacts } = useUser();
  
  if (!user) return <div className="p-10 font-bold text-slate-500 text-center animate-pulse">Loading Context...</div>;

  const [formData, setFormData] = useState({
     name: user.name || '',
     age: user.age || '',
     gender: user.gender || '',
     address: user.address || '',
     blood_group: user.vitals?.blood_group || '',
     weight: user.vitals?.weight || '',
     height: user.vitals?.height || '',
     blood_pressure: user.vitals?.blood_pressure || '',
     heart_rate: user.vitals?.heart_rate || '',
     past_diseases: user.medical_history?.past_diseases || '',
     chronic_conditions: user.medical_history?.chronic_conditions || '',
     family_history: user.medical_history?.family_history || '',
     surgeries: user.medical_history?.surgeries || '',
     medications: user.medications || '',
     allergies: user.allergies || '',
     income: user.scheme_data?.income || '',
     category: user.scheme_data?.category || '',
     state: user.scheme_data?.state || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
      updateProfile({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          address: formData.address,
          vitals: {
              ...user.vitals,
              blood_group: formData.blood_group,
              weight: parseFloat(formData.weight),
              height: parseFloat(formData.height),
              blood_pressure: formData.blood_pressure,
              heart_rate: parseInt(formData.heart_rate),
          },
          medical_history: {
              ...user.medical_history,
              past_diseases: formData.past_diseases,
              chronic_conditions: formData.chronic_conditions,
              family_history: formData.family_history,
              surgeries: formData.surgeries
          },
          medications: formData.medications,
          allergies: formData.allergies,
          scheme_data: {
              ...user.scheme_data,
              income: formData.income,
              category: formData.category,
              state: formData.state
          }
      });
      setIsEditing(false);
  };

  const SectionHeader = ({ icon: Icon, title }) => (
     <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
         <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center"><Icon size={16} className="text-teal-600" /></div>
         <h2 className="text-lg font-bold text-slate-800">{title}</h2>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-bottom flex flex-col xl:flex-row gap-6">
       
       <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
            <div>
               <h1 className="text-3xl font-bold border-b-4 border-teal-500 inline-block pb-1 text-slate-900">Health Profile Overview</h1>
               <p className="text-slate-500 mt-2">Manage your core clinical integrations across the platform network.</p>
            </div>
            <div className="flex gap-4">
              {isEditing ? (
                 <>
                   <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                   <button onClick={handleSave} className="px-6 py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/30 rounded-xl transition-all">Save Context</button>
                 </>
              ) : (
                 <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg transition-all border border-slate-800">Edit Profile</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <SectionHeader icon={HeartPulse} title="Personal Diagnostics" />
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Name</label>
                         {isEditing ? <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="font-bold text-slate-800 text-lg">{formData.name}</p>}
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Age & Gender</label>
                         {isEditing ? (
                            <div className="flex gap-2">
                               <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-16 border rounded-lg p-2" />
                               <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg p-2"><option>Male</option><option>Female</option><option>Other</option></select>
                            </div>
                         ) : <p className="font-bold text-slate-800 text-lg">{formData.age} yrs • {formData.gender}</p>}
                      </div>
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Geographic Coordinates Address</label>
                       {isEditing ? <input name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="text-slate-600 font-medium flex items-center gap-1"><MapPin size={16} className="text-teal-500" /> {formData.address}</p>}
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <SectionHeader icon={Activity} title="Current Vitals" />
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">Blood Group</label>
                      {isEditing ? <input name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full border rounded-lg p-1.5" /> : <p className="font-black text-rose-600 text-2xl">{formData.blood_group || '--'}</p>}
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Blood Pressure</label>
                      {isEditing ? <input name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} className="w-full border rounded-lg p-1.5" /> : <p className="font-bold text-slate-800 text-xl">{formData.blood_pressure} <span className="text-sm font-medium text-slate-500">mmHg</span></p>}
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Weight / Height</label>
                      {isEditing ? (
                         <div className="flex gap-2"><input name="weight" placeholder="kg" value={formData.weight} onChange={handleChange} className="w-16 border rounded-lg p-1.5" /><input name="height" placeholder="cm" value={formData.height} onChange={handleChange} className="flex-1 border rounded-lg p-1.5" /></div>
                      ) : <p className="font-bold text-slate-800 text-lg">{formData.weight}kg <span className="text-slate-400 font-normal mx-1">/</span> {formData.height}cm</p>}
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Resting Heart Rate</label>
                      {isEditing ? <input name="heart_rate" type="number" value={formData.heart_rate} onChange={handleChange} className="w-full border rounded-lg p-1.5" /> : <p className="font-bold text-slate-800 text-xl">{formData.heart_rate} <span className="text-sm font-medium text-slate-500">bpm</span></p>}
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <SectionHeader icon={ActivitySquare} title="Medical History Log" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Past Diseases</label>
                       {isEditing ? <input name="past_diseases" value={formData.past_diseases} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[50px]">{formData.past_diseases || 'Nil'}</p>}
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Chronic Conditions</label>
                       {isEditing ? <input name="chronic_conditions" value={formData.chronic_conditions} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[50px]">{formData.chronic_conditions || 'Nil'}</p>}
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Family History</label>
                       {isEditing ? <input name="family_history" value={formData.family_history} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[50px]">{formData.family_history || 'Nil'}</p>}
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Surgeries</label>
                       {isEditing ? <input name="surgeries" value={formData.surgeries} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[50px]">{formData.surgeries || 'Nil'}</p>}
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <SectionHeader icon={Pill} title="Medications & Rx" />
                <div className="space-y-4">
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Medications</label>
                       {isEditing ? <textarea name="medications" value={formData.medications} onChange={handleChange} className="w-full border rounded-lg p-2" rows="3" /> : <p className="text-slate-700 bg-teal-50 p-4 border border-teal-100 rounded-xl">{formData.medications || 'No active medications mapped.'}</p>}
                   </div>
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Allergies</label>
                       {isEditing ? <textarea name="allergies" value={formData.allergies} onChange={handleChange} className="w-full border rounded-lg p-2" rows="2" /> : <p className="text-amber-800 bg-amber-50 font-medium p-4 border border-amber-200 rounded-xl">{formData.allergies || 'No known allergies mapped.'}</p>}
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <SectionHeader icon={Bookmark} title="Government Scheme Filters" />
                <div className="space-y-4">
                   <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Declared Annual Income</label>
                       {isEditing ? (
                          <select name="income" value={formData.income} onChange={handleChange} className="w-full border rounded-lg p-2">
                             <option value="Below 8 Lakh">Below ₹8 Lakh (Govt threshold)</option>
                             <option value="8 Lakh - 15 Lakh">₹8 Lakh - ₹15 Lakh</option>
                             <option value="Above 15 Lakh">Above ₹15 Lakh</option>
                          </select>
                       ) : <p className="font-bold text-slate-800 text-lg bg-slate-50 p-3 border border-slate-100 rounded-lg">{formData.income || '--'}</p>}
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Bracket Category</label>
                         {isEditing ? <input name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="font-bold text-slate-800 bg-slate-50 p-3 border border-slate-100 rounded-lg capitalize">{formData.category || '--'}</p>}
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Bound State</label>
                         {isEditing ? <input name="state" value={formData.state} onChange={handleChange} className="w-full border rounded-lg p-2" /> : <p className="font-bold text-slate-800 bg-slate-50 p-3 border border-slate-100 rounded-lg capitalize">{formData.state || '--'}</p>}
                      </div>
                   </div>
                </div>
             </div>

          </div>
       </div>

       {/* Emergency Profile Panel Sidebar */}
       <div className="xl:w-80 space-y-6">
          <div className="bg-slate-900 border-4 border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-900/20 text-white relative overflow-hidden">
              <AlertCircle size={100} className="absolute -bottom-6 -right-6 text-slate-700/50" />
              <div className="relative z-10">
                 <h2 className="text-xl font-bold border-b border-slate-700 pb-3 mb-4 text-rose-400 flex items-center gap-2"><AlertCircle size={20} /> SOS Endpoints</h2>
                 <p className="text-sm text-slate-400 mb-6 font-medium">Mapped targets for backend dispatch execution.</p>
                 
                 <div className="space-y-3">
                    {contacts.map((c, i) => (
                       <div key={i} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors">
                          <p className="font-bold text-sm tracking-wide">{c.name}</p>
                          <p className="text-teal-400 font-mono text-xs mt-1 flex items-center gap-1"><Phone size={12}/> {c.phone}</p>
                       </div>
                    ))}
                 </div>
              </div>
          </div>
       </div>
    </div>
  );
};

export default Profile;
