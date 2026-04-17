import React, { useState } from 'react';
import { Mail, Building, Calendar, Globe, ExternalLink, Cpu, Trash2 } from 'lucide-react';
import AdminModal from '../shared/AdminModal';
import AdminButton from '../shared/AdminButton';
import StatusBadge from '../shared/StatusBadge';

const DetailRow = ({ icon: Icon, label, value, href }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
          >
            {value} <ExternalLink size={12} />
          </a>
        ) : (
          <p className="text-sm text-slate-900 font-medium">{value}</p>
        )}
      </div>
    </div>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

const ApplicationDetail = ({ app, onClose, onUpdateStatus, onDelete }) => {
  if (!app) return null;

  return (
    <AdminModal
      isOpen={!!app}
      onClose={onClose}
      title={app.name}
      description={`Applied ${new Date(app.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`}
      maxWidth="max-w-3xl"
      footer={
        <>
          <AdminButton variant="outline" size="sm" onClick={() => onDelete(app.id)}>
            <Trash2 size={14} /> Delete
          </AdminButton>
          <div className="flex items-center gap-2 ml-auto">
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(app.id, 'rejected')}
            >
              Reject
            </AdminButton>
            <AdminButton
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus(app.id, 'approved')}
            >
              Approve
            </AdminButton>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left — details */}
        <div className="md:col-span-4 space-y-1">
          <div className="mb-4">
            <StatusBadge status={app.status} />
          </div>

          <DetailRow icon={Mail} label="Email" value={app.email} />
          {app.email && (
            <div className="pl-[26px] -mt-1 pb-2">
              <CopyButton text={app.email} />
            </div>
          )}
          <DetailRow icon={Building} label="College" value={app.college} />
          <DetailRow icon={Calendar} label="Year" value={app.year} />
          <DetailRow icon={Globe} label="Domain" value={app.domain} />

          <div className="border-t border-slate-100 mt-3 pt-3 space-y-1">
            <DetailRow icon={Globe} label="LinkedIn" value="View Profile" href={app.linkedin} />
            <DetailRow icon={Globe} label="GitHub" value="View Profile" href={app.github} />
            {app.portfolio && (
              <DetailRow icon={Globe} label="Portfolio" value="View Website" href={app.portfolio} />
            )}
          </div>
        </div>

        {/* Right — tech + reason */}
        <div className="md:col-span-8 space-y-6">
          {/* Tech stack */}
          {app.tech_stack && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={14} className="text-slate-400" />
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tech Stack</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {String(app.tech_stack || '').split(',').filter(Boolean).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reason */}
          {app.reason && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Motivation
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600 leading-relaxed">
                {app.reason}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminModal>
  );
};

export default ApplicationDetail;
