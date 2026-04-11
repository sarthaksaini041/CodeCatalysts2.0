import React from 'react';
import { motion } from 'framer-motion';
import ParallaxLayer from './ParallaxLayer';
import { SplitWords } from '../utils/animations.jsx';

/* Stagger timings for the hero entrance sequence */
const EASE_OUT   = [0.16, 1, 0.3, 1];
const EASE_EXPO  = [0.87, 0, 0.13, 1];

const Chapter_Hero = ({ siteContent = {} }) => {
  return (
    <section
      id="hero"
      className="chapter-section hero-spark"
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="container" style={{ zIndex: 1, textAlign: 'center' }}>
        <ParallaxLayer offset={30}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* TAG LINE — clip-path slide up */}
            <motion.p
              initial={{ opacity: 0, y: 12, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: 'clamp(0.2em, 2vw, 0.8em)' }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE_OUT }}
              style={{
                marginBottom: '2.5rem',
                fontSize: '0.78rem',
                fontWeight: 900,
                letterSpacing: '0.8em',
                color: 'var(--primary)',
                textTransform: 'uppercase',
              }}
            >
              CODE CATALYSTS
            </motion.p>

            {/* HEADLINE LINE 1 — word by word */}
            <div style={{ overflow: 'hidden', marginBottom: '0.4rem' }}>
              <motion.h1
                className="hero-headline"
                style={{ lineHeight: 1.05, fontSize: 'clamp(2.2rem, 10vw, 8rem)', marginBottom: 0 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT }}
              >
                WE DIDN&apos;T FIND A PATH.
              </motion.h1>
            </div>

            {/* HEADLINE LINE 2 — delayed, gradient */}
            <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
              <motion.h1
                className="hero-headline"
                style={{ lineHeight: 1.05, fontSize: 'clamp(2.2rem, 10vw, 8rem)', marginBottom: 0 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: EASE_OUT }}
              >
                <span className="text-gradient">WE BUILT ONE.</span>
              </motion.h1>
            </div>

            {/* UNDERLINE accent — draws in after headline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.0, ease: EASE_EXPO, originX: 0.5 }}
              style={{
                height: '2px',
                width: '80px',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                borderRadius: '100px',
                boxShadow: '0 0 20px var(--primary)',
                transformOrigin: 'center',
              }}
            />

            {/* SCROLL HINT */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              style={{
                marginTop: '3rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.35em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
              }}
            >
              Scroll to begin
            </motion.p>

          </div>
        </ParallaxLayer>
      </div>

      {/* Background Logo — develops in slowly like a photographic print */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 0.28, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.2, ease: EASE_OUT }}
          style={{
            width: '120vh',
            height: '120vh',
            WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 50%, transparent 80%)',
            maskImage: 'radial-gradient(circle at center, black 0%, black 50%, transparent 80%)',
          }}
        >
          <img
            src="/logo.svg"
            alt="Code Catalysts Logo"
            fetchPriority="high"
            loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(1.1) contrast(1.1)' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Chapter_Hero;
