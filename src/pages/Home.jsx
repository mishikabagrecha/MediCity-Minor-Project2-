import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Activity, Users, Clock, ArrowRight, HeartPulse, Stethoscope, Video, Database } from 'lucide-react';
import { FeatureCard } from '../components/Cards';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    { title: "AI Health Assistant", description: "Get instant preliminary diagnosis powered by advanced AI models.", icon: <Activity size={24} /> },
    { title: "Medical Vault", description: "Securely store and access your medical records anywhere, anytime.", icon: <Database size={24} /> },
    { title: "Teleconsultation", description: "Connect with certified doctors via high-quality video calls.", icon: <Video size={24} /> },
    { title: "Emergency SOS", description: "One-tap emergency alerts and nearest hospital routing.", icon: <Shield size={24} /> },
    { title: "Govt Schemes", description: "Discover and apply for healthcare schemes you are eligible for.", icon: <Users size={24} /> },
    { title: "Vaccination Tracker", description: "Never miss a dose with automated vaccination reminders.", icon: <Clock size={24} /> },
    { title: "Blood Finder", description: "Real-time blood availability tracking and donor matching.", icon: <HeartPulse size={24} /> },
    { title: "Specialist Network", description: "Access a wide network of verified healthcare specialists.", icon: <Stethoscope size={24} /> },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col-reverse lg:flex-row items-center">
          
          <div className="lg:w-1/2 lg:pr-12 mt-12 lg:mt-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-medium text-sm mb-6 border border-teal-100"
            >
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
              Revolutionizing Urban Healthcare
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Healthcare Access for <span className="text-gradient">Everyone, Everywhere.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              Empowering communities with equitable health services, AI-driven diagnostics, and seamless medical record management.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/signup" className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center">
                Learn More
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 h-[400px] lg:h-[600px] w-full relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-slate-950/10 via-transparent to-transparent pointer-events-none" />
             <div className="absolute left-1/2 bottom-10 -translate-x-1/2 w-[62%] h-24 rounded-full bg-slate-900/10 shadow-[0_30px_80px_rgba(14,165,233,0.18)] blur-2xl pointer-events-none" />
             <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-[46%] h-8 rounded-full bg-white/15 shadow-[0_0_60px_rgba(56,189,248,0.25)] pointer-events-none" />
             <div className="relative w-full h-full max-w-[550px] max-h-[560px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-950/10">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                <iframe
                   title="Female doctor 36"
                   frameBorder="0"
                   allowFullScreen
                   mozallowfullscreen="true"
                   webkitallowfullscreen="true"
                   allow="autoplay; fullscreen; xr-spatial-tracking"
                   src="https://sketchfab.com/models/b253da68cf714a53ae83c30224258ff4/embed?autostart=1&ui_infos=0&ui_watermark=0&ui_logotype=0&ui_controls=0&ui_stop=0&ui_animations=1&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&transparent=1"
                   className="w-full h-full min-h-[400px] min-w-[320px] bg-transparent pointer-events-none"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive Care Ecosystem</h2>
            <p className="text-lg text-slate-600">Everything you need to manage your health, accessible from a single unified platform.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <FeatureCard 
                key={idx}
                title={feature.title} 
                description={feature.description} 
                icon={feature.icon} 
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works / Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How MediCity India Works</h2>
            <p className="text-lg text-slate-600">A seamless journey towards better health management.</p>
          </div>
          
          <div className="relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-teal-100 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: "01", title: "Create Account", desc: "Sign up and build your secure medical profile." },
                { step: "02", title: "Connect", desc: "Link with doctors, hospitals, and access schemes." },
                { step: "03", title: "Manage Health", desc: "Get AI insights, track records, and consult easily." }
              ].map((item, i) => (
                <div key={i} className="text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-teal-500/30">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-slate-400">Hear what our users have to say about the MediCity experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "MediCity India completely changed how I manage my family's health records. The AI diagnosis is incredibly helpful before deciding to visit a doctor.", author: "Sunita Sharma", role: "Mother of two" },
              { text: "As someone who needs regular blood transfusions, the Blood Finder feature has been a literal lifesaver. Finding donors in Delhi is so much easier now.", author: "Rahul Verma", role: "Patient" },
              { text: "The PM-JAY govt schemes integration helped me discover benefits I didn't even know I was eligible for at Apollo Hospital, saving me thousands on medical bills.", author: "Amit Patel", role: "Freelancer" }
            ].map((t, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="flex gap-1 text-teal-400 mb-6">
                  {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                </div>
                <p className="text-slate-300 italic mb-6">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-white">{t.author}</h4>
                  <p className="text-sm text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
