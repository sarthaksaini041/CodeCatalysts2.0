import React from 'react';
import { useCMS } from '../hooks/useCMS';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GitHubIcon } from '../components/icons/TechnicalIcons';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';

const Chapter_Forge = () => {
  const { projects: cmsProjects, siteContent, loading } = useCMS();

  if (loading) return null;

  const title = siteContent.chapter4_title || 'The Creations of Logic.';

  const projects = cmsProjects.map(p => ({
    name: p.name,
    desc: p.description,
    tech: p.tech_stack || [],
    image: p.image_url,
    github: p.github_link,
    live: p.live_link
  }));

  return (
    <section id="chapter-04" className="chapter-section forge-dev" style={{ padding: '20vh 0', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 2 }}>
        <motion.div
           variants={fadeUpVariant}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="chapter-label-line"
        >
          <div className="line" style={{ background: 'var(--primary)' }} />
          <span className="text">CHAPTER 04</span>
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
            <motion.h2 variants={fadeUpVariant} className="title-main" style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--primary), var(--accent))' }}>FORGE</motion.h2>
          </div>
        </motion.div>

        <div className="forge-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="forge-card"
              style={{
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '32px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '2rem',
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  position: 'relative',
                  overflow: 'hidden'
              }}
              whileHover={{
                  y: -15,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(123, 97, 255, 0.3)',
                  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ 
                  position: 'relative', 
                  overflow: 'hidden', 
                  borderRadius: '24px', 
                  marginBottom: '2rem', 
                  aspectRatio: '16/10', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: '#0a0a0a'
              }}>
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  src={project.image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'}
                  alt={project.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) contrast(1.1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.8), transparent)' }} />
                <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tech.map(tag => (
                    <span key={tag} style={{
                        padding: '0.3rem 0.8rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '100px',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase'
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '0.8rem', color: '#fff', letterSpacing: '-0.02em' }}>{project.name}</h3>
              <p style={{ 
                  color: 'rgba(255,255,255,0.4)', 
                  fontSize: '0.9rem', 
                  marginBottom: '2.5rem', 
                  lineHeight: 1.6, 
                  height: '3.2rem', 
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
              }}>{project.desc}</p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.a
                  href={project.live || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                      flex: 1.2, 
                      padding: '1.1rem', 
                      background: '#fff', 
                      color: '#000', 
                      borderRadius: '100px', 
                      fontWeight: 950, 
                      fontSize: '0.8rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.15em', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.6rem', 
                      border: 'none', 
                      cursor: 'pointer',
                      textDecoration: 'none'
                  }}
                >
                  LIVE <ArrowUpRight size={18} />
                </motion.a>
                <motion.a
                  href={project.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                      width: '60px', 
                      height: '54px', 
                      background: 'rgba(255,255,255,0.03)', 
                      color: '#fff', 
                      borderRadius: '100px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      cursor: 'pointer',
                      textDecoration: 'none'
                  }}
                >
                  <GitHubIcon size={20} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Forge;
