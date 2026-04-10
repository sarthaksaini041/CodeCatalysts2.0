import React, { useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { supabaseServer } from '../src/lib/supabase-server';

// Import chapter components
import Chapter_Hero from '../src/components/Chapter_Hero';
import Chapter_Genesis from '../src/components/Chapter_Genesis';
import Chapter_Shift from '../src/components/Chapter_Shift';
import Chapter_Journey from '../src/components/Chapter_Journey';
import Chapter_Forge from '../src/components/Chapter_Forge';
import Chapter_Architects from '../src/components/Chapter_Architects';
import Footer from '../src/components/Footer';
import ParallaxLayer from '../src/components/ParallaxLayer';

// Dynamic import for Three.js / heavy visual components
const UnifiedBackground = dynamic(() => import('../src/components/UnifiedBackground'), { ssr: false });

const scrollOffset = ["start start", "end end"];
const landingWrapperStyle = { background: 'transparent', color: 'white' };
const finalCtaStyle = { minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const finalContainerStyle = { textAlign: 'center' };
const heroHeadlineStyle = { fontSize: 'clamp(3.5rem, 11vw, 7.5rem)', marginBottom: '2rem', lineHeight: 0.9 };
const p1Style = { fontSize: '1.6rem', color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 };
const p2Style = { fontSize: '1.6rem', color: 'white', maxWidth: '700px', margin: '0 auto 4rem auto', lineHeight: 1.6, fontWeight: 700 };

/**
 * Fetch ALL CMS data at build time.
 * Zero runtime API calls for visitors.
 */
export async function getStaticProps() {
  const [
    { data: siteContentRaw },
    { data: chapter1Items },
    { data: chapter2Cards },
    { data: chapter2Stats },
    { data: chapter3Steps },
    { data: projects },
    { data: chapter5Showcase },
    { data: teamMembers },
    { data: footerSettings },
  ] = await Promise.all([
    supabaseServer.from('site_content').select('*'),
    supabaseServer.from('chapter1_items').select('*').order('order_index', { ascending: true }),
    supabaseServer.from('chapter2_cards').select('*').order('order_index', { ascending: true }),
    supabaseServer.from('chapter2_stats').select('*').order('order_index', { ascending: true }),
    supabaseServer.from('chapter3_steps').select('*').order('order_index', { ascending: true }),
    supabaseServer.from('projects').select('*').order('order_index', { ascending: true }),
    supabaseServer.from('chapter5_showcase').select('*').order('order_index', { ascending: true }),
    supabaseServer.from('team_members').select('*').order('order_index', { ascending: true }).order('name', { ascending: true }),
    supabaseServer.from('footer_settings').select('*').maybeSingle(),
  ]);

  // Transform site_content array into a key-value map
  const siteContent = (siteContentRaw || []).reduce((acc, curr) => {
    acc[curr.key] = curr.content;
    return acc;
  }, {});

  return {
    props: {
      siteContent,
      chapter1Items: chapter1Items || [],
      chapter2Cards: chapter2Cards || [],
      chapter2Stats: chapter2Stats || [],
      chapter3Steps: chapter3Steps || [],
      projects: projects || [],
      chapter5Showcase: chapter5Showcase || [],
      teamMembers: teamMembers || [],
      footerSettings: footerSettings || {},
    },
    revalidate: 60, // ISR: Regenerate page every 60 seconds in background
  };
}

export default function HomePage({
  siteContent,
  chapter1Items,
  chapter2Cards,
  chapter2Stats,
  chapter3Steps,
  projects,
  chapter5Showcase,
  teamMembers,
  footerSettings,
}) {
  const router = useRouter();
  const containerRef = useRef(null);

  return (
    <>
      <Head>
        <title>Code Catalysts</title>
        <meta name="description" content="Code Catalysts is a community of passionate builders, developers, and innovators. Join us to learn, build, and ship together." />
        <meta property="og:title" content="Code Catalysts" />
        <meta property="og:description" content="A community of passionate builders, developers, and innovators." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="landing-page"
        ref={containerRef}
        style={landingWrapperStyle}
      >
        {/* Dynamic Evolution Background */}
        <UnifiedBackground />

        {/* CHAPTER 00: THE SPARK */}
        <Chapter_Hero siteContent={siteContent} />

        {/* CHAPTER 01: THE GENESIS */}
        <Chapter_Genesis chapter1Items={chapter1Items} siteContent={siteContent} />

        {/* CHAPTER 02: THE SHIFT */}
        <Chapter_Shift chapter2Cards={chapter2Cards} chapter2Stats={chapter2Stats} siteContent={siteContent} />

        {/* CHAPTER 03: THE JOURNEY */}
        <Chapter_Journey chapter3Steps={chapter3Steps} siteContent={siteContent} />

        {/* CHAPTER 04: THE FORGE */}
        <Chapter_Forge projects={projects} siteContent={siteContent} />

        {/* CHAPTER 05: THE ARCHITECTS */}
        <Chapter_Architects teamMembers={teamMembers} />

        <section className="chapter-section final-cta" style={finalCtaStyle}>
          <div className="container" style={finalContainerStyle}>
            <ParallaxLayer offset={50}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.8 }}
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
                  You don&apos;t need to be the best.
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
                  onClick={() => router.push('/apply')}
                  className="btn-catalyst-large magnetic"
                  style={{ cursor: 'none' }}
                >
                  BECOME A CATALYST <Sparkles size={28} />
                </motion.button>
              </motion.div>
            </ParallaxLayer>
          </div>
        </section>

        <Footer footerSettings={footerSettings} siteContent={siteContent} />
      </motion.div>
    </>
  );
}
