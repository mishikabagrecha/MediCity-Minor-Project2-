import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Activity, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logoutUser } = useUser();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-lg text-white">
                <Activity size={24} />
              </div>
              <span className="font-bold text-xl text-gradient tracking-tight">MediCity India</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                    isActive(link.path) ? 'text-teal-600' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                    Log in
                  </Link>
                  <Link to="/signup" className="text-sm font-medium bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-teal-500/30 transition-all">
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors">Dashboard</Link>
                  <div className="flex items-center gap-2 bg-slate-100 pl-2 pr-4 py-1.5 rounded-full border border-slate-200">
                    <UserCircle className="text-teal-600" size={24} />
                    <span className="text-sm font-bold text-slate-800">{user?.name?.split(' ')[0] || 'User'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-teal-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-2 px-3">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center text-base font-medium text-slate-600 hover:text-teal-600 py-2">
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block text-center text-base font-medium bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-md">
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-center text-base font-medium bg-slate-100 text-slate-800 px-4 py-2 rounded-md">
                      Go to Dashboard
                    </Link>
                    <button onClick={() => { logoutUser(); navigate('/'); setIsOpen(false); }} className="block text-center text-base font-medium text-red-500 py-2">
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
