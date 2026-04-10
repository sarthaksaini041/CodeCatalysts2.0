import React from 'react';
import { motion } from 'framer-motion';

const COLORS = {
  slate:   { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-100'   },
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-100'  },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100'    },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100'   },
};

const StatCard = ({ title, value, icon: Icon, color = 'slate', delay = 0 }) => {
  const c = COLORS[color] || COLORS.slate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 group-hover:scale-105 transition-transform ${c.bg} ${c.text} ${c.border}`}>
        <Icon size={20} />
      </div>
      <p className="text-3xl font-black text-slate-900 tabular-nums tracking-tight mb-1">{value}</p>
      <p className="text-xs font-medium text-slate-400">{title}</p>
    </motion.div>
  );
};

export default StatCard;
