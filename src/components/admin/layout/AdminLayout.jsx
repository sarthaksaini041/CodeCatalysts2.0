import React, { useState } from 'react';
import { Menu, RefreshCcw, ExternalLink } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useCMS } from '../../../hooks/useCMS';
import AdminButton from '../shared/AdminButton';

const TAB_TITLES = {
  dashboard:    'Dashboard',
  applications: 'Applications',
  team:         'Team Members',
  hero:         'Hero Section',
  genesis:      'Genesis Section',
  shift:        'Shift Section',
  journey:      'Journey Section',
  projects:     'Projects',
  architects:   'Architects',
  footer:       'Footer Settings',
};

const AdminLayout = ({ activeTab, setActiveTab, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { refresh } = useCMS();

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <main className="lg:ml-[260px] min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {TAB_TITLES[activeTab] || activeTab}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => refresh()}
                className="text-slate-500 hover:text-indigo-600"
              >
                <RefreshCcw size={16} />
                <span className="hidden sm:inline ml-2">Sync Data</span>
              </AdminButton>
              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
              >
                <ExternalLink size={16} />
                <span className="hidden sm:inline ml-2">View Site</span>
              </AdminButton>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
