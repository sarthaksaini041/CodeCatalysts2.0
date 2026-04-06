import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, subValue, icon: Icon, color = 'indigo', delay = 0 }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const selectedColor = colorClasses[color] || colorClasses.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${selectedColor}`}>
          <Icon size={20} />
        </div>
        {subValue && (
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {subValue.includes('+') ? <TrendingUp size={12} className="text-emerald-500" /> : 
             subValue.includes('-') ? <TrendingDown size={12} className="text-rose-500" /> : 
             <Minus size={12} />}
            {subValue}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-slate-900 font-bold text-2xl tracking-tight tabular-nums">
          {value}
        </h3>
        <p className="text-slate-400 text-xs font-medium tracking-tight">
          {title}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
