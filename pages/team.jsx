import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';

import { supabaseServer } from '../src/lib/supabase-server';
import { GitHubIcon, LinkedInIcon } from '../src/components/icons/TechnicalIcons';
import Footer from '../src/components/Footer';
import {
  fadeUpVariant,
  staggerContainer,
  cardVariant,
  SplitWords,
} from '../src/utils/animations.jsx';

const TeamBackground = dynamic(() => import('../src/components/TeamBackground'), { ssr: false });

/* ─── Shared easing ─────────────────────────────────────── */
const EASE_OUT  = [0.16, 1, 0.3, 1];
const EASE_EXPO = [0.87, 0, 0.13, 1];

/* ─── Animated Section Divider with expanding lines ──────── */
const SectionHeader = ({ title, color = 'var(--primary)', delay = 0 }) => (
  <motion.div
    variants={staggerContainer(0.12, delay)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.6 }}
    className="chapter-label-line"
    style={{ margin: '14vh 0 7vh' }}
  >
    <motion.div
      variants={{
        hidden:  { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
      }}
      style={{ background: color, transformOrigin: 'left', flex: 1, height: '1px', maxWidth: '140px' }}
    />
    <motion.span variants={fadeUpVariant} className="text">{title}</motion.span>
    <motion.div
      variants={{
        hidden:  { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO, delay: 0.15 } },
      }}
      style={{ background: color, transformOrigin: 'right', flex: 1, height: '1px', maxWidth: '140px' }}
    />
  </motion.div>
);

/* ─── Social Links ───────────────────────────────────────── */
const SocialLinks = ({ github, linkedin, size = 18 }) => (
  <div className="social-links-wrap">
    {github && (
      <motion.a
        href={github} target="_blank" rel="noopener noreferrer"
        className="social-btn" title="GitHub Profile"
        onClick={(e) => e.stopPropagation()}
        whileHover={{ scale: 1.12, background: '#333' }}
        whileTap={{ scale: 0.92 }}
      >
        <GitHubIcon size={size} />
      </motion.a>
    )}
    {linkedin && (
      <motion.a
        href={linkedin} target="_blank" rel="noopener noreferrer"
        className="social-btn" title="LinkedIn Profile"
        onClick={(e) => e.stopPropagation()}
        whileHover={{ scale: 1.12, background: '#0a66c2' }}
        whileTap={{ scale: 0.92 }}
      >
        <LinkedInIcon size={size} />
      </motion.a>
    )}
  </div>
);

/* ─── Expanded Profile Modal ─────────────────────────────── */
const ExpandedProfile = ({ person, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!person) return null;

  const roleLabel = {
    Lead:   'LEADER / FOUNDER',
    Rep:    'REPRESENTATIVE',
    Member: 'MEMBER',
  }[person.role] || person.role;

  const modalContent = (
    <motion.div
      className="profile-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <motion.div
        className="profile-modal-card"
        initial={{ scale: 0.88, opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ scale: 1,    opacity: 1, y: 0,  filter: 'blur(0px)' }}
        exit={{   scale: 0.92, opacity: 0, y: 16, filter: 'blur(4px)' }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button
          className="modal-close-btn"
          onClick={onClose}
          whileHover={{ rotate: 90, background: 'rgba(255,0,0,0.2)', borderColor: 'rgba(255,0,0,0.4)' }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <X size={20} />
        </motion.button>

        {/* Avatar — photo reveal */}
        <motion.div
          className="modal-avatar"
          initial={{ scale: 0.75, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1,    opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
        >
          {person.image_url ? (
            <img src={person.image_url} alt={person.name} loading="lazy" decoding="async" />
          ) : (
            <div className="modal-initials">{person.name.split(' ').map(n => n[0]).join('')}</div>
          )}
        </motion.div>

        {/* Content — staggered fade up */}
        <div className="modal-content">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: EASE_OUT }}
            style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
          >
            {person.university || 'Code Catalysts'}
          </motion.div>

          <motion.h2
            className="modal-name"
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT }}
          >
            {person.name}
          </motion.h2>

          <motion.div
            className="modal-role"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            {roleLabel}
          </motion.div>

          <motion.p
            className="modal-bio"
            style={{ maxWidth: '450px', margin: '0 auto 1.5rem' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42, ease: EASE_OUT }}
          >
            {person.bio || person.tagline}
          </motion.p>

          <motion.div
            style={{ marginTop: '2rem' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <SocialLinks github={person.github} linkedin={person.linkedin} size={24} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

/* ─── Visionary Card (Lead) ──────────────────────────────── */
const VisionaryCard = ({ person, onClick }) => (
  <motion.div
    className="visionary-card-wrap"
    initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 1.1, ease: EASE_OUT }}
    whileHover={{ scale: 1.01, boxShadow: '0 30px 80px rgba(123,97,255,0.18)' }}
    whileTap={{ scale: 0.99 }}
    onClick={() => onClick(person)}
  >
    <div className="visionary-card">
      {/* Avatar — develops photo style */}
      <motion.div
        className="visionary-avatar-box"
        initial={{ scale: 1.1, filter: 'brightness(0.5) blur(8px)' }}
        whileInView={{ scale: 1, filter: 'brightness(1) blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.3, delay: 0.15, ease: EASE_OUT }}
      >
        {person.image_url ? (
          <img src={person.image_url} alt={person.name} loading="lazy" decoding="async" />
        ) : (
          <div className="visionary-initials">{person.name.split(' ').map(n => n[0]).join('')}</div>
        )}
        {/* Subtle gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(123,97,255,0.08), transparent)', borderRadius: '25px' }} />
      </motion.div>

      <div className="visionary-content">
        {/* Role badge */}
        <motion.div
          className="visionary-role"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
        >
          LEADER / FOUNDER
        </motion.div>

        {/* Name — word by word */}
        <div style={{ marginBottom: '1.2rem' }}>
          <SplitWords
            as="h2"
            text={person.name}
            delay={0.2}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 950, lineHeight: 1, textTransform: 'uppercase', display: 'block' }}
          />
        </div>

        {/* Bio */}
        <motion.p
          className="visionary-bio"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT }}
        >
          {person.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55 }}
        >
          <SocialLinks github={person.github} linkedin={person.linkedin} size={20} />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

