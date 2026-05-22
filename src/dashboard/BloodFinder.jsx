import React, { useState } from 'react';
import { Search, Droplets, MapPin, Heart, AlertCircle, Phone, Landmark, Navigation, CheckCircle, Filter, Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

const BloodFinder = () => {
  const { user } = useUser();
  const [selectedBlood, setSelectedBlood] = useState("Any");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const donors = [
    { id: 1, name: "Michael R.", blood: "O-", distance: "2.5 km", time: "10 mins", status: "Available", priority: true, phone: "+91 98765 43210", lastDonated: "2 months ago" },
    { id: 2, name: "Sarah L.", blood: "A+", distance: "4.1 km", time: "18 mins", status: "Available", priority: false, phone: "+91 98765 43211", lastDonated: "1 month ago" },
    { id: 3, name: "David J.", blood: "B+", distance: "6.8 km", time: "25 mins", status: "Offline", priority: false, phone: "+91 98765 43212", lastDonated: "3 months ago" },
    { id: 4, name: "Priya K.", blood: "AB+", distance: "3.2 km", time: "12 mins", status: "Available", priority: true, phone: "+91 98765 43213", lastDonated: "2 weeks ago" },
  ];

  const banks = [
    { id: 1, name: "City Central Blood Bank", blood: "O-, A+, B+", distance: "3.2 km", units: 12, phone: "+91 98765 43220", rating: 4.5 },
    { id: 2, name: "Red Cross Center", blood: "All Types", distance: "5.5 km", units: 45, phone: "+91 98765 43221", rating: 4.8 },
    { id: 3, name: "Apollo Blood Bank", blood: "A+, AB+, O+", distance: "7.1 km", units: 28, phone: "+91 98765 43222", rating: 4.6 },
    { id: 4, name: "District Blood Center", blood: "All Types", distance: "8.3 km", units: 34, phone: "+91 98765 43223", rating: 4.3 },
  ];

  const bloodTypes = ["Any", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const filteredDonors = selectedBlood === "Any" ? donors : donors.filter(d => d.blood === selectedBlood);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-2xl border border-rose-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplets size={28} className="text-rose-500" /> Blood Finder
          </h2>
          <p className="text-slate-600 text-sm mt-1">Find real-time blood availability from donors and nearby banks.</p>
        </div>
        <button className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-2 text-sm">
          <Heart size={18} /> Register as Donor
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Blood Group</label>
          <div className="flex flex-wrap gap-1">
            {bloodTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedBlood(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedBlood === type ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city or zip code"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              defaultValue="New York, NY"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-rose-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-rose-700 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Blood Availability Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bloodTypes.filter(t => t !== 'Any').filter((_, i) => i < 4).map(type => (
          <div key={type} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
            <p className="text-2xl font-black text-rose-600">{type}</p>
            <p className="text-xs text-slate-500 mt-1">{Math.floor(Math.random() * 20 + 3)} units available</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Individual Donors */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" /> Individual Donors
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filteredDonors.length} found</span>
          </h3>
          <div className="space-y-4">
            {filteredDonors.map(donor => (
              <div key={donor.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-lg border-2 border-white shadow-sm shrink-0">
                      {donor.blood}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{donor.name}</h4>
                        {donor.priority && <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Urgent Match</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                        <span className={`w-2 h-2 rounded-full ${donor.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        {donor.status}
                        <span className="text-slate-300">•</span>
                        <MapPin size={12} /> {donor.distance}
                        <span className="text-slate-300">•</span>
                        Last: {donor.lastDonated}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button disabled={donor.status !== 'Available'} className={`flex-1 py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-all ${
                    donor.status === 'Available' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                  }`}>
                    <Phone size={14} /> Contact
                  </button>
                  <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1">
                    <Navigation size={14} /> Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Banks */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Landmark size={20} className="text-slate-500" /> Blood Banks & Hospitals
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{banks.length} found</span>
          </h3>
          <div className="space-y-4">
            {banks.map(bank => (
              <div key={bank.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-900">{bank.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">Open</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                  <MapPin size={14} /> {bank.distance} away
                  <span className="text-slate-300 ml-2">•</span>
                  <span className="text-amber-500">★</span> {bank.rating}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center mb-4">
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
                  <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-xl font-medium hover:bg-slate-50 transition-all text-xs">Directions</button>
                  <button className="flex-1 bg-slate-800 text-white py-2 rounded-xl font-medium hover:bg-slate-700 transition-all text-xs flex items-center justify-center gap-1">
                    <Phone size={14} /> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Alert */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-rose-600 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-rose-900 text-lg mb-1">Urgent: O- Blood Needed</h3>
          <p className="text-rose-700 text-sm">A patient at City Central Hospital requires O- blood immediately. If you can donate, please contact the blood bank or register as a donor.</p>
        </div>
        <button className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shrink-0">
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default BloodFinder;