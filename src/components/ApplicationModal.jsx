import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Globe, 
  ExternalLink, 
  Calendar, 
  Briefcase, 
  Cpu, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './icons/TechnicalIcons';

const DetailItem = ({ icon: Icon, label, value, href }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1 group">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Icon size={12} /> {label}
      </div>
      <div className="flex items-center gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-slate-900 font-bold text-sm hover:text-indigo-600 transition-colors flex items-center gap-2">
            {value} <ExternalLink size={14} className="opacity-40" />
          </a>
        ) : (
          <span className="text-slate-900 font-bold text-sm">{value || 'N/A'}</span>
        )}
        
        {label === 'Email' && (
          <button 
            onClick={handleCopy}
            className="p-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-bold uppercase tracking-tight"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
};

const ApplicationModal = ({ app, onClose, onUpdateStatus, onDelete }) => {
  if (!app) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-full bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-start justify-between bg-white">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h2 className="text-slate-900 font-bold text-3xl tracking-tight leading-none">{app.name}</h2>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  app.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                  'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {app.status || 'pending'}
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium flex items-center gap-2">
                <Calendar size={14} /> Submitted on {new Date(app.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all flex items-center justify-center border-none cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Left Column: Details */}
            <div className="md:col-span-4 space-y-8">
              <div className="space-y-6">
                <DetailItem icon={Mail} label="Email" value={app.email} />
                <DetailItem icon={Briefcase} label="College" value={app.college} />
                <DetailItem icon={Calendar} label="Year" value={app.year} />
                <DetailItem icon={Globe} label="Domain" value={app.domain} />
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <DetailItem icon={LinkedInIcon} label="LinkedIn" value="View Profile" href={app.linkedin} />
                <DetailItem icon={GitHubIcon} label="GitHub" value="View Repository" href={app.github} />
                {app.portfolio && <DetailItem icon={Globe} label="Portfolio" value="View Website" href={app.portfolio} />}
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="md:col-span-8 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Cpu size={12} /> Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.tech_stack?.split(',').map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 font-semibold">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Motivation & Goals</div>
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed font-medium">
                  {app.reason}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
            <button 
              onClick={() => onDelete(app.id)}
              className="px-6 py-3 rounded-xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Trash2 size={18} /> Delete Application
            </button>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => onUpdateStatus(app.id, 'rejected')}
                className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reject
              </button>
              <button 
                onClick={() => onUpdateStatus(app.id, 'approved')}
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Approve Entry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplicationModal;
