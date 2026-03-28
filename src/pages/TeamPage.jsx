import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, Cpu, Zap, Globe, Terminal } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './admin/AdminIcons';
import { useNavigate } from 'react-router-dom';
import { INITIAL_LEADER, INITIAL_REPS } from './admin/adminData';
import './TeamPage.css';

// ── Components ────────────────────────────────────────────────────────

const SystemGrid = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.15 }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--glass-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    <motion.div 
      animate={{ y: ['0%', '100%'] }} 
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, var(--primary), transparent)', opacity: 0.4 }} 
    />
    <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.3, letterSpacing: '0.2em', fontSize: '0.65rem', fontFamily: 'monospace' }}>[ 28.6139° N, 77.2090° E ]</div>
    <div style={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.3, letterSpacing: '0.2em', fontSize: '0.65rem', fontFamily: 'monospace' }}>[ SYS_ACTIVE // NODE_01 ]</div>
  </div>
);

const NodeCard = ({ person, isLeader = false, onClick, delay = 0 }) => {
  const accent = isLeader ? 'var(--primary)' : 'var(--secondary)';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`pill-card ${isLeader ? 'pill-card--leader' : ''}`}
      style={{ 
        width: isLeader ? '100%' : 'auto', 
        maxWidth: isLeader ? '480px' : 'none',
        margin: isLeader ? '0 auto' : '0',
        borderColor: 'rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.01)'
      }}
      onClick={() => onClick(person)}
    >
      <div className="pill-avatar-wrap" style={{ background: `linear-gradient(45deg, ${accent}, transparent)` }}>
        <div className="pill-avatar">
          {person.image ? (
            <img src={person.image} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', fontWeight: 900, fontSize: '1.2rem', color: accent }}>
              {person.name[0]}
            </div>
          )}
        </div>
        <div className="status-indicator">
          <span className="status-dot" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
        </div>
      </div>
      
      <div className="pill-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <h3 className="pill-name" style={{ margin: 0, fontSize: '1.2rem' }}>{person.name}</h3>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{person.id || '00'}</span>
        </div>
        <p className="pill-role" style={{ color: accent, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{person.role}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
           {person.techStack?.slice(0, 3).map(tech => (
             <span key={tech} style={{ fontSize: '0.55rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.02)' }}>{tech}</span>
           ))}
        </div>
      </div>

      <div className="pill-scan" />
    </motion.div>
  );
};

