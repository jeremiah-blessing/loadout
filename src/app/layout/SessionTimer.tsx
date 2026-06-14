import { useEffect, useRef, useState } from 'react';
import { KEYS, usePersistentState } from '@/shared/lib/persistent-state';
import { fireOwnedCelebration } from '@/shared/lib/confetti';
import { Icon, Tip } from '@/shared/ui';

type FlagKey = 'user' | 'root';

interface SessionState {
  running: boolean;
  /** Time banked from previous run segments, in ms. */
  accumulated: number;
  /** Timestamp of the current run segment, or null when paused. */
  startedAt: number | null;
  box: string;
  flags: Partial<Record<FlagKey, number>>;
}

const INITIAL: SessionState = { running: false, accumulated: 0, startedAt: null, box: '', flags: {} };

/** Format ms as { full: HH:MM:SS, short: MM:SS }. */
function fmt(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return { full: `${p(h)}:${p(m)}:${p(s)}`, short: `${p(m)}:${p(s)}` };
}

/** Single source of truth for the running session. */
function useSession() {
  const [st, setSt] = usePersistentState<SessionState>(KEYS.session, INITIAL);

  // `now` advances the live clock without reading Date.now() during render
  // (which would be impure). Lazy-init from the wall clock — correct on restore,
  // since stored startedAt is in the past — then tick every second while running.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!st.running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [st.running]);

  // Clamp: just after resume, `now` may predate the fresh startedAt — the new
  // segment is ~0 until the next tick, so floor it at zero.
  const elapsed = st.accumulated + (st.running && st.startedAt ? Math.max(0, now - st.startedAt) : 0);

  const toggle = () =>
    setSt((p) =>
      p.running
        ? { ...p, running: false, startedAt: null, accumulated: p.accumulated + (p.startedAt ? Date.now() - p.startedAt : 0) }
        : { ...p, running: true, startedAt: Date.now() },
    );
  const reset = () => setSt((p) => ({ running: false, accumulated: 0, startedAt: null, box: p.box, flags: {} }));
  const setBox = (box: string) => setSt((p) => ({ ...p, box }));
  const capture = (key: FlagKey) =>
    setSt((p) => {
      const el = p.accumulated + (p.running && p.startedAt ? Date.now() - p.startedAt : 0);
      const flags = { ...p.flags };
      if (flags[key] != null) delete flags[key];
      else flags[key] = el;
      // Box owned — both flags captured: stop the clock, banking elapsed time
      // at the moment the second flag was grabbed.
      if (flags.user != null && flags.root != null && p.running) {
        return { ...p, flags, running: false, startedAt: null, accumulated: el };
      }
      return { ...p, flags };
    });

  return { st, elapsed, toggle, reset, setBox, capture };
}

interface CtrlButtonProps {
  icon: string;
  onClick: () => void;
  label: string;
  primary?: boolean;
  disabled?: boolean;
}

/* 28px square control — primary (lavender) for play/pause, outline for reset. */
const CtrlButton = ({
  icon,
  onClick,
  label,
  primary,
  disabled,
}: CtrlButtonProps) => {
  return (
    <Tip label={label}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`inline-flex h-7 w-7 flex-none items-center justify-center rounded-md p-0 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          primary
            ? 'border border-transparent bg-lavender text-on-primary hover:bg-lavender-hover'
            : 'border border-hairline bg-transparent text-ink-subtle hover:bg-surface-2 hover:text-ink'
        }`}
      >
        <Icon name={icon} size={15} fill={icon === 'play' ? 'currentColor' : 'none'} />
      </button>
    </Tip>
  );
}

interface FlagChipProps {
  label: string;
  captured?: number;
  disabled: boolean;
  onToggle: () => void;
}

/* HTB flag milestone — stacks label over its captured split time. Disabled
 * (but still tooltip-able) until the session is running; captured chips fill
 * lavender and stay readable. */
