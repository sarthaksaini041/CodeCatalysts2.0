import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import {
  fadeUpVariant,
  staggerContainer,
  SplitWords,
} from '../utils/animations.jsx';

const EASE_EXPO = [0.87, 0, 0.13, 1];

/* Chapter label with animated expanding lines */
const ChapterLabel = ({ label, color }) => (
  <motion.div
    variants={staggerContainer(0.12, 0)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.6 }}
    className="chapter-label-line"
    style={{ alignItems: 'center' }}
  >
    <motion.div
      variants={{
        hidden:  { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
      }}
      style={{ background: color, transformOrigin: 'left', flex: 1, height: '1px', maxWidth: '120px' }}
    />
    <motion.span variants={fadeUpVariant} className="text">{label}</motion.span>
    <motion.div
      variants={{
        hidden:  { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO, delay: 0.15 } },
      }}
      style={{ background: color, transformOrigin: 'right', flex: 1, height: '1px', maxWidth: '120px' }}
    />
  </motion.div>
);

const Chapter_Genesis = ({ chapter1Items = [], siteContent = {} }) => {
  const points = chapter1Items.map((item, index) => ({
    title: item.title,
    content: item.description,
    image: item.image_url,
    reverse: index % 2 !== 0,
  }));

  return (
    <section id="chapter-01" className="chapter-section genesis-timeline">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Chapter header */}
        <div style={{ marginBottom: '5rem' }}>
          <ChapterLabel label="CHAPTER 01" color="var(--primary)" />

          <motion.div
            variants={staggerContainer(0.14, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="chapter-header-v2"
          >
            <div className="chapter-title-v2">
              <motion.span variants={fadeUpVariant} className="title-prefix">THE</motion.span>
              <motion.h2
                variants={{
                  hidden:  { opacity: 0, y: 30 }, // Removed blur filter
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="title-main"
                style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                GENESIS
              </motion.h2>
            </div>
          </motion.div>
        </div>

        {/* Zig-zag story rows */}
        <div className="zig-zag-container" style={{ position: 'relative' }}>
          {points.map((point, index) => (
            <div key={index} style={{ marginBottom: 'clamp(5rem, 10vh, 10rem)' }}>
              <div
                className={`zig-zag-row ${point.reverse ? 'reverse' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Text block — slides in from its side */}
                <ScrollReveal
                  direction={point.reverse ? 'right' : 'left'}
                  delay={0}
                  duration={1}
                  amount={0.15}
                  className="zig-zag-content"
                  style={{ flex: 1 }}
                >
                  {/* Index log */}
                  <motion.span
                    initial={{ opacity: 0, x: point.reverse ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.25)',
                      letterSpacing: '0.2em',
                      display: 'block',
                      marginBottom: '1rem',
                      fontWeight: 900,
                    }}
                  >
                    0{index + 1}
                  </motion.span>

                  {/* Title — word by word */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <SplitWords
                      as="h3"
                      text={point.title}
                      delay={0.15}
                      style={{
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                        fontWeight: 950,
                        color: index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
                        // Removed 40px blur textShadow for performance
                        letterSpacing: '-0.02em',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Body — fades up */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontSize: '1.05rem',
                      color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.75,
                      maxWidth: '480px',
                      marginLeft: point.reverse ? 'auto' : '0',
                    }}
                  >
                    {point.content}
                  </motion.p>
                </ScrollReveal>

                {/* Image — photo-developing reveal */}
                <ScrollReveal
                  direction="photo"
                  delay={0.1}
                  duration={1.3}
                  amount={0.15}
                  className="zig-zag-image-wrapper"
                  style={{ flex: 1, position: 'relative' }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={point.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'}
                      alt={point.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      className="zig-zag-image"
                    />
                  </div>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: index % 2 === 0
                      ? 'rgba(123, 97, 255, 0.08)'
                      : 'rgba(255, 138, 23, 0.08)',
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.55), transparent)', pointerEvents: 'none' }} />

                  {/* Corner index label */}
                  <div style={{
                    position: 'absolute', top: '1.2rem', right: '1.2rem',
                    fontFamily: 'JetBrains Mono', fontSize: '0.58rem',
                    color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', fontWeight: 700,
                  }}>
                    MEM_0{index + 1}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chapter_Genesis;
