import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';
import Button from '../components/Button';
import { SHIMMER_1_1 } from '../utils/imageUtils';

const EASE_EXPO = [0.87, 0, 0.13, 1];
const EASE_OUT = [0.16, 1, 0.3, 1];

const MemberCard = ({ person, accent }) => {
  let displayRole = person.role?.toUpperCase() || '';
  if (displayRole === 'LEAD') {
    displayRole = person.name.toLowerCase().replace(/\s/g, '').includes('rudrak') ? 'FOUNDER' : 'FOUNDER';
  } else if (displayRole === 'REP') {
    displayRole = 'REPRESENTATIVE';
  }

  return (
    <motion.div
      className="pill-card"
      style={{ width: 'min(300px, 85vw)', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
    >
      <div className="pill-avatar-wrap" style={{
        width: '56px', height: '56px',
        background: `linear-gradient(45deg, ${accent || 'var(--secondary)'}, transparent)`,
      }}>
        <div className="pill-avatar">
          {person.image ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={person.image}
                alt={person.name ?? 'Team Member'}
                fill
                sizes="56px"
                style={{ objectFit: 'cover' }}
                placeholder="blur"
                blurDataURL={SHIMMER_1_1}
              />
            </div>
          ) : (
            <div style={{
              width: '100%', height: '100%', background: '#111',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 900, color: accent || 'var(--secondary)',
            }}>
              {(person.name || '?')[0]}
            </div>
          )}
        </div>
      </div>
      <div className="pill-info">
        <h3 className="pill-name" style={{ fontSize: '1.1rem' }}>{person.name}</h3>
        <p className="pill-role" style={{ color: accent || 'var(--secondary)', fontSize: '0.7rem' }}>{displayRole}</p>
      </div>
    </motion.div>
  );
};

const ScrollingTrack = ({ items, duration, reverse = false, accent }) => {
  const displayItems = React.useMemo(() => (items.length > 0 ? [...items, ...items] : []), [items]);
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <div
      className="infinite-scroll-container"
      style={{ overflow: 'hidden', width: '100vw', margin: '1rem 0' }}
      aria-hidden="true"  /* decorative — screen readers skip this */
    >
      <motion.div
        className="infinite-scroll-track"
        animate={shouldReduceMotion ? { x: 0 } : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
        style={{
          display: 'flex',
          gap: '1rem',
          width: 'max-content',
          cursor: 'default',
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
      >
        {displayItems.map((member, i) => (
          <MemberCard key={i} person={member} accent={accent} />
        ))}
      </motion.div>
    </div>
  );
};

const Chapter_Architects = ({ teamMembers = [], siteContent = {} }) => {
  const router = useRouter();

  const leads = teamMembers.filter(m => m.role === 'Lead' || m.role === 'Rep');
  const simpleMembers = teamMembers.filter(m => m.role === 'Member');

  let row1Items, row2Items, row3Items;
  if (leads.length > 0) {
    row1Items = leads.map(m => ({ ...m, image: m.image_url }));
    const memberList = simpleMembers.map(m => ({ ...m, image: m.image_url }));
    row2Items = memberList.slice(0, Math.ceil(memberList.length / 2));
    row3Items = memberList.slice(Math.ceil(memberList.length / 2));
  } else {
    const all = teamMembers.map(m => ({ ...m, image: m.image_url }));
    const third = Math.ceil(all.length / 3);
    row1Items = all.slice(0, third);
    row2Items = all.slice(third, 2 * third);
    row3Items = all.slice(2 * third);
  }

  return (
    <section className="chapter-section architects-scan" id="chapter-05" style={{ position: 'relative', overflow: 'hidden', padding: '10vh 0' }}>


      {/* Header */}
      <div className="container" style={{ position: 'relative', zIndex: 1, marginBottom: '5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          {/* Chapter label */}
          <motion.div
            variants={staggerContainer(0.12, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="chapter-label-line"
          >
            <motion.div
              variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO } } }}
              style={{ background: 'var(--accent)', transformOrigin: 'left', flex: 1, height: '1px', maxWidth: '120px' }}
            />
            <motion.span variants={fadeUpVariant} className="text">CHAPTER 05</motion.span>
            <motion.div
              variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO, delay: 0.15 } } }}
              style={{ background: 'var(--accent)', transformOrigin: 'right', flex: 1, height: '1px', maxWidth: '120px' }}
            />
          </motion.div>

          {/* Title */}
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
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_OUT } },
                }}
                className="title-main"
                style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--accent), var(--primary))' }}
              >
                {(siteContent.chapter5_title || 'ARCHITECTS').replace(/^THE\s+/i, '')}
              </motion.h2>
            </div>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.85, delay: 0.35, ease: EASE_OUT }}
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.3)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            The humans behind the code. Every idea started here.
          </motion.p>
        </div>
      </div>

      {/* Scrolling member tracks — stagger their appearance */}
      <motion.div
        className="scrolling-rows-container"
        style={{ margin: '3rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <ScrollingTrack items={row1Items} duration={60} accent="var(--primary)" />
        <ScrollingTrack items={row2Items} duration={80} reverse={true} accent="var(--secondary)" />
        <ScrollingTrack items={row3Items} duration={70} accent="var(--accent)" />
      </motion.div>

      {/* CTA */}
      <div className="container" style={{ marginTop: '3rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.85, ease: EASE_OUT }}
        >
          <Button
            variant="default"
            size="lg"
            motionProps={{
              whileHover: { scale: 1.06, boxShadow: '0 0 40px rgba(123,97,255,0.4)', y: -4 },
              whileTap: { scale: 0.95 }
            }}
            onClick={() => router.push('/team')}
          >
            MEET THE CATALYSTS
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Chapter_Architects;
