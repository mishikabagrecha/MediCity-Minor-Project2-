import React, { useMemo } from 'react';
import { Landmark, CheckCircle, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Schemes = () => {
  const { user } = useUser();

  const eligibleSchemes = useMemo(() => {
    let mapping = [];

    // Ayushman Bharat bounding
    if (user?.scheme_data?.income === "Below 8 Lakh") {
        mapping.push({
          id: 1,
          name: "Ayushman Bharat (PM-JAY)",
          description: "Health cover of ₹5 lakhs per family per year. You fall under the ₹8L income cutoff naturally.",
          status: "Eligible (Income Bound)",
          coverage: "₹5,00,000",
          benefits: ["Cashless Access to Healthcare", "Covers Pre and Post Hospitalization", "Income Filter Verified"],
          hospitals: ["AIIMS New Delhi", "Apollo Hospital", "Fortis"]
        });
    }

    if (user?.scheme_data?.category?.toLowerCase() === "veteran" || user?.scheme_data?.category?.toLowerCase() === "general") {
         mapping.push({
          id: 2,
          name: "Central Government Health Scheme (CGHS)",
          description: "Comprehensive medical care. Targeted for specific category bounds.",
          status: "Check Rules",
          coverage: "Govt Approved Rates",
          benefits: ["OPD Treatment", "Specialist Consultation", "Cashless treatment"],
          hospitals: ["Safdarjung Hospital", "Apex Super Speciality"]
        });
    }

    // Default ESI push 
    mapping.push({
      id: 3,
      name: "Employees' State Insurance (ESI)",
      description: "Social security system tailored to provide socio-economic protection.",
      status: "Check Eligibility",
      coverage: "Full Medical Care",
      benefits: ["Sickness Benefit at 70%", "Maternity Benefit"],
      hospitals: ["ESI Model Hospital", "State Tie-up Hospitals"]
    });

    return mapping;
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-teal-600 to-blue-700 p-8 rounded-3xl text-white shadow-lg">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Landmark size={24} className="text-teal-200" />
            <h2 className="text-2xl font-bold">Indian Government Health Schemes</h2>
          </div>
          <p className="text-teal-50">Based on your provided demographic (Income: {user?.scheme_data?.income || "Undisclosed"}, State: {user?.scheme_data?.state || "Undisclosed"}, Category: {user?.scheme_data?.category || "Undisclosed"}), our system filtered <strong>{eligibleSchemes.length} matching schemes</strong> dynamically.</p>
        </div>
        <button className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all w-full md:w-auto text-center">
          Update Profile Info
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {eligibleSchemes.map(scheme => (
          <div key={scheme.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{scheme.name}</h3>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  scheme.status.includes('Eligible') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {scheme.status.includes('Eligible') && <CheckCircle size={14} />} {scheme.status}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-6">{scheme.description}</p>
              
              <div className="mb-4 bg-slate-50 p-4 border border-slate-100 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Coverage Amount</p>
                <p className="text-xl font-bold text-teal-600">{scheme.coverage}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Benefits</p>
                <ul className="space-y-2">
                  {scheme.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <ShieldCheck size={16} className="text-teal-500 shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Empaneled Hospitals</p>
                <div className="flex flex-wrap gap-2">
                   {scheme.hospitals.map((hosp, i) => (
                     <span key={i} className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{hosp}</span>
                   ))}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-md transition-shadow">
                Check Eligibility <ExternalLink size={16} />
              </button>
              <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <MapPin size={16} /> Locate Counters
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mt-8 text-center max-w-3xl mx-auto">
         <h3 className="text-lg font-bold text-slate-900 mb-2">Explore State-Specific Schemes</h3>
         <p className="text-slate-600 text-sm mb-6">Looking for schemes specific to Maharashtra, MP, or Karnataka? Browse through the complete catalog of state health schemes.</p>
         <button className="border border-teal-600 text-teal-700 px-6 py-2.5 rounded-xl font-medium hover:bg-teal-50 transition-colors">
           Browse State Catalog
         </button>
      </div>
    </div>
  );
};

export default Schemes;
