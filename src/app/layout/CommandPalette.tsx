/* Loadout — global ⌘K command palette (the hero), centered variant.
 * cmdk drives keyboard nav / selection inside a Radix Dialog; MiniSearch still
 * does the ranking (shouldFilter=false) so tool-body/flag search + snippets work. */

import { Fragment, useMemo, useState } from 'react';
import { Command } from 'cmdk';
import { Dialog } from 'radix-ui';
import { TOOLS } from '@/shared/content/tools';
import { search } from '@/shared/content/search';
import type { RouteInput } from '@/shared/types';
import { Icon } from '@/shared/ui';

type Row =
  | { kind: 'action'; id: string; primary: string; secondary: string; icon: string; go?: RouteInput; act?: 'vars' }
  | { kind: 'tool'; id: string; primary: string; secondary: string; icon: string; slug: string; category: string; body: string }
  | { kind: 'wordlist'; id: string; primary: string; secondary: string; icon: string; wlName: string }
  | { kind: 'port'; id: string; primary: string; secondary: string; icon: string; port: number };

interface Group {
  label: string;
  rows: Row[];
}

const ACTIONS: Row[] = [
  { kind: 'action', id: 'n:tools', primary: 'Browse tools', secondary: 'All tools by category', icon: 'terminal', go: { view: 'tools' } },
  { kind: 'action', id: 'n:wordlists', primary: 'Wordlist guide', secondary: 'Which list for which job', icon: 'list', go: { view: 'wordlists' } },
  { kind: 'action', id: 'n:revshell', primary: 'Reverse shell generator', secondary: 'Build a one-liner offline', icon: 'terminal', go: { view: 'revshell' } },
  { kind: 'action', id: 'n:ports', primary: 'Ports & services', secondary: 'Port → service → next steps', icon: 'server', go: { view: 'ports' } },
  { kind: 'action', id: 'n:scratch', primary: 'Scratchpad', secondary: 'Loose working values', icon: 'file', go: { view: 'scratch' } },
  { kind: 'action', id: 'a:vars', primary: 'Set engagement variables', secondary: 'TARGET · LHOST · LPORT · WORDLIST', icon: 'hash', act: 'vars' },
];

function matchText(haystack: string, q: string): boolean {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const h = haystack.toLowerCase();
  return terms.every((t) => h.includes(t));
}

/** A short snippet of a tool body containing the first query term. */
function snippet(body: string, q: string): string | null {
  const term = q.toLowerCase().split(/\s+/).filter(Boolean)[0];
  if (!term) return null;
  const idx = body.toLowerCase().indexOf(term);
  if (idx < 0) return null;
  const start = Math.max(0, idx - 24);
  let snip = body.slice(start, idx + 56);
  if (start > 0) snip = '…' + snip;
  return snip.trim();
}

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (r: RouteInput) => void;
  onOpenVars: () => void;
}

