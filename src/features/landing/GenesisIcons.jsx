import React from 'react';
import { motion } from 'framer-motion';

export const FuturisticLogo = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M30 20C45 40 45 80 30 100"
      stroke="var(--dash-cyan)"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M90 20C75 40 75 80 90 100"
      stroke="var(--dash-cyan)"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
    />
    <motion.path
      d="M45 50L75 70"
      stroke="var(--dash-cyan)"
      strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.path
      d="M75 50L45 70"
      stroke="var(--dash-cyan)"
      strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.7 }}
    />
    {/* Glow Filter simulation */}
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  </svg>
);

export const PlusMarker = ({ className }) => (
  <span className={`plus-icon ${className}`}>+</span>
);

export const CornerDecoration = () => (
  <div className="absolute top-0 right-0 p-4 opacity-20">
    <svg width="40" height="40" viewBox="0 0 40 40">
      <path d="M0 1H39V40" fill="none" stroke="white" strokeWidth="1" />
    </svg>
  </div>
);
