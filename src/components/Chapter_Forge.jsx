import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '../utils/animations.jsx';
import { shimmerDataURL } from '../utils/imageUtils';

/* ── Constants ─────────────────────────────────────────────────── */
const EASE_EXPO = [0.87, 0, 0.13, 1];
const EASE_OUT  = [0.16, 1, 0.3, 1];
const PLACEHOLDER = shimmerDataURL(800, 600);

/* ── Inline GitHub SVG (lucide-react has no 'Github' export) ───── */
const GitHubIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

/* ── Chapter decorative label ───────────────────────────────────── */
const ChapterLabel = ({ label, color }) => (
  <motion.div
    variants={staggerContainer(0.12, 0)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    className="chapter-label-line"
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

/* ── Action button — renders ONLY when href is a non-empty string ─ */
const LinkBtn = ({ href, children, isPrimary }) => {
  if (!href || typeof href !== 'string' || !href.trim()) return null;
  return (
    <motion.a
      href={href.trim()}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2, scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className={isPrimary ? 'forge-btn-live' : 'forge-btn-github'}
      onClick={(e) => e.stopPropagation()} /* Prevent triggering modal open on button click */
    >
      {children}
    </motion.a>
  );
};

/* ── Main component ─────────────────────────────────────────────── */
const Chapter_Forge = ({ projects: cmsProjects = [] }) => {
  const [activeProject, setActiveProject] = useState(null);

  const projects = cmsProjects.map((p) => ({
    name:   p.name        || 'Untitled Project',
    desc:   p.description || '',
    tech:   Array.isArray(p.tech_stack) ? p.tech_stack : [],
    image:  p.image_url   || null,
    github: p.github_link || '',
    live:   p.live_link   || '',
  }));

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  return (
    <section
      id="chapter-04"
      className="chapter-section forge-dev"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(1rem, 4vw, 2.5rem)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* ── Section header ─────────────────────────────────── */}
        <div style={{ marginBottom: 'clamp(2.5rem, 6vh, 5rem)' }}>
          <ChapterLabel label="CHAPTER 04" color="var(--primary)" />

          <motion.div
            variants={staggerContainer(0.14, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="chapter-header-v2"
          >
            <div className="chapter-title-v2">
              <motion.span variants={fadeUpVariant} className="title-prefix">THE</motion.span>
              <motion.h2
                variants={{
                  hidden:  { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_OUT } },
                }}
                className="title-main"
                style={{ '--chapter-gradient': 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                FORGE
              </motion.h2>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
            style={{
              fontSize: 'clamp(0.88rem, 1.8vw, 1rem)',
              color: 'rgba(255,255,255,0.3)',
              maxWidth: '480px',
              margin: '1.5rem auto 0',
              lineHeight: 1.8,
              textAlign: 'center',
            }}
          >
            Where ideas meet execution. Every project shipped is proof we mean it.
          </motion.p>
        </div>

        {/* ── Card grid ──────────────────────────────────────── */}
        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>
            Projects coming soon.
          </p>
        ) : (
          <div className="forge-grid">
            {projects.map((project, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.7, delay: index * 0.07, ease: EASE_OUT }}
                className="forge-project-card group"
                onClick={() => setActiveProject(project)}
                style={{ cursor: 'pointer' }}
              >
                {/* ── Image area ──────────────────────────────── */}
                <div className="forge-card-image-wrap">
                  <Image
                    src={
                      project.image ||
                      'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?q=80&w=800&auto=format&fit=crop'
                    }
                    alt={project.name}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 34vw"
                    style={{ objectFit: 'cover' }}
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER}
                  />
                  {/* Dark gradient at bottom */}
                  <div className="forge-card-img-overlay" />
                </div>

                {/* ── Text + buttons (Clickable) ───────────────────────────── */}
                <div className="forge-card-body">
                  <h3 className="forge-card-title">{project.name}</h3>
                  {project.desc && (
                    <p className="forge-card-desc">{project.desc}</p>
                  )}

                  {/* Action Buttons (Clicking these won't trigger modal due to stopPropagation in LinkBtn) */}
                  {(project.live || project.github) && (
                    <div className="forge-card-actions w-full mt-auto pt-2 relative z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {project.live && (
                        <LinkBtn href={project.live} isPrimary>
                          <ArrowUpRight size={14} /> Live
                        </LinkBtn>
                      )}
                      {project.github && (
                        <LinkBtn href={project.github} isPrimary={false}>
                          <GitHubIcon size={14} /> GitHub <ArrowUpRight size={14} />
                        </LinkBtn>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* ── Expanded Project Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {activeProject && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5, 5, 5, 0.85)',
                backdropFilter: 'blur(20px)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveProject(null)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="relative w-full max-w-4xl bg-[#090b10] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
              style={{ maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>

              {/* Left Side: Image Visual */}
              <div className="relative w-full md:w-1/2 min-h-[220px] md:min-h-full flex justify-center items-center pt-8 pb-4 md:p-0 md:block bg-[#05060A]/40 md:bg-transparent">
                <div className="relative w-[160px] h-[160px] md:w-full md:h-full rounded-3xl md:rounded-none overflow-hidden shadow-2xl md:shadow-none shrink-0">
                  <Image
                    src={activeProject.image || 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?q=80&w=800&auto=format&fit=crop'}
                    alt={activeProject.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                {/* Gradient fade to blend into the right side (Desktop only) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent from-50% to-[#090b10] pointer-events-none hidden md:block" />
              </div>

              {/* Right Side: Information */}
              <div className="relative w-full md:w-1/2 p-5 md:p-10 flex flex-col justify-center overflow-y-auto" style={{ maxHeight: '90vh' }}>
                <div className="mb-3 md:mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] mb-1.5 md:mb-2 block">
                    Project Details
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-none">
                    {activeProject.name}
                  </h2>
                </div>

                {activeProject.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-8">
                    {activeProject.tech.map((tag) => (
                      <span key={tag} className="px-2 py-1 md:px-3 md:py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-invert prose-sm text-white/60 mb-5 md:mb-8 max-w-none">
                  {activeProject.desc.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-3 md:mb-4 text-[12px] md:text-[13px] leading-relaxed font-medium">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Buttons only appear when the link is set in admin */}
                {(activeProject.live || activeProject.github) && (
                  <div className="flex flex-wrap gap-3 md:gap-4 mt-auto pt-4 md:pt-6 border-t border-white/5">
                    <LinkBtn href={activeProject.live} isPrimary>
                      <ArrowUpRight size={14} /> View Live
                    </LinkBtn>
                    <LinkBtn href={activeProject.github} isPrimary={false}>
                      <GitHubIcon size={14} /> GitHub <ArrowUpRight size={14} />
                    </LinkBtn>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Chapter_Forge;
