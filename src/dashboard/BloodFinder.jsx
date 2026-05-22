import React, { useState } from 'react';
import { Search, Droplets, MapPin, Heart, AlertCircle, Phone, Landmark } from 'lucide-react';
import { useUser } from '../context/UserContext';

const BloodFinder = () => {
  const { user } = useUser();
  const donors = [
    { id: 1, name: "Michael R.", blood: "O-", distance: "2.5 km", time: "10 mins", status: "Available", priority: true },
    { id: 2, name: "Sarah L.", blood: "A+", distance: "4.1 km", time: "18 mins", status: "Available", priority: false },
    { id: 3, name: "David J.", blood: "B+", distance: "6.8 km", time: "25 mins", status: "Offline", priority: false },
  ];

  const banks = [
    { id: 1, name: "City Central Blood Bank", blood: "O-, A+, B+", distance: "3.2 km", units: 12 },
    { id: 2, name: "Red Cross Center", blood: "All Types", distance: "5.5 km", units: 45 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-rose-50 p-6 rounded-2xl border border-rose-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplets size={28} className="text-rose-500 fill-rose-500/20" /> Blood Finder
          </h2>
          <p className="text-slate-600 text-sm mt-1">Find real-time blood availability from donors and nearby banks.</p>
        </div>
        <button className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-colors flex items-center gap-2">
          <Heart size={18} />
          Register as Donor
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <select defaultValue={user?.vitals?.blood_group || "Any Blood Group"} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full md:w-auto font-medium">
          <option>Any Blood Group</option>
          <option>A+</option><option>A-</option>
          <option>B+</option><option>B-</option>
          <option>O+</option><option>O-</option>
          <option>AB+</option><option>AB-</option>
        </select>
        
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Enter city or zip code" 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            defaultValue="New York, NY"
          />
        </div>
        
        <button className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors flex flex-center gap-2">
          <Search size={18} /> Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" /> Individual Donors
          </h3>
          <div className="space-y-4">
            {donors.map(donor => (
              <div key={donor.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-lg border-2 border-white shadow-sm shrink-0">
                      {donor.blood}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{donor.name}</h4>
                        {donor.priority && <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Urgent Match</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                        <span className={`w-2 h-2 rounded-full ${donor.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        {donor.status}
                        <span className="text-slate-300">•</span>
                        <MapPin size={12} /> {donor.distance} ({donor.time})
                      </div>
                    </div>
                 </div>
                 <button disabled={donor.status !== 'Available'} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                   donor.status === 'Available' 
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                 }`}>
                   <Phone size={16} /> Contact
                 </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Landmark size={20} className="text-slate-500" /> Blood Banks & Hospitals
          </h3>
          <div className="space-y-4">
            {banks.map(bank => (
              <div key={bank.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-900">{bank.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Open</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                  <MapPin size={14} /> {bank.distance} away
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Available Types</p>
                    <p className="font-medium text-slate-800 text-sm">{bank.blood}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Total Units</p>
                    <p className="font-bold text-teal-600 text-lg">{bank.units}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 text-sm">
                   <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">Directions</button>
                   <button className="flex-1 bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors">Request Unit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodFinder;
