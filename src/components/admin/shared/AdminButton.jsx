import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary:
    'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
  outline:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  ghost:
    'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
};

const AdminButton = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center font-semibold rounded-lg
          transition-colors duration-200 focus:outline-none focus:ring-2
          focus:ring-indigo-500/40 focus:ring-offset-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

AdminButton.displayName = 'AdminButton';
export default AdminButton;
