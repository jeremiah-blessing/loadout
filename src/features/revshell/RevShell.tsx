import { useEffect, useRef, useState } from 'react';
import { ToggleGroup } from 'radix-ui';
import { REVSHELLS, LISTENERS } from '@/shared/content/reference';
import { KEYS, usePersistentState } from '@/shared/lib/persistent-state';
import { resolve } from '@/shared/lib/tokens';
import { useVars } from '@/shared/lib/contexts';
import type { RevShell as RevShellType } from '@/shared/types';
import { Icon, PageHeader } from '@/shared/ui';
import { CodeBlock, CmdTokens, CopyButton } from '@/shared/components';

type Enc = 'none' | 'url' | 'double' | 'base64';

function encode(str: string, mode: Enc): string {
  if (mode === 'url') return encodeURIComponent(str);
  if (mode === 'double') return encodeURIComponent(encodeURIComponent(str));
  if (mode === 'base64') {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return str;
    }
  }
  return str;
}

const BRAND_FOR: Record<string, string> = {
  bash: 'bash',
  terminal: 'sh',
  plug: 'nc',
  perl: 'perl',
  python: 'python',
  php: 'php',
  gem: 'ruby',
  powershell: 'powershell',
  code: 'awk',
};

interface BrandIconProps {
  brand: string;
  size?: number;
}

const BrandIcon = ({ brand, size = 18 }: BrandIconProps) => {
  const glyph = (icon: string, fg: string, bg: string) => (
    <span className="inline-flex flex-none items-center justify-center rounded-[6px]" style={{ width: size, height: size, background: bg, color: fg }}>
      <Icon name={icon} size={Math.round(size * 0.62)} strokeWidth={2} />
    </span>
  );
  const svg = (children: React.ReactNode) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      {children}
    </svg>
  );
  switch (brand) {
    case 'python':
      return svg(
        <>
          <path fill="#3776AB" d="M11.91 2c-.78 0-1.53.06-2.19.18C7.78 2.52 7.43 3.24 7.43 4.56v1.75h4.58v.58H5.69c-1.33 0-2.5.8-2.86 2.32-.42 1.74-.44 2.83 0 4.65.32 1.35 1.1 2.32 2.43 2.32h1.57v-2.1c0-1.51 1.31-2.84 2.86-2.84h4.57c1.27 0 2.29-1.05 2.29-2.33V4.56c0-1.24-1.05-2.18-2.29-2.38C13.95 2.05 13.13 1.99 11.91 2zm-2.48 1.4c.47 0 .86.4.86.88 0 .48-.39.87-.86.87-.48 0-.86-.39-.86-.87 0-.49.38-.88.86-.88z" />
          <path fill="#FFD43B" d="M12.09 22c.78 0 1.53-.06 2.19-.18 1.94-.34 2.29-1.06 2.29-2.38v-1.75h-4.58v-.58h6.32c1.33 0 2.5-.8 2.86-2.32.42-1.74.44-2.83 0-4.65-.32-1.35-1.1-2.32-2.43-2.32h-1.57v2.1c0 1.51-1.31 2.84-2.86 2.84H9.74c-1.27 0-2.29 1.05-2.29 2.33v4.13c0 1.24 1.05 2.18 2.29 2.38.78.13 1.6.19 2.35.18zm2.48-1.4c-.47 0-.86-.4-.86-.88 0-.48.39-.87.86-.87.48 0 .86.39.86.87 0 .49-.38.88-.86.88z" />
        </>,
      );
    case 'php':
      return svg(
        <>
          <ellipse cx={12} cy={12} rx={11.2} ry={6.6} fill="#777BB4" />
          <text x={12} y={14.9} fontSize={7} fontWeight={700} fontStyle="italic" fill="#fff" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif">php</text>
        </>,
      );
    case 'ruby':
      return svg(
        <>
          <path fill="#CC342D" d="M3 8.3 7.2 3h9.6L21 8.3 12 21.4z" />
          <path fill="rgba(255,255,255,.22)" d="M7.2 3 12 8.3 16.8 3z" />
          <path stroke="rgba(0,0,0,.18)" strokeWidth={0.8} d="M3 8.3h18M12 8.3v13.1" />
        </>,
      );
    case 'powershell':
      return svg(
        <>
          <rect x={1.5} y={3.5} width={21} height={17} rx={2.6} fill="#2671BE" />
          <path d="M6.2 8.2 10.4 12l-4.2 3.8" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.6 15.8H17" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
        </>,
      );
    case 'bash':
      return svg(
        <>
          <rect x={1.5} y={3.5} width={21} height={17} rx={2.6} fill="#303642" />
          <path d="M6.2 8.4 10 12l-3.8 3.6" stroke="#7FE081" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.4 15.6H17" stroke="#7FE081" strokeWidth={1.8} strokeLinecap="round" />
        </>,
      );
    case 'perl':
      return svg(
        <>
          <circle cx={12} cy={12} r={10} fill="#39457E" />
          <text x={12} y={15.6} fontSize={8.5} fontWeight={700} fill="#fff" textAnchor="middle" fontFamily='Georgia, "Times New Roman", serif'>Pl</text>
        </>,
      );
    case 'nc':
      return glyph('plug', '#137a6e', 'rgba(19,122,110,0.12)');
    case 'awk':
      return glyph('code', '#9a6b12', 'rgba(154,107,18,0.14)');
    default:
      return glyph('terminal', 'var(--color-ink-subtle)', 'var(--color-surface-2)');
  }
}

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

