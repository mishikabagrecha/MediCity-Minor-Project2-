import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const QA = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button className="flex justify-between items-center w-full text-left font-semibold text-slate-800" onClick={() => setOpen(!open)}>
        {question}
        {open ? <ChevronUp size={20} className="text-teal-600" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      {open && <p className="mt-4 text-slate-600">{answer}</p>}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "Is MediCity India really free to use?", a: "The core features of MediCity India, including the medical vault, standard AI diagnosis, and emergency SOS, are completely free. We also offer a premium tier for advanced features." },
    { q: "How secure is my medical data?", a: "We take privacy seriously. All data is encrypted end-to-end and stored securely complying with international healthcare data regulations (HIPAA)." },
    { q: "Can I use the app for real-time emergencies?", a: "Yes, the Emergency SOS feature alerts predefined contacts and local hospitals with your exact GPS coordinates instantly." },
  ];

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {faqs.map((faq, i) => <QA key={i} question={faq.q} answer={faq.a} />)}
      </div>
    </div>
  );
};

export default FAQ;
