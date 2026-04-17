import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Sparkles,
  Zap,
  Rocket,
  Code2,
  Users2,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { signOut } from '@/core/services/admin';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'applications', label: 'Applications',   icon: FileText },
  { id: 'team',         label: 'Team',           icon: Users },
  { id: 'hero',         label: 'Hero',           icon: Sparkles },
  { id: 'genesis',      label: 'Genesis',        icon: Sparkles },
  { id: 'shift',        label: 'Shift',          icon: Zap },
  { id: 'journey',      label: 'Journey',        icon: Rocket },
  { id: 'projects',     label: 'Projects',       icon: Code2 },
  { id: 'architects',   label: 'Architects',     icon: Users2 },
  { id: 'footer',       label: 'Footer',         icon: Settings },
];

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-200
          flex flex-col z-[60] transition-transform duration-300
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 leading-none">Code Catalysts</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                  transition-colors duration-200 group relative
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <item.icon
                  size={16}
                  className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}
                />
                <span className="text-sm truncate">{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto text-indigo-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm"
          >
            <LogOut size={16} className="flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
