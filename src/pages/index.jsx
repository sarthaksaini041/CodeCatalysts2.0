import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import Button from '../components/Button';
import { useCMS } from '../hooks/useCMS';

import { supabaseServer } from '../lib/supabase-server';

// ── Above-the-fold chapters (eagerly loaded) ──────────────────
import Chapter_Hero    from '../components/Chapter_Hero';
import Chapter_Genesis from '../components/Chapter_Genesis';

// ── Below-the-fold chapters (lazy loaded after hydration) ─────
// These reduce initial JS bundle and only parse when needed.
const Chapter_Shift = dynamic(() => import('../components/Chapter_Shift'), {
  ssr: true,
});
const Chapter_Journey = dynamic(() => import('../components/Chapter_Journey'), {
  ssr: true,
});
const Chapter_Forge = dynamic(() => import('../components/Chapter_Forge'), {
  ssr: true,
});
const Chapter_Architects = dynamic(() => import('../components/Chapter_Architects'), {
  ssr: true,
});
const Footer = dynamic(() => import('../components/Footer'), {
  ssr: true,
});

// ── Static styles (defined outside component to avoid recreating) ──
const landingWrapperStyle = { background: 'transparent', color: 'white' };
const finalCtaStyle = {
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};
const finalContainerStyle = { textAlign: 'center' };
const heroHeadlineStyle = {
  fontSize: 'clamp(3.5rem, 11vw, 7.5rem)',
  marginBottom: '2rem',
  lineHeight: 0.9,
};
const p1Style = {
  fontSize: 'clamp(1rem, 2vw, 1.6rem)',
  color: 'var(--text-dim)',
  maxWidth: '700px',
  margin: '0 auto 1.5rem auto',
  lineHeight: 1.6,
};
const p2Style = {
  fontSize: 'clamp(1rem, 2vw, 1.6rem)',
  color: 'white',
  maxWidth: '700px',
  margin: '0 auto 4rem auto',
  lineHeight: 1.6,
  fontWeight: 700,
};

/**
 * Fetch ALL CMS data at build time via ISR.
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
    revalidate: 60, // ISR: regenerate page every 60 seconds in background
  };
}

export default function HomePage({
  siteContent: initialSiteContent,
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
  const { siteContent: liveSiteContent } = useCMS();
  
  // Use live content from useCMS after hydration for immediate updates
  const siteContent = { ...initialSiteContent, ...liveSiteContent };
  const isApplyEnabled = siteContent.applyPageEnabled !== 'false';

  // Prefetch high-priority pages for instant navigation
  React.useEffect(() => {
    router.prefetch('/team');
    if (isApplyEnabled) router.prefetch('/apply');
  }, [router, isApplyEnabled]);

  return (
    <>
      <Head>
        <title>Code Catalysts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Code Catalysts is a community of passionate builders, developers, and innovators. Join us to learn, build, and ship together." />
        <meta property="og:title" content="Code Catalysts" />
        <meta property="og:description" content="A community of passionate builders, developers, and innovators." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div
        className="landing-page"
        style={landingWrapperStyle}
      >
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
        <Chapter_Architects teamMembers={teamMembers} siteContent={siteContent} />

        {/* FINAL CTA / JOIN US SECTION */}
        <section className="chapter-section final-cta" style={finalCtaStyle}>
          <div className="container" style={finalContainerStyle}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.8 }}
            >
              {isApplyEnabled ? (
                <>
                  <h2 className="hero-headline" style={heroHeadlineStyle}>
                    WANT TO JOIN <br />
                    <span className="text-gradient">CODE CATALYSTS?</span>
                  </h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={p1Style}
                  >
                    We&apos;re currently open to new members.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={p2Style}
                  >
                    If you&apos;re interested, you can apply using the link below.
                  </motion.p>

                  <Button href="/apply" size="lg" className="magnetic">
                    APPLY NOW <Sparkles size={24} />
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="hero-headline" style={heroHeadlineStyle}>
                    THINKING ABOUT <br />
                    <span className="text-gradient">JOINING US?</span>
                  </h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={p1Style}
                  >
                    At the moment, we&apos;re not taking on new members.
                    <br />
                    We&apos;re focused on our current work and projects.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={p2Style}
                  >
                    If that changes in the future, we&apos;ll update it here.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-center mt-4"
                  >
                    <div className="relative group">
                      {/* Subtle glow effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative flex items-center gap-2 px-3 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                        CHECK BACK SOON
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </section>

        <Footer footerSettings={footerSettings} siteContent={siteContent} />
      </div>
    </>
  );
}
