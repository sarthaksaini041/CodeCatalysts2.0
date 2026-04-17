import React from 'react';

const colorConfig = {
  slate:   { bg: 'bg-slate-50',   text: 'text-slate-600',   icon: 'text-slate-500',   border: 'border-slate-200'  },
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  icon: 'text-indigo-500',  border: 'border-indigo-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500', border: 'border-emerald-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    icon: 'text-rose-500',    border: 'border-rose-100'   },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: 'text-amber-500',   border: 'border-amber-100'  },
};

const AdminStatCard = ({ title, value, icon: Icon, color = 'slate' }) => {
  const c = colorConfig[color] || colorConfig.slate;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.bg} ${c.icon} ${c.border} border`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">{value}</p>
      <p className={`text-xs font-medium mt-1 ${c.text}`}>{title}</p>
    </div>
  );
};

export default AdminStatCard;
