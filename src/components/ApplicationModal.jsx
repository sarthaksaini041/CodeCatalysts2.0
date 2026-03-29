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
    <div className="space-y-1.5 group">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
        <Icon size={12} /> {label}
      </div>
      <div className="flex items-center gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-white font-black text-sm hover:text-primary transition-colors flex items-center gap-2">
            {value} <ExternalLink size={14} className="opacity-40" />
          </a>
        ) : (
          <span className="text-white font-black text-sm">{value || 'N/A'}</span>
        )}
        
        {label === 'Email' && (
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
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
          className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-full bg-white/[0.03] border border-white/10 rounded-[48px] overflow-hidden flex flex-col shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="p-10 border-b border-white/5 flex items-start justify-between bg-white/[0.01]">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-black text-4xl tracking-tighter leading-none">{app.name}</h2>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  app.status === 'approved' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                  app.status === 'rejected' ? 'bg-rose-400/10 text-rose-400 border-rose-400/20' :
                  'bg-amber-400/10 text-amber-400 border-amber-400/20'
                }`}>
                  {app.status || 'pending'}
                </div>
              </div>
              <p className="text-white/30 text-xs font-black tracking-widest uppercase flex items-center gap-2">
                <Calendar size={14} /> Submitted on {new Date(app.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center border-none cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Left Column: Details */}
            <div className="md:col-span-4 space-y-10">
              <div className="space-y-6">
                <DetailItem icon={Mail} label="Email" value={app.email} />
                <DetailItem icon={Briefcase} label="College" value={app.college} />
                <DetailItem icon={Calendar} label="Year" value={app.year} />
                <DetailItem icon={Globe} label="Domain" value={app.domain} />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-6 font-black uppercase tracking-widest">
                <DetailItem icon={LinkedInIcon} label="LinkedIn" value="Profile" href={app.linkedin} />
                <DetailItem icon={GitHubIcon} label="GitHub" value="Profile" href={app.github} />
                {app.portfolio && <DetailItem icon={Globe} label="Portfolio" value="Website" href={app.portfolio} />}
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="md:col-span-8 space-y-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                  <Cpu size={12} /> Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.tech_stack?.split(',').map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 text-xs text-white/60 font-black">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Motivation_Data</div>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] text-white/60 text-sm leading-relaxed font-medium">
                  {app.reason}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-10 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-4">
            <button 
              onClick={() => onDelete(app.id)}
              className="px-6 py-4 rounded-2xl bg-red-400/10 hover:bg-red-500 text-red-500 group-hover:text-white transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest border-none cursor-pointer"
            >
              <Trash2 size={18} /> Delete Entry
            </button>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => onUpdateStatus(app.id, 'rejected')}
                className="px-8 py-4 rounded-2xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Reject Application
              </button>
              <button 
                onClick={() => onUpdateStatus(app.id, 'approved')}
                className="px-8 py-4 rounded-2xl bg-white text-black hover:scale-105 transition-all text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Approve Application
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplicationModal;
