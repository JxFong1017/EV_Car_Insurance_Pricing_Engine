import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
        emerald: 'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        slate: 'border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200',
        amber: 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200',
        red: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
        outline: 'text-slate-950',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
