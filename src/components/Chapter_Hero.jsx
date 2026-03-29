import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../hooks/useCMS';

const Chapter_Hero = () => {
  const { siteContent, loading } = useCMS();
  
  // Default subtitle if not loaded yet
  const subtitle = siteContent?.site_subtitle || "A COLLECTIVE OF BUILDERS.";

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
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ 
                marginBottom: '2rem', 
                fontSize: '0.8rem', 
                fontWeight: 900, 
                letterSpacing: '0.8em', 
                color: 'var(--primary)', 
                textTransform: 'uppercase'
              }}
            >
              CODE CATALYSTS
            </motion.p>
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
            WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 50%, transparent 80%)',
            maskImage: 'radial-gradient(circle at center, black 0%, black 50%, transparent 80%)',
          }}
        >
          <img
            src="/logo.svg"
            alt="Code Catalysts Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(1.1) contrast(1.1)' }}
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
