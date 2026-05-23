import React, { useMemo } from 'react';
import { Landmark, CheckCircle, ExternalLink, ShieldCheck, MapPin, Users, IndianRupee, Award, AlertCircle, BadgeCheck, Stethoscope } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Full catalog of government health schemes
const allSchemes = [
  {
    id: 1,
    name: "Ayushman Bharat (PM-JAY)",
    shortName: "PM-JAY",
    description: "World's largest government-funded health insurance scheme providing health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
    coverage: "₹5,00,000 per family/year",
    eligibility: (data) => {
      const income = data?.income || "";
      const category = data?.category || "";
      // Eligible if income below 8L OR SC/ST/OBC category
      return income === "Below 8 Lakh" || ["sc", "st", "obc"].includes(category.toLowerCase());
    },
    eligibilityReason: (data) => {
      const income = data?.income || "";
      const category = data?.category || "";
      if (income === "Below 8 Lakh") return "Annual household income below ₹8 lakh threshold";
      if (["sc", "st", "obc"].includes(category.toLowerCase())) return "Eligible under reserved category provisions";
      return "";
    },
    statusLabel: (data) => {
      const income = data?.income || "";
      const category = data?.category || "";
      if (income === "Below 8 Lakh" && ["sc", "st", "obc"].includes(category.toLowerCase())) return "Highly Eligible";
      return "Likely Eligible";
    },
    benefits: ["Cashless hospitalization at empaneled hospitals", "Covers pre & post hospitalization (3+15 days)", "No cap on family size", "All pre-existing diseases covered from day 1", "Free diagnostic & medicine coverage"],
    hospitals: 16500,
    stateCoverage: "All States & UTs except Delhi & West Bengal",
    icon: "ShieldCheck",
    color: "emerald"
  },
  {
    id: 2,
    name: "Central Government Health Scheme (CGHS)",
    shortName: "CGHS",
    description: "Comprehensive healthcare scheme for central government employees, pensioners and their dependents covering OPD, hospitalization, and diagnostic services.",
    coverage: "Comprehensive medical care at CGHS rates",
    eligibility: (data) => {
      const category = data?.category || "";
      const income = data?.income || "";
      // Veterans and general category central employees
      return category?.toLowerCase() === "veteran" || category?.toLowerCase() === "general";
    },
    eligibilityReason: (data) => {
      const category = data?.category || "";
      if (category?.toLowerCase() === "veteran") return "Veteran / Ex-serviceman category";
      if (category?.toLowerCase() === "general") return "General category - check employment status";
      return "";
    },
    statusLabel: () => "Check Employment Status",
    benefits: ["OPD consultation at CGHS wellness centers", "Specialist consultation & diagnostic tests", "Cashless treatment at empaneled hospitals", "Pharmaceutical coverage at CGHS rates", "Annual health check-up"],
    hospitals: 680,
    stateCoverage: "70+ cities across India",
    icon: "Award",
    color: "blue"
  },
  {
    id: 3,
    name: "Employees' State Insurance (ESI)",
    shortName: "ESI",
    description: "Self-financing social security & health insurance scheme for workers earning up to ₹21,000/month covering full medical care for employees and dependents.",
    coverage: "Full medical care + Cash benefits",
    eligibility: (data) => {
      const income = data?.income || "";
      // Generally covers employees earning below ₹21K/month
      return income === "Below 8 Lakh" || income === "8 Lakh - 15 Lakh";
    },
    eligibilityReason: () => "Applicable for employees earning up to ₹21,000/month under ESI Act",
    statusLabel: () => "Check Employer Registration",
    benefits: ["Full medical care (OPD & IPD)", "Sickness benefit at 70% of wages", "Maternity benefit up to 26 weeks", "Disablement benefit for work injuries", "Dependents medical coverage"],
    hospitals: 1450,
    stateCoverage: "All major industrial states",
    icon: "Users",
    color: "purple"
  },
  {
    id: 4,
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    shortName: "PMSBY",
    description: "Accident insurance scheme providing accidental death and disability cover at a nominal premium of just ₹12 per year (auto-debited from bank account).",
    coverage: "₹2,00,000 (accidental death) / ₹1,00,000 (partial disability)",
    eligibility: (data) => {
      const age = data?.age || 0;
      const income = data?.income || "";
      // Age 18-70 years with savings bank account
      return age >= 18 && age <= 70;
    },
    eligibilityReason: (data) => {
      const age = data?.age || 0;
      if (age >= 18 && age <= 70) return `Age ${age} years - within eligible range (18-70)`;
      return "";
    },
    statusLabel: () => "Premium: ₹12/year",
    benefits: ["Accidental death cover of ₹2,00,000", "Total permanent disability cover", "Partial disability cover of ₹1,00,000", "Auto-renewal from bank account", "Very low premium"],
    hospitals: 0,
    stateCoverage: "All India",
    icon: "BadgeCheck",
    color: "amber"
  },
  {
    id: 5,
    name: "Pradhan Mantri Jan Arogya Yojana (PMJAY-SEHK)",
    shortName: "PMJAY-SEHK",
    description: "Extension of Ayushman Bharat specifically for senior citizens aged 70+ providing additional health coverage for age-related ailments.",
    coverage: "Additional ₹5,00,000 for seniors 70+",
    eligibility: (data) => {
      const age = data?.age || 0;
      const income = data?.income || "";
      return age >= 70 && income === "Below 8 Lakh";
    },
    eligibilityReason: (data) => {
      const age = data?.age || 0;
      if (age >= 70) return "Senior citizen aged 70+ eligible for additional coverage";
      return "Age requirement: 70+ years";
    },
    statusLabel: () => "Senior Citizen Scheme",
    benefits: ["Additional ₹5 lakh cover for seniors", "Covers age-related diseases", "Cashless treatment network", "No medical check-up required", "Family coverage included"],
    hospitals: 12500,
    stateCoverage: "All Ayushman Bharat states",
    icon: "Award",
    color: "teal"
  },
  {
    id: 6,
    name: "Rashtriya Swasthya Bima Yojana (RSBY)",
    shortName: "RSBY",
    description: "Health insurance scheme for Below Poverty Line (BPL) families providing smart card based cashless health cover of ₹30,000 per family per year.",
    coverage: "₹30,000 per family/year",
    eligibility: (data) => {
      const income = data?.income || "";
      const category = data?.category || "";
      return income === "Below 8 Lakh" && ["sc", "st", "obc"].includes(category?.toLowerCase());
    },
    eligibilityReason: () => "BPL category with income below threshold",
    statusLabel: () => "BPL Scheme",
    benefits: ["Smart card based cashless treatment", "Covers 5 family members", "Transportation allowance", "Pre-existing diseases covered", "Maternity benefits included"],
    hospitals: 9800,
    stateCoverage: "Select states (Uttar Pradesh, MP, etc.)",
    icon: "Users",
    color: "sky"
  },
  {
    id: 7,
    name: "Chief Minister's Health Insurance Scheme (State-Specific)",
    shortName: "CM Health Scheme",
    description: "State-specific health insurance schemes that supplement central schemes. Coverage varies by state - Madhya Pradesh, Maharashtra, and other states have their own versions.",
    coverage: "₹2,00,000 - ₹5,00,000 (varies by state)",
    eligibility: (data) => {
      const state = data?.state || "";
      const income = data?.income || "";
      // Check if user has a state and income data
      return !!state && income === "Below 8 Lakh";
    },
    eligibilityReason: (data) => {
      const state = data?.state || "";
      if (state) return `State resident of ${state}`;
      return "State residency required";
    },
    statusLabel: (data) => {
      const state = data?.state || "";
      return state ? `Available in ${state}` : "State Dependent";
    },
    benefits: ["Cashless hospitalization in state network", "Coverage for critical illnesses", "Free diagnostics & medicines", "Maternity & newborn care", "Ambulance services"],
    hospitals: "State network hospitals",
    stateCoverage: "MP: ₹5L, Maharashtra: ₹5L, Gujarat: ₹3L, etc.",
    icon: "MapPin",
    color: "indigo"
  }
];

