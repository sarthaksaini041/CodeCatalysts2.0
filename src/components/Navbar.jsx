import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import Button from './Button';
import { useCMS } from '../hooks/useCMS';

/* ─────────────────────────────────────────────
   Nav link definitions for the Landing page
───────────────────────────────────────────── */
const LANDING_LINKS = [
  { label: 'Genesis',    href: '#chapter-01', sectionId: 'chapter-01' },
  { label: 'Shift',      href: '#chapter-02', sectionId: 'chapter-02' },
  { label: 'Journey',    href: '#chapter-03', sectionId: 'chapter-03' },
  { label: 'Forge',      href: '#chapter-04', sectionId: 'chapter-04' },
  { label: 'Architects', href: '#chapter-05', sectionId: 'chapter-05' },
];

const PRIMARY_ACTIONS = [
  { label: 'Apply Now', href: '/apply', route: true, accent: true, key: 'applyPageEnabled' },
];

/* ─────────────────────────────────────────────
   Smooth-scroll helper — respects Lenis
───────────────────────────────────────────── */
const scrollToSection = (sectionId, immediate = false, attempts = 0) => {
  const el = document.getElementById(sectionId);
  
  if (!el) {
    if (attempts < 10) {
      setTimeout(() => scrollToSection(sectionId, immediate, attempts + 1), 100);
    }
    return false;
  }

  el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
  return true;
};

/* ─────────────────────────────────────────────
   Wait for an element to appear in the DOM
───────────────────────────────────────────── */
const waitForElement = (id, timeout = 3000) =>
  new Promise((resolve) => {
    if (document.getElementById(id)) return resolve(true);
    const observer = new MutationObserver(() => {
      if (document.getElementById(id)) {
        observer.disconnect();
        resolve(true);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); resolve(false); }, timeout);
  });

