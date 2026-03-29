import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  MousePointer2,
  Download,
  Plus,
  Loader2,
  LayoutDashboard,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Rocket,
  Code2,
  Network,
  ShieldCheck,
  Star
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import AdminSidebar from '../components/AdminSidebar';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationModal from '../components/ApplicationModal';
import StatCard from '../components/StatCard';

// CMS Section Managers
import GenesisManager from '../components/cms/GenesisManager';
import ShiftManager from '../components/cms/ShiftManager';
import JourneyManager from '../components/cms/JourneyManager';
import ForgeManager from '../components/cms/ForgeManager';
import ArchitectsManager from '../components/cms/ArchitectsManager';
import TeamManager from '../components/cms/TeamManager';
import FooterSettings from '../components/cms/FooterSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('All Domains');
  const [filterYear, setFilterYear] = useState('All Years');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
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
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(prev => ({ ...prev, status }));
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApplications(prev => prev.filter(app => app.id !== id));
      setSelectedApp(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const stats = useMemo(() => {
    const total = applications.length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    const pending = applications.filter(a => !a.status || a.status === 'pending').length;
    
    // Find most popular domain
    const domainCounts = applications.reduce((acc, app) => {
      acc[app.domain] = (acc[app.domain] || 0) + 1;
      return acc;
    }, {});
    
    const mostPopularDomain = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { total, approved, rejected, pending, mostPopularDomain };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDomain = filterDomain === 'All Domains' || app.domain === filterDomain;
      const matchesYear = filterYear === 'All Years' || app.year === filterYear;

      return matchesSearch && matchesDomain && matchesYear;
    });
  }, [applications, searchTerm, filterDomain, filterYear]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-outfit text-left">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-10 relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Header */}
        <div className="flex items-end justify-between mb-12 relative z-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent text-left">
              {activeTab.toUpperCase()}_COMMAND
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
              Central Processing Unit / Code Catalysts v2.0
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">SYSTEM_NOMINAL</span>
            </div>
            <button 
              onClick={() => {
                const csv = [
                  ['Name', 'Email', 'College', 'Domain', 'Status', 'Date'],
                  ...applications.map(a => [a.name, a.email, a.college, a.domain, a.status || 'pending', a.created_at])
                ].map(e => e.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('href', url);
                a.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
                a.click();
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download size={14} /> EXPORT_DATA
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dash"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="TOTAL_APPLICATIONS" value={stats.total} icon={Users} color="white" delay={0.1} />
                <StatCard title="APPROVED_SIGS" value={stats.approved} icon={CheckCircle} color="primary" delay={0.2} subValue="+12%" />
                <StatCard title="REJECTED_SIGS" value={stats.rejected} icon={XCircle} color="white" delay={0.3} subValue="-5%" />
                <StatCard title="PRIME_DOMAIN" value={stats.mostPopularDomain} icon={MousePointer2} color="primary" delay={0.4} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">LATEST_SIGNALS</h3>
                    <button 
                      onClick={() => setActiveTab('applications')}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2"
                    >
                      VIEW_ALL_COMMAND <ArrowRight size={12} />
                    </button>
                  </div>
                  <ApplicationTable 
                    applications={filteredApplications.slice(0, 5)} 
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
                
                <div className="lg:col-span-4 space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-widest text-white/40 px-2">DOMAIN_DYNAMICS</h3>
                   <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
                      {Object.entries(
                        applications.reduce((acc, a) => {
                          acc[a.domain] = (acc[a.domain] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([domain, count]) => (
                        <div key={domain} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white/60">{domain}</span>
                            <span className="text-white">{count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / stats.total) * 100}%` }}
                              className="h-full bg-primary"
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div 
              key="apps"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
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

          {activeTab === 'chapter1' && (
             <motion.div key="ch1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
               <GenesisManager />
             </motion.div>
          )}

          {activeTab === 'chapter2' && (
             <motion.div key="ch2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
               <ShiftManager />
             </motion.div>
          )}

          {activeTab === 'chapter3' && (
             <motion.div key="ch3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
               <JourneyManager />
             </motion.div>
          )}

          {activeTab === 'chapter4' && (
             <motion.div key="ch4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
               <ForgeManager />
             </motion.div>
          )}

          {activeTab === 'chapter5' && (
             <motion.div key="ch5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
               <ArchitectsManager />
             </motion.div>
          )}

          {activeTab === 'team' && (
             <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
               <TeamManager />
             </motion.div>
          )}

          {activeTab === 'footer' && (
             <motion.div key="footer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
               <FooterSettings />
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Details Modal */}
      <ApplicationModal 
        app={selectedApp} 
        onClose={() => setSelectedApp(null)} 
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
      
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/50 backdrop-blur-sm">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
