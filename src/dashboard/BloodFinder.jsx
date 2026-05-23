import React, { useState } from 'react';
import { Search, Droplets, MapPin, Heart, AlertCircle, Phone, Landmark, Navigation, CheckCircle, Filter, Loader2, X, User, Clock, Building2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Blood banks data - each bank lists which blood groups they support
const locationData = {
  indore: {
    banks: [
      { id: 1, name: "MY Hospital Blood Bank", groups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], distance: "1.5 km", units: 42, phone: "+91 731 252 4400", rating: 4.7, lat: 22.717, lng: 75.856, timing: "24x7" },
      { id: 2, name: "Choithram Hospital", groups: ["A+", "O+", "AB+", "B+"], distance: "3.8 km", units: 28, phone: "+91 731 236 1492", rating: 4.5, lat: 22.729, lng: 75.871, timing: "24x7" },
      { id: 3, name: "Bombay Hospital Indore", groups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], distance: "4.2 km", units: 55, phone: "+91 731 400 6666", rating: 4.8, lat: 22.708, lng: 75.843, timing: "24x7" },
      { id: 4, name: "Apollo Hospitals Indore", groups: ["O-", "A+", "B+", "AB+"], distance: "6.1 km", units: 34, phone: "+91 731 428 8888", rating: 4.6, lat: 22.741, lng: 75.893, timing: "24x7" },
      { id: 5, name: "Medanta Hospital Blood Bank", groups: ["A+", "B+", "O+", "AB+", "AB-"], distance: "5.0 km", units: 20, phone: "+91 731 467 8900", rating: 4.4, lat: 22.735, lng: 75.868, timing: "8 AM - 8 PM" },
      { id: 6, name: "Red Cross Blood Bank Indore", groups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], distance: "2.3 km", units: 48, phone: "+91 731 243 1100", rating: 4.9, lat: 22.721, lng: 75.861, timing: "8 AM - 6 PM" },
    ],
    stats: { "A+": 18, "B+": 12, "O+": 22, "AB+": 8, "A-": 5, "B-": 3, "O-": 7, "AB-": 4 },
  },
  ujjain: {
    banks: [
      { id: 1, name: "Ujjain District Hospital Blood Bank", groups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], distance: "2.0 km", units: 38, phone: "+91 734 251 2300", rating: 4.3, lat: 23.178, lng: 75.772, timing: "24x7" },
      { id: 2, name: "CR Gardi Hospital", groups: ["A+", "B+", "O+", "AB+"], distance: "3.5 km", units: 22, phone: "+91 734 255 0666", rating: 4.4, lat: 23.191, lng: 75.789, timing: "24x7" },
      { id: 3, name: "Dhanvantri Blood Bank", groups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], distance: "1.8 km", units: 31, phone: "+91 734 252 7777", rating: 4.6, lat: 23.185, lng: 75.775, timing: "7 AM - 9 PM" },
      { id: 4, name: "Maharaja Yashwantrao Hospital", groups: ["A+", "B+", "O+", "AB+"], distance: "2.5 km", units: 25, phone: "+91 734 250 0011", rating: 4.2, lat: 23.182, lng: 75.776, timing: "24x7" },
    ],
    stats: { "A+": 10, "B+": 14, "O+": 16, "AB+": 6, "A-": 3, "B-": 2, "O-": 4, "AB-": 2 },
  },
  dewas: {
    banks: [
      { id: 1, name: "District Hospital Dewas Blood Bank", groups: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], distance: "1.2 km", units: 25, phone: "+91 727 253 1100", rating: 4.2, lat: 22.961, lng: 76.051, timing: "24x7" },
      { id: 2, name: "Sharma Blood Bank", groups: ["A+", "B+", "O+", "AB+"], distance: "2.5 km", units: 18, phone: "+91 727 254 3322", rating: 4.0, lat: 22.972, lng: 76.058, timing: "9 AM - 6 PM" },
      { id: 3, name: "City Care Hospital Blood Bank", groups: ["O-", "A+", "AB+", "B+"], distance: "3.0 km", units: 14, phone: "+91 727 255 4400", rating: 4.1, lat: 22.967, lng: 76.046, timing: "8 AM - 8 PM" },
      { id: 4, name: "Mata Gujri Hospital", groups: ["A+", "O+", "B+", "AB+"], distance: "1.8 km", units: 12, phone: "+91 727 256 5500", rating: 4.3, lat: 22.964, lng: 76.053, timing: "24x7" },
    ],
    stats: { "A+": 8, "B+": 10, "O+": 12, "AB+": 4, "A-": 2, "B-": 1, "O-": 3, "AB-": 1 },
  },
};

