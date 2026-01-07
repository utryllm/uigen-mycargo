'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#333333]">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              // Standard select height (44px) for proper touch targets
              'w-full h-11 px-3.5 pr-10 border rounded-xl text-[15px] appearance-none',
              'bg-white cursor-pointer transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#C41230] focus:border-transparent',
              error
                ? 'border-[#DC3545] focus:ring-[#DC3545]'
                : 'border-[#E0E0E0] hover:border-[#CCCCCC]',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#DC3545] mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
