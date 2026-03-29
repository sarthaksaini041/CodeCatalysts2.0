import React from 'react';
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

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    approved: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    rejected: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status || 'pending'}
    </span>
  );
};

const ApplicationTable = ({ 
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
  
  const domains = ['All Domains', ...new Set(applications.map(a => a.domain))];
  const years = ['All Years', ...new Set(applications.map(a => a.year))];

  return (
    <div className="space-y-6">
      {/* Controls Overlay */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:bg-white/5 focus:border-white/10 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="appearance-none w-full md:w-48 bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-4 pr-10 text-white text-sm outline-none cursor-pointer focus:bg-white/5"
            >
              {domains.map(d => <option key={d} value={d} className="bg-[#0f0f0f]">{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="appearance-none w-full md:w-32 bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-4 pr-10 text-white text-sm outline-none cursor-pointer focus:bg-white/5"
            >
              {years.map(y => <option key={y} value={y} className="bg-[#0f0f0f]">{y}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Applicant</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Domain</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Year</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Date</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {applications.map((app, idx) => (
                  <motion.tr 
                    key={app.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm">{app.name}</span>
                        <span className="text-white/30 text-xs font-medium">{app.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-white/60 uppercase tracking-widest leading-none">
                      {app.domain}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-white/60">
                      {app.year}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-white/30 tabular-nums">
                      {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onView(app)}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center justify-center p-0 border-none cursor-pointer"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'approved')}
                          className="w-10 h-10 rounded-xl bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 transition-colors flex items-center justify-center p-0 border-none cursor-pointer"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'rejected')}
                          className="w-10 h-10 rounded-xl bg-rose-400/10 hover:bg-rose-400/20 text-rose-400 transition-colors flex items-center justify-center p-0 border-none cursor-pointer"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(app.id)}
                          className="w-10 h-10 rounded-xl bg-red-400/10 hover:bg-red-400 text-red-400 group-hover:text-white transition-all flex items-center justify-center p-0 border-none cursor-pointer"
                        >
                          <Trash2 size={18} />
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
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-20">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white flex items-center justify-center mb-6">
              <Search size={32} />
            </div>
            <p className="font-black text-xs tracking-widest uppercase">NO_SIGNALS_FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTable;
