import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/core/utils/animations.jsx';

const EASE_EXPO = [0.87, 0, 0.13, 1];

// Custom, High-fidelity Animated SVGs for Genesis Story
const ScanLineOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-20 opacity-[0.05]"
    style={{
      background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))`,
      backgroundSize: '100% 3px, 3px 100%',
    }}
  />
);

// Metadata component removed


const LoopSVG = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full max-w-[320px] opacity-40">
    <path
      d="M120,60 A60,60 0 1,1 119.9,60"
      fill="none"
      stroke="var(--dash-cyan)"
      strokeWidth="1.5"
      opacity="0.5"
    />
    <circle cx="120" cy="120" r="80" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="4 8" opacity="0.1" />
    <circle cx="120" cy="40" r="2" fill="var(--dash-cyan)" />
    <circle cx="120" cy="200" r="2" fill="var(--dash-cyan)" opacity="0.3" />
  </svg>
);

const GrowthSVG = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full max-w-[280px] opacity-50">
    <line x1="40" y1="180" x2="200" y2="180" stroke="white" strokeWidth="0.5" opacity="0.2" />
    <path
      d="M60,180 Q100,180 120,130 T180,60"
      fill="none"
      stroke="var(--dash-magenta)"
      strokeWidth="1.5"
    />
    <circle cx="180" cy="60" r="4" fill="var(--dash-magenta)" />
  </svg>
);

const ConnectionSVG = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full max-w-[260px] opacity-45">
    <path d="M70,70 L170,170 M70,170 L170,70" stroke="white" strokeWidth="0.2" strokeDasharray="1 4" />
    {[{ x: 70, y: 70 }, { x: 170, y: 170 }, { x: 120, y: 120 }].map((pos, i) => (
      <circle key={i} cx={pos.x} cy={pos.y} r={i === 2 ? 5 : 3} fill={i === 2 ? "var(--dash-cyan)" : "white"} />
    ))}
  </svg>
);

const ExpansionSVG = () => (
  <svg viewBox="0 0 240 240" className="w-full h-full max-w-[300px] opacity-40">
    <circle cx="120" cy="120" r="60" fill="none" stroke="var(--dash-cyan)" strokeWidth="0.5" opacity="0.3" />
    <circle cx="120" cy="120" r="90" fill="none" stroke="var(--dash-cyan)" strokeWidth="0.2" opacity="0.1" />
    {[0, 90, 180, 270].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <circle
          key={i}
          cx={120 + Math.cos(rad) * 60}
          cy={120 + Math.sin(rad) * 60}
          r="1.5"
          fill="white"
          opacity="0.3"
        />
      );
    })}
  </svg>
);

const ChapterLabel = ({ label, color }) => (
  <motion.div
    variants={staggerContainer(0.12, 0)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.6 }}
    className="chapter-label-line"
    style={{ display: 'flex', alignItems: 'center' }}
  >
    <motion.div
      variants={{
        hidden: { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
      }}
      style={{ background: color, transformOrigin: 'left', flex: 1, height: '1px', maxWidth: '120px' }}
    />
    <motion.span variants={fadeUpVariant} className="text" style={{ padding: '0 1.5rem', letterSpacing: '0.4em' }}>{label}</motion.span>
    <motion.div
      variants={{
        hidden: { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO, delay: 0.15 } },
      }}
      style={{ background: color, transformOrigin: 'right', flex: 1, height: '1px', maxWidth: '120px' }}
    />
  </motion.div>
);

const Chapter_Genesis = ({ chapter1Items = [] }) => {
  // We use exactly 4 items for the dashboard layout.
  // We merge dynamic data from Supabase with the high-fidelity hardcoded defaults
  // so that even with partial data, the layout feels complete.
  const defaults = [
    { title: "Stuck in the Loop", meta: "PHASE 01", content: "Classes. Scrolling. Repeating.\nWe knew this wasn’t leading anywhere.", color: "#818cf8" },
    { title: "Choosing Growth", meta: "PHASE 02", content: "We decided to build instead of scroll.\nStarted with just one mind.", color: "#f43f5e" },
    { title: "Finding Our People", meta: "PHASE 03", content: "Hackathons brought us together.\nSame mindset. Same hunger.", color: "#06b6d4" },
    { title: "Momentum", meta: "PHASE 04", content: "From one class → many classes.\nFrom one college → many colleges.", color: "#10b981" }
  ];

  const cards = [0, 1, 2, 3].map(i => {
    const item = chapter1Items[i] || {};
    return {
      title: item.title || defaults[i].title,
      meta: item.meta || defaults[i].meta,
      content: (item.description || defaults[i].content).split('\n'),
      color: defaults[i].color
    };
  });

  return (
    <section id="chapter-01" className="chapter-section genesis-timeline">
      <div className="container">

        <div style={{ marginBottom: '8vh' }}>
          <ChapterLabel label="CHAPTER 01" color="var(--dash-cyan)" />

          <motion.div
            variants={staggerContainer(0.14, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="chapter-header-v2"
          >
            <div className="chapter-title-v2">
              <motion.span variants={fadeUpVariant} className="title-prefix" style={{ color: 'rgba(255,255,255,0.2)' }}>THE</motion.span>
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="title-main"
                style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--dash-cyan), var(--dash-magenta))', backgroundClip: 'text' }}
              >
                GENESIS
              </motion.h2>
            </div>
          </motion.div>
        </div>

        <div className="genesis-dash-grid" style={{ gap: '1rem' }}>

          {/* Module 01: The Realization (SCAN LINE EFFECT) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.2, ease: EASE_EXPO }}
            className="dash-module mod-primary"
            style={{
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <ScanLineOverlay />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <LoopSVG />
            </div>
            <div className="relative z-10">
              <h2 className="text-white text-4xl font-black tracking-tight mb-6 leading-tight">
                {cards[0].title}
              </h2>
              {cards[0].content.map((line, i) => (
                <p key={i} className="text-white/50 text-sm font-medium tracking-wide mb-2 max-w-[85%]">{line}</p>
              ))}
            </div>
          </motion.div>

          {/* Module 02: The Shift (MAGENTA GRADIENT) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE_EXPO }}
            className="dash-module mod-tech"
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <GrowthSVG />
            </div>
            <div className="relative z-10 text-right">
              <h3 className="text-white text-4xl font-black tracking-tight mb-6 leading-tight">{cards[1].title}</h3>
              {cards[1].content.map((line, i) => (
                <p key={i} className="text-white/50 text-sm font-medium tracking-wide mb-2">{line}</p>
              ))}
            </div>
          </motion.div>

          {/* Module 03: The Connection (MESH GRADIENT) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE_EXPO }}
            className="dash-module mod-gradient"
            style={{
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <ConnectionSVG />
            </div>
            <div className="relative z-10">
              <h2 className="text-white text-4xl font-black mb-6 tracking-tighter leading-none">{cards[2].title}</h2>
              {cards[2].content.map((line, i) => (
                <p key={i} className="text-white/50 text-sm font-medium tracking-wide mb-2">{line}</p>
              ))}
            </div>
          </motion.div>

          {/* Module 04: The Expansion (CYAN GRADIENT) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.2, delay: 0.6, ease: EASE_EXPO }}
            className="dash-module mod-narrative"
            style={{
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <ExpansionSVG />
            </div>
            <div className="relative z-10 text-center">
              <h3 className="text-white text-4xl font-black tracking-tight mb-8 leading-tight">
                {cards[3].title}
              </h3>
              <div className="space-y-2">
                {cards[3].content.map((line, i) => (
                  <p key={i} className="text-white/50 text-sm font-medium tracking-wide">{line}</p>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Chapter_Genesis;



