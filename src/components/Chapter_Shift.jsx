import React from 'react';
import { useCMS } from '../hooks/useCMS';
import { motion } from 'framer-motion';
import { Zap, Rocket, Trophy, Users, Star, Target, Shield, Cpu } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';

const iconMap = {
  Zap: <Zap size={36} />,
  Rocket: <Rocket size={36} />,
  Trophy: <Trophy size={36} />,
  Users: <Users size={36} />,
  Star: <Star size={36} />,
  Target: <Target size={36} />,
  Shield: <Shield size={36} />,
  Cpu: <Cpu size={36} />
};

const Chapter_Shift = () => {
  const { chapter2Cards, chapter2Stats, teamMembers, projects, siteContent, loading } = useCMS();

  if (loading) return null;

  const title = siteContent.chapter2_title || 'The Mindset Shift.';
  const defaultIcons = [Zap, Rocket, Trophy, Users, Star, Target, Shield, Cpu];

  return (
    <section id="chapter-02" className="chapter-section shift-hybrid" style={{
      background: 'radial-gradient(circle at 50% 10%, rgba(123, 97, 255, 0.05) 0%, transparent 60%)',
      padding: '15vh 2rem'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
           variants={fadeUpVariant}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="chapter-label-line"
        >
          <div className="line" style={{ background: 'var(--secondary)' }} />
          <span className="text">CHAPTER 02</span>
          <div className="line" style={{ background: 'var(--secondary)' }} />
        </motion.div>

        <motion.div
           variants={staggerContainer(0.1, 0)}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="chapter-header-v2"
        >
          <div className="chapter-title-v2">
            <motion.span variants={fadeUpVariant} className="title-prefix">THE</motion.span>
            <motion.h2 variants={fadeUpVariant} className="title-main" style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--secondary), var(--primary))' }}>SHIFT</motion.h2>
          </div>
        </motion.div>

        {/* PROTOCOL PRINCIPLE CARDS - NOW FIRST */}
        <motion.div
          className="protocol-grid"
          style={{
            display: 'grid',
            gap: '2rem',
            marginBottom: '8rem'
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {chapter2Cards.map((card, i) => {
            const color = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
            const IconComponent = defaultIcons[i % defaultIcons.length];
            
            return (
              <motion.div
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={{
                  y: -10,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: color,
                  boxShadow: `0 20px 40px -20px ${color}33`
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
                  overflow: 'hidden'
                }}
              >
                {/* Decorative background pulse */}
                <div style={{
                  position: 'absolute',
                  top: '-20%',
                  left: '-20%',
                  width: '140%',
                  height: '140%',
                  background: `radial-gradient(circle at center, ${color}11 0%, transparent 70%)`,
                  opacity: 0.2
                }} />

                <div style={{ color, filter: `drop-shadow(0 0 10px ${color}55)`, position: 'relative' }}>
                  <IconComponent size={32} />
                </div>

                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: 950,
                  color: '#fff',
                  letterSpacing: '0.01em',
                  lineHeight: 1.2,
                  margin: 0,
                  position: 'relative'
                }}>
                  {card.title}
                </h3>


              </motion.div>
            );
          })}
        </motion.div>

        {/* ANALYTIC COUNTER CARDS - NOW SECOND */}
        <motion.div
          className="stats-grid"
          style={{
            display: 'grid',
            gap: '1.5rem'
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {chapter2Stats.map((stat, i) => {
            const count = i + 1;
            const accentColor = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
            
            // DYNAMIC COUNT LOGIC
            let displayValue = stat.value;
            if (stat.label === 'ENGINEERS') {
                displayValue = `${teamMembers.length}+`;
            } else if (stat.label === 'BUILDS') {
                displayValue = `${projects.length}+`;
            }

            return (
              <motion.div
                key={stat.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 20 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={{ y: -10, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                style={{
                  padding: '3.5rem 2rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '32px',
                  backdropFilter: 'blur(30px)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '240px'
                }}
              >
                {/* Background ID number */}
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  fontSize: '8rem',
                  fontWeight: 950,
                  color: 'rgba(255, 255, 255, 0.03)',
                  pointerEvents: 'none',
                  lineHeight: 1,
                  userSelect: 'none',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {count}
                </div>

                <h4 style={{ 
                  fontSize: '4rem', 
                  fontWeight: 950, 
                  color: '#fff', 
                  margin: '0 0 1rem 0',
                  letterSpacing: '-0.02em',
                  position: 'relative',
                  lineHeight: 1
                }}>
                  {displayValue}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 900, 
                    letterSpacing: '0.25em', 
                    color: accentColor,
                    textTransform: 'uppercase',
                    margin: 0
                  }}>
                    {stat.label}
                  </p>
                  
                  {/* Optional Description / Sub-text */}
                  <p style={{ 
                    fontSize: '0.65rem', 
                    color: 'rgba(255,255,255,0.3)', 
                    fontWeight: 600,
                    margin: 0,
                    maxWidth: '180px'
                  }}>
                    {stat.description || "Building the core."}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '2px',
                  background: accentColor,
                  boxShadow: `0 0 20px ${accentColor}`,
                  borderRadius: '10px 10px 0 0',
                  opacity: 0.8
                }} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Chapter_Shift;