export const CommandPalette = ({ open, onClose, onNavigate, onOpenVars }: Props) => {
  const [q, setQ] = useState('');
  const ql = q.trim();

  const groups = useMemo<Group[]>(() => {
    const g: Group[] = [];
    if (!ql) {
      g.push({ label: 'Go to', rows: ACTIONS });
      g.push({ label: 'Tools', rows: TOOLS.slice(0, 4).map(toolRow) });
      return g;
    }
    const matchedActions = ACTIONS.filter((a) => matchText(a.primary + ' ' + a.secondary, ql));
    const hits = search(ql);
    const tools = hits.filter((h) => h.type === 'tool').slice(0, 8).map(hitToolRow);
    const wls = hits.filter((h) => h.type === 'wordlist').slice(0, 5).map(hitWordlistRow);
    const ports = hits.filter((h) => h.type === 'port').slice(0, 5).map(hitPortRow);
    if (matchedActions.length) g.push({ label: 'Go to', rows: matchedActions });
    if (tools.length) g.push({ label: 'Tools', rows: tools });
    if (wls.length) g.push({ label: 'Wordlists', rows: wls });
    if (ports.length) g.push({ label: 'Ports', rows: ports });
    return g;
  }, [ql]);

  const choose = (row?: Row) => {
    if (!row) return;
    if (row.kind === 'action') {
      if (row.go) onNavigate(row.go);
      else if (row.act === 'vars') {
        onClose();
        onOpenVars();
        return;
      }
    } else if (row.kind === 'tool') onNavigate({ view: 'tool', slug: row.slug, jump: ql });
    else if (row.kind === 'wordlist') onNavigate({ view: 'wordlists', highlight: row.wlName });
    else if (row.kind === 'port') onNavigate({ view: 'ports', highlight: row.port });
    onClose();
  };

  // Reset the query each time the palette opens.
  const onOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[rgba(1,1,2,0.6)] backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={() => setQ('')}
          className="lo-scale-in fixed left-1/2 top-[14vh] z-[70] w-[min(92vw,580px)] -translate-x-1/2 overflow-hidden rounded-lg border border-hairline-strong bg-surface-1 shadow-overlay"
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Command shouldFilter={false} loop>
            <div className="flex items-center gap-[11px] border-b border-hairline px-4 py-3.5">
              <Icon name="search" size={17} className="text-ink-subtle" />
              <Command.Input
                value={q}
                onValueChange={setQ}
                autoFocus
                placeholder="Search tools, flags, wordlists, ports…"
                className="flex-1 border-none bg-transparent font-text text-[15.5px] tracking-[-0.1px] text-ink outline-none"
              />
              <kbd className="rounded border border-hairline-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-ink-subtle">
                Esc
              </kbd>
            </div>

            <Command.List className="max-h-[380px] overflow-y-auto p-2">
              <Command.Empty className="p-[34px] text-center font-text text-sm text-ink-tertiary">No results for “{ql}”</Command.Empty>
              {groups.map((g) => (
                <Fragment key={g.label}>
                  <div className="px-2.5 pb-1 pt-2.5 font-text text-[11px] font-medium uppercase tracking-[0.4px] text-ink-tertiary">
                    {g.label}
                  </div>
                  {g.rows.map((row) => (
                    <CmdRow key={row.id} row={row} q={ql} onSelect={() => choose(row)} />
                  ))}
                </Fragment>
              ))}
            </Command.List>

            <div className="flex items-center gap-3.5 border-t border-hairline px-3.5 py-2 font-text text-[11.5px] text-ink-tertiary">
              <HintKey keys={['↑', '↓']} label="navigate" />
              <HintKey keys={['↵']} label="open" />
              <HintKey keys={['esc']} label="close" />
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function toolRow(t: (typeof TOOLS)[number]): Row {
  return { kind: 'tool', id: 't:' + t.slug, primary: t.name, secondary: t.category + ' · ' + t.oneLiner, icon: 'terminal', slug: t.slug, category: t.category, body: t.body };
}

function hitToolRow(h: ReturnType<typeof search>[number]): Row {
  return { kind: 'tool', id: h.id, primary: h.name ?? '', secondary: (h.category ?? '') + ' · ' + (h.oneLiner ?? ''), icon: 'terminal', slug: h.slug ?? '', category: h.category ?? '', body: h.body ?? '' };
}

function hitWordlistRow(h: ReturnType<typeof search>[number]): Row {
  return { kind: 'wordlist', id: h.id, primary: h.name ?? '', secondary: (h.useCase ?? '') + ' · ' + (h.when ?? ''), icon: 'list', wlName: h.name ?? '' };
}

function hitPortRow(h: ReturnType<typeof search>[number]): Row {
  return { kind: 'port', id: h.id, primary: h.port + ' · ' + (h.service ?? ''), secondary: h.notes ?? '', icon: 'server', port: h.port ?? 0 };
}

interface HintKeyProps {
  keys: string[];
  label: string;
}

const HintKey = ({ keys, label }: HintKeyProps) => {
  return (
    <span className="inline-flex items-center gap-[5px]">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className="inline-block min-w-[14px] rounded-[3px] border border-hairline-strong bg-surface-2 px-1 text-center font-mono text-[10.5px] text-ink-subtle"
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  );
}

interface CmdRowProps {
  row: Row;
  q: string;
  onSelect: () => void;
}

const CmdRow = ({ row, q, onSelect }: CmdRowProps) => {
  const snip = row.kind === 'tool' && q ? snippet(row.body, q) : null;
  const monoPrimary = row.kind === 'tool' || row.kind === 'wordlist';
  return (
    <Command.Item
      value={row.id}
      onSelect={onSelect}
      className="group flex w-full cursor-pointer items-center gap-[11px] rounded-md px-2.5 py-2 text-left data-[selected=true]:bg-surface-2"
    >
      <span className="inline-flex w-[22px] flex-none justify-center text-ink-subtle group-data-[selected=true]:text-ink-muted">
        <Icon name={row.icon} size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-ink ${monoPrimary ? 'font-mono' : 'font-text'}`}>
            {row.primary}
          </span>
          {row.kind === 'tool' && (
            <span className="flex-none rounded-xs border border-hairline px-[5px] font-text text-[10.5px] text-ink-tertiary">{row.category}</span>
          )}
        </span>
        <span className="mt-px block overflow-hidden text-ellipsis whitespace-nowrap font-text text-xs text-ink-subtle">{snip || row.secondary}</span>
      </span>
      <Icon name="enter" size={14} className="flex-none text-ink-tertiary opacity-0 group-data-[selected=true]:opacity-100" />
    </Command.Item>
  );
}
