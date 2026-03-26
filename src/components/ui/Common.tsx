import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn('bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-transparent transition-all duration-300', className)}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'pro' }) => {
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    pro: 'bg-primary/10 text-primary',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', variants[variant])}>
      {children}
    </span>
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full bg-white border-b-2 border-outline-variant px-4 py-2 focus:outline-none focus:border-primary transition-colors',
        className
      )}
      {...props}
    />
  )
);
