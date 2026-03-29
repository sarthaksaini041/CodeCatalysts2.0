import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, subValue, icon: Icon, color = 'primary', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.05] transition-all group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color} border border-${color}/20 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {subValue && (
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/20">
            {subValue.includes('+') ? <TrendingUp size={12} className="text-emerald-400" /> : 
             subValue.includes('-') ? <TrendingDown size={12} className="text-rose-400" /> : 
             <Minus size={12} />}
            {subValue}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-white font-black text-3xl tracking-tighter tabular-nums">
          {value}
        </h3>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
          {title}
        </p>
      </div>

      {/* Decorative Glow */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${color}/10 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`} />
    </motion.div>
  );
};

export default StatCard;
