import React from 'react';
import { useCMS } from '../hooks/useCMS';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';

const Chapter_Journey = () => {
  const { chapter3Steps, siteContent, loading } = useCMS();

  if (loading) return null;

  const title = siteContent.chapter3_title || 'The Path Unknown.';
  const journeySteps = chapter3Steps.map(step => ({
    title: step.title,
    desc: step.description,
    image: step.image_url,
    layout: step.layout_type || 'image-right'
  }));

  return (
    <section id="chapter-03" className="chapter-section journey-scroll" style={{ padding: '20vh 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
           variants={fadeUpVariant}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="chapter-label-line"
        >
          <div className="line" style={{ background: '#60A5FA' }} />
          <span className="text">CHAPTER 03</span>
          <div className="line" style={{ background: '#60A5FA' }} />
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
            <motion.h2 variants={fadeUpVariant} className="title-main" style={{ '--chapter-gradient': 'linear-gradient(135deg, #60A5FA, var(--primary))' }}>JOURNEY</motion.h2>
          </div>
        </motion.div>

        <motion.p 
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ 
              fontSize: '1.2rem', 
              color: 'rgba(255,255,255,0.4)', 
              maxWidth: '700px', 
              margin: '3rem auto 10vh', 
              lineHeight: 1.8,
              fontWeight: 500,
              textAlign: 'center'
          }}
        >
          “It didn't happen in one moment... It was a thousand moments of choosing to stay when we could have left.”
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15vh' }}>
          {journeySteps.map((step, i) => {
            const isImageLeft = step.layout === 'image-left';
            const accentColor = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
            
            return (
              <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5rem', 
                  flexDirection: isImageLeft ? 'row' : 'row-reverse',
                  textAlign: isImageLeft ? 'left' : 'right'
              }}>
                <motion.div
                  initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, amount: 0.3 }}
                  style={{ 
                      flex: 1, 
                      padding: '4rem',
                      background: 'rgba(255,255,255,0.015)',
                      borderRadius: '40px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: `0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 0 20px ${accentColor}11`,
                      position: 'relative',
                      overflow: 'hidden'
                  }}
                >
                  <div style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '0.65rem',
                    color: accentColor,
                    letterSpacing: '0.3em',
                    marginBottom: '1.5rem',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}>
                    {isImageLeft ? 'LOG_TYPE::CORE_VISUAL' : 'LOG_TYPE::SYSTEM_CHRONICLE'}
                  </div>
                  <h3 style={{ 
                      fontSize: '2.5rem', 
                      marginBottom: '1.5rem', 
                      fontWeight: 950, 
                      color: '#fff',
                      letterSpacing: '-0.02em' 
                  }}>{step.title}</h3>
                  <p style={{ 
                      fontSize: '1.1rem', 
                      color: 'rgba(255,255,255,0.5)', 
                      lineHeight: 1.7 
                  }}>{step.desc}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  style={{ 
                      flex: 1.2, 
                      position: 'relative', 
                      borderRadius: '40px', 
                      overflow: 'hidden',
                      aspectRatio: '16/10',
                      boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <img 
                    src={step.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'} 
                    alt={step.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(${isImageLeft ? 'to right' : 'to left'}, rgba(5,5,5,0.6), transparent)`
                  }} />
                </motion.div>
              </div>
            );
          })}

          {/* Internal background pulse removed for unity */}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Journey;
