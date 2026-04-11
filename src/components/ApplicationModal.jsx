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

const DetailItem = React.memo(({ icon: Icon, label, value, href }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let timer;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
        <Icon size={12} className="text-indigo-400/50" /> {label}
      </div>
      <div className="flex items-center gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-white font-black text-[13px] hover:text-indigo-400 transition-all flex items-center gap-2 group-hover:translate-x-1 duration-300">
            {value} <ExternalLink size={14} className="opacity-20 group-hover:opacity-100" />
          </a>
        ) : (
          <span className="text-white font-black text-[13px] tracking-tight">{value || 'N/A'}</span>
        )}
        
        {label === 'Email' && (
          <button 
            onClick={handleCopy}
            className="p-1 px-3 rounded-lg bg-white/5 hover:bg-indigo-500 text-white/40 hover:text-white transition-all text-[8px] font-black uppercase tracking-widest border border-white/5"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
});

const ApplicationModal = ({ app, onClose, onUpdateStatus, onDelete }) => {
  React.useEffect(() => {
    if (app) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [app]);

  if (!app) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-4xl max-h-full bg-black/40 border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-10 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <h2 className="text-white font-black text-4xl tracking-tighter uppercase">{app.name}</h2>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md ${
                  app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                  app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                }`}>
                  {app.status || 'pending'}
                </div>
              </div>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" /> Received: {new Date(app.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border border-white/5 cursor-pointer group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-12 gap-12 custom-scrollbar">
            {/* Left Column: Details */}
            <div className="md:col-span-4 space-y-10">
              <div className="space-y-8">
                <DetailItem icon={Mail} label="Contact" value={app.email} />
                <DetailItem icon={Briefcase} label="Institution" value={app.college} />
                <DetailItem icon={Calendar} label="Cycle" value={app.year} />
                <DetailItem icon={Globe} label="Sector" value={app.domain} />
              </div>

              <div className="pt-8 border-t border-white/5 space-y-5">
                <DetailItem icon={LinkedInIcon} label="Social Network" value="View LinkedIn" href={app.linkedin} />
                <DetailItem icon={GitHubIcon} label="Version Control" value="View GitHub" href={app.github} />
                {app.portfolio && <DetailItem icon={Globe} label="Portfolio" value="View Website" href={app.portfolio} />}
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="md:col-span-8 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                  <Cpu size={12} className="text-indigo-400" /> Technical Arsenal
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {app.tech_stack?.split(',').map((tech, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/60 font-black uppercase tracking-widest hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/20 transition-all cursor-default">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Mission Objective & Motivation</div>
                <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] text-white/50 text-[13px] leading-relaxed font-bold tracking-tight shadow-inner">
                  {app.reason}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-10 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-6">
            <button 
              onClick={() => onDelete(app.id)}
              className="px-8 py-4 rounded-2xl bg-transparent border border-white/5 text-white/20 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer group"
            >
              <Trash2 size={18} className="group-hover:scale-110 transition-transform" /> Purge Signal
            </button>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => onUpdateStatus(app.id, 'rejected')}
                className="px-8 py-4 rounded-2xl border border-white/5 bg-transparent text-white/30 hover:bg-white/5 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer"
              >
                Decline
              </button>
              <button 
                onClick={() => onUpdateStatus(app.id, 'approved')}
                className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] transition-all cursor-pointer transform hover:-translate-y-1"
              >
                Authorize Entry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplicationModal;
