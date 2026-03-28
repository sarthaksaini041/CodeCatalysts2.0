import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const UnifiedBackground = () => {
  const { scrollYProgress } = useScroll();

  // Scroll mapping for 5 cinematic chapters
  // 0-0.2: Hero (Spark)
  // 0.2-0.4: Genesis (Timeline)
  // 0.4-0.6: Shift (Stats)
  // 0.6-0.8: Journey (Story)
  // 0.8-1.0: Forge & Architects (Builders)

  const opacityHero = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const opacityGenesis = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
  const opacityShift = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.6], [0, 1, 1, 0]);
  const opacityJourney = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.8], [0, 1, 1, 0]);
  const opacityBuilders = useTransform(scrollYProgress, [0.75, 0.8, 1], [0, 1, 1]);

  return (
    <div className="unified-bg-system" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      backgroundColor: '#050505',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      
      {/* 0. HERO (THE SPARK): Deep base with minimal glow */}
      <motion.div 
        style={{ opacity: opacityHero, position: 'absolute', inset: 0 }}
        className="bg-layer-hero"
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.08) 0%, transparent 70%)',
        }} />
      </motion.div>

      {/* 1. GENESIS (TIMELINE): Faint digital grid */}
      <motion.div 
        style={{ opacity: opacityGenesis, position: 'absolute', inset: 0 }}
        className="bg-layer-genesis"
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(123, 97, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 97, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }} />
      </motion.div>

      {/* 2. THE SHIFT (SYSTEM): Structured grid and system pulses */}
      <motion.div 
        style={{ opacity: opacityShift, position: 'absolute', inset: 0 }}
        className="bg-layer-shift"
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <motion.div 
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.3), transparent)',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)'
          }}
        />
      </motion.div>

      {/* 3. THE JOURNEY (MOTION): Rising energy trails */}
      <motion.div 
        style={{ opacity: opacityJourney, position: 'absolute', inset: 0 }}
        className="bg-layer-journey"
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(123, 97, 255, 0.05), transparent)',
        }} />
      </motion.div>

      {/* 4. THE FORGE & ARCHITECTS (COLLECTIVE): Unified energy core */}
      <motion.div 
        style={{ opacity: opacityBuilders, position: 'absolute', inset: 0 }}
        className="bg-layer-builders"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: '-30%',
            background: 'radial-gradient(circle at 40% 50%, rgba(255, 0, 255, 0.05) 0%, transparent 60%), radial-gradient(circle at 60% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 60%)',
            filter: 'blur(100px)'
          }}
        />
      </motion.div>

      {/* Permanent subtle noise for all layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none'
      }} />

    </div>
  );
};

export default UnifiedBackground;
