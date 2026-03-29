import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

// Import New Cinematic Chapters
import Chapter_Hero from '../components/Chapter_Hero';
import Chapter_Genesis from '../components/Chapter_Genesis';
import Chapter_Shift from '../components/Chapter_Shift';
import Chapter_Journey from '../components/Chapter_Journey';
import Chapter_Forge from '../components/Chapter_Forge';
import Chapter_Architects from '../components/Chapter_Architects';
import UnifiedBackground from '../components/UnifiedBackground';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="landing-page" ref={containerRef} style={{ background: '#050505', color: 'white' }}>
      
      {/* Dynamic Evolution Background */}
      <UnifiedBackground />

      {/* CHAPTER 00: THE SPARK */}
      <Chapter_Hero />

      {/* CHAPTER 01: THE GENESIS */}
      <Chapter_Genesis />

      {/* CHAPTER 02: THE SHIFT */}
      <Chapter_Shift />

      {/* CHAPTER 03: THE JOURNEY */}
      <Chapter_Journey />

      {/* CHAPTER 04: THE FORGE */}
      <Chapter_Forge />

      {/* CHAPTER 05: THE ARCHITECTS */}
      <Chapter_Architects />

      {/* FINAL SECTION: JOIN THE BUILDERS */}
      <section className="chapter-section final-cta" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 100%, rgba(123, 97, 255, 0.15) 0%, transparent 70%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Removed THE FINAL CALL header as requested */}
            <h2 className="hero-headline" style={{ fontSize: 'clamp(3.5rem, 11vw, 7.5rem)', marginBottom: '2rem', lineHeight: 0.9 }}>
              JOIN THE <br />
              <span className="text-gradient">BUILDERS.</span>
            </h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ fontSize: '1.6rem', color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}
            >
              You don’t need to be the best.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              style={{ fontSize: '1.6rem', color: 'white', maxWidth: '700px', margin: '0 auto 4rem auto', lineHeight: 1.6, fontWeight: 700 }}
            >
              Just someone who starts.
            </motion.p>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/apply')}
              className="btn-catalyst-large"
            >
              BECOME A CATALYST <Sparkles size={28} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
