import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GitHubIcon } from '../pages/admin/AdminIcons';

const projects = [
  {
    name: "Aura AI",
    desc: "A generative emotional intelligence layer for modern interfaces.",
    tech: ["React", "PyTorch", "WebGL"],
    image: "/assets/abstract_particles_brain_1774718742476.png"
  },
  {
    name: "Neural Nexus",
    desc: "A decentralized knowledge graph for collaborative builders.",
    tech: ["Node.js", "GraphQL", "Solana"],
    image: "/assets/projects_vibe_banner_1774718825465.png"
  },
  {
    name: "Carbon Code",
    desc: "Predictive coding patterns for sustainable software architecture.",
    tech: ["Next.js", "PostgreSQL", "Tailwind"],
    image: "/assets/code_struggle_screen_1774718783990.png"
  },
  {
    name: "Prism UI",
    desc: "Dynamic glassmorphic components with physics-based interactions.",
    tech: ["Framer", "CSS", "Vanilla JS"],
    image: "/assets/celebration_glow_vibe_1774718804486.png"
  }
];

const Chapter_Forge = () => {
  return (
    <section id="chapter-04" className="chapter-section project-forge" style={{ padding: '15vh 2rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <span className="chapter-label">CHAPTER 04 // THE FORGE</span>
        <h2 className="chapter-title">The Creations of <span className="text-gradient">Logic.</span></h2>
        
        <div className="forge-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="forge-card"
            >
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', marginBottom: '2rem', aspectRatio: '16/10', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    src={project.image} 
                    alt={project.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) contrast(1.1)' }} 
                 />
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.9), transparent)' }} />
                 <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.6rem' }}>
                    {project.tech.map(tag => (
                       <span key={tag} className="tech-tag">{tag}</span>
                    ))}
                 </div>
              </div>

              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.8rem', color: '#fff' }}>{project.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6, height: '3.2rem', overflow: 'hidden' }}>{project.desc}</p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ flex: 1.2, padding: '1.1rem', background: '#fff', color: '#000', borderRadius: '100px', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', border: 'none', cursor: 'pointer' }}
                >
                   LIVE <ArrowUpRight size={18} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ width: '60px', height: '54px', background: 'rgba(255,255,255,0.03)', color: '#fff', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                >
                   <GitHubIcon size={20} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Forge;
