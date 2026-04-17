import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { useCMS } from '@/core/hooks/useCMS';
import { supabaseServer } from '@/core/lib/supabase-server';
import { GitHubIcon, LinkedInIcon } from '@/shared/components/icons/TechnicalIcons';
import Footer from '@/shared/components/Footer';
import Button from '@/shared/components/Button';

// Animations
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Social Links Component
const SocialLinks = ({ github, linkedin }) => (
  <div className="member-socials">
    {github && (
      <a href={github} target="_blank" rel="noopener noreferrer" className="minim-social-icon" onClick={(e) => e.stopPropagation()}>
        <GitHubIcon size={18} />
      </a>
    )}
    {linkedin && (
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className="minim-social-icon" onClick={(e) => e.stopPropagation()}>
        <LinkedInIcon size={18} />
      </a>
    )}
  </div>
);

// ── Expanded Profile Modal ───────────────────────────────────────────
const ExpandedProfile = ({ person, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  if (!person) return null;

  let displayRole = person.role;
  if (person.role === 'Lead') displayRole = "FOUNDER";
  if (person.role === 'Rep') displayRole = "REPRESENTATIVE";
  if (person.role === 'Member') displayRole = "MEMBER";

  const modalContent = (
    <motion.div 
      className="profile-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ zIndex: 5000, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', padding: '2rem' }}
    >
      <motion.div 
        className="profile-modal-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '30px', textAlign: 'center', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div className="modal-avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#111', position: 'relative' }}>
          {person.image_url ? (
            <Image src={person.image_url} alt={person.name} fill sizes="120px" style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>
              {person.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {person.university || "Code Catalysts"}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', textTransform: 'uppercase' }}>{person.name}</h2>
          <div style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 800, letterSpacing: '0.1em' }}>{displayRole}</div>
        </div>
        
        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {person.bio || person.tagline}
        </p>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          {person.github && (
            <a href={person.github} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <GitHubIcon size={20} />
            </a>
          )}
          {person.linkedin && (
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <LinkedInIcon size={20} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};


export async function getStaticProps() {
  const [
    { data: siteContentRaw },
    { data: teamMembers },
    { data: footerSettings },
  ] = await Promise.all([
    supabaseServer.from('site_content').select('*'),
    supabaseServer.from('team_members').select('*').order('order_index', { ascending: true }).order('name', { ascending: true }),
    supabaseServer.from('footer_settings').select('*').maybeSingle(),
  ]);

  const siteContent = (siteContentRaw || []).reduce((acc, curr) => {
    acc[curr.key] = curr.content;
    return acc;
  }, {});

  return {
    props: {
      siteContent,
      teamMembers: teamMembers || [],
      footerSettings: footerSettings || {},
    },
    revalidate: 60,
  };
}

export default function TeamPage({ 
  siteContent: initialSiteContent, 
  teamMembers: initialTeamMembers, 
  footerSettings: initialFooterSettings 
}) {
  const router = useRouter();
  const { 
    siteContent: liveSiteContent, 
    teamMembers: liveTeamMembers, 
    footerSettings: liveFooterSettings, 
    loading 
  } = useCMS();
  
  // Use live content from useCMS after hydration for immediate updates
  const siteContent = { ...initialSiteContent, ...liveSiteContent };
  const teamMembers = liveTeamMembers.length > 0 ? liveTeamMembers : initialTeamMembers;
  const footerSettings = Object.keys(liveFooterSettings).length > 0 ? liveFooterSettings : initialFooterSettings;

  const [isMounted, setIsMounted] = useState(false);
  const [activeMember, setActiveMember] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    // Prefetch high-priority pages 
    router.prefetch('/');
  }, [router]);

  return (
    <div className="team-system-page">
      <Head>
        <title>Team | Code Catalysts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Meet the elite team of architects and catalysts behind Code Catalysts — building the next generation of digital experiences." />
      </Head>

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

      {/* Team Grid */}
      <section className="team-grid-section">
        {teamMembers.filter(m => m.role === 'Lead').length > 0 && (
          <motion.div 
            className="team-row"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {teamMembers.filter(m => m.role === 'Lead').map((member) => (
              <motion.div key={member.id} variants={fadeUp} className="member-card" onClick={() => setActiveMember(member)}>
                <div className="avatar-wrapper">
                  {member.image_url ? (
                     <Image src={member.image_url} alt={member.name} fill sizes="130px" className="avatar-image" />
                  ) : (
                    <div className="avatar-initials">{member.name.split(' ').map(n => n[0]).join('')}</div>
                  )}
                </div>
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">FOUNDER</span>
                <p className="member-vibe">{member.tagline || member.bio || "Turns ideas into reality."}</p>
                <SocialLinks github={member.github} linkedin={member.linkedin} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {teamMembers.filter(m => m.role === 'Rep').length > 0 && (
          <motion.div 
            className="team-row"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {teamMembers.filter(m => m.role === 'Rep').map((member) => (
              <motion.div key={member.id} variants={fadeUp} className="member-card" onClick={() => setActiveMember(member)}>
                <div className="avatar-wrapper">
                  {member.image_url ? (
                     <Image src={member.image_url} alt={member.name} fill sizes="130px" className="avatar-image" />
                  ) : (
                    <div className="avatar-initials">{member.name.split(' ').map(n => n[0]).join('')}</div>
                  )}
                </div>
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">REPRESENTATIVE</span>
                <p className="member-vibe">{member.tagline || member.bio || "Turns ideas into reality."}</p>
                <SocialLinks github={member.github} linkedin={member.linkedin} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {teamMembers.filter(m => m.role === 'Member').length > 0 && (
          <motion.div 
            className="team-row"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {teamMembers.filter(m => m.role === 'Member').map((member) => (
              <motion.div key={member.id} variants={fadeUp} className="member-card" onClick={() => setActiveMember(member)}>
                <div className="avatar-wrapper">
                  {member.image_url ? (
                     <Image src={member.image_url} alt={member.name} fill sizes="130px" className="avatar-image" />
                  ) : (
                    <div className="avatar-initials">{member.name.split(' ').map(n => n[0]).join('')}</div>
                  )}
                </div>
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role">MEMBER</span>
                <p className="member-vibe">{member.tagline || member.bio || "Turns ideas into reality."}</p>
                <SocialLinks github={member.github} linkedin={member.linkedin} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>



      {/* Recruitment */}
      <section className="py-20 px-6 flex justify-center items-center relative z-10 w-full mb-10">
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="relative group bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] p-12 md:p-20 text-center max-w-xl w-full mx-auto overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/10"
        >
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center space-y-6">
            {siteContent.applyPageEnabled !== 'false' ? (
              <>
                <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase text-white leading-none">
                  Join the <span className="text-cyan-400">Catalysts.</span>
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                  We&apos;re currently looking for passionate builders. Ready to ignite your journey?
                </p>
                <div className="pt-4">
                  <Button href="/apply" variant="default" size="lg" className="magnetic">
                    APPLY NOW <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase text-white leading-none whitespace-nowrap">
                  We are full!
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                  We’re currently full, but we’d love to have you in soon-stay close.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </section>


      {/* Return Button */}
      {isMounted && !activeMember && createPortal(
        <button
          onClick={() => router.push('/')}
          className="return-root-btn"
        >
          <ChevronLeft size={16} /> Return
        </button>,
        document.body
      )}

      <Footer footerSettings={footerSettings} siteContent={siteContent} />
    </div>
  );
}
