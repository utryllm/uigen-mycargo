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
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#333333]">{label}</label>
        )}
        <input
          type={type}
          className={cn(
            // Standard input height (44px) for proper touch targets
            'w-full h-11 px-3.5 border rounded-xl text-[15px] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#C41230] focus:border-transparent',
            'placeholder:text-[#999999]',
            error
              ? 'border-[#DC3545] focus:ring-[#DC3545]'
              : 'border-[#E0E0E0] hover:border-[#CCCCCC]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-[#DC3545] mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
