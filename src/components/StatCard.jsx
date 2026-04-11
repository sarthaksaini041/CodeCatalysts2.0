import React from 'react';
import { motion } from 'framer-motion';

const COLORS = {
  slate:   { glow: 'rgba(255, 255, 255, 0.1)', text: 'text-white/40',    icon: 'text-white/60',    border: 'border-white/10' },
  indigo:  { glow: 'rgba(99, 102, 241, 0.2)',  text: 'text-indigo-400',  icon: 'text-indigo-500',  border: 'border-indigo-500/20' },
  emerald: { glow: 'rgba(16, 185, 129, 0.2)',  text: 'text-emerald-400', icon: 'text-emerald-500', border: 'border-emerald-500/20' },
  rose:    { glow: 'rgba(244, 63, 94, 0.2)',   text: 'text-rose-400',    icon: 'text-rose-500',    border: 'border-rose-500/20' },
  amber:   { glow: 'rgba(245, 158, 11, 0.2)',  text: 'text-amber-400',   icon: 'text-amber-500',   border: 'border-amber-500/20' },
};

const StatCard = ({ title, value, icon: Icon, color = 'slate', delay = 0 }) => {
  const c = COLORS[color] || COLORS.slate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[32px] relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500"
    >
      {/* Glow Effect */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: c.glow }}
      />

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-black/40 ${c.icon} ${c.border} shadow-lg shadow-black/20`}>
        <Icon size={22} />
      </div>
      
      <div className="relative z-10">
        <p className="text-4xl font-black text-white tabular-nums tracking-tight mb-2 flex items-baseline gap-1">
          {value}
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest hidden group-hover:inline-block animate-fade-in">verified</span>
        </p>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${c.text}`}>{title}</p>
      </div>

      {/* Subtle bottom bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
    </motion.div>
  );
};

export default StatCard;
