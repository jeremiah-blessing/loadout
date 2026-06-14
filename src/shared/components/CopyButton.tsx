import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/shared/ui';

export interface CopyButtonProps {
  getText: string | (() => string);
  size?: number;
  label?: string;
  variant?: 'icon' | 'labeled';
  className?: string;
}

export const CopyButton = ({ getText, size = 14, label, variant = 'icon', className = '' }: CopyButtonProps) => {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = typeof getText === 'function' ? getText() : getText;
    try {
      void navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1100);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  const labeled = variant === 'labeled' || !!label;
  const pad = labeled ? 'px-2 py-1' : 'p-1';
  const color = done ? 'text-success' : 'text-ink-subtle hover:text-ink';

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy"
      aria-label="Copy to clipboard"
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-transparent bg-transparent font-text text-xs font-medium transition-colors hover:bg-surface-3 ${pad} ${color} ${className}`}
    >
      <Icon name={done ? 'check' : 'copy'} size={size} />
      {labeled && <span>{done ? 'Copied' : label || 'Copy'}</span>}
    </button>
  );
}
