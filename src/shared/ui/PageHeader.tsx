import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export const PageHeader = ({
  icon,
  title,
  subtitle,
  right,
}: Props) => {
  return (
    <div className="mb-[22px] flex flex-wrap items-end gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          {icon && <Icon name={icon} size={20} className="text-lavender" />}
          <h1 className="m-0 font-display text-[26px] font-semibold tracking-[-0.6px] text-ink">{title}</h1>
        </div>
        {subtitle && <p className="m-0 mt-2 max-w-[620px] text-pretty font-text text-[14.5px] text-ink-subtle">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
