'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-[#333333]">{label}</label>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-3 py-2 border rounded text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#C41230] focus:border-transparent',
            'placeholder:text-[#999999]',
            error
              ? 'border-[#DC3545] focus:ring-[#DC3545]'
              : 'border-[#E0E0E0]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-[#DC3545]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