const defaultData = {
  banks: [
    { id: 1, name: "Enter a city above to see blood banks", groups: [], distance: "—", units: 0, phone: "—", rating: 0, lat: 20.5937, lng: 78.9629, timing: "—" },
  ],
  stats: { "A+": 0, "B+": 0, "O+": 0, "AB+": 0, "A-": 0, "B-": 0, "O-": 0, "AB-": 0 },
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

  // Filter banks based on selected blood group
  const filteredBanks = selectedBlood === "Any"
    ? currentData.banks
    : currentData.banks.filter(bank => bank.groups.includes(selectedBlood));

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
    }, 800);
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
          <p className="text-slate-600 text-sm mt-1">Find blood banks in <strong>Indore</strong>, <strong>Ujjain</strong>, or <strong>Dewas</strong> that have the blood type you need.</p>
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
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Blood Group Needed</label>
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
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">City</label>
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
          Showing blood banks in <strong>{searchedCity}</strong>
          {selectedBlood !== "Any" && <> for blood group <strong>{selectedBlood}</strong></>}
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
          Enter a city name (Indore, Ujjain, or Dewas) and click Search to find blood banks.
        </div>
      )}

      {/* Blood Availability Stats */}
      {searchResult && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(currentData.stats).map(([type, units]) => (
            <div key={type} className={`rounded-2xl p-4 border shadow-sm text-center transition-all ${
              selectedBlood === type || (selectedBlood === "Any" && units > 0)
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-white border-slate-200'
            }`}>
              <p className={`text-2xl font-black ${selectedBlood === type ? 'text-rose-600' : units > 0 ? 'text-slate-800' : 'text-slate-300'}`}>{type}</p>
              <p className={`text-xs mt-1 ${units > 0 ? 'text-slate-500' : 'text-slate-300'}`}>{units} units available</p>
            </div>
          ))}
        </div>
      )}

      {/* Blood Banks List */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-slate-500" /> Blood Banks & Hospitals
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filteredBanks.length} found</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBanks.map(bank => (
            <div key={bank.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-base truncate">{bank.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <MapPin size={14} /> {bank.distance} away
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-500">★</span> {bank.rating}
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600 font-medium">{bank.timing}</span>
                  </div>
                </div>
              </div>
              
              {/* Supported Blood Groups */}
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Blood Groups</p>
                <div className="flex flex-wrap gap-1.5">
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(type => {
                    const isAvailable = bank.groups.includes(type);
                    const isSelected = selectedBlood === type || (selectedBlood === "Any" && isAvailable);
                    return (
                      <span
                        key={type}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isAvailable
                            ? isSelected
                              ? 'bg-rose-600 text-white'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-50 text-slate-300 border border-slate-100 line-through'
                        }`}
                      >
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Units Info */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Units</p>
                  <p className={`font-bold text-lg ${bank.units > 20 ? 'text-teal-600' : bank.units > 10 ? 'text-amber-600' : 'text-rose-600'}`}>{bank.units}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Availability</p>
                  <p className={`font-bold text-sm ${bank.units > 20 ? 'text-teal-600' : 'text-amber-600'}`}>
                    {bank.units > 20 ? 'Well Stocked' : bank.units > 10 ? 'Moderate' : 'Low'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => handleDirections(bank.lat, bank.lng, bank.name)}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <Navigation size={14} /> Directions
                </button>
                <button
                  onClick={() => handleCall(bank.phone)}
                  className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl font-medium hover:bg-slate-700 transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone size={14} /> Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {searchResult && filteredBanks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Droplets size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-600 text-lg mb-1">No blood banks found</h3>
          <p className="text-sm text-slate-400">No blood banks in {searchedCity} have blood group {selectedBlood} available. Try a different blood group or city.</p>
        </div>
      )}

      {/* Urgent Alert */}
      {searchResult && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 flex items-start gap-4">
          <AlertCircle size={24} className="text-rose-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-rose-900 text-lg mb-1">Urgent: O- Blood Needed</h3>
            <p className="text-rose-700 text-sm">A patient requires O- blood immediately. If you can donate, please contact the nearest blood bank directly or register as a donor.</p>
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shrink-0"
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
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
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
                    className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
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