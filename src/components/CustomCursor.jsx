import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * CustomCursor
 * ─────────────
 * A premium dual-layer cursor system.
 * 1. Main Dot: Fast, sharp, and precise.
 * 2. Trailing Circle: Smooth, physics-based lag effect.
 * Features: Hover expansion, magnetic pull, and mobile disabling.
 */
const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [magneticTarget, setMagneticTarget] = useState(null);

  // Motion values for smooth tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Physics-based spring for the trailing circle
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    checkMobile();

    const moveMouse = (e) => {
      if (magneticTarget) {
        // Magnetic pull logic: pull cursor towards target center
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to center
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        // If close enough, snap/drift towards center
        const pull = 0.35; // intensity
        mouseX.set(e.clientX - dx * pull);
        mouseY.set(e.clientY - dy * pull);
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    const handleHoverStart = (e) => {
      const target = e.target.closest('a, button, .pill-card, [role="button"]');
      if (target) {
        setIsHovered(true);
        if (target.classList.contains('magnetic')) {
          setMagneticTarget(target);
        }
      }
    };

    const handleHoverEnd = () => {
      setIsHovered(false);
      setMagneticTarget(null);
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [magneticTarget, mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
      {/* 1. MAIN CURSOR DOT */}
      <motion.div
        className="cursor-dot"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* 2. TRAILING CIRCLE */}
      <motion.div
        className="cursor-ring"
        animate={{
          scale: isHovered ? 2.5 : 1,
          opacity: isHovered ? 0.3 : 0.6,
          borderWidth: isHovered ? '1px' : '2px',
        }}
        transition={{ type: 'spring', ...springConfig }}
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      <style jsx global>{`
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background-color: #fff;
          border-radius: 50%;
          z-index: 100000;
          pointer-events: none;
          mix-blend-mode: difference;
        }

        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 2px solid var(--primary, #7c3aed);
          border-radius: 50%;
          z-index: 99999;
          pointer-events: none;
          backdrop-filter: blur(1px);
        }

        /* Hide default cursor everywhere when custom cursor is active */
        * {
          cursor: none !important;
        }
        
        a, button, [role="button"], .magnetic {
          cursor: none !important;
        }
        
        /* Optional Glow Effect */
        .cursor-ring::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
          opacity: 0.5;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
