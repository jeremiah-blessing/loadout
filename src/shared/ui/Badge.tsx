import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-2 text-ink-muted',
  accent: 'bg-[rgba(94,105,209,0.16)] text-var-filled',
  success: 'bg-[rgba(39,166,68,0.16)] text-[#6cd389]',
};

interface Props {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export const Badge = ({
  tone = 'neutral',
  className = '',
  children,
}: Props) => {
  return (
    <span
      className={`inline-flex h-5 items-center whitespace-nowrap rounded-pill px-2 font-text text-xs font-medium leading-none ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
