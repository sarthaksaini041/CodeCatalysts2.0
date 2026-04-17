import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';

/**
 * Universal Button Component
 * 
 * Variants:
 * - default: The primary Catalyst button (white background, purple hover)
 * - gradient: Full neon gradient button (team/apply actions)
 * - ghost: Transparent button with hover emphasis
 * - outline: Bordered button
 * 
 * Sizes:
 * - sm: Small (navbar context)
 * - md: Medium (standard interaction)
 * - lg: Large (Hero/CTA)
 */
const Button = React.forwardRef(({
  children,
  variant = 'default', 
  size = 'md',
  href,
  className,
  motionProps = {},
  disableHoverAnimation = false,
  ...props
}, ref) => {

  const baseStyles = "inline-flex items-center justify-center gap-2 border-none rounded-full font-black uppercase tracking-widest cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-[clamp(2rem,8vw,4.5rem)] py-[clamp(0.9rem,3vw,1.5rem)] text-[clamp(0.85rem,2.5vw,1.1rem)]",
  };

  const variantStyles = {
    default: "bg-white text-black hover:bg-[#7c3aed] hover:text-white hover:shadow-[0_10px_30px_rgba(124,58,237,0.35)]",
    gradient: "bg-gradient-to-br from-[#06b6d4] to-[#7c3aed] text-white hover:shadow-[0_8px_35px_rgba(124,58,237,0.4)]",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50",
    outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
  };

  const classes = clsx(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  const hoverAnimation = disableHoverAnimation ? {} : {
    scale: 1.05,
    y: -3
  };

  const tapAnimation = disableHoverAnimation ? {} : {
    scale: 0.96
  };

  const content = (
    <>
      <motion.span 
        className="flex items-center justify-center gap-2 relative z-10 w-full"
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    // Determine if external link
    const isExternal = href.startsWith('http');
    if (isExternal) {
      return (
        <motion.a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className={classes}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          {...motionProps}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a 
          ref={ref}
          className={classes}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          {...motionProps}
        >
          {content}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button 
      ref={ref}
      className={classes}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
