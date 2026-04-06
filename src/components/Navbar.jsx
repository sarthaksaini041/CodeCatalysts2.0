import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import './Navbar.css';

/* ─────────────────────────────────────────────
   Nav link definitions for the Landing page
───────────────────────────────────────────── */
const LANDING_LINKS = [
  { label: 'Genesis',  href: '#chapter-01', sectionId: 'chapter-01' },
  { label: 'Shift',    href: '#chapter-02', sectionId: 'chapter-02' },
  { label: 'Journey',  href: '#chapter-03', sectionId: 'chapter-03' },
  { label: 'Forge',    href: '#chapter-04', sectionId: 'chapter-04' },
  { label: 'Team',     href: '/team',        sectionId: null,          route: true },
];

const PRIMARY_ACTIONS = [
  { label: 'Apply Now',   href: '/apply',        route: true, accent: true },
];

/* ─────────────────────────────────────────────
   Smooth-scroll helper (respects Lenis)
───────────────────────────────────────────── */
const scrollToSection = (sectionId) => {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Navbar = () => {
  const { loading } = useCMS();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredIdx,    setHoveredIdx]    = useState(null);

  const linkRefs      = useRef([]);
  const navbarRef     = useRef(null);
  const linksWrapRef  = useRef(null);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section via Intersection Observer ── */
  useEffect(() => {
    if (!isLanding || loading) return;
    const sectionIds = LANDING_LINKS
      .filter(l => l.sectionId)
      .map(l => l.sectionId);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLanding]);

  /* ── Floating indicator (pill glider) ── */
  const updateIndicator = useCallback((idx) => {
    const ref  = linkRefs.current[idx];
    const wrap = linksWrapRef.current;   // parent of the indicator & links
    if (!ref || !wrap) return;
    const rRect = ref.getBoundingClientRect();
    const wRect = wrap.getBoundingClientRect();
    setIndicatorStyle({
      left:    rRect.left - wRect.left,
      width:   rRect.width,
      opacity: 1,
    });
  }, []);

  const clearIndicator = useCallback(() => {
    setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
  }, []);

  /* ── Which link is "active" right now ── */
  const getActiveIdx = () => {
    if (!isLanding) {
      if (location.pathname === '/team')  return LANDING_LINKS.findIndex(l => l.href === '/team');
      if (location.pathname === '/apply') return -1; // handled separately
      return -1;
    }
    // Return -1 if no chapter is active (e.g. Header), hiding the box
    if (!activeSection) return -1;
    const idx = LANDING_LINKS.findIndex(l => l.sectionId === activeSection);
    return idx;
  };

  useEffect(() => {
    if (hoveredIdx !== null) {
      updateIndicator(hoveredIdx);
    } else {
      const ai = getActiveIdx();
      if (ai >= 0) updateIndicator(ai);
      else clearIndicator();
    }
  }, [hoveredIdx, activeSection, location.pathname]);

  /* ── Click handler ── */
  const handleNavClick = (link, e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (link.route) {
      navigate(link.href);
    } else if (link.sectionId && isLanding) {
      scrollToSection(link.sectionId);
    } else if (!isLanding) {
      navigate('/');
      setTimeout(() => {
        if (link.sectionId) scrollToSection(link.sectionId);
      }, 600);
    }
  };

  /* ── Mobile backdrop close ── */
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isLinkActive = (link) => {
    if (link.route) return location.pathname === link.href;
    return link.sectionId === activeSection && isLanding;
  };

  return (
    <>
      {/* ══════════════════ DESKTOP NAVBAR ══════════════════ */}
      <motion.nav
        className="navbar-root"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        aria-label="Main navigation"
      >
        <div className={`navbar-pill ${scrolled ? 'navbar-pill--scrolled' : ''}`} ref={navbarRef}>

          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label="Go to top"
          >
            <img src="/logo.svg" alt="Code Catalysts" className="navbar-logo-img" />
            <span className="navbar-logo-text">CODE <span className="navbar-logo-accent">CATALYSTS</span></span>
          </button>

          {/* Divider */}
          <div className="navbar-divider" aria-hidden="true" />

          {/* Nav links area with glider */}
          <div className="navbar-links-wrap" ref={linksWrapRef}>
            {/* Floating indicator */}
            <motion.div
              className="navbar-indicator"
              animate={{
                left:    indicatorStyle.left,
                width:   indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
              transition={{
                left:    { type: 'spring', stiffness: 380, damping: 30 },
                width:   { type: 'spring', stiffness: 380, damping: 30 },
                opacity: { duration: 0.25, ease: 'easeInOut' },
              }}
              aria-hidden="true"
            />

            {LANDING_LINKS.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                ref={el => { linkRefs.current[idx] = el; }}
                className={`navbar-link ${isLinkActive(link) ? 'navbar-link--active' : ''}`}
                onClick={(e) => handleNavClick(link, e)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                aria-current={isLinkActive(link) ? 'page' : undefined}
              >
                {link.label}
                {isLinkActive(link) && (
                  <motion.span
                    className="navbar-link-dot"
                    layoutId="activeNavDot"
                    transition={{ type: 'tween', duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="navbar-divider" aria-hidden="true" />

          {/* CTA */}
          {PRIMARY_ACTIONS.map(action => (
            <motion.button
              key={action.label}
              className="navbar-cta"
              onClick={() => navigate(action.href)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <Sparkles size={14} strokeWidth={2.5} />
              {action.label}
            </motion.button>
          ))}

          {/* Mobile toggle */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={20} /></motion.span>
                : <motion.span key="menu" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={20} /></motion.span>
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
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0,      opacity: 1 }}
              exit={{ x: '100%',    opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
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
                    href={link.href}
                    className={`mobile-nav-link ${isLinkActive(link) ? 'mobile-nav-link--active' : ''}`}
                    onClick={(e) => handleNavClick(link, e)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + idx * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="mobile-nav-num">0{idx + 1}</span>
                    <span className="mobile-nav-label">{link.label}</span>
                    {isLinkActive(link) && <span className="mobile-nav-active-bar" />}
                  </motion.a>
                ))}
              </nav>

              <div className="mobile-drawer-footer">
                <motion.button
                  className="navbar-cta mobile-cta"
                  onClick={() => { navigate('/apply'); setMobileOpen(false); }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Sparkles size={16} strokeWidth={2.5} />
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
