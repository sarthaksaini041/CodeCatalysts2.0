import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal — cinematic scroll-triggered entrance.
 *
 * Props:
 *   direction  – 'up' | 'down' | 'left' | 'right' | 'scale' | 'photo' | 'drop' | 'none'
 *   delay      – stagger delay in seconds
 *   duration   – animation duration
 *   once       – only animate once
 *   amount     – viewport intersection threshold (0–1)
 *   blur       – whether to add blur at start (default true)
 */

const directionMap = {
  up:    { y: 40,   x: 0,   scale: 1,    rotateX: 0   },
  down:  { y: -40,  x: 0,   scale: 1,    rotateX: 0   },
  left:  { y: 0,    x: -60, scale: 1,    rotateX: 0   },
  right: { y: 0,    x: 60,  scale: 1,    rotateX: 0   },
  scale: { y: 0,    x: 0,   scale: 0.94, rotateX: 0   },
  photo: { y: 0,    x: 0,   scale: 1.07, rotateX: 0   }, // photo developing
  drop:  { y: -28,  x: 0,   scale: 0.96, rotateX: 6   }, // dropping onto surface
  none:  { y: 0,    x: 0,   scale: 1,    rotateX: 0   },
};

const blurMap = {
  up:    'blur(8px)',
  down:  'blur(8px)',
  left:  'blur(6px)',
  right: 'blur(6px)',
  scale: 'blur(4px)',
  photo: 'blur(14px) brightness(0.65)',
  drop:  'blur(4px)',
  none:  'blur(0px)',
};

const ScrollReveal = ({
  children,
  delay      = 0,
  direction  = 'up',
  duration   = 0.95,
  once       = true,
  className,
  style,
  as         = 'div',
  amount     = 0.18,
  blur       = true,
}) => {
  const from = directionMap[direction] || directionMap.up;
  const blurStart = blur ? (blurMap[direction] || 'blur(6px)') : 'blur(0px)';

  const hidden = {
    opacity: 0,
    ...from,
    filter: blurStart,
  };

  const visible = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px) brightness(1)',
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  };

  const Tag = motion[as] || motion.div;

  return (
    <Tag
      initial={hidden}
      whileInView={visible}
      viewport={{ once, amount }}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
