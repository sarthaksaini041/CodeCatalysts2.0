import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket, Trophy, Users, Star, Target, Shield, Cpu } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';

const EASE_EXPO = [0.87, 0, 0.13, 1];
const EASE_OUT  = [0.16, 1, 0.3, 1];

/* ── Chapter label w/ expanding lines ───────────────────────── */
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
    <section id="chapter-02" className="chapter-section shift-hybrid">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>

        <div style={{ marginBottom: '6rem' }}>
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
                  hidden:  { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
                }}
                className="title-main"
                style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--secondary), var(--primary))' }}
              >
                SHIFT
              </motion.h2>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.35)',
              maxWidth: '560px',
              margin: '1.5rem auto 0',
              lineHeight: 1.75,
            }}
          >
            The moment we stopped consuming and started creating.
          </motion.p>
        </div>

        {/* PROTOCOL CARDS */}
        <motion.div
          className="protocol-grid"
          style={{ display: 'grid', gap: '2rem', marginBottom: '8rem' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            show:   { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
        >
          {chapter2Cards.map((card, i) => {
            const color = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
            const IconComponent = defaultIcons[i % defaultIcons.length];
            // Stagger the CSS float animation per card
            const floatDelay = `${i * 0.3}s`;

            return (
              <motion.div
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 28, scale: 0.97 },
                  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
                }}
                whileHover={{
                  y: -8,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: color,
                  boxShadow: `0 16px 40px -12px ${color}44`,
                }}
                style={{
                  padding: 'clamp(2rem, 8vw, 4rem) 1.5rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.015)',
                  borderRadius: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2rem',
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle radial background tint — static, not animated */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at 50% 0%, ${color}10 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Icon — entry animation only, then CSS float */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                  className="animate-float"
                  style={{ color, filter: `drop-shadow(0 0 10px ${color}55)`, animationDelay: floatDelay }}
                >
                  <IconComponent size={32} />
                </motion.div>

                <h3 style={{
                  fontSize: '1.45rem',
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

        {/* STAT CARDS */}
        <motion.div
          className="stats-grid"
          style={{ display: 'grid', gap: '1.5rem' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            show:   { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          {chapter2Stats.map((stat, i) => {
            const accentColor = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';

            return (
              <motion.div
                key={stat.id}
                variants={{
                  hidden: { opacity: 0, y: -16, scale: 0.95 },
                  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE_OUT } },
                }}
                whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                style={{
                  padding: 'clamp(2rem, 8vw, 3.5rem) 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '28px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Ghost number — static, low opacity */}
                <div style={{
                  position: 'absolute', top: '10%', left: '10%',
                  fontSize: 'clamp(4rem, 20vw, 8rem)', fontWeight: 950,
                  pointerEvents: 'none', lineHeight: 1,
                  userSelect: 'none', fontFamily: 'var(--font-heading)',
                  color: '#fff', opacity: 0.025,
                }}>
                  {i + 1}
                </div>

                {/* Stat value */}
                <motion.h4
                  initial={{ opacity: 0, scale: 0.75 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    fontSize: 'clamp(2.5rem, 12vw, 4rem)', fontWeight: 950, color: '#fff',
                    margin: '0 0 1rem 0', letterSpacing: '-0.02em',
                    position: 'relative', lineHeight: 1,
                  }}
                >
                  {stat.value}
                </motion.h4>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontSize: '0.75rem', fontWeight: 900,
                    letterSpacing: '0.25em', color: accentColor,
                    textTransform: 'uppercase', margin: 0,
                  }}>
                    {stat.label}
                  </p>
                </div>

                {/* Bottom accent line — CSS pulse instead of FM infinite */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ scaleX: { duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE_EXPO } }}
                  className="animate-pulse-opacity"
                  style={{
                    position: 'absolute', bottom: 0,
                    left: '50%', transform: 'translateX(-50%)',
                    width: '60px', height: '2px',
                    background: accentColor,
                    boxShadow: `0 0 16px ${accentColor}`,
                    borderRadius: '10px 10px 0 0',
                    transformOrigin: 'center',
                    animationDelay: `${i * 0.25}s`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Chapter_Shift;
