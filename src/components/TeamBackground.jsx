import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TeamBackground = () => {
  const { scrollYProgress } = useScroll();

  // Scroll mapping for Team Page specific phases:
  // 0-0.2: Hero (The Spark)
  // 0.2-0.35: Visionary (The Architect)
  // 0.35-0.65: Builders (The Construction)
  // 0.65-1.0: Catalysts (The Architects)

  const opacityHero = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const opacityVisionary = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.45], [0, 1, 1, 0]);
  const opacityBuilders = useTransform(scrollYProgress, [0.35, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const opacityCatalysts = useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1]);

  return (
    <div className="team-bg-system" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      background: 'transparent',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      
      {/* 0. HERO: Soft ambient glow */}
      <motion.div 
        style={{ opacity: opacityHero, position: 'absolute', inset: 0 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 40%, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
        }} />
      </motion.div>

      {/* 1. VISIONARY: Central pulse */}
      <motion.div 
        style={{ opacity: opacityVisionary, position: 'absolute', inset: 0 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)',
        }} />
      </motion.div>

      {/* 2. BUILDERS: Dynamic accent orbs */}
      <motion.div 
        style={{ opacity: opacityBuilders, position: 'absolute', inset: 0 }}
      >
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 40%, rgba(123, 97, 255, 0.04) 0%, transparent 65%)',
          }}
        />
      </motion.div>

      {/* 3. CATALYSTS: Spread network glow */}
      <motion.div 
        style={{ opacity: opacityCatalysts, position: 'absolute', inset: 0 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.03) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.03) 0%, transparent 60%)',
        }} />
      </motion.div>
    </div>
  );
};

export default TeamBackground;
