import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const InputUnderlined = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <Input
        className={cn(
          'rounded-none border-x-0 border-b-2 border-t-0 p-0 focus-visible:outline-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
InputUnderlined.displayName = 'InputUnderlined';

export { InputUnderlined };
