import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Stethoscope, 
  AlertTriangle, 
  Landmark, 
  Syringe, 
  Video, 
  Droplets, 
  Map,
  LogOut,
  User,
  Mic,
  Activity
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, setisOpen }) => {
  const { logoutUser } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', path: '/dashboard', end: true, icon: <LayoutDashboard size={20} /> },
    { name: 'Medical Vault', path: '/dashboard/vault', icon: <FolderOpen size={20} /> },
    { name: 'AI Diagnosis', path: '/dashboard/ai-diagnosis', icon: <Stethoscope size={20} /> },
    { name: 'Emergency', path: '/dashboard/emergency', icon: <AlertTriangle size={20} /> },
    { name: 'Govt Schemes', path: '/dashboard/schemes', icon: <Landmark size={20} /> },
    { name: 'Vaccination', path: '/dashboard/vaccination', icon: <Syringe size={20} /> },
    { name: 'Consultation', path: '/dashboard/consultation', icon: <Video size={20} /> },
    { name: 'Blood Finder', path: '/dashboard/blood-finder', icon: <Droplets size={20} /> },
    { name: 'Exercise Tracking', path: '/dashboard/exercise', icon: <Activity size={20} /> },
    { name: 'Voice Assistant', path: '/dashboard/voice', icon: <Mic size={20} /> },
    { name: 'Heatmap', path: '/dashboard/heatmap', icon: <Map size={20} /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <User size={20} /> },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-screen`}>
      <div className="flex h-16 items-center px-6 border-b border-slate-200 shrink-0">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-1.5 rounded-lg text-white">
            <Stethoscope size={20} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">MediCity India</span>
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={() => setisOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                isActive
                  ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 shrink-0">
        <button
          onClick={() => { logoutUser(); navigate('/login'); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-colors font-medium text-sm w-full"
        >
          <LogOut size={20} className="text-slate-400 group-hover:text-red-500" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
