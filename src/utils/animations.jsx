/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  transition: { duration: 0.8, ease: "easeInOut" }
};

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer = (staggerChildren = 0.15, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.3, ease: "easeOut" }
};

export const tapScale = {
  scale: 0.98
};

export const sectionReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

// --- Components ---

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
        
        // Easing: easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        const current = start + (end - start) * easeProgress;
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    }
  }, [isInView, to, duration]);

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}</span>;
};
