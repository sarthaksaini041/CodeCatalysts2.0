import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TeamBackground = () => {
  const { scrollYProgress } = useScroll();

  // Scroll mapping for Team Page specific phases:
  // 0-0.2: Hero (The Spark)
  // 0.2-0.35: Visionary (The Architect)
  // 0.35-0.65: Builders (The Construction)
  // 0.65-1.0: Catalysts (The Network)

  const opacityHero = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const opacityVisionary = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.45], [0, 1, 1, 0]);
  const opacityBuilders = useTransform(scrollYProgress, [0.35, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const opacityCatalysts = useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1]);

  return (
    <div className="team-bg-system" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      backgroundColor: '#050505',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      
      {/* 0. HERO (THE SPARK): Deep core glow */}
      <motion.div 
        style={{ opacity: opacityHero, position: 'absolute', inset: 0 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.1) 0%, transparent 70%)',
        }} />
      </motion.div>

      {/* 1. VISIONARY (THE ARCHITECT): Radial blueprint geometry */}
      <motion.div 
        style={{ opacity: opacityVisionary, position: 'absolute', inset: 0 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(123, 97, 255, 0.05) 50%, transparent 51%)',
          backgroundSize: '200px 200px',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(123, 97, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 97, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </motion.div>

      {/* 2. BUILDERS (THE CONSTRUCTION): Active system pulse */}
      <motion.div 
        style={{ opacity: opacityBuilders, position: 'absolute', inset: 0 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(0, 240, 255, 0.05) 0%, transparent 50%)',
          }}
        />
      </motion.div>

      {/* 3. CATALYSTS (THE NETWORK): Interconnected glow-nodes */}
      <motion.div 
        style={{ opacity: opacityCatalysts, position: 'absolute', inset: 0 }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(123, 97, 255, 0.03), rgba(0, 240, 255, 0.03))',
        }} />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: '-20%',
            background: 'radial-gradient(circle at 20% 80%, rgba(255, 0, 225, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(0, 240, 255, 0.05) 0%, transparent 40%)',
            filter: 'blur(80px)'
          }}
        />
      </motion.div>

      {/* Universal grain for cinema feel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none'
      }} />

    </div>
  );
};

export default TeamBackground;
