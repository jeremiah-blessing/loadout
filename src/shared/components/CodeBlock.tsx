import { resolve } from '@/shared/lib/tokens';
import { useVars } from '@/shared/lib/contexts';
import { CmdTokens } from './CmdTokens';
import { CopyButton } from './CopyButton';
import { Icon } from '@/shared/ui';

export interface CodeBlockProps {
  cmd: string;
  label?: string;
  variant?: 'terminal' | 'minimal';
}

const MONO = 'font-mono text-[13px] leading-[1.6] text-ink break-words [overflow-wrap:anywhere] whitespace-pre-wrap';

export const CodeBlock = ({ cmd, label, variant = 'terminal' }: CodeBlockProps) => {
  const { vars } = useVars();
  const getText = () => resolve(cmd, vars);

  if (variant === 'terminal') {
    return (
      <div className="overflow-hidden rounded-md border border-hairline bg-canvas">
        <div className="flex items-center gap-2 border-b border-hairline bg-surface-1 py-1.5 pl-3 pr-2">
          <Icon name="terminal" size={13} className="text-ink-subtle" />
          {label ? (
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-text text-xs text-ink-subtle">
              {label}
            </span>
          ) : (
            <span className="flex-1" />
          )}
          <CopyButton getText={getText} />
        </div>
        <div className="flex items-start gap-[9px] px-[13px] py-[11px]">
          <span className="flex-none select-none font-mono text-[13px] text-placeholder">$</span>
          <code className={`flex-1 ${MONO}`}>
            <CmdTokens cmd={cmd} />
          </code>
        </div>
      </div>
    );
  }

  // minimal
  return (
    <div className="group relative flex items-start gap-2.5 rounded-md border border-hairline bg-surface-1 px-3 py-2.5">
      <code className={`flex-1 pr-6 ${MONO}`}>
        <CmdTokens cmd={cmd} />
      </code>
      <div className="pointer-events-none absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        <CopyButton getText={getText} />
      </div>
    </div>
  );
}
