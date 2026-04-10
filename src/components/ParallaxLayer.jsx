import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ParallaxLayer
 * ──────────────
 * Creates the "stable content" illusion by moving elements at a different
 * rate than the scroll (Parallax). Also adds soft-locking visuals
 * (scale/opacity) as elements pass through the viewport center.
 *
 * Props:
 *   offset    – how far the element drifts (px)  (default 50)
 *   children  – content to be parallaxed
 *   className – forwarded className
 */
const ParallaxLayer = ({ 
  children, 
  offset = 60, 
  className = "",
  style = {}
}) => {
  const ref = useRef(null);
  
  // Track progress of the element through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate parallax movement (inverse to scroll direction or slower)
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  
  // Smooth out the movement with a spring
  const ySpring = useSpring(y, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  // Center-focused viewing effects:
  // - Opacity shifts to 100% at center (0.5 progress)
  // - Scale shifts to 100% at center
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.45, 0.55, 0.8, 1], [0.4, 0.7, 1, 1, 0.7, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.96, 1, 1, 0.96]);

  return (
    <motion.div
      ref={ref}
      style={{
        ...style,
        y: ySpring,
        opacity,
        scale,
        willChange: 'transform, opacity',
      }}
      className={`parallax-layer ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxLayer;