const Navbar = () => {
  const router = useRouter();
  const { siteContent, loading: cmsLoading } = useCMS();
  const isLanding = router.pathname === '/';

  const [scrolled,       setScrolled]       = useState(false);
  const [activeSection,  setActiveSection]  = useState(null);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [hoveredIdx,     setHoveredIdx]     = useState(null);

  const linkRefs     = useRef([]);
  const navbarRef    = useRef(null);
  const linksWrapRef = useRef(null);

  // Filter actions based on feature flags — hide if explicitly 'false' or while loading
  const visibleActions = PRIMARY_ACTIONS.filter(action => {
    if (cmsLoading) return false;
    if (action.key && siteContent[action.key] === 'false') return false;
    return true;
  });

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    // Immediately sync state with current scroll position
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  /* ── Active section via Intersection Observer (more reliable than scroll listener) ── */
  useEffect(() => {
    if (!isLanding) {
      setActiveSection(null);
      return;
    }

    const sectionIds = LANDING_LINKS.filter(l => l.sectionId).map(l => l.sectionId);
    const visibleSections = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        });

        // Find the section with highest intersection ratio
        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibleSections) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        setActiveSection(bestRatio > 0.1 ? bestId : null);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-15% 0px -25% 0px',
      }
    );

    const els = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    els.forEach(el => {
      visibleSections.set(el.id, 0);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLanding]);

  const getActiveIdx = useCallback(() => {
    if (!isLanding) return -1;
    if (!activeSection) return -1;
    return LANDING_LINKS.findIndex(l => l.sectionId === activeSection);
  }, [isLanding, activeSection]);

  /* ── Close mobile menu on route change ── */
  const handleNavClick = useCallback(async (link, e) => {
    e.preventDefault();
    setMobileOpen(false);

    if (link.route) {
      router.push(link.href);
      return;
    }

    if (link.sectionId) {
      if (isLanding) {
        scrollToSection(link.sectionId);
      } else {
        // Let the URL hash drive the destination
        const target = link.href.startsWith('#') ? '/' + link.href : link.href;
        router.push(target, undefined, { scroll: false });
      }
    }
  }, [isLanding, router]);

  /* ── Handle external navigation to a specific section via hash ── */
  useEffect(() => {
    if (!isLanding) return;
    
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.startsWith('chapter-')) {
      const waitAndScroll = async () => {
        const found = await waitForElement(hash, 4000);
        if (found) {
          setTimeout(() => {
            const success = scrollToSection(hash);
            if (!success) setTimeout(() => scrollToSection(hash), 300);
          }, 250);
        }
      };
      waitAndScroll();
    }
  }, [isLanding, router.asPath]);

  /* ── Mobile backdrop close ── */
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* ── Close mobile menu on route change ── */
  useEffect(() => {
    setMobileOpen(false);
  }, [router.asPath]);

  const isLinkActive = (link) => {
    if (link.route) return router.pathname === link.href;
    return link.sectionId === activeSection && isLanding;
  };

  return (
    <>
      {/* ══════════════════ DESKTOP NAVBAR ══════════════════ */}
      <motion.nav
        className="navbar-root"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        aria-label="Main navigation"
      >
        <div className={`navbar-pill ${scrolled ? 'navbar-pill--scrolled' : ''}`} ref={navbarRef}>

          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={() => {
              if (isLanding) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                router.push('/');
              }
            }}
            aria-label="Go to top"
          >
            <Image 
              src="/logo.svg" 
              alt="Code Catalysts" 
              width={32} 
              height={32} 
              className="navbar-logo-img" 
              priority
            />
            <span className="navbar-logo-text">CODE <span className="navbar-logo-accent">CATALYSTS</span></span>
          </button>

          {/* Divider */}
          <div className="navbar-divider" aria-hidden="true" />

          {/* Nav links area with glider */}
          <div className="navbar-links-wrap" ref={linksWrapRef}>


            {LANDING_LINKS.map((link, idx) => (
              <Link
                key={link.label}
                href={link.href.startsWith('#') ? '/' + link.href : link.href}
                className={`navbar-link ${isLinkActive(link) ? 'navbar-link--active' : ''}`}
                onClick={(e) => handleNavClick(link, e)}
                aria-current={isLinkActive(link) ? 'page' : undefined}
              >
                {link.label}
                {isLinkActive(link) && (
                  <motion.span
                    className="navbar-link-dot"
                    layoutId="activeNavDot"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA - Only show divider if we have actions */}
          {visibleActions.length > 0 && (
            <>
              <div className="navbar-divider" aria-hidden="true" />
              {visibleActions.map(action => (
                <Button
                  key={action.label}
                  href={action.href}
                  variant="default"
                  size="sm"
                >
                  <Sparkles size={14} strokeWidth={2.5} />
                  {action.label}
                </Button>
              ))}
            </>
          )}

          {/* Mobile toggle */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.18 }}><X    size={20} /></motion.span>
                : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={20} /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ══════════════════ MOBILE DRAWER ══════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.9 }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="mobile-drawer-header">
                <span className="mobile-drawer-brand">NAVIGATION</span>
                <button className="mobile-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                  <X size={22} />
                </button>
              </div>

              <nav className="mobile-drawer-links">
                {LANDING_LINKS.map((link, idx) => (
                  <motion.a
                    key={link.label}
                    href={link.href.startsWith('#') ? '/' + link.href : link.href}
                    className={`mobile-nav-link ${isLinkActive(link) ? 'mobile-nav-link--active' : ''}`}
                    onClick={(e) => handleNavClick(link, e)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + idx * 0.055, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="mobile-nav-num">0{idx + 1}</span>
                    <span className="mobile-nav-label">{link.label}</span>
                    {isLinkActive(link) && <span className="mobile-nav-active-bar" />}
                  </motion.a>
                ))}
              </nav>

              <div className="mobile-drawer-footer">
                {!cmsLoading && siteContent.applyPageEnabled !== 'false' && (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full flex justify-center"
                    onClick={() => { router.push('/apply'); setMobileOpen(false); }}
                    motionProps={{
                      initial: { opacity: 0, y: 16 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: 0.35, duration: 0.32 }
                    }}
                  >
                    <Sparkles size={16} strokeWidth={2.5} />
                    Apply Now
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
