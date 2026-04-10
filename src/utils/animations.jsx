/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { useInView, motion } from 'framer-motion';

/* ──────────────────────────────────────────
   EASING CURVES  (cinematic feel)
────────────────────────────────────────── */
export const ease = {
  out:      [0.16, 1, 0.3, 1],      // iOS-style smooth out
  inOut:    [0.4, 0, 0.2, 1],       // Material design
  spring:   [0.22, 1, 0.36, 1],     // Fast start, soft landing
  expo:     [0.87, 0, 0.13, 1],     // Dramatic expo ease
};

/* ──────────────────────────────────────────
   CORE VARIANTS
────────────────────────────────────────── */
export const fadeInVariant = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: ease.out } },
};

export const fadeUpVariant = {
  hidden:  { opacity: 0, y: 36, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: ease.spring },
  },
};

export const fadeUpFastVariant = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
};

export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

export const cardVariant = {
  hidden:  { opacity: 0, y: 40, scale: 0.97, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: ease.spring },
  },
};

/* ──────────────────────────────────────────
   CINEMATIC / STORY VARIANTS
────────────────────────────────────────── */

/** Clip-path reveal from bottom: text slides up from behind a mask */
export const clipRevealVariant = {
  hidden:  { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: { duration: 0.9, ease: ease.expo },
  },
};

/** Scale up from slightly smaller — photo developing feel */
export const photoRevealVariant = {
  hidden:  { opacity: 0, scale: 1.08, filter: 'blur(12px) brightness(0.6)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    transition: { duration: 1.2, ease: ease.out },
  },
};

/** Slide from left with a blur trail */
export const slideInLeftVariant = {
  hidden:  { opacity: 0, x: -60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.95, ease: ease.spring },
  },
};

/** Slide from right with a blur trail */
export const slideInRightVariant = {
  hidden:  { opacity: 0, x: 60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.95, ease: ease.spring },
  },
};

/** Card drops from above — "file being placed on desk" */
export const dropInVariant = {
  hidden:  { opacity: 0, y: -30, rotateX: 8, scale: 0.95, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: ease.spring },
  },
};

/** Label / chapter number line slide expand */
export const lineExpandVariant = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: ease.expo },
  },
};

/** Chapter heading — each word reveals individually */
export const wordRevealVariant = {
  hidden:  { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: ease.spring },
  },
};

export const wordStaggerContainer = (delay = 0) => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: delay },
  },
});

/** Stat number count-up entrance */
export const statEntryVariant = {
  hidden:  { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.spring },
  },
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const tapScale = { scale: 0.98 };

export const sectionReveal = {
  initial:     { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, amount: 0.2 },
  transition:  { duration: 0.8, ease: ease.spring },
};

/* ──────────────────────────────────────────
   SPLIT TEXT COMPONENT
   Wraps each word in its own motion.span
────────────────────────────────────────── */
export const SplitWords = ({ text, className, style, delay = 0, as: Tag = 'span' }) => {
  const words = text.split(' ');
  const MotionTag = motion[Tag] || motion.span;

  return (
    <MotionTag
      className={className}
      style={{ display: 'inline', ...style }}
      variants={wordStaggerContainer(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', marginRight: '0.28em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={wordRevealVariant}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

/* ──────────────────────────────────────────
   COUNT-UP COMPONENT (unchanged)
────────────────────────────────────────── */
export const CountUp = ({ to, duration = 2, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseFloat(to);
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeProgress;
        setCount(current);
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    }
  }, [isInView, to, duration]);

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}</span>;
};