const Segmented = <T extends string>({ options, value, onChange }: SegmentedProps<T>) => {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
      className="inline-flex gap-0.5 rounded-md border border-hairline bg-surface-2 p-0.5"
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          className="cursor-pointer rounded-sm border-none bg-transparent px-[11px] py-[5px] font-text text-[12.5px] font-medium text-ink-subtle transition-colors data-[state=on]:bg-surface-4 data-[state=on]:text-ink data-[state=on]:shadow-edge"
        >
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

interface InlineVarProps {
  name: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
}

const InlineVar = ({ name, value, onChange, icon }: InlineVarProps) => {
  const [focus, setFocus] = useState(false);
  const filled = value !== '' && value != null;
  const border = focus ? 'border-lavender-focus shadow-focus' : filled ? 'border-hairline-strong' : 'border-placeholder-border';
  return (
    <div className="flex min-w-[120px] flex-1 flex-col gap-1.5">
      <label className="font-mono text-[11px] font-medium tracking-[0.3px] text-ink-subtle">{name}</label>
      <div className={`flex h-[38px] items-center gap-2 rounded-md border bg-surface-1 px-3 transition-[border-color,box-shadow] ${border}`}>
        <Icon name={icon} size={14} className="flex-none text-ink-subtle" />
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={name === 'LHOST' ? 'your IP' : 'port'}
          className="min-w-0 flex-1 border-none bg-transparent font-mono text-sm text-ink outline-none"
        />
      </div>
    </div>
  );
}

function eyebrow(children: React.ReactNode) {
  return <span className="inline-flex items-center gap-[7px] font-text text-[11px] font-medium uppercase tracking-[0.4px] text-ink-tertiary">{children}</span>;
}

const CARD = 'rounded-lg border border-hairline bg-surface-1 p-[18px] shadow-edge';

/** Curated starter set shown before searching — a simple one-liner per language,
 * including a PowerShell and a PHP, so the common picks are one click away. */
const DEFAULT_SHELL_IDS = ['bash-i', 'nc-mkfifo', 'nc-e', 'python3-1', 'php-pentestmonkey', 'powershell-2', 'perl', 'ruby-1', 'socat-1'];

export const RevShell = () => {
  const { vars, setVar } = useVars();
  const [shellId, setShellId] = usePersistentState(KEYS.revShell, 'bash-i');
  const [enc, setEnc] = useState<Enc>('none');
  const [osFilter, setOsFilter] = useState<'all' | 'linux' | 'windows'>('all');
  const [shellQuery, setShellQuery] = useState('');
  const [shellFocus, setShellFocus] = useState(false);
  const [listenerId, setListenerId] = usePersistentState(KEYS.revListener, 'nc');
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus the shell search on mount so you can type a shell name immediately.
  useEffect(() => {
    searchRef.current?.focus({ preventScroll: true });
  }, []);

  const shell = REVSHELLS.find((s) => s.id === shellId) || REVSHELLS[0];
  const listener = LISTENERS.find((l) => l.id === listenerId) || LISTENERS[0];
  const q = shellQuery.trim().toLowerCase();
  const inFilter = (s: RevShellType) => osFilter === 'all' || s.os.includes(osFilter);
  const shells = REVSHELLS.filter(
    (s) => inFilter(s) && (!q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.template.toLowerCase().includes(q)),
  );
  // Before searching, show a curated starter set (plus the remembered pick, so it
  // stays visible); while searching, show the top matches. Either way, stay compact.
  let visibleShells: RevShellType[];
  if (q) {
    visibleShells = shells.slice(0, 12);
  } else {
    const def = DEFAULT_SHELL_IDS.map((id) => REVSHELLS.find((s) => s.id === id)).filter((s): s is RevShellType => !!s && inFilter(s));
    const sel = REVSHELLS.find((s) => s.id === shellId);
    visibleShells = sel && inFilter(sel) && !def.some((s) => s.id === shellId) ? [sel, ...def] : def;
  }
  const hiddenCount = shells.length - visibleShells.length;

  const finalOut = encode(resolve(shell.template, vars), enc);

  const Connection = (
    <div>
      <div className="flex items-end gap-3">
        <InlineVar name="LHOST" value={vars.LHOST} onChange={(v) => setVar('LHOST', v)} icon="wifi" />
        <InlineVar name="LPORT" value={vars.LPORT} onChange={(v) => setVar('LPORT', v)} icon="hash" />
      </div>
      <div className="mt-2 flex items-center gap-1.5 font-text text-[11.5px] text-ink-tertiary">
        <Icon name="enter" size={12} />
        Synced with your engagement variables.
      </div>
    </div>
  );

  const ShellPicker = (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
        {eyebrow('Shell type')}
        <Segmented
          options={[
            { value: 'all', label: 'All' },
            { value: 'linux', label: 'Linux' },
            { value: 'windows', label: 'Windows' },
          ]}
          value={osFilter}
          onChange={setOsFilter}
        />
      </div>
      <div className={`mb-3 flex h-9 items-center gap-2 rounded-md border bg-surface-1 px-[11px] transition-[border-color,box-shadow] ${shellFocus ? 'border-lavender-focus shadow-focus' : 'border-hairline'}`}>
        <Icon name="search" size={14} className="flex-none text-ink-tertiary" />
        <input
          ref={searchRef}
          value={shellQuery}
          onChange={(e) => setShellQuery(e.target.value)}
          onFocus={() => setShellFocus(true)}
          onBlur={() => setShellFocus(false)}
          placeholder="Search shells — bash, python, nc…"
          className="min-w-0 flex-1 border-none bg-transparent font-text text-[13px] text-ink outline-none"
        />
        {shellQuery ? (
          <button onClick={() => setShellQuery('')} aria-label="Clear search" className="inline-flex flex-none cursor-pointer border-none bg-transparent p-0.5 text-ink-tertiary">
            <Icon name="x" size={13} />
          </button>
        ) : (
          <span className="flex-none font-mono text-[11px] text-ink-tertiary">{shells.length}</span>
        )}
      </div>
      {shells.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 px-3 py-[26px] font-text text-[13px] text-ink-tertiary">
          <Icon name="search" size={18} className="text-ink-tertiary" />
          <span>No shells match “{shellQuery.trim()}”</span>
        </div>
      ) : (
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
          {visibleShells.map((s) => {
            const on = s.id === shellId;
            return (
              <button
                key={s.id}
                onClick={() => setShellId(s.id)}
                className={`flex cursor-pointer flex-col items-start gap-1.5 rounded-md border p-[10px_11px] text-left transition-colors ${
                  on ? 'border-lavender bg-lavender' : 'border-hairline bg-surface-1 hover:border-hairline-strong'
                }`}
              >
                <span className="flex max-w-full items-center gap-2">
                  <BrandIcon brand={BRAND_FOR[s.icon] || 'sh'} size={18} />
                  <span className={`overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[13px] font-medium ${on ? 'text-white' : 'text-ink-muted'}`}>{s.name}</span>
                </span>
                <span className={`font-text text-[11px] capitalize leading-[1.3] ${on ? 'text-white/80' : 'text-ink-tertiary'}`}>{s.os.join(' · ')}</span>
              </button>
            );
          })}
        </div>
      )}
      {hiddenCount > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 font-text text-[11.5px] text-ink-tertiary">
          <Icon name="search" size={12} />
          {hiddenCount} more — {q ? 'refine your search' : 'search to find them'}
        </div>
      )}
    </div>
  );

  const Options = (
    <div className="flex flex-wrap items-end gap-[22px]">
      <div className="flex flex-col gap-2">
        {eyebrow('Encoding')}
        <Segmented
          options={[
            { value: 'none', label: 'None' },
            { value: 'url', label: 'URL' },
            { value: 'double', label: 'Double URL' },
            { value: 'base64', label: 'Base64' },
          ]}
          value={enc}
          onChange={setEnc}
        />
      </div>
    </div>
  );

  const OutputPanel = (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        {eyebrow(
          <>
            <span className="text-lavender">
              <Icon name="zap" size={13} />
            </span>
            Payload
          </>,
        )}
        <CopyButton getText={() => finalOut} variant="labeled" className="border border-hairline-strong" />
      </div>
      <div
        className="overflow-y-auto rounded-md border border-hairline bg-canvas px-[15px] py-[13px]"
        style={{ minHeight: 120, maxHeight: 'calc(13px * 1.65 * 10 + 26px)' }}
      >
        <code className="block whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.65] text-ink [overflow-wrap:anywhere]">
          {enc === 'none' ? <CmdTokens cmd={shell.template} /> : finalOut}
        </code>
      </div>
      {(!vars.LHOST || !vars.LPORT) && (
        <div className="mt-[9px] flex items-center gap-[7px] font-text text-xs text-placeholder">
          <Icon name="info" size={13} />
          Set {[!vars.LHOST && 'LHOST', !vars.LPORT && 'LPORT'].filter(Boolean).join(' & ')} above for a ready-to-run command.
        </div>
      )}
      <div className="mt-[18px]">
        <div className="mb-2.5 flex items-center justify-between">
          {eyebrow(
            <>
              <Icon name="wifi" size={13} />
              Listener — run this first
            </>,
          )}
          <div className="inline-flex flex-wrap gap-1">
            {LISTENERS.map((l) => (
              <button
                key={l.id}
                onClick={() => setListenerId(l.id)}
                className={`cursor-pointer rounded-pill border px-[9px] py-[3px] font-text text-[11.5px] ${
                  l.id === listenerId ? 'border-transparent bg-surface-4 text-ink' : 'border-hairline bg-transparent text-ink-subtle'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
        <CodeBlock cmd={listener.template} variant="minimal" />
      </div>
    </div>
  );

  return (
    <div className="lo-fade-in mx-auto" style={{ maxWidth: 1000, padding: '28px 32px 80px' }}>
      <PageHeader
        icon="terminal"
        title="Reverse shell"
        subtitle="Build a one-liner offline — never open revshells.com again. Pick a shell, set your handler, copy."
      />
      <div className="grid items-start gap-[18px]" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
        <div className="flex flex-col gap-[18px]">
          <div className={CARD}>{Connection}</div>
          <div className={CARD}>{ShellPicker}</div>
          <div className={CARD}>{Options}</div>
        </div>
        <div className={`${CARD} sticky top-0`}>{OutputPanel}</div>
      </div>
    </div>
  );
}
