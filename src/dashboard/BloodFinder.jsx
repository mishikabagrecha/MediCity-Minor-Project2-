import React, { useState } from 'react';
import { Search, Droplets, MapPin, Heart, AlertCircle, Phone, Landmark, Navigation, CheckCircle, Filter, Loader2, X, User, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Location-specific data for supported cities
const locationData = {
  indore: {
    donors: [
      { id: 1, name: "Rahul S.", blood: "O-", distance: "2.1 km", time: "8 mins", status: "Available", priority: true, phone: "+91 98765 43201", lastDonated: "1 month ago", lat: 22.7196, lng: 75.8577 },
      { id: 2, name: "Priya M.", blood: "A+", distance: "3.4 km", time: "14 mins", status: "Available", priority: false, phone: "+91 98765 43202", lastDonated: "2 weeks ago", lat: 22.7208, lng: 75.8602 },
      { id: 3, name: "Amit K.", blood: "B+", distance: "5.2 km", time: "20 mins", status: "Offline", priority: false, phone: "+91 98765 43203", lastDonated: "3 months ago", lat: 22.7234, lng: 75.8551 },
      { id: 4, name: "Neha P.", blood: "AB+", distance: "1.8 km", time: "7 mins", status: "Available", priority: true, phone: "+91 98765 43204", lastDonated: "1 week ago", lat: 22.7185, lng: 75.8549 },
      { id: 5, name: "Vikas J.", blood: "O+", distance: "4.0 km", time: "15 mins", status: "Available", priority: false, phone: "+91 98765 43205", lastDonated: "2 months ago", lat: 22.7241, lng: 75.8633 },
    ],
    banks: [
      { id: 1, name: "MY Hospital Blood Bank", blood: "All Types", distance: "1.5 km", units: 42, phone: "+91 731 252 4400", rating: 4.7, lat: 22.717, lng: 75.856 },
      { id: 2, name: "Choithram Hospital", blood: "A+, O+, AB+", distance: "3.8 km", units: 28, phone: "+91 731 236 1492", rating: 4.5, lat: 22.729, lng: 75.871 },
      { id: 3, name: "Bombay Hospital Indore", blood: "All Types", distance: "4.2 km", units: 55, phone: "+91 731 400 6666", rating: 4.8, lat: 22.708, lng: 75.843 },
      { id: 4, name: "Apollo Hospitals Indore", blood: "O-, A+, B+", distance: "6.1 km", units: 34, phone: "+91 731 428 8888", rating: 4.6, lat: 22.741, lng: 75.893 },
    ],
    stats: { "A+": 18, "B+": 12, "O+": 22, "AB+": 8 },
  },
  ujjain: {
    donors: [
      { id: 1, name: "Rajesh V.", blood: "O-", distance: "1.2 km", time: "5 mins", status: "Available", priority: true, phone: "+91 98765 43210", lastDonated: "3 weeks ago", lat: 23.1824, lng: 75.7776 },
      { id: 2, name: "Sunita R.", blood: "B+", distance: "2.8 km", time: "11 mins", status: "Available", priority: false, phone: "+91 98765 43211", lastDonated: "1 month ago", lat: 23.1845, lng: 75.7801 },
      { id: 3, name: "Arjun T.", blood: "A+", distance: "4.5 km", time: "17 mins", status: "Offline", priority: false, phone: "+91 98765 43212", lastDonated: "2 months ago", lat: 23.1882, lng: 75.7743 },
      { id: 4, name: "Meena D.", blood: "AB+", distance: "3.0 km", time: "12 mins", status: "Available", priority: true, phone: "+91 98765 43213", lastDonated: "2 weeks ago", lat: 23.1809, lng: 75.7788 },
    ],
    banks: [
      { id: 1, name: "Ujjain District Hospital", blood: "All Types", distance: "2.0 km", units: 38, phone: "+91 734 251 2300", rating: 4.3, lat: 23.178, lng: 75.772 },
      { id: 2, name: "CR Gardi Hospital", blood: "A+, B+, O+", distance: "3.5 km", units: 22, phone: "+91 734 255 0666", rating: 4.4, lat: 23.191, lng: 75.789 },
      { id: 3, name: "Dhanvantri Blood Bank", blood: "All Types", distance: "1.8 km", units: 31, phone: "+91 734 252 7777", rating: 4.6, lat: 23.185, lng: 75.775 },
    ],
    stats: { "A+": 10, "B+": 14, "O+": 16, "AB+": 6 },
  },
  dewas: {
    donors: [
      { id: 1, name: "Sandeep C.", blood: "B+", distance: "1.5 km", time: "6 mins", status: "Available", priority: false, phone: "+91 98765 43220", lastDonated: "1 month ago", lat: 22.9634, lng: 76.0526 },
      { id: 2, name: "Anita G.", blood: "O+", distance: "2.2 km", time: "9 mins", status: "Available", priority: true, phone: "+91 98765 43221", lastDonated: "1 week ago", lat: 22.9651, lng: 76.0543 },
      { id: 3, name: "Deepak S.", blood: "A+", distance: "3.8 km", time: "15 mins", status: "Offline", priority: false, phone: "+91 98765 43222", lastDonated: "2 months ago", lat: 22.9687, lng: 76.0501 },
      { id: 4, name: "Kavita R.", blood: "AB-", distance: "4.0 km", time: "16 mins", status: "Available", priority: true, phone: "+91 98765 43223", lastDonated: "3 weeks ago", lat: 22.9608, lng: 76.0489 },
      { id: 5, name: "Manish P.", blood: "O-", distance: "2.8 km", time: "11 mins", status: "Available", priority: false, phone: "+91 98765 43224", lastDonated: "2 months ago", lat: 22.9622, lng: 76.0558 },
    ],
    banks: [
      { id: 1, name: "District Hospital Dewas", blood: "All Types", distance: "1.2 km", units: 25, phone: "+91 727 253 1100", rating: 4.2, lat: 22.961, lng: 76.051 },
      { id: 2, name: "Sharma Blood Bank", blood: "A+, B+, O+", distance: "2.5 km", units: 18, phone: "+91 727 254 3322", rating: 4.0, lat: 22.972, lng: 76.058 },
      { id: 3, name: "City Care Hospital", blood: "O-, A+, AB+", distance: "3.0 km", units: 14, phone: "+91 727 255 4400", rating: 4.1, lat: 22.967, lng: 76.046 },
    ],
    stats: { "A+": 8, "B+": 10, "O+": 12, "AB+": 4 },
  },
};

const defaultData = {
  donors: [
    { id: 1, name: "Search for a city", blood: "—", distance: "—", time: "—", status: "Available", priority: false, phone: "—", lastDonated: "—", lat: 20.5937, lng: 78.9629 },
  ],
  banks: [
    { id: 1, name: "Enter a city above", blood: "—", distance: "—", units: 0, phone: "—", rating: 0, lat: 20.5937, lng: 78.9629 },
  ],
  stats: { "A+": 0, "B+": 0, "O+": 0, "AB+": 0 },
};

const BloodFinder = () => {
  const { user } = useUser();
  const [selectedBlood, setSelectedBlood] = useState("Any");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [donorForm, setDonorForm] = useState({ name: '', phone: '', blood: 'O+', address: '' });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchedCity, setSearchedCity] = useState("");

  const bloodTypes = ["Any", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const currentData = searchResult || defaultData;

  const filteredDonors = selectedBlood === "Any"
    ? currentData.donors
    : currentData.donors.filter(d => d.blood === selectedBlood);

  const handleSearch = () => {
    const city = location.trim().toLowerCase();
    if (!city) return;

    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      if (locationData[city]) {
        setSearchResult(locationData[city]);
        setSearchedCity(city.charAt(0).toUpperCase() + city.slice(1));
      } else {
        setSearchResult(null);
        setSearchedCity(city.charAt(0).toUpperCase() + city.slice(1));
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleCall = (phone) => {
    if (phone !== "—") window.location.href = `tel:${phone}`;
  };

  const handleDirections = (lat, lng, name) => {
    const query = encodeURIComponent(name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${query}`, '_blank');
  };

  const handleRegisterDonor = (e) => {
    e.preventDefault();
    setRegistrationSuccess(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegistrationSuccess(false);
      setDonorForm({ name: '', phone: '', blood: 'O+', address: '' });
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const supportedCities = Object.keys(locationData);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-2xl border border-rose-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplets size={28} className="text-rose-500" /> Blood Finder
          </h2>
          <p className="text-slate-600 text-sm mt-1">Search for blood donors and banks in <strong>Indore</strong>, <strong>Ujjain</strong>, or <strong>Dewas</strong>.</p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-2 text-sm"
        >
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
              onKeyDown={handleKeyDown}
              placeholder="Search: Indore, Ujjain, or Dewas"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {supportedCities.map(city => (
              <button
                key={city}
                onClick={() => { setLocation(city.charAt(0).toUpperCase() + city.slice(1)); }}
                className="text-xs px-2 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-medium"
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={isSearching || !location.trim()}
            className="w-full bg-rose-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-rose-700 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search results status */}
      {searchResult && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          Showing blood availability for <strong>{searchedCity}</strong>
        </div>
      )}
      {!searchResult && searchedCity && !isSearching && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-600" />
          No data available for <strong>{searchedCity}</strong>. Try searching for <strong>Indore</strong>, <strong>Ujjain</strong>, or <strong>Dewas</strong>.
        </div>
      )}
      {!searchResult && !searchedCity && !isSearching && (
        <div className="bg-slate-50 border border-slate-200 text-slate-500 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          Enter a city name (Indore, Ujjain, or Dewas) and click Search to find blood availability.
        </div>
      )}

      {/* Blood Availability Stats */}
      {searchResult && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(currentData.stats).map(([type, units]) => (
            <div key={type} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
              <p className="text-2xl font-black text-rose-600">{type}</p>
              <p className="text-xs text-slate-500 mt-1">{units} units available</p>
            </div>
          ))}
        </div>
      )}

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
                  <button
                    disabled={donor.status !== 'Available' || donor.phone === "—"}
                    onClick={() => donor.status === 'Available' && handleCall(donor.phone)}
                    className={`flex-1 py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-all ${
                      donor.status === 'Available' && donor.phone !== "—"
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer'
                        : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                    }`}
                  >
                    <Phone size={14} /> Contact
                  </button>
                  <button
                    onClick={() => handleDirections(donor.lat, donor.lng, donor.name)}
                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
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
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{currentData.banks.length} found</span>
          </h3>
          <div className="space-y-4">
            {currentData.banks.map(bank => (
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
                    <p className={`font-bold text-lg ${bank.units > 0 ? 'text-teal-600' : 'text-slate-400'}`}>{bank.units > 0 ? bank.units : "—"}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => handleDirections(bank.lat, bank.lng, bank.name)}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-xl font-medium hover:bg-slate-50 transition-all text-xs cursor-pointer"
                  >
                    Directions
                  </button>
                  <button
                    onClick={() => handleCall(bank.phone)}
                    className="flex-1 bg-slate-800 text-white py-2 rounded-xl font-medium hover:bg-slate-700 transition-all text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone size={14} /> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Alert */}
      {searchResult && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 flex items-start gap-4">
          <AlertCircle size={24} className="text-rose-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-rose-900 text-lg mb-1">Urgent: O- Blood Needed</h3>
            <p className="text-rose-700 text-sm">A patient at a local hospital requires O- blood immediately. If you can donate, please contact the blood bank or register as a donor.</p>
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shrink-0 cursor-pointer"
          >
            Donate Now
          </button>
        </div>
      )}

      {/* Register as Donor Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { if (!registrationSuccess) setShowRegisterModal(false); }} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {!registrationSuccess ? (
              <>
                <div className="p-6 pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Heart size={22} className="text-rose-500" /> Register as Donor
                    </h3>
                    <button
                      onClick={() => setShowRegisterModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">Fill in your details to register as a blood donor and help save lives.</p>
                </div>
                <form onSubmit={handleRegisterDonor} className="p-6 pt-0 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={donorForm.name}
                      onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={donorForm.phone}
                      onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Blood Group</label>
                    <select
                      value={donorForm.blood}
                      onChange={(e) => setDonorForm({ ...donorForm, blood: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    >
                      {bloodTypes.filter(t => t !== 'Any').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Address</label>
                    <textarea
                      required
                      value={donorForm.address}
                      onChange={(e) => setDonorForm({ ...donorForm, address: e.target.value })}
                      placeholder="Enter your address"
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart size={18} /> Register Now
                  </button>
                </form>
              </>
            ) : (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Registration Successful!</h3>
                <p className="text-sm text-slate-500">Thank you for registering as a blood donor. You may be contacted in case of emergencies.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodFinder;