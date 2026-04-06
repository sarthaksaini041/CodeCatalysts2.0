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
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0 z-20">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-slate-900 font-bold text-sm tracking-tight leading-none mb-1">Admin Panel</h2>
          <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Verified Access</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-bold' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`} />
              <span className="text-xs font-semibold">{item.label}</span>
              
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-indigo-300" />
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-4 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold group"
      >
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default AdminSidebar;
