import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Slot } from 'radix-ui';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const BTN_SIZES: Record<ButtonSize, string> = {
  sm: 'h-7 gap-1.5 px-2.5 text-[13px]',
  md: 'h-[34px] gap-2 px-3.5 text-sm',
  lg: 'h-10 gap-2 px-[18px] text-[15px]',
};

const BTN_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-lavender text-on-primary border border-transparent hover:bg-lavender-hover',
  secondary: 'bg-surface-1 text-ink border border-hairline-strong hover:bg-surface-2',
  ghost: 'bg-transparent text-ink-muted border border-transparent hover:bg-surface-1',
};

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Render as the single child element (e.g. an anchor) for link composition. */
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className = '',
  type = 'button',
  asChild = false,
  children,
  ...rest
}: Props) => {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      className={`inline-flex cursor-pointer items-center justify-center rounded-md font-text font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${BTN_SIZES[size]} ${BTN_VARIANTS[variant]} ${className}`}
      {...(asChild ? {} : { type })}
      {...rest}
    >
      {asChild ? (
        children
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </Comp>
  );
}
