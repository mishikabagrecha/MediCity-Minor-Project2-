import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/vault': 'Medical Vault',
  '/dashboard/ai-diagnosis': 'AI Diagnosis',
  '/dashboard/emergency': 'Emergency Services',
  '/dashboard/schemes': 'Government Schemes',
  '/dashboard/vaccination': 'Vaccination Records',
  '/dashboard/consultation': 'Consultation',
  '/dashboard/blood-finder': 'Blood Finder',
  '/dashboard/exercise': 'Exercise Tracking',
  '/dashboard/voice': 'Voice Assistant',
  '/dashboard/heatmap': 'Health Heatmap',
  '/dashboard/profile': 'My Profile',
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  // Dynamic subtitle based on route
  const pageSubtitles = {
    '/dashboard': 'Your health at a glance',
    '/dashboard/vault': 'Your medical records',
    '/dashboard/ai-diagnosis': 'AI-powered health analysis',
    '/dashboard/emergency': 'Emergency contacts & ambulance',
    '/dashboard/schemes': 'Check your eligibility',
    '/dashboard/vaccination': 'Track your immunizations',
    '/dashboard/consultation': 'Book & join video calls',
    '/dashboard/blood-finder': 'Find blood donors near you',
    '/dashboard/exercise': 'Track your fitness journey',
    '/dashboard/voice': 'Talk to MediCity AI',
    '/dashboard/heatmap': 'Health trends visualization',
    '/dashboard/profile': 'Manage your profile',
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop & Mobile */}
      <Sidebar isOpen={sidebarOpen} setisOpen={setSidebarOpen} />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 hover:text-teal-600 focus:outline-none md:hidden mr-4"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-slate-800">{currentTitle}</h1>
              <p className="text-xs text-slate-400 font-medium">{pageSubtitles[location.pathname] || ''}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-teal-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-slate-500">{user?.age ? `${user.age} yrs • ` : ''}Patient Profile</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'GU'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
