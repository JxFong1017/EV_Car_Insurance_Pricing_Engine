import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-emerald-600 text-white hover:bg-emerald-700',
        secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-100',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const classNames = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      // Ensure Slot receives a single React element child. If `children` is
      // a valid React element, clone it to inject className, loader and
      // disabled props so Slot only sees one child. Otherwise wrap children
      // in a span.
      if (React.isValidElement(children)) {
        const child = React.cloneElement(
          children as React.ReactElement,
          {
            className: cn(classNames, (children as any).props?.className),
            disabled: isLoading || (props as any).disabled,
            ref: ref,
            ...props,
          },
          <>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {(children as any).props?.children}
          </>
        );

        return <Slot>{child}</Slot>;
      }

      // Fallback: wrap non-element children so Slot still gets a single child
      return (
        <Slot>
          <button className={classNames} ref={ref} disabled={isLoading || props.disabled} {...props}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
          </button>
        </Slot>
      );
    }

    return (
      <button
        className={classNames}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
