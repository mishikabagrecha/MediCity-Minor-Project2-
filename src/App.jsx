import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Dashboard Views
import Overview from './dashboard/Overview';
import MedicalVault from './dashboard/MedicalVault';
import AIDiagnosis from './dashboard/AIDiagnosis';
import Emergency from './dashboard/Emergency';
import Schemes from './dashboard/Schemes';
import Vaccination from './dashboard/Vaccination';
import Consultation from './dashboard/Consultation';
import BloodFinder from './dashboard/BloodFinder';
import Heatmap from './dashboard/Heatmap';
import Profile from './dashboard/Profile';
import Exercise from './dashboard/Exercise';
import VoiceAssistant from './dashboard/VoiceAssistant';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Routes>
          {/* Dashboard Route (without global Navbar/Footer for app-like experience) */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="vault" element={<MedicalVault />} />
            <Route path="ai-diagnosis" element={<AIDiagnosis />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="vaccination" element={<Vaccination />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="blood-finder" element={<BloodFinder />} />
            <Route path="heatmap" element={<Heatmap />} />
            <Route path="profile" element={<Profile />} />
            <Route path="exercise" element={<Exercise />} />
            <Route path="voice" element={<VoiceAssistant />} />
          </Route>

          {/* Main Website Routes */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
