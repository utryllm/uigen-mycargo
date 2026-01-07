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
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-[#333333]">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-3 py-2 pr-10 border rounded text-sm appearance-none',
              'bg-white cursor-pointer transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#C41230] focus:border-transparent',
              error
                ? 'border-[#DC3545] focus:ring-[#DC3545]'
                : 'border-[#E0E0E0]',
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
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#DC3545]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
