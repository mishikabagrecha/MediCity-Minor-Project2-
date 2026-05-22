import React from 'react';

const Pricing = () => (
  <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing for India</h1>
      <p className="text-lg text-slate-600">Choose the plan that fits your healthcare needs.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic</h3>
        <p className="text-4xl font-extrabold text-slate-900 mb-6">₹0<span className="text-lg font-normal text-slate-500">/mo</span></p>
        <ul className="space-y-4 mb-8 text-slate-600">
          <li>✓ Basic features</li>
          <li>✓ Govt scheme checker (PM-JAY, etc.)</li>
          <li>✓ Limited Medical Vault storage</li>
          <li>✓ Blood Bank & Hospital Finder</li>
        </ul>
        <button className="w-full py-3 rounded-lg bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors">Current Plan</button>
      </div>

      <div className="bg-gradient-to-b from-teal-50 to-white p-8 rounded-2xl shadow-xl border border-teal-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium</h3>
        <p className="text-4xl font-extrabold text-slate-900 mb-6">₹299<span className="text-lg font-normal text-slate-500">/mo</span></p>
        <ul className="space-y-4 mb-8 text-slate-600">
          <li>✓ Unlimited Medical Vault storage</li>
          <li>✓ Advanced AI Diagnosis Models</li>
          <li>✓ Priority Teleconsultations & Support</li>
          <li>✓ Advanced Live Ambulance Tracking (SOS)</li>
        </ul>
        <button className="w-full py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/30">Upgrade to Premium</button>
      </div>
    </div>
  </div>
);

export default Pricing;
