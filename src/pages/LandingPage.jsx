import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

// Import New Cinematic Chapters
import Chapter_Hero from '../components/Chapter_Hero';
import Chapter_Genesis from '../components/Chapter_Genesis';
import Chapter_Shift from '../components/Chapter_Shift';
import Chapter_Journey from '../components/Chapter_Journey';
import Chapter_Forge from '../components/Chapter_Forge';
import Chapter_Architects from '../components/Chapter_Architects';
import Footer from '../components/Footer';

const landingWrapperStyle = { background: 'transparent', color: 'white' };
const finalCtaStyle = { minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const finalContainerStyle = { textAlign: 'center' };
const heroHeadlineStyle = { fontSize: 'clamp(3.5rem, 11vw, 7.5rem)', marginBottom: '2rem', lineHeight: 0.9 };
const p1Style = { fontSize: '1.6rem', color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 };
const p2Style = { fontSize: '1.6rem', color: 'white', maxWidth: '700px', margin: '0 auto 4rem auto', lineHeight: 1.6, fontWeight: 700 };

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { loading } = useCMS();
  
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="min-h-screen bg-black flex items-center justify-center fixed inset-0 z-[1000]"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <Loader2 className="animate-spin text-primary" size={48} strokeWidth={1} />
              <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black tracking-[1em] text-primary uppercase opacity-60">Initializing</span>
              <span className="text-xs font-black tracking-[0.5em] text-white uppercase">THE VOID</span>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="landing-page" 
          ref={containerRef} 
          style={landingWrapperStyle}
        >


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
          <section className="chapter-section final-cta" style={finalCtaStyle}>
            <div className="container" style={finalContainerStyle}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="hero-headline" style={heroHeadlineStyle}>
                  JOIN THE <br />
                  <span className="text-gradient">BUILDERS.</span>
                </h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={p1Style}
                >
                  You don’t need to be the best.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  style={p2Style}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingPage;
