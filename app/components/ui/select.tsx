import * as React from 'react';
import { cn } from '@/app/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, label, error, id, children, ...props }, ref) {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    return (
      <div className="flex flex-col space-y-1.5">
        {label && <label htmlFor={selectId} className="text-sm font-medium text-slate-700">{label}</label>}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
