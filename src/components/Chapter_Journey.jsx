import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const journeySteps = [
  {
    title: "First Hackathon",
    desc: "Confused. Nervous. Excited. We jumped into the deep end without a life vest.",
    image: "/assets/team_hackathon_photo_1774718764927.png"
  },
  {
    title: "The Struggle",
    desc: "Nothing worked. We stayed in the lab until the sun rose. Re-writing, re-thinking, re-building.",
    image: "/assets/code_struggle_screen_1774718783990.png"
  },
  {
    title: "Breakthrough",
    desc: "A small win. A big shift. We realized that the only boundary was our own imagination.",
    image: "/assets/celebration_glow_vibe_1774718804486.png"
  }
];

const Chapter_Journey = () => {
  return (
    <section id="chapter-03" className="chapter-section journey-scroll" style={{ padding: '20vh 2rem' }}>
      <div className="container">
        <span className="chapter-label">03 // THE JOURNEY</span>
        <h2 className="chapter-title">The Path <span className="text-gradient">Unknown.</span></h2>
        
        <p style={{ fontSize: '1.4rem', color: 'var(--text-dim)', marginBottom: '15vh', maxWidth: '800px', margin: '0 auto 15vh auto', lineHeight: 1.6 }}>
          “It didn't happen in one moment... It was a thousand moments of choosing to stay when we could have left.”
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20vh' }}>
          {journeySteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5vw', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.3 }}
                className="glass-card"
                style={{ flex: 1, textAlign: 'left', padding: '3.5rem', boxShadow: i % 2 === 0 ? 'var(--glow-primary)' : 'var(--glow-secondary)' }}
              >
                <div style={{ 
                  fontFamily: 'JetBrains Mono', 
                  fontSize: '0.65rem', 
                  color: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)', 
                  letterSpacing: '0.3em',
                  marginBottom: '1rem',
                  fontWeight: 900
                }}>
                  {i % 2 === 0 ? 'LEFT_ALIGNED_CHRONICLE' : 'RIGHT_ALIGNED_CHRONICLE'}
                </div>
                <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900, color: '#fff' }}>{step.title}</h3>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', lineHeight: 1.7 }}>{step.desc}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                viewport={{ once: true }}
                className="zig-zag-image-wrapper"
              >
                <img src={step.image} alt={step.title} className="zig-zag-image" />
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: `linear-gradient(${i % 2 === 0 ? 'to right' : 'to left'}, rgba(5,5,5,0.7), transparent)` 
                }} />
              </motion.div>
            </div>
          ))}

          {/* Dramatic Wide Visual Section - HEIGHT REDUCED & PATH FIXED */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '450px', 
              borderRadius: '40px', 
              overflow: 'hidden',
              marginTop: '10vh',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
            }}
          >
            <img 
              src="/assets/projects_vibe_banner_1774718825465.png" 
              alt="The Journey" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent, rgba(0,0,0,1))' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Chapter_Journey;
