import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CountUp = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

const Chapter_Shift = () => {
  const principles = [
    { title: "Start Before Ready", desc: "Action is the best teacher. Don't wait for permission.", icon: "⚡" },
    { title: "Build > Talk", desc: "Code speaks louder than words. Ship early and often.", icon: "🛠️" },
    { title: "Consistency Wins", desc: "Success is a compounding game. Show up every day.", icon: "📈" },
    { title: "Learn in Public", desc: "Transparency breeds growth. Share your journey.", icon: "🌐" }
  ];

  const stats = [
    { label: "Builders", val: 120, suffix: "+" },
    { label: "Hackathons", val: 18, suffix: "" },
    { label: "Wins", val: 14, suffix: "" },
    { label: "Projects", val: 45, suffix: "+" }
  ];

  return (
    <section id="chapter-02" className="chapter-section shift-hybrid" style={{ 
      background: 'radial-gradient(circle at 50% 50%, rgba(123, 97, 255, 0.05) 0%, transparent 70%)',
      padding: '15vh 2rem'
    }}>
      <div className="container">
        <span className="chapter-label">CHAPTER 02 // THE SHIFT</span>
        <h2 className="chapter-title">The Mindset <span className="text-gradient">Shift.</span></h2>
        
        <motion.div 
          className="principles-grid" 
          style={{ marginBottom: '8rem' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {principles.map((p, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card"
              style={{ padding: '3rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', opacity: 0.8 }}>{p.icon}</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{p.title}</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{p.desc}</p>
              <div style={{ 
                position: 'absolute', 
                bottom: '-20px', 
                right: '-20px', 
                fontSize: '8rem', 
                fontWeight: 900, 
                opacity: 0.03, 
                userSelect: 'none' 
              }}>
                {i + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="stats-grid" 
          style={{ marginTop: '8rem' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {[
            { label: "ARCHITECTS", val: 30, suffix: "+", sub: "Building the core", color: "#7b61ff" },
            { label: "DEPLOYMENTS", val: 12, suffix: "+", sub: "Live ecosystems", color: "#ff8a17" },
            { label: "VICTORIES", val: 8, suffix: "", sub: "Shattering records", color: "#00f5d4" },
            { label: "BREAKTHROUGHS", val: 15, suffix: "+", sub: "New paradigms", color: "#f15bb5" }
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '24px',
                padding: '4rem 2rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
               {/* Large Index Number */}
               <div style={{ 
                 position: 'absolute', 
                 top: '10px', 
                 left: '20px', 
                 fontSize: '6rem', 
                 fontWeight: 900, 
                 color: 'rgba(255,255,255,0.03)', 
                 lineHeight: 1,
                 userSelect: 'none'
               }}>
                 {i + 1}
               </div>

               {/* Main Number */}
               <div style={{ position: 'relative', zIndex: 1, fontSize: '4.5rem', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '1.5rem' }}>
                 <CountUp end={s.val} />{s.suffix}
               </div>

               {/* Label & Subtext */}
               <div style={{ position: 'relative', zIndex: 1 }}>
                 <div style={{ fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: s.color, fontWeight: 900, marginBottom: '0.5rem' }}>
                   {s.label}
                 </div>
                 <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                   {s.sub}
                 </div>
               </div>

               {/* Bottom Accent Bar */}
               <div style={{ 
                 position: 'absolute', 
                 bottom: 0, 
                 left: '50%', 
                 transform: 'translateX(-50%)', 
                 width: '40px', 
                 height: '3px', 
                 background: s.color, 
                 borderRadius: '10px 10px 0 0',
                 boxShadow: `0 0 15px ${s.color}66`
               }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Chapter_Shift;
