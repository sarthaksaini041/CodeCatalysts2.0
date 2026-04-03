import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const UnifiedBackground = () => {
  const { scrollYProgress } = useScroll();

  // Wide overlapping crossfades — layers always blend into each other,
  // never leaving a bare gap that would show as a hard cut.
  const opacityHero     = useTransform(scrollYProgress, [0,    0.3], [1,    0]);
  const opacityGenesis  = useTransform(scrollYProgress, [0.05, 0.35, 0.5], [0, 0.4, 0]);
  const opacityShift    = useTransform(scrollYProgress, [0.25, 0.55, 0.7], [0, 0.4, 0]);
  const opacityJourney  = useTransform(scrollYProgress, [0.45, 0.75, 0.9], [0, 0.4, 0]);
  const opacityBuilders = useTransform(scrollYProgress, [0.65, 0.95, 1   ], [0, 0.6, 0.5]);

  return (
    <div className="unified-bg-system" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>

      {/* HERO: extreme subtle violet bloom, center */}
      <motion.div style={{ opacity: opacityHero, position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124, 58, 237, 0.04) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </motion.div>

      {/* GENESIS: neon cyan glow, extremely faint top-left drift */}
      <motion.div style={{ opacity: opacityGenesis, position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 55% at 25% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }} />
      </motion.div>

      {/* SHIFT: violet + mint blend, dark mode */}
      <motion.div style={{ opacity: opacityShift, position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(ellipse 65% 50% at 75% 40%, rgba(124, 58, 237, 0.04) 0%, transparent 65%),' +
            'radial-gradient(ellipse 50% 40% at 30% 70%, rgba(16, 245, 160, 0.02) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }} />
      </motion.div>

      {/* JOURNEY: violet rising from bottom, extremely subtle */}
      <motion.div style={{ opacity: opacityJourney, position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 60% at 50% 80%, rgba(124, 58, 237, 0.03) 0%, transparent 65%)',
          filter: 'blur(120px)',
        }} />
      </motion.div>

      {/* BUILDERS: soft cyan core bloom, darkened */}
      <motion.div style={{ opacity: opacityBuilders, position: 'absolute', inset: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: '-20%',
            background:
              'radial-gradient(ellipse 60% 50% at 40% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%),' +
              'radial-gradient(ellipse 50% 45% at 70% 55%, rgba(124, 58, 237, 0.03) 0%, transparent 60%)',
            filter: 'blur(150px)',
          }}
        />
      </motion.div>

    </div>
  );
};

export default UnifiedBackground;


