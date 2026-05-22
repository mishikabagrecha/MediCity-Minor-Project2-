import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-1.5 rounded-lg text-white">
                <Activity size={20} />
              </div>
              <span className="font-bold text-lg text-gradient tracking-tight">MediCity India</span>
            </Link>
            <p className="text-sm text-slate-500 mb-4">
              Healthcare Access for Everyone, Everywhere. Empowering communities with equitable health digital services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors">
                <Phone size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors">
                <MapPin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-teal-600 transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-600 transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-teal-600 transition-colors">FAQ</Link></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Features</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/dashboard/ai-diagnosis" className="hover:text-teal-600 transition-colors">AI Diagnosis</Link></li>
              <li><Link to="/dashboard/vault" className="hover:text-teal-600 transition-colors">Medical Vault</Link></li>
              <li><Link to="/dashboard/schemes" className="hover:text-teal-600 transition-colors">Govt Schemes</Link></li>
              <li><Link to="/dashboard/consultation" className="hover:text-teal-600 transition-colors">Teleconsultation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MediCity India. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for equitable healthcare.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
