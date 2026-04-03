import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal
 * ─────────────
 * A lightweight wrapper that gives any child element a cinematic
 * scroll-triggered entrance animation.
 *
 * Props:
 *   delay     – stagger delay in seconds   (default 0)
 *   direction – 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'
 *   distance  – px travel distance          (default 40)
 *   duration  – animation duration in s    (default 0.9)
 *   once      – only animate once          (default true)
 *   className – forwarded className
 *   style     – forwarded style
 */
const directions = {
  up:    { y: 40,   x: 0,    scale: 1 },
  down:  { y: -40,  x: 0,    scale: 1 },
  left:  { y: 0,    x: 60,   scale: 1 },
  right: { y: 0,    x: -60,  scale: 1 },
  scale: { y: 0,    x: 0,    scale: 0.92 },
  none:  { y: 0,    x: 0,    scale: 1 },
};

const ScrollReveal = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.9,
  once = true,
  className,
  style,
  as = 'div',
}) => {
  const hidden  = { opacity: 0, ...directions[direction] };
  const visible = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  };

  const Tag = motion[as] || motion.div;

  return (
    <Tag
      initial={hidden}
      whileInView={visible}
      viewport={{ once, amount: 0.15 }}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