const ExpandedProfile = ({ person, onClose }) => {
   const accent = person.id === 'leader' ? 'var(--primary)' : 'var(--secondary)';

   return (
     <motion.div 
       initial={{ opacity: 0 }} 
       animate={{ opacity: 1 }} 
       exit={{ opacity: 0 }}
       className="profile-overlay"
       onClick={onClose}
       style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
     >
       <motion.div 
         initial={{ scale: 0.9, y: 20 }}
         animate={{ scale: 1, y: 0 }}
         exit={{ scale: 0.9, y: 20 }}
         className="profile-modal"
         onClick={e => e.stopPropagation()}
       >
         <button className="close-btn" onClick={onClose}><X size={20} /></button>
         
         <div className="modal-content">
           <div className="modal-header">
             <div className="pill-avatar-wrap" style={{ width: '120px', height: '120px', background: `linear-gradient(45deg, ${accent}, transparent)` }}>
               <div className="pill-avatar">
                 {person.image ? <img src={person.image} alt={person.name} /> : <div className="avatar-fallback-big" style={{ fontSize: '3rem', fontWeight: 900 }}>{person.name[0]}</div>}
               </div>
             </div>
             <div className="modal-title-group" style={{ textAlign: 'left' }}>
                <span className="modal-label" style={{ color: accent, fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem', fontWeight: 900, letterSpacing: '0.3em' }}>MEMBER_DATA_RESTRICTION_OFF</span>
                <h2 style={{ fontSize: '3rem', fontWeight: 950, lineHeight: 0.9 }}>{person.name}</h2>
                <p className="pill-role" style={{ color: accent, fontSize: '1rem', marginTop: '1rem' }}>{person.role}</p>
             </div>
           </div>

           <div className="modal-grid">
             <div className="modal-section">
               <h4><Terminal size={14} /> SYSTEM_BIO</h4>
               <p style={{ color: 'var(--text-dim)', lineHeight: 1.8 }}>{person.bio || "Data stream active. Connection established. Member of the primary assembly."}</p>
             </div>
             
             <div className="modal-section">
               <h4><Cpu size={14} /> TECH_STACK</h4>
               <div className="modal-skills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                 {person.techStack?.map(s => <span key={s} className="tech-tag" style={{ border: `1px solid ${accent}44` }}>{s}</span>)}
               </div>
             </div>

             <div className="modal-section" style={{ border: 'none' }}>
               <h4><Globe size={14} /> CONNECTION_POINTS</h4>
               <div className="modal-socials" style={{ display: 'flex', gap: '1.5rem' }}>
                 <a href={person.github || '#'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem' }}><GitHubIcon size={18} /> GITHUB</a>
                 <a href={person.linkedin || '#'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem' }}><LinkedInIcon size={18} /> LINKEDIN</a>
               </div>
             </div>
           </div>
         </div>
         <div className="pill-scan" />
       </motion.div>
     </motion.div>
   );
};

// ── Main Page ─────────────────────────────────────────────────────────

export default function TeamPage() {
  const navigate = useNavigate();
  const [activePerson, setActivePerson] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leader = INITIAL_LEADER;
  const reps = INITIAL_REPS;

  return (
    <div className="team-system-page" style={{ position: 'relative', background: '#050505' }}>
      <SystemGrid />
      <div className="noise-overlay" />
      
      <header className="page-header" style={{ position: 'relative', zIndex: 10, padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.button 
          whileHover={{ x: -10 }} 
          className="back-btn" 
          onClick={() => navigate('/')}
          style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, cursor: 'pointer', letterSpacing: '0.2em', fontSize: '0.8rem' }}
        >
          <ChevronLeft size={16} /> RETURN_TO_ROOT
        </motion.button>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.3em' }}>[ SYSTEM_STATUS: STABLE // NODES_ONLINE: {1 + reps.length} ]</div>
      </header>

      <main className="container" style={{ position: 'relative', zIndex: 1, padding: '10vh 2rem' }}>
        <section style={{ textAlign: 'center', marginBottom: '12vh' }}>
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="chapter-label"
              style={{ letterSpacing: '1em' }}
            >
              NODES // ARCHITECTS
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.2 }}
              className="hero-headline"
              style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', fontWeight: 950 }}
            >
              CORE <span className="text-gradient">NETWORK.</span>
            </motion.h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.25rem', maxWidth: '700px', margin: '2rem auto 0', lineHeight: 1.8 }}>
              A decentralized assembly of engineers and creators unified by a single protocol: Constructing the future in the shadows of the present.
            </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '10vh' }}>
           {/* VISIONARY NODE */}
           <div className="group-wrapper">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 900, letterSpacing: '0.8em', display: 'block', textAlign: 'center', marginBottom: '3rem' }}>[ 01_VISIONARY ]</span>
              <NodeCard person={leader} isLeader={true} onClick={setActivePerson} delay={0.2} />
           </div>

           {/* SYSTEM NODES */}
           <div className="group-wrapper">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 900, letterSpacing: '0.8em', display: 'block', textAlign: 'center', marginBottom: '3rem' }}>[ 02_SYSTEM_BUILDERS ]</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                {reps.map((rep, idx) => (
                  <NodeCard key={rep.id} person={rep} onClick={setActivePerson} delay={0.4 + (idx * 0.1)} />
                ))}
              </div>
           </div>

           {/* COLLECTIVE NODES */}
           <div className="group-wrapper">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 900, letterSpacing: '0.8em', display: 'block', textAlign: 'center', marginBottom: '3rem' }}>[ 03_CATALYST_NODES ]</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                 {reps.flatMap(rep => rep.members || []).map((member, idx) => (
                   <motion.div
                     key={member.id}
                     whileHover={{ y: -5, background: 'rgba(255,255,255,0.03)' }}
                     className="pill-card"
                     style={{ padding: '0.8rem 1.5rem', background: 'transparent', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}
                     onClick={() => setActivePerson(member)}
                   >
                     <div className="pill-avatar-wrap" style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.1)' }}>
                        <div className="pill-avatar">
                           {member.image ? <img src={member.image} alt={member.name} /> : <div style={{ fontWeight: 900, fontSize: '0.8rem' }}>{member.name[0]}</div>}
                        </div>
                     </div>
                     <div className="pill-info">
                        <h4 style={{ fontSize: '0.9rem', color: 'white' }}>{member.name}</h4>
                        <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800 }}>{member.role}</p>
                     </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <AnimatePresence>
        {activePerson && <ExpandedProfile person={activePerson} onClose={() => setActivePerson(null)} />}
      </AnimatePresence>

      <footer style={{ padding: '10vh 2rem 5vh', textAlign: 'center', opacity: 0.3 }}>
          <div style={{ height: '1px', width: '100%', background: 'linear-gradient(to right, transparent, var(--glass-border), transparent)', marginBottom: '3rem' }} />
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.5em', fontWeight: 800 }}>© 2026 // STILL_BUILDING // CODE_CATALYSTS</div>
      </footer>
    </div>
  );
}