/* ─── Builder Card (Rep) — drops in like a photo being placed ─ */
const BuilderCard = ({ person, onClick, index = 0 }) => (
  <motion.div
    className="builder-card"
    initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(6px)', rotateX: 5 }}
    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotateX: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, delay: index * 0.1, ease: EASE_OUT }}
    whileHover={{ y: -10, borderColor: 'var(--primary)', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 20px rgba(123,97,255,0.12)' }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(person)}
    style={{ perspective: 800 }}
  >
    <div className="builder-image-area">
      <div className="builder-initials-bg">{person.name.split(' ').map(n => n[0]).join('')}</div>
      {person.image_url && (
        <motion.img
          src={person.image_url}
          alt={person.name}
          loading="lazy"
          decoding="async"
          initial={{ scale: 1.12, filter: 'brightness(0.5)' }}
          whileInView={{ scale: 1, filter: 'brightness(1)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1 + index * 0.08, ease: EASE_OUT }}
        />
      )}
    </div>

    <div className="builder-info-area">
      <motion.div
        className="builder-site"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 + index * 0.06 }}
      >
        REPRESENTATIVE
      </motion.div>
      <h3 className="builder-name">{person.name}</h3>
      <span className="builder-uni-label-small">{person.university || 'Code Catalysts'}</span>
      <div className="builder-social-wrap">
        <SocialLinks github={person.github} linkedin={person.linkedin} size={14} />
      </div>
    </div>
  </motion.div>
);

/* ─── Catalyst Card (Member) — slides from bottom in staggered wave ── */
const CatalystCard = ({ person, onClick, index = 0 }) => {
  const accentColor = index % 3 === 0 ? 'var(--primary)' : index % 3 === 1 ? 'var(--secondary)' : 'var(--accent)';

  return (
    <motion.div
      className="catalyst-card"
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay: (index % 6) * 0.07, ease: EASE_OUT }}
      whileHover={{
        backgroundColor: 'rgba(255,255,255,0.055)',
        scale: 1.025,
        borderColor: `${accentColor}55`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.35), 0 0 20px ${accentColor}18`,
        y: -4,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(person)}
    >
      <div className="catalyst-header-row">
        {/* Avatar circle */}
        <motion.div
          className="catalyst-avatar-circle"
          style={{ borderColor: `${accentColor}33` }}
          whileHover={{ borderColor: accentColor, boxShadow: `0 0 16px ${accentColor}33` }}
        >
          {person.image_url ? (
            <img src={person.image_url} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span className="catalyst-initials" style={{ color: accentColor }}>
              {person.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </motion.div>

        <div className="catalyst-title-wrap">
          <h4 className="catalyst-name">{person.name}</h4>
          <span className="catalyst-role">MEMBER</span>
        </div>
      </div>

      <div className="catalyst-body">
        <p className="catalyst-bio">{person.tagline || person.bio}</p>
      </div>

      <div className="catalyst-card-footer">
        <span className="catalyst-uni-label" style={{ color: accentColor }}>
          {person.university || 'Code Catalysts'}
        </span>
        <div className="catalyst-socials-minimal">
          <SocialLinks github={person.github} linkedin={person.linkedin} size={14} />
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Data Fetching ──────────────────────────────────────── */
export async function getStaticProps() {
  const { data: teamMembers } = await supabaseServer
    .from('team_members')
    .select('*')
    .order('order_index', { ascending: true })
    .order('name', { ascending: true });

  const { data: footerSettings } = await supabaseServer
    .from('footer_settings').select('*').maybeSingle();

  const { data: siteContentRaw } = await supabaseServer.from('site_content').select('*');
  const siteContent = (siteContentRaw || []).reduce((acc, curr) => {
    acc[curr.key] = curr.content;
    return acc;
  }, {});

  return {
    props: {
      teamMembers: teamMembers || [],
      footerSettings: footerSettings || {},
      siteContent,
    },
    revalidate: 60,
  };
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function TeamPage({ teamMembers, footerSettings, siteContent }) {
  const router = useRouter();
  const [activeMember, setActiveMember] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visionary = teamMembers.find(m => m.role === 'Lead');
  const builders  = teamMembers.filter(m => m.role === 'Rep');
  const catalysts = teamMembers.filter(m => m.role === 'Member');

  return (
    <>
      <Head>
        <title>Code Catalysts — The Team</title>
        <meta name="description" content="Meet the people behind Code Catalysts — our leaders, representatives, and members who are building the future together." />
        <meta property="og:title"       content="Code Catalysts — The Team" />
        <meta property="og:description" content="Meet the people behind Code Catalysts." />
        <meta property="og:type"        content="website" />
      </Head>

      <motion.div
        className="team-system-page"
        animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <TeamBackground />

        <AnimatePresence>
          {activeMember && (
            <ExpandedProfile person={activeMember} onClose={() => setActiveMember(null)} />
          )}
        </AnimatePresence>

        {/* ══ HERO ══ */}
        <section className="team-hero">

          {/* Tag line — letter-spacing expand */}
          <motion.span
            className="team-hero-label"
            initial={{ opacity: 0, y: 12, letterSpacing: '0.2em' }}
            animate={{ opacity: 0.8, y: 0,  letterSpacing: '0.8em' }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE_OUT }}
          >
            The Architect of Code
          </motion.span>

          {/* H1 — bursts from blur */}
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              className="team-hero-title"
              initial={{ opacity: 0, y: 70, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.55, ease: EASE_OUT }}
            >
              The Catalysts.
            </motion.h1>
          </div>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: EASE_EXPO }}
            style={{
              marginTop: '2rem',
              height: '2px',
              width: '80px',
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: '100px',
              boxShadow: '0 0 24px var(--primary)',
              transformOrigin: 'center',
            }}
          />

          {/* Scroll hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.0 }}
            style={{
              marginTop: '2.5rem',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
            }}
          >
            Scroll to meet them
          </motion.p>
        </section>

        {/* ══ MAIN CONTENT ══ */}
        <main className="container" style={{ margin: '0 auto', maxWidth: '1200px', padding: '0 2rem 10vh' }}>

          {/* The Visionary */}
          {visionary && (
            <>
              <SectionHeader title="The Visionary" color="var(--primary)" />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <VisionaryCard person={visionary} onClick={setActiveMember} />
              </div>
            </>
          )}

          {/* The Builders */}
          {builders.length > 0 && (
            <>
              <SectionHeader title="The Builders" color="var(--secondary)" delay={0.05} />
              <div className="builders-grid">
                {builders.map((builder, i) => (
                  <BuilderCard key={builder.id} person={builder} onClick={setActiveMember} index={i} />
                ))}
              </div>
            </>
          )}

          {/* The Catalysts */}
          {catalysts.length > 0 && (
            <>
              <SectionHeader title="The Catalysts" color="var(--accent)" delay={0.05} />
              <div className="catalysts-grid">
                {catalysts.map((member, i) => (
                  <CatalystCard key={member.id} person={member} onClick={setActiveMember} index={i} />
                ))}
              </div>
            </>
          )}

        </main>

        <Footer footerSettings={footerSettings} siteContent={siteContent} />
      </motion.div>

      {/* Return Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isExiting ? 0 : 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ x: -6, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'var(--primary)', boxShadow: '0 0 20px rgba(123,97,255,0.2)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => router.push('/'), 400);
        }}
        className="return-root-btn"
      >
        <ChevronLeft size={16} /> RETURN
      </motion.button>
    </>
  );
}
