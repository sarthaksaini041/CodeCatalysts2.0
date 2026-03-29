import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles,
  Zap,
  Rocket,
  Code2,
  Network,
  MousePointer2,
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: Users },
  { id: 'chapter1', label: 'Chapter 1: Genesis', icon: Sparkles },
  { id: 'chapter2', label: 'Chapter 2: Shift', icon: Zap },
  { id: 'chapter3', label: 'Chapter 3: Journey', icon: Rocket },
  { id: 'chapter4', label: 'Chapter 4: Projects', icon: Code2 },
  { id: 'chapter5', label: 'Chapter 5: Architects', icon: Network },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'footer', label: 'Footer Settings', icon: MousePointer2 },
];

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="w-64 h-screen bg-white/[0.02] border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-20 backdrop-blur-3xl">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-white font-black text-sm tracking-tight leading-none mb-1">ADMIN_HUB</h2>
          <p className="text-[10px] text-white/30 font-black tracking-widest uppercase">Verified Access</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/5 text-white shadow-lg' 
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <item.icon size={18} className={`${isActive ? 'text-primary' : 'group-hover:text-white'} transition-colors`} />
              <span className="text-xs font-black tracking-tight">{item.label}</span>
              
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-white/20" />
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-black tracking-tight group"
      >
        <LogOut size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span>TERMINATE_SESSION</span>
      </button>
    </div>
  );
};

export default AdminSidebar;
