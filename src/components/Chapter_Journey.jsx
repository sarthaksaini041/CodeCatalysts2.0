import React from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer, SplitWords } from '../utils/animations.jsx';
import ScrollReveal from './ScrollReveal';
import Image from 'next/image';

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

const Chapter_Journey = ({ chapter3Steps = [], siteContent = {} }) => {
  const journeySteps = chapter3Steps.map(step => ({
    title: step.title,
    desc: step.description,
    image: step.image_url,
    layout: step.layout_type || 'image-right',
  }));

  return (
    <section id="chapter-03" className="chapter-section journey-scroll">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '5rem' }}>
          <ChapterLabel label="CHAPTER 03" color="#60A5FA" />

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
                style={{ '--chapter-gradient': 'linear-gradient(135deg, #60A5FA, var(--primary))' }}
              >
                JOURNEY
              </motion.h2>
            </div>
          </motion.div>

          {/* Quote — reveals word by word */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE_OUT }}
            style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.38)',
              maxWidth: '680px',
              margin: '3rem auto 0',
              lineHeight: 1.85,
              fontWeight: 500,
              fontStyle: 'italic',
              borderLeft: '2px solid rgba(96, 165, 250, 0.3)',
              paddingLeft: '1.5rem',
              textAlign: 'left',
            }}
          >
            &ldquo;It didn&apos;t happen in one moment&hellip; It was a thousand moments of choosing to stay when we could have left.&rdquo;
          </motion.div>
        </div>

        {/* Journey steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15vh' }}>
          {journeySteps.map((step, i) => {
            const isImageLeft = step.layout === 'image-left';
            const accentColor = i % 2 === 0 ? 'var(--primary)' : '#60A5FA';

            return (
              <div key={i} style={{ marginBottom: 'clamp(5rem, 12vh, 15rem)' }}>
                <div
                  className={`zig-zag-row ${isImageLeft ? '' : 'reverse'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {/* Text panel — slides from its side */}
                  <ScrollReveal
                    direction={isImageLeft ? 'left' : 'right'}
                    delay={0}
                    duration={1}
                    amount={0.15}
                    className="zig-zag-content"
                    style={{
                      flex: 1,
                      padding: 'clamp(1.5rem, 4vw, 4rem)',
                      background: 'rgba(255,255,255,0.015)',
                      borderRadius: '40px',
                      border: '1px solid rgba(255,255,255,0.055)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: `0 30px 60px -12px rgba(0,0,0,0.5), 0 0 30px ${accentColor}0d`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Log badge */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 }}
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.62rem',
                        color: accentColor,
                        letterSpacing: '0.3em',
                        marginBottom: '1.5rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                      }}
                    >
                      CHAPTER_LOG :: {String(i + 1).padStart(2, '0')}
                    </motion.div>

                    {/* Step title — word by word */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <SplitWords
                        as="h3"
                        text={step.title}
                        delay={0.2}
                        style={{
                          fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)',
                          fontWeight: 950,
                          color: '#fff',
                          letterSpacing: '-0.02em',
                          display: 'block',
                        }}
                      />
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT }}
                      style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.75 }}
                    >
                      {step.desc}
                    </motion.p>

                    {/* Accent corner */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0, [isImageLeft ? 'left' : 'right']: 0,
                      width: '80px', height: '3px',
                      background: accentColor,
                      borderRadius: '100px',
                      boxShadow: `0 0 16px ${accentColor}`,
                    }} />
                  </ScrollReveal>

                  {/* Image — photo reveal from opposite side */}
                  <ScrollReveal
                    direction={isImageLeft ? 'right' : 'left'}
                    delay={0.12}
                    duration={1.2}
                    amount={0.15}
                    className="zig-zag-image-wrapper"
                    style={{ flex: 1.2, position: 'relative', height: '100%', minHeight: '300px' }}
                  >
                    <Image
                      src={step.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      className="zig-zag-image"
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(${isImageLeft ? 'to right' : 'to left'}, rgba(5,5,5,0.55), transparent)`,
                    }} />
                    {/* Step number watermark */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1.2rem', [isImageLeft ? 'right' : 'left']: '1.5rem',
                      fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
                      color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', fontWeight: 700,
                    }}>
                      STEP_{String(i + 1).padStart(2, '0')}
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Journey;
