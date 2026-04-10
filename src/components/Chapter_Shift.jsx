import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket, Trophy, Users, Star, Target, Shield, Cpu } from 'lucide-react';
import { fadeUpVariant, staggerContainer, SplitWords } from '../utils/animations.jsx';
import ParallaxLayer from './ParallaxLayer';

const EASE_EXPO  = [0.87, 0, 0.13, 1];
const EASE_OUT   = [0.16, 1, 0.3, 1];

const ChapterLabel = ({ label, color }) => (
  <motion.div
    variants={staggerContainer(0.12, 0)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.6 }}
    className="chapter-label-line"
  >
    <motion.div
      variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO } } }}
      style={{ background: color, transformOrigin: 'left', flex: 1, height: '1px', maxWidth: '120px' }}
    />
    <motion.span variants={fadeUpVariant} className="text">{label}</motion.span>
    <motion.div
      variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO, delay: 0.15 } } }}
      style={{ background: color, transformOrigin: 'right', flex: 1, height: '1px', maxWidth: '120px' }}
    />
  </motion.div>
);

const Chapter_Shift = ({ chapter2Cards = [], chapter2Stats = [], siteContent = {} }) => {
  const defaultIcons = [Zap, Rocket, Trophy, Users, Star, Target, Shield, Cpu];

  return (
    <section id="chapter-02" className="chapter-section shift-hybrid" style={{ padding: '15vh 2rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>

        <ParallaxLayer offset={25}>
          <ChapterLabel label="CHAPTER 02" color="var(--secondary)" />

          <motion.div
            variants={staggerContainer(0.14, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="chapter-header-v2"
          >
            <div className="chapter-title-v2">
              <motion.span variants={fadeUpVariant} className="title-prefix">THE</motion.span>
              <motion.h2
                variants={{
                  hidden:  { opacity: 0, y: 50, filter: 'blur(10px)' },
                  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 1, ease: EASE_OUT } },
                }}
                className="title-main"
                style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--secondary), var(--primary))' }}
              >
                SHIFT
              </motion.h2>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.35)',
              maxWidth: '560px',
              margin: '1.5rem auto 6rem',
              lineHeight: 1.75,
            }}
          >
            The moment we stopped consuming and started creating.
          </motion.p>
        </ParallaxLayer>

        {/* PROTOCOL CARDS — staggered materialisation with glow burst */}
        <ParallaxLayer offset={40}>
          <motion.div
            className="protocol-grid"
            style={{ display: 'grid', gap: '2rem', marginBottom: '8rem' }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0 },
              show:   { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            {chapter2Cards.map((card, i) => {
              const color = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
              const IconComponent = defaultIcons[i % defaultIcons.length];

              return (
                <motion.div
                  key={card.id}
                  className="magnetic"
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.94, filter: 'blur(8px)' },
                    show:   {
                      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                      transition: { duration: 0.85, ease: EASE_OUT },
                    },
                  }}
                  whileHover={{
                    y: -10,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: color,
                    boxShadow: `0 20px 50px -15px ${color}55`,
                  }}
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.015)',
                    borderRadius: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Background radial glow */}
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: `radial-gradient(circle at 50% 0%, ${color}14 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }} 
                  />

                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 0 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    viewport={{ once: true }}
                    transition={{ 
                      scale: { duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] },
                      opacity: { duration: 0.5, delay: 0.1 + i * 0.07 },
                      y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }
                    }}
                    style={{ color, filter: `drop-shadow(0 0 12px ${color}66)`, position: 'relative' }}
                  >
                    <IconComponent size={34} />
                  </motion.div>

                  <h3 style={{
                    fontSize: '1.55rem',
                    fontWeight: 950,
                    color: '#fff',
                    letterSpacing: '0.01em',
                    lineHeight: 1.2,
                    margin: 0,
                    position: 'relative',
                  }}>
                    {card.title}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>
        </ParallaxLayer>

        {/* STAT CARDS — drop in from slightly above like data loading */}
        <ParallaxLayer offset={30}>
          <motion.div
            className="stats-grid"
            style={{ display: 'grid', gap: '1.5rem' }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0 },
              show:   { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
            }}
          >
            {chapter2Stats.map((stat, i) => {
              const accentColor = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';

              return (
                <motion.div
                  key={stat.id}
                  className="magnetic"
                  variants={{
                    hidden: { opacity: 0, y: -20, scale: 0.94, filter: 'blur(6px)' },
                    show:   {
                      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                      transition: { duration: 0.75, ease: EASE_OUT },
                    },
                  }}
                  whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                  style={{
                    padding: '3.5rem 2rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '32px',
                    backdropFilter: 'blur(30px)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '240px',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {/* Ghost number bg */}
                  <motion.div 
                    animate={{ y: [0, 10, 0], opacity: [0.015, 0.04, 0.015] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    style={{
                      position: 'absolute', top: '10%', left: '10%',
                      fontSize: '8rem', fontWeight: 950,
                      pointerEvents: 'none', lineHeight: 1,
                      userSelect: 'none', fontFamily: 'var(--font-heading)',
                      color: '#fff',
                    }}
                  >
                    {i + 1}
                  </motion.div>

                  {/* Stat value — scales in */}
                  <motion.h4
                    initial={{ opacity: 0, scale: 0.7, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      fontSize: '4rem', fontWeight: 950, color: '#fff',
                      margin: '0 0 1rem 0', letterSpacing: '-0.02em',
                      position: 'relative', lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </motion.h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                    <p style={{
                      fontSize: '0.75rem', fontWeight: 900,
                      letterSpacing: '0.25em', color: accentColor,
                      textTransform: 'uppercase', margin: 0,
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)',
                      fontWeight: 600, margin: 0, maxWidth: '180px',
                    }}>
                      {stat.description || 'Building the core.'}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    viewport={{ once: true }}
                    transition={{ 
                      scaleX: { duration: 0.6, delay: 0.3 + i * 0.08, ease: EASE_EXPO },
                      opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }
                    }}
                    style={{
                      position: 'absolute', bottom: 0,
                      left: '50%', transform: 'translateX(-50%)',
                      width: '60px', height: '2px',
                      background: accentColor,
                      boxShadow: `0 0 20px ${accentColor}`,
                      borderRadius: '10px 10px 0 0',
                      transformOrigin: 'center',
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </ParallaxLayer>
      </div>
    </section>
  );
};

export default Chapter_Shift;
