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
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
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
    <div className="space-y-6">
      {/* Controls Overlay */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicants..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-slate-900 text-sm outline-none focus:border-indigo-500 transition-all font-medium shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="appearance-none w-full md:w-48 bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-slate-700 text-sm outline-none cursor-pointer focus:border-indigo-500 shadow-sm"
            >
              {domains.map(d => <option key={d} value={d} className="bg-white">{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="appearance-none w-full md:w-32 bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-slate-700 text-sm outline-none cursor-pointer focus:border-indigo-500 shadow-sm"
            >
              {years.map(y => <option key={y} value={y} className="bg-white">{y}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Applicant</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Domain</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Year</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {applications.map((app, idx) => (
                  <motion.tr 
                    key={app.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold text-sm">{app.name}</span>
                        <span className="text-slate-400 text-xs">{app.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {app.domain}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {app.year}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400 tabular-nums">
                      {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => onView(app)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center justify-center border-none cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'approved')}
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors flex items-center justify-center border-none cursor-pointer"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'rejected')}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center justify-center border-none cursor-pointer"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(app.id)}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-600 hover:text-white text-slate-400 transition-all flex items-center justify-center border-none cursor-pointer"
                          title="Delete"
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
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Search className="text-slate-300" size={24} />
            </div>
            <p className="font-bold text-sm text-slate-400">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ApplicationTable;
