import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Zap,
  Rocket,
  Code2,
  MousePointer2,
  LogOut,
  ShieldCheck,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { supabase } from '../lib/supabase-browser';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'applications', label: 'Applications',        icon: FileText },
  { id: 'team',         label: 'Team Members',         icon: Users },
  { id: 'chapter1',     label: 'Genesis',              icon: Sparkles },
  { id: 'chapter2',     label: 'Shift',                icon: Zap },
  { id: 'chapter3',     label: 'Journey',              icon: Rocket },
  { id: 'chapter4',     label: 'Forge / Projects',     icon: Code2 },
  { id: 'footer',       label: 'Footer Settings',      icon: MousePointer2 },
];

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="w-64 h-screen bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-[60] shadow-2xl">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] flex-shrink-0">
          <ShieldCheck size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-white font-black text-[13px] tracking-tight leading-none mb-1 uppercase">Control Center</h2>
          <p className="text-[9px] text-white/30 font-black tracking-[0.2em] uppercase">Code Catalysts</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left relative overflow-hidden ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 font-black'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 top-0 w-1 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" 
                />
              )}
              <item.icon
                size={18}
                className={`flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-white/20 group-hover:text-white/60'} transition-all duration-300`}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider truncate">{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto text-indigo-500/50 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Log out */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-[11px] font-black uppercase tracking-widest group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
          <span>Exit System</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