const FlagChip = ({
  label,
  captured,
  disabled,
  onToggle,
}: FlagChipProps) => {
  const on = captured != null;
  const tip = disabled
    ? 'Start the session to mark flags'
    : on
      ? `${label} captured at ${fmt(captured).full} — click to clear`
      : `Mark ${label} flag`;
  return (
    <Tip label={tip}>
      <button
        type="button"
        // aria-disabled (not disabled) keeps the tooltip reachable on hover while
        // remaining visually dimmed and non-actionable when the session is idle.
        aria-disabled={disabled || undefined}
        onClick={() => {
          if (!disabled) onToggle();
        }}
        className={`flex min-w-0 flex-1 flex-col items-stretch gap-1 rounded-md px-[9px] py-1.5 text-left transition-[background-color,border-color,opacity] ${
          on
            ? 'border border-var-filled-border bg-var-filled-bg'
            : disabled
              ? 'cursor-default border border-hairline bg-transparent opacity-45'
              : 'border border-hairline bg-transparent hover:bg-surface-2'
        }`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <Icon
            name={on ? 'flag' : 'flagOff'}
            size={13}
            fill={on ? 'currentColor' : 'none'}
            className={on ? 'text-lavender' : 'text-ink-tertiary'}
          />
          <span className={`font-text text-[11px] font-medium ${on ? 'text-ink' : 'text-ink-subtle'}`}>{label}</span>
        </span>
        <span
          className={`font-mono text-[14px] font-medium leading-none tracking-[0.3px] tabular-nums ${
            on ? 'text-lavender' : 'text-ink-tertiary'
          }`}
        >
          {on ? fmt(captured).short : '--:--'}
        </span>
      </button>
    </Tip>
  );
}

export const SessionTimer = () => {
  const s = useSession();
  const f = fmt(s.elapsed);
  const owned = s.st.flags.user != null && s.st.flags.root != null;

  // Celebrate the moment the box is owned — fire only on the false→true edge,
  // so a render or a page reload while already owned stays quiet. A Reset clears
  // both flags (owned→false), re-arming the burst for the next box.
  const wasOwned = useRef(owned);
  useEffect(() => {
    if (owned && !wasOwned.current) fireOwnedCelebration();
    wasOwned.current = owned;
  }, [owned]);

  return (
    <div className="mt-1 border-t border-hairline px-1 pb-1 pt-2">
      <div className="rounded-md border border-hairline bg-surface-1 px-3 py-[11px] shadow-edge">
        {/* header: live dot · editable box name · owned badge */}
        <div className="mb-[7px] flex items-center gap-[7px]">
          <span
            className={`inline-block h-1.5 w-1.5 flex-none rounded-full transition-[background-color,box-shadow] ${
              s.st.running ? 'lo-timer-live bg-lavender shadow-[0_0_0_3px_rgba(94,105,209,0.16)]' : 'bg-ink-tertiary'
            }`}
          />
          <input
            value={s.st.box}
            onChange={(e) => s.setBox(e.target.value)}
            placeholder="Name this box…"
            spellCheck={false}
            aria-label="Box name"
            className={`min-w-0 flex-1 border-none bg-transparent p-0 font-text text-[9.5px] font-semibold uppercase tracking-[0.5px] outline-none placeholder:text-ink-tertiary ${
              s.st.box ? 'text-ink' : 'text-ink-tertiary'
            }`}
          />
          {owned && (
            <span className="flex-none font-text text-[9.5px] font-semibold uppercase tracking-[0.3px] text-success">
              Owned
            </span>
          )}
        </div>

        {/* clock + start/pause + reset */}
        <div className="mb-[9px] flex items-end gap-2">
          <span className="font-mono text-[23px] font-medium leading-none tracking-[0.5px] tabular-nums text-ink">
            {f.full}
          </span>
          <span className="flex-1" />
          <CtrlButton icon={s.st.running ? 'pause' : 'play'} onClick={s.toggle} label={s.st.running ? 'Pause' : 'Start'} primary />
          <CtrlButton icon="rotate" onClick={s.reset} label="Reset" disabled={s.elapsed === 0 && !s.st.running} />
        </div>

        {/* User / Root flag splits */}
        <div className="flex gap-1.5">
          <FlagChip label="User" captured={s.st.flags.user} disabled={!s.st.running} onToggle={() => s.capture('user')} />
          <FlagChip label="Root" captured={s.st.flags.root} disabled={!s.st.running} onToggle={() => s.capture('root')} />
        </div>
      </div>
    </div>
  );
}
