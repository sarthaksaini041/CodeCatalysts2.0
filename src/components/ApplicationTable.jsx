import React, { useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2,
  ChevronDown
} from 'lucide-react';

const StatusBadge = memo(({ status }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${styles[status] || styles.pending} backdrop-blur-md`}>
      {status || 'pending'}
    </span>
  );
});

const ApplicationTable = memo(({ 
  applications, 
  loading, 
  onView, 
  onUpdateStatus, 
  onDelete,
  searchTerm,
  setSearchTerm,
  filterDomain,
  setFilterDomain,
  filterYear,
  setFilterYear
}) => {
  
  const domains = useMemo(() => ['All Domains', ...new Set(applications.map(a => a.domain))], [applications]);
  const years = useMemo(() => ['All Years', ...new Set(applications.map(a => a.year))], [applications]);

  return (
    <div className="space-y-8">
      {/* Controls Overlay */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative z-20">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicants..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white/[0.06] focus:border-indigo-500/50 transition-all backdrop-blur-xl shadow-2xl"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="appearance-none w-full md:w-48 bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-5 pr-12 text-white/60 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer focus:border-indigo-500/50 backdrop-blur-xl transition-all"
            >
              {domains.map(d => <option key={d} value={d} className="bg-[#0a0a0b] text-white">{d}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="appearance-none w-full md:w-36 bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-5 pr-12 text-white/60 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer focus:border-indigo-500/50 backdrop-blur-xl transition-all"
            >
              {years.map(y => <option key={y} value={y} className="bg-[#0a0a0b] text-white">{y}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Specialization</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Cycle</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Registry Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {applications.map((app, idx) => (
                  <motion.tr 
                    key={app.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-white/[0.03] transition-all duration-300 cursor-default"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          {app.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-[13px] tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{app.name}</span>
                          <span className="text-white/30 text-[10px] font-bold tracking-widest">{app.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="px-2 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded text-[9px] font-black uppercase tracking-widest text-indigo-400/80">
                        {app.domain}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-black text-white/40 tabular-nums">
                      {app.year}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-white/20 tabular-nums uppercase tracking-tighter">
                      {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onView(app)}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-500 text-white transition-all flex items-center justify-center border border-white/5 cursor-pointer shadow-lg active:scale-95"
                          title="Decrypt Profile"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'approved')}
                          className="w-10 h-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all flex items-center justify-center border border-emerald-500/20 cursor-pointer shadow-lg active:scale-95"
                          title="Authorize"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'rejected')}
                          className="w-10 h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all flex items-center justify-center border border-rose-500/20 cursor-pointer shadow-lg active:scale-95"
                          title="Terminate"
                        >
                          <XCircle size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(app.id)}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600 text-white/40 hover:text-white transition-all flex items-center justify-center border border-white/5 cursor-pointer shadow-lg active:scale-95"
                          title="Purge Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!loading && applications.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 animate-pulse">
              <Search className="text-white/10" size={32} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-white/30">No active signals found in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ApplicationTable;
