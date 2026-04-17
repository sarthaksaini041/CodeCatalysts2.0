import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * ScrollReveal — cinematic scroll-triggered entrance.
 * Optimized for performance:
 * - Uses transform/opacity (GPU-accelerated)
 * - Purely declarative (no resize listeners)
 * - Reduced motion support built-in
 *
 * Props:
 *   direction  – 'up' | 'down' | 'left' | 'right' | 'scale' | 'photo' | 'drop' | 'none'
 *   delay      – stagger delay in seconds
 *   duration   – animation duration
 *   once       – only animate once
 *   amount     – viewport intersection threshold (0–1)
 *   blur       – whether to add blur (disabled on reduced motion)
 */

const directionMap = {
  up:    { y: 32,   x: 0,   scale: 1,    rotateX: 0   },
  down:  { y: -32,  x: 0,   scale: 1,    rotateX: 0   },
  left:  { y: 0,    x: -40, scale: 1,    rotateX: 0   },
  right: { y: 0,    x: 40,  scale: 1,    rotateX: 0   },
  scale: { y: 0,    x: 0,   scale: 0.95, rotateX: 0   },
  photo: { y: 0,    x: 0,   scale: 1.05, rotateX: 0   },
  drop:  { y: -20,  x: 0,   scale: 0.96, rotateX: 6   },
  none:  { y: 0,    x: 0,   scale: 1,    rotateX: 0   },
};

const blurMap = {
  up:    'blur(6px)',
  down:  'blur(6px)',
  left:  'blur(4px)',
  right: 'blur(4px)',
  scale: 'blur(4px)',
  photo: 'blur(12px) brightness(0.7)',
  drop:  'blur(4px)',
  none:  'blur(0px)',
};

const ScrollReveal = ({
  children,
  delay      = 0,
  direction  = 'up',
  duration   = 0.85,
  once       = true,
  className,
  style,
  as         = 'div',
  amount     = 0.15,
  blur       = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const from = directionMap[direction] || directionMap.up;
  const blurValue = blur ? (blurMap[direction] || 'blur(4px)') : 'blur(0px)';

  // Define variants
  const variants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : from.x,
      y: shouldReduceMotion ? 0 : from.y,
      scale: shouldReduceMotion ? 1 : from.scale,
      rotateX: shouldReduceMotion ? 0 : from.rotateX,
      filter: shouldReduceMotion ? 'none' : blurValue,
      transition: { duration: 0 }
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px) brightness(1)',
      transition: {
        duration: shouldReduceMotion ? 0.1 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // cinematic cubic-bezier
      },
    },
  };

  const Tag = motion[as] || motion.div;

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      className={className}
      style={{
        ...style,
        willChange: shouldReduceMotion ? 'auto' : 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
