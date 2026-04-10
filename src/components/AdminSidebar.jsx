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
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-slate-900 font-bold text-sm tracking-tight leading-none mb-1">Admin Panel</h2>
          <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Code Catalysts</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-left ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon
                size={17}
                className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}
              />
              <span className="text-xs font-semibold truncate">{item.label}</span>
              {isActive && <ChevronRight size={13} className="ml-auto text-indigo-300 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Log out */}
      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold group"
      >
        <LogOut size={17} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default AdminSidebar;
