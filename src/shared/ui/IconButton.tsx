import type { ButtonHTMLAttributes } from 'react';
import { Slot } from 'radix-ui';
import { Tip } from './Tip';

type IconButtonVariant = 'ghost' | 'outline' | 'solid';
type IconButtonSize = 'sm' | 'md' | 'lg';

const IB_SIZES: Record<IconButtonSize, string> = {
  sm: 'w-6 h-6',
  md: 'w-7 h-7',
  lg: 'w-[34px] h-[34px]',
};

const IB_VARIANTS: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent text-ink-subtle border border-transparent',
  outline: 'bg-transparent text-ink-muted border border-hairline',
  solid: 'bg-surface-1 text-ink border border-hairline-strong',
};

type Props = {
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  label: string;
  /** Render as the single child element (e.g. an anchor) for link composition. */
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = ({
  size = 'md',
  variant = 'ghost',
  label,
  className = '',
  asChild = false,
  children,
  ...rest
}: Props) => {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Tip label={label}>
      <Comp
        aria-label={label}
        {...(asChild ? {} : { type: 'button' as const })}
        className={`inline-flex cursor-pointer items-center justify-center rounded-md p-0 transition-colors hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 ${IB_SIZES[size]} ${IB_VARIANTS[variant]} ${className}`}
        {...rest}
      >
        {children}
      </Comp>
    </Tip>
  );
}
