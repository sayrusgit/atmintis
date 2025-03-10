import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useComposition } from '@/lib/hooks-ui';

interface InputComposition {
  Icon: typeof InputIcon;
}

const iconVariants = cva('absolute top-2.5', {
  variants: {
    size: {
      default: 'h-4 w-4',
    },
    side: {
      left: 'left-3',
      right: 'right-3',
    },
  },
  defaultVariants: {
    size: 'default',
    side: 'left',
  },
});

export interface InputIconProps
  extends React.HTMLAttributes<HTMLOrSVGElement>,
    VariantProps<typeof iconVariants> {}

const InputIcon = React.forwardRef<HTMLSlotElement, InputIconProps>(
  ({ children, className, size, side }, ref) => {
    return (
      <Slot data-icon ref={ref} className={cn(iconVariants({ size, side }), className)}>
        {children}
      </Slot>
    );
  },
);
InputIcon.displayName = 'InputIcon';

const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      composition: {
        true: 'px-9',
        false: 'px-3',
      },
    },
    defaultVariants: {
      composition: false,
    },
  },
);
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return <input type={type} className={className} ref={ref} {...props} />;
  },
);
Input.displayName = 'Input';

const Root = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, ...props }, ref) => {
    const Icons = useComposition(children, InputIcon.displayName!);

    if (Icons.length > 0) {
      return (
        <div className="relative">
          {Icons}
          <Input
            ref={ref}
            className={cn(inputVariants({ composition: true }), className)}
            {...props}
          />
        </div>
      );
    }
    return (
      <Input
        ref={ref}
        className={cn(inputVariants({ composition: false }), className)}
        {...props}
      />
    );
  },
) as React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>> &
  InputComposition;

Root.displayName = 'Input';
Root.Icon = InputIcon;
export { Root as Input };
