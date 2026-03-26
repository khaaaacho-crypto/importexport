import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, asChild, children, ...props }, ref) => {
    const variants = {
      primary: 'kinetic-gradient text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95',
      secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
      outline: 'border-2 border-outline-variant text-on-surface hover:bg-surface-container-low',
      ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
      md: 'px-5 py-2.5 text-sm font-semibold rounded-xl',
      lg: 'px-8 py-4 text-lg font-bold rounded-xl',
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(variants[variant], sizes[size], className, (children as any).props.className),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
