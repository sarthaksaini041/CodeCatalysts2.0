import React from 'react';
import { useCMS } from '../hooks/useCMS';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';

const Chapter_Genesis = () => {
  const { chapter1Items, siteContent, loading } = useCMS();

  if (loading) return null;

  const title = siteContent.chapter1_title || 'The Spark of Creation.';

  const points = chapter1Items.map((item, index) => ({
    title: item.title,
    content: item.description,
    image: item.image_url,
    reverse: index % 2 !== 0
  }));

  return (
    <section id="chapter-01" className="chapter-section genesis-timeline" style={{ padding: '15vh 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
           variants={fadeUpVariant}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="chapter-label-line"
        >
          <div className="line" style={{ background: 'var(--primary)' }} />
          <span className="text">CHAPTER 01</span>
          <div className="line" style={{ background: 'var(--primary)' }} />
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
            <motion.h2 variants={fadeUpVariant} className="title-main" style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--primary), var(--accent))' }}>GENESIS</motion.h2>
          </div>
        </motion.div>

        <div className="zig-zag-container" style={{ position: 'relative' }}>
          {/* Timeline line removed as per request to remove grids */}

          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.3 }}
              className={`zig-zag-row ${point.reverse ? 'reverse' : ''}`}
              style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4rem',
                  marginBottom: '10rem',
                  flexDirection: point.reverse ? 'row-reverse' : 'row'
              }}
            >
              <div className="zig-zag-content" style={{ flex: 1, textAlign: point.reverse ? 'right' : 'left' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.2em',
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: 900
                }}>
                  0{index + 1} // MEMORY_LOG
                </span>
                <h3 style={{
                  fontSize: '2.5rem',
                  marginBottom: '1.5rem',
                  fontWeight: 950,
                  color: index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
                  textShadow: index % 2 === 0 ? '0 0 30px rgba(123, 97, 255, 0.3)' : '0 0 30px rgba(255, 138, 23, 0.3)',
                  letterSpacing: '-0.02em'
                }}>
                  {point.title}
                </h3>
                <p style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(255,255,255,0.5)', 
                    lineHeight: 1.7, 
                    maxWidth: '500px', 
                    marginLeft: point.reverse ? 'auto' : '0' 
                }}>
                  {point.content}
                </p>
              </div>

              <div className="zig-zag-image-wrapper" style={{ 
                  flex: 1, 
                  position: 'relative', 
                  borderRadius: '32px', 
                  overflow: 'hidden',
                  aspectRatio: '16/10',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              }}>
                <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    src={point.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'} 
                    alt={point.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: index % 2 === 0 ? 'rgba(123, 97, 255, 0.1)' : 'rgba(255, 138, 23, 0.1)',
                  mixBlendMode: 'overlay'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(5,5,5,0.6), transparent)'
                }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Genesis;