const stateSuggestions = {
  "madhya pradesh": ["MP Mukhyamantri Swasthya Yojana", "MP Ayushman Jan Arogya Yojana"],
  "maharashtra": ["Mahatma Phule Jan Arogya Yojana", "Rajiv Gandhi Jeevandayee Yojana"],
  "gujarat": ["Mukhyamantri Amrutam Yojana (MA Yojana)", "Gujarat Health Scheme"],
  "rajasthan": ["Rajasthan Mukhyamantri Chiranjeevi Yojana", "Bhamashah Swasthya Bima Yojana"],
  "karnataka": ["Ayushman Bharat Karnataka", "Vajpayee Arogya Shree"],
  "uttar pradesh": ["UP Mukhyamantri Jan Arogya Yojana", "UP Ayushman Bharat"],
};

const Schemes = () => {
  const { user } = useUser();

  const schemeData = user?.scheme_data || {};
  const userAge = user?.age || 0;
  const enrichedData = { ...schemeData, age: userAge };

  const eligibleSchemes = useMemo(() => {
    return allSchemes
      .filter(scheme => scheme.eligibility(enrichedData))
      .map(scheme => ({
        ...scheme,
        eligibilityReason: scheme.eligibilityReason(enrichedData),
        statusLabel: scheme.statusLabel(enrichedData),
      }));
  }, [enrichedData]);

  const ineligibleSchemes = useMemo(() => {
    return allSchemes
      .filter(scheme => !scheme.eligibility(enrichedData))
      .map(scheme => ({
        ...scheme,
        eligibilityReason: scheme.eligibilityReason(enrichedData),
      }));
  }, [enrichedData]);

  const stateName = enrichedData?.state || "";
  const localSchemes = stateSuggestions[stateName?.toLowerCase()] || [];

  const getIcon = (iconName) => {
    switch(iconName) {
      case "ShieldCheck": return <ShieldCheck size={22} className="text-emerald-600" />;
      case "Award": return <Award size={22} className="text-blue-600" />;
      case "Users": return <Users size={22} className="text-purple-600" />;
      case "BadgeCheck": return <BadgeCheck size={22} className="text-amber-600" />;
      case "MapPin": return <MapPin size={22} className="text-indigo-600" />;
      default: return <Landmark size={22} className="text-slate-600" />;
    }
  };

  const statusColors = (status) => {
    if (status?.includes("Highly")) return "bg-emerald-100 text-emerald-800";
    if (status?.includes("Eligible") || status?.includes("Available") || status?.includes("Premium")) return "bg-emerald-50 text-emerald-700";
    if (status?.includes("Check")) return "bg-amber-50 text-amber-700";
    if (status?.includes("Senior") || status?.includes("BPL")) return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    return "bg-slate-100 text-slate-600";
  };

  const iconBgColorMap = { ShieldCheck: "bg-emerald-50", Award: "bg-blue-50", Users: "bg-purple-50", BadgeCheck: "bg-amber-50", MapPin: "bg-indigo-50" };
  const iconTextColorMap = { ShieldCheck: "text-emerald-600", Award: "text-blue-600", Users: "text-purple-600", BadgeCheck: "text-amber-600", MapPin: "text-indigo-600" };
  const borderColors = { emerald: "border-emerald-200 ring-emerald-100", blue: "border-blue-200 ring-blue-100", purple: "border-purple-200 ring-purple-100", amber: "border-amber-200 ring-amber-100", teal: "border-teal-200 ring-teal-100", sky: "border-sky-200 ring-sky-100", indigo: "border-indigo-200 ring-indigo-100" };
  const badgeBgColors = { emerald: "bg-emerald-50", blue: "bg-blue-50", purple: "bg-purple-50", amber: "bg-amber-50", teal: "bg-teal-50", sky: "bg-sky-50", indigo: "bg-indigo-50" };
  const badgeBorderColors = { emerald: "border-emerald-200", blue: "border-blue-200", purple: "border-purple-200", amber: "border-amber-200", teal: "border-teal-200", sky: "border-sky-200", indigo: "border-indigo-200" };
  const badgeTextColors = { emerald: "text-emerald-800", blue: "text-blue-800", purple: "text-purple-800", amber: "text-amber-800", teal: "text-teal-800", sky: "text-sky-800", indigo: "text-indigo-800" };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-teal-600 to-blue-700 p-8 rounded-3xl text-white shadow-lg">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Landmark size={24} className="text-teal-200" />
            <h2 className="text-2xl font-bold">Indian Government Health Schemes</h2>
          </div>
          <p className="text-teal-50 text-sm leading-relaxed">
            Based on your profile <span className="font-semibold text-white">
              {enrichedData?.income ? `| Income: ${enrichedData.income}` : ''}
              {enrichedData?.state ? ` | State: ${enrichedData.state}` : ''}
              {enrichedData?.category ? ` | Category: ${enrichedData.category}` : ''}
              {userAge ? ` | Age: ${userAge}` : ''}
            </span>
          </p>
          <p className="text-teal-100/80 text-xs mt-1">
            Showing <strong>{eligibleSchemes.length} eligible</strong> out of {allSchemes.length} schemes based on your profile data.
            {eligibleSchemes.length === 0 && " Update your profile in Profile section to check eligibility."}
          </p>
        </div>
      </div>

      {/* No data warning */}
      {!enrichedData?.income && !enrichedData?.state && !enrichedData?.category && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 text-sm mb-1">Profile data incomplete</h4>
            <p className="text-amber-700 text-sm">Please complete your profile (especially Income, State, and Category) in the signup form to get accurate scheme recommendations.</p>
          </div>
        </div>
      )}

      {/* Eligible Schemes */}
      {eligibleSchemes.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-emerald-500" /> Eligible Schemes for You
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{eligibleSchemes.length}</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {eligibleSchemes.map(scheme => (
              <div key={scheme.id} className={`bg-white border ${borderColors[scheme.color] || 'border-slate-200'} rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all`}>
                <div className="p-6 border-b border-slate-100 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${iconBgColorMap[scheme.icon] || 'bg-slate-50'} flex items-center justify-center`}>
                        {getIcon(scheme.icon, scheme.color)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{scheme.shortName}</h3>
                        <p className="text-xs text-slate-400 font-medium">{scheme.name}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusColors(scheme.statusLabel)}`}>
                      {scheme.statusLabel?.includes("Eligible") && <CheckCircle size={12} />}
                      {scheme.statusLabel}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{scheme.description}</p>
                  
                  {/* Why eligible banner */}
                  {scheme.eligibilityReason && (
                    <div className={`rounded-xl p-3 mb-4 flex items-start gap-2 border ${badgeBgColors[scheme.color] || 'bg-slate-50'} ${badgeBorderColors[scheme.color] || 'border-slate-200'}`}>
                      <BadgeCheck size={16} className={`shrink-0 mt-0.5 ${iconTextColorMap[scheme.icon] || 'text-slate-600'}`} />
                      <p className={`text-xs font-medium ${badgeTextColors[scheme.color] || 'text-slate-800'}`}>{scheme.eligibilityReason}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Coverage</p>
                      <div className="flex items-center gap-1">
                      <IndianRupee size={14} className="text-teal-600" />
                        <p className="text-sm font-bold text-slate-800">{scheme.coverage}</p>
                      </div>
                    </div>
                    {scheme.hospitals > 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Empaneled Hospitals</p>
                        <p className="text-sm font-bold text-slate-800">{scheme.hospitals.toLocaleString()}+</p>
                      </div>
                    )}
                    {scheme.hospitals === 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Coverage Area</p>
                        <p className="text-sm font-bold text-slate-800">All India</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Benefits</p>
                    <ul className="space-y-1.5">
                      {scheme.benefits.slice(0, 4).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <ShieldCheck size={14} className="text-teal-500 shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {scheme.stateCoverage && (
                    <p className="text-[10px] text-slate-400 mt-3 font-medium">
                      <MapPin size={10} className="inline mr-0.5" /> {scheme.stateCoverage}
                    </p>
                  )}
                </div>
                
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-2 hover:shadow-md transition-shadow">
                    Check Full Eligibility <ExternalLink size={14} />
                  </button>
                  <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <MapPin size={14} /> Find Hospitals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional schemes from other categories */}
      {localSchemes.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-800 mb-2 flex items-center gap-2">
            <MapPin size={20} /> State-Specific Schemes for {stateName}
          </h3>
          <p className="text-sm text-indigo-600 mb-4">These schemes are available in your state. Contact your nearest district health office for enrollment details.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localSchemes.map((scheme, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <Landmark size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{scheme}</p>
                  <p className="text-xs text-slate-500 mt-0.5">State Govt. Scheme - {stateName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ineligible / Other Schemes (collapsible info) */}
      {ineligibleSchemes.length > 0 && (
        <details className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between">
            <h3 className="font-bold text-slate-600 text-sm flex items-center gap-2">
              <AlertCircle size={16} className="text-slate-400" />
              Other Schemes (Not currently eligible)
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{ineligibleSchemes.length}</span>
            </h3>
            <span className="text-xs text-slate-400">Click to expand</span>
          </summary>
          <div className="px-6 pb-6 border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ineligibleSchemes.map(scheme => (
              <div key={scheme.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-slate-700 text-sm">{scheme.shortName}</h4>
                  <span className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{scheme.coverage}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{scheme.eligibilityReason || "Different eligibility criteria required"}</p>
                <p className="text-xs text-slate-400">Update your profile to check eligibility for this scheme.</p>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Bottom info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Stethoscope size={20} className="text-teal-500" />
          <h3 className="text-lg font-bold text-slate-900">Get Personalized Help</h3>
        </div>
        <p className="text-slate-500 text-sm mb-4 max-w-lg mx-auto">
          Visit your nearest <strong>Common Service Center (CSC)</strong> or district health office for assistance in enrolling in these schemes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-xs bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-medium border border-teal-100">Dial 104 (Health Helpline)</span>
          <span className="text-xs bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium border border-blue-100">Dial 14555 (Ayushman Bharat)</span>
          <span className="text-xs bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-medium border border-amber-100">Visit csc.gov.in</span>
        </div>
      </div>
    </div>
  );
};

export default Schemes;