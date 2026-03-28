import React from 'react';
import { motion } from 'framer-motion';

const Chapter_Hero = () => {
  return (
    <section className="chapter-section hero-spark" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ zIndex: 1, textAlign: 'center' }}>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Sequential Narrative Lines - NOW CENTERED AND CLEAN */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="hero-headline" 
              style={{ marginBottom: '1.5rem', lineHeight: 1.1, fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
            >
              WE DIDN’T FIND A PATH.
            </motion.h1>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.5 }}
              className="hero-headline" 
              style={{ lineHeight: 1.1, fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}
            >
              <span className="text-gradient">WE BUILT ONE.</span>
            </motion.h1>
          </div>
        </motion.div>
      </div>

      {/* Particle Cluster Background (The Spark) - RE-CENTERED & CUTOFF FIXED */}
      <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible' // Ensure glow isn't clipped
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            width: '120vh', // Slightly larger for safety
            height: '120vh',
            WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 20%, transparent 65%)',
            maskImage: 'radial-gradient(circle at center, black 0%, black 20%, transparent 65%)',
          }}
        >
          <img 
            src="/spark.png" 
            alt="The Spark"
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'active hue-rotate(180deg) brightness(1.2) contrast(1.1)' }}
          />
        </motion.div>
      </div>

      {/* Narrative Gradient Overlay - Softens the bottom transition */}
      <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: '30vh', 
          background: 'linear-gradient(to bottom, transparent, var(--bg-deep))',
          zIndex: 1 
      }} />
    </section>
  );
};

export default Chapter_Hero;
