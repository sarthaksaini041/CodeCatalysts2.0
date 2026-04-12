import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase-browser';
import AdminSidebar from '../components/AdminSidebar';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationModal from '../components/ApplicationModal';
import StatCard from '../components/StatCard';

// CMS Section Managers
import GenesisManager  from '../components/cms/GenesisManager';
import ShiftManager    from '../components/cms/ShiftManager';
import JourneyManager  from '../components/cms/JourneyManager';
import ForgeManager    from '../components/cms/ForgeManager';
import TeamManager     from '../components/cms/TeamManager';
import ArchitectsManager from '../components/cms/ArchitectsManager';
import HeroManager from '../components/cms/HeroManager';
import FooterSettings  from '../components/cms/FooterSettings';

/* ── Tab → Component map (CMS sections) ─────────────────── */
const CMS_TABS = {
  chapter1: GenesisManager,
  hero: HeroManager,
  chapter2: ShiftManager,
  chapter3: JourneyManager,
  chapter4: ForgeManager,
  chapter5: ArchitectsManager,
  team:     TeamManager,
  footer:   FooterSettings,
};

/* ── Tab title labels ────────────────────────────────────── */
const TAB_LABELS = {
  dashboard:    'Overview',
  applications: 'Applications',
  hero:         'The Spark (Hero)',
  chapter1:     'Genesis',
  chapter2:     'Shift',
  chapter3:     'Journey',
  chapter4:     'Forge / Projects',
  chapter5:     'Architects',
  team:         'Team Members',
  footer:       'Footer Settings',
};

/* ── Export applications as CSV ──────────────────────────── */
const exportCSV = (applications) => {
  const rows = [
    ['Name', 'Email', 'College', 'Domain', 'Year', 'Status', 'Date'],
    ...applications.map(a => [
      a.name, a.email, a.college, a.domain, a.year,
      a.status || 'pending',
      new Date(a.created_at).toLocaleDateString(),
    ]),
  ];
  const csv  = rows.map(r => r.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `applications_${new Date().toISOString().split('T')[0]}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
};

/* ── Slide transition ────────────────────────────────────── */
const tabVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -16 },
};

/* ── AdminDashboard ──────────────────────────────────────── */
const AdminDashboard = () => {
  const [activeTab,   setActiveTab]   = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  // Filters & search
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterDomain,  setFilterDomain]  = useState('All Domains');
  const [filterYear,    setFilterYear]    = useState('All Years');

  /* ── Fetch ── */
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  /* ── Update status ── */
  const handleUpdateStatus = useCallback(async (id, status) => {
    try {
      const { error } = await supabase.from('applications').update({ status }).eq('id', id);
      if (error) throw error;
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      setSelectedApp(prev => prev?.id === id ? { ...prev, status } : prev);
    } catch (err) {
      console.error('Update error:', err);
    }
  }, []);

  /* ── Delete ── */
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this application? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      setApplications(prev => prev.filter(a => a.id !== id));
      setSelectedApp(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, []);

  /* ── Computed stats (all live from data) ── */
  const stats = useMemo(() => {
    const total    = applications.length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    const pending  = applications.filter(a => !a.status || a.status === 'pending').length;
    return { total, approved, rejected, pending };
  }, [applications]);

  /* ── Filtered list ── */
  const debouncedSearch = useDebounce(searchTerm, 300);
  const filteredApplications = useMemo(() => applications.filter(app => {
    const matchSearch  = (app.name + app.email).toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchDomain  = filterDomain === 'All Domains' || app.domain === filterDomain;
    const matchYear    = filterYear   === 'All Years'   || app.year   === filterYear;
    return matchSearch && matchDomain && matchYear;
  }), [applications, debouncedSearch, filterDomain, filterYear]);

  /* ── Resolve active CMS manager component ── */
  const CmsComponent = CMS_TABS[activeTab] ?? null;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex font-outfit text-left overflow-x-hidden">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed]/5 via-transparent to-[#06b6d4]/5 opacity-40" />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#7c3aed]/10 to-transparent blur-[120px]" />
      </div>

      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-10 relative min-h-screen z-10">
        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-12 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">System Core v2.4</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm uppercase">
              {TAB_LABELS[activeTab] ?? activeTab}
            </h1>
            <p className="text-white/40 text-[11px] font-bold tracking-wider mt-1 uppercase">Command & Control Center</p>
          </div>

          {/* Show export only on data tabs */}
          {(activeTab === 'dashboard' || activeTab === 'applications') && (
            <button
              onClick={() => exportCSV(applications)}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-xl backdrop-blur-md group"
            >
              <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Export Database
            </button>
          )}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div key="dash" variants={tabVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.2 }} className="space-y-10 relative z-10"
            >
              {/* Real stat cards — no fake percentages */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Total"    value={stats.total}    icon={Users}        color="slate"   delay={0.05} />
                <StatCard title="Pending"  value={stats.pending}  icon={Clock}        color="amber"   delay={0.1} />
                <StatCard title="Approved" value={stats.approved} icon={CheckCircle}  color="emerald" delay={0.15} />
                <StatCard title="Rejected" value={stats.rejected} icon={XCircle}      color="rose"    delay={0.2} />
              </div>

              {/* Recent applications preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Intelligence Feed</h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-[10px] font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                  >
                    ACCESS ALL <ArrowRight size={12} />
                  </button>
                </div>
                <ApplicationTable
                  applications={filteredApplications.slice(0, 8)}
                  loading={loading}
                  onView={setSelectedApp}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterDomain={filterDomain}
                  setFilterDomain={setFilterDomain}
                  filterYear={filterYear}
                  setFilterYear={setFilterYear}
                />
              </div>
            </motion.div>
          )}

          {/* APPLICATIONS */}
          {activeTab === 'applications' && (
            <motion.div key="apps" variants={tabVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.2 }} className="relative z-10"
            >
              <ApplicationTable
                applications={filteredApplications}
                loading={loading}
                onView={setSelectedApp}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterDomain={filterDomain}
                setFilterDomain={setFilterDomain}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
              />
            </motion.div>
          )}

          {/* CMS MANAGERS — resolved from config map */}
          {CmsComponent && (
            <motion.div key={activeTab} variants={tabVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.2 }} className="relative z-10"
            >
              <CmsComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Application detail modal */}
      <ApplicationModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />

      {/* Global loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Synchronizing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
