import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../hooks/useCMS';
import { GitHubIcon, LinkedInIcon } from '../components/icons/TechnicalIcons';
import Footer from '../components/Footer';
import StaticBackground from '../components/StaticBackground';
import { fadeUpVariant, staggerContainer, cardVariant } from '../utils/animations.jsx';
import './TeamPage.css';

// ── Shared Components ──────────────────────────────────────────────────

const SocialLinks = ({ github, linkedin, size = 18 }) => (
  <div className="social-links-wrap">
    {github && (
      <a 
        href={github} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-btn" 
        title="GitHub Profile"
        onClick={(e) => e.stopPropagation()}
      >
        <GitHubIcon size={size} />
      </a>
    )}
    {linkedin && (
      <a 
        href={linkedin} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-btn" 
        title="LinkedIn Profile"
        onClick={(e) => e.stopPropagation()}
      >
        <LinkedInIcon size={size} />
      </a>
    )}
  </div>
);

const SectionHeader = ({ title }) => (
  <motion.div
     variants={fadeUpVariant}
     initial="hidden"
     whileInView="visible"
     viewport={{ once: true }}
     className="chapter-label-line"
     style={{ margin: '15vh 0 8vh' }}
  >
    <div className="line" style={{ background: 'var(--primary)' }} />
    <span className="text">{title}</span>
    <div className="line" style={{ background: 'var(--primary)' }} />
  </motion.div>
);

// ── Expanded Profile Modal ───────────────────────────────────────────

const ExpandedProfile = ({ person, onClose }) => {
  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  if (!person) return null;

  let displayRole = person.role;
  if (person.role === 'Lead') displayRole = "LEADER / FOUNDER";
  if (person.role === 'Rep') displayRole = "REPRESENTATIVE";
  if (person.role === 'Member') displayRole = "MEMBER";

  const modalContent = (
    <motion.div 
      className="profile-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ zIndex: 5000 }} // High enough for UI overlays but below global elements
    >
      <motion.div 
        className="profile-modal-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-avatar">
          {person.image_url ? (
            <img src={person.image_url} alt={person.name} loading="lazy" decoding="async" />
          ) : (
            <div className="modal-initials">{person.name.split(' ').map(n => n[0]).join('')}</div>
          )}
        </div>

        <div className="modal-content">
          <div className="modal-university" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {person.university || "Code Catalysts"}
          </div>
          <h2 className="modal-name">{person.name}</h2>
          <div className="modal-role">{displayRole}</div>
          <p className="modal-bio" style={{ maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            {person.bio || person.tagline}
          </p>
          
          <div style={{ marginTop: '2rem' }}>
            <SocialLinks github={person.github} linkedin={person.linkedin} size={24} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

// ── Card Components ────────────────────────────────────────────────────

const VisionaryCard = ({ person, onClick }) => (
  <motion.div 
    className="visionary-card-wrap"
    variants={cardVariant}
    onClick={() => onClick(person)}
  >
    <div className="visionary-card">
      <div className="visionary-avatar-box">
        {person.image_url ? (
          <img src={person.image_url} alt={person.name} loading="lazy" decoding="async" />
        ) : (
          <div className="visionary-initials">{person.name.split(' ').map(n => n[0]).join('')}</div>
        )}
      </div>
      <div className="visionary-content">
        <h2 className="visionary-name">{person.name}</h2>
        <div className="visionary-role">LEADER / FOUNDER</div>
        <p className="visionary-bio">{person.bio}</p>
        <SocialLinks github={person.github} linkedin={person.linkedin} size={20} />
      </div>
    </div>
  </motion.div>
);

const BuilderCard = ({ person, onClick }) => (
  <motion.div 
    className="builder-card"
    variants={cardVariant}
    onClick={() => onClick(person)}
  >
    <div className="builder-image-area">
      <div className="builder-initials-bg">{person.name.split(' ').map(n => n[0]).join('')}</div>
      {person.image_url && <img src={person.image_url} alt={person.name} loading="lazy" decoding="async" />}
    </div>
    
    <div className="builder-info-area">
      <div className="builder-site">REPRESENTATIVE</div>
      <h3 className="builder-name">{person.name}</h3>
      <span className="builder-uni-label-small">{person.university || "Code Catalysts"}</span>
      <div className="builder-social-wrap">
        <SocialLinks github={person.github} linkedin={person.linkedin} size={14} />
      </div>
    </div>
  </motion.div>
);

const CatalystCard = ({ person, onClick }) => (
  <motion.div 
    className="catalyst-card"
    variants={cardVariant}
    onClick={() => onClick(person)}
  >
    <div className="catalyst-header-row">
      <div className="catalyst-avatar-circle">
          {person.image_url ? (
              <img src={person.image_url} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
          ) : (
            <span className="catalyst-initials">{person.name.split(' ').map(n => n[0]).join('')}</span>
          )}
      </div>
      <div className="catalyst-title-wrap">
        <h4 className="catalyst-name">{person.name}</h4>
        <span className="catalyst-role">MEMBER</span>
      </div>
    </div>
    
    <div className="catalyst-body">
      <p className="catalyst-bio">{person.tagline || person.bio}</p>
    </div>

    <div className="catalyst-card-footer">
      <span className="catalyst-uni-label">{person.university || "Code Catalysts"}</span>
      <div className="catalyst-socials-minimal">
        <SocialLinks github={person.github} linkedin={person.linkedin} size={14} />
      </div>
    </div>
  </motion.div>
);

// ── Main Page ──────────────────────────────────────────────────────────

export default function TeamPage() {
  const navigate = useNavigate();
  const { teamMembers, loading } = useCMS();
  const [activeMember, setActiveMember] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const visionary = teamMembers.find(m => m.role === 'Lead');
  const builders = teamMembers.filter(m => m.role === 'Rep');
  const catalysts = teamMembers.filter(m => m.role === 'Member');

  return (
    <div className="team-system-page">
      <StaticBackground />

      <AnimatePresence>
        {activeMember && (
          <ExpandedProfile 
            person={activeMember} 
            onClose={() => setActiveMember(null)} 
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="team-hero">
        <motion.span 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="team-hero-label"
        >
          The Architect of Code
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="team-hero-title"
        >
          The Catalysts.
        </motion.h1>
      </section>

      {/* Main Content */}
      <main className="container" style={{ margin: '0 auto', maxWidth: '1200px', padding: '0 2rem 10vh' }}>
        
        {visionary && (
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader title="The Visionary" />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <VisionaryCard person={visionary} onClick={setActiveMember} />
            </div>
            </motion.div>
        )}

        <motion.div 
          style={{ marginTop: '10vh' }}
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <SectionHeader title="The Builders" />
          <div className="builders-grid">
            {builders.map(builder => (
              <BuilderCard key={builder.id} person={builder} onClick={setActiveMember} />
            ))}
          </div>
        </motion.div>

        <motion.div 
          style={{ marginTop: '10vh' }}
          variants={staggerContainer(0.05, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <SectionHeader title="The Catalysts" />
          <div className="catalysts-grid">
            {catalysts.map(member => (
                <CatalystCard 
                    key={member.id} 
                    person={member} 
                    onClick={setActiveMember} 
                />
            ))}
          </div>
        </motion.div>

      </main>

      {/* Return Button */}
      {createPortal(
        <motion.button
          whileHover={{ x: -10, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="return-root-btn"
        >
          <ChevronLeft size={16} /> RETURN
        </motion.button>,
        document.body
      )}

      <Footer />
    </div>
  );
}
