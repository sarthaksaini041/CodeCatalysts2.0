import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GitHubIcon } from './icons/TechnicalIcons';
import { fadeUpVariant, staggerContainer, SplitWords } from '../utils/animations.jsx';
import ParallaxLayer from './ParallaxLayer';

const EASE_EXPO = [0.87, 0, 0.13, 1];
const EASE_OUT  = [0.16, 1, 0.3, 1];

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

const Chapter_Forge = ({ projects: cmsProjects = [], siteContent = {} }) => {
  const projects = cmsProjects.map(p => ({
    name: p.name,
    desc: p.description,
    tech: p.tech_stack || [],
    image: p.image_url,
    github: p.github_link,
    live: p.live_link,
  }));

  return (
    <section id="chapter-04" className="chapter-section forge-dev" style={{ padding: '20vh 0', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <ParallaxLayer offset={20}>
          <ChapterLabel label="CHAPTER 04" color="var(--primary)" />

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
                style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                FORGE
              </motion.h2>
            </div>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT }}
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.32)',
              maxWidth: '540px',
              margin: '1.5rem auto 6rem',
              lineHeight: 1.75,
              textAlign: 'center',
            }}
          >
            Where ideas meet execution. Every project shipped is proof we mean it.
          </motion.p>
        </ParallaxLayer>

        {/* Project cards — drop in sequentially like files placed on a desk */}
        <div className="forge-grid">
          {projects.map((project, index) => (
            <ParallaxLayer key={index} offset={25}>
              <motion.div
                initial={{ opacity: 0, y: -24, scale: 0.96, filter: 'blur(6px)', rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotateX: 0 }}
                transition={{ duration: 0.85, delay: index * 0.1, ease: EASE_OUT }}
                viewport={{ once: true, amount: 0.15 }}
                className="forge-card magnetic"
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '32px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '2rem',
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  perspective: 800,
                }}
                whileHover={{
                  y: -14,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(123, 97, 255, 0.3)',
                  boxShadow: '0 30px 70px -12px rgba(0,0,0,0.6), 0 0 40px rgba(123,97,255,0.12)',
                }}
              >
                {/* Image area */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '24px',
                  marginBottom: '2rem',
                  aspectRatio: '16/10',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: '#0a0a0a',
                }}>
                  <motion.img
                    initial={{ scale: 1.1, filter: 'brightness(0.5)' }}
                    whileInView={{ scale: 1, filter: 'brightness(0.72)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.08, ease: EASE_OUT }}
                    whileHover={{ scale: 1.08 }}
                    src={project.image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'}
                    alt={project.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.85), transparent)' }} />

                  {/* Tech tags */}
                  <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {project.tech.map(tag => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                        style={{
                          padding: '0.3rem 0.8rem',
                          background: 'rgba(255,255,255,0.07)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '100px',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          letterSpacing: '0.1em',
                          color: 'rgba(255,255,255,0.65)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Project name */}
                <h3 style={{
                  fontSize: '1.75rem', fontWeight: 950,
                  marginBottom: '0.8rem', color: '#fff',
                  letterSpacing: '-0.02em',
                }}>
                  {project.name}
                </h3>

                <p style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '0.9rem',
                  marginBottom: '2.5rem',
                  lineHeight: 1.65,
                  height: '3.2rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {project.desc}
                </p>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <motion.a
                    href={project.live || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="magnetic"
                    style={{
                      flex: 1.2, padding: '1.1rem',
                      background: '#fff', color: '#000',
                      borderRadius: '100px', fontWeight: 950,
                      fontSize: '0.8rem', textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.6rem', border: 'none', cursor: 'none', textDecoration: 'none',
                    }}
                  >
                    LIVE <ArrowUpRight size={18} />
                  </motion.a>
                  <motion.a
                    href={project.github || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.96 }}
                    className="magnetic"
                    style={{
                      width: '60px', height: '54px',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#fff', borderRadius: '100px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: 'none', textDecoration: 'none',
                    }}
                  >
                    <GitHubIcon size={20} />
                  </motion.a>
                </div>
              </motion.div>
            </ParallaxLayer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Forge;
