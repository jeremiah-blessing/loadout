import type { Vars } from '@/shared/types';

/** The core engagement variables — always present (PRD §3.5). */
export const CORE_VARS = ['TARGET', 'LHOST', 'LPORT', 'WORDLIST'] as const;

export const DEFAULT_VARS: Vars = {
  TARGET: '',
  LHOST: '',
  LPORT: '4444',
  WORDLIST: '/usr/share/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-medium.txt',
};

type Seg =
  | { t: 'text'; v: string }
  | { t: 'tok'; name: string; filled: boolean; value: string };

/** Split a command string into literal + token segments. Tokens look like <NAME>. */
export function tokenize(input: string, vars: Vars): Seg[] {
  const segments: Seg[] = [];
  const tokenPattern = /<([A-Z][A-Z0-9_]*)>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(input)) !== null) {
    if (match.index > lastIndex) segments.push({ t: 'text', v: input.slice(lastIndex, match.index) });
    const name = match[1];
    const value = vars && vars[name] != null ? vars[name] : '';
    segments.push({ t: 'tok', name, filled: value !== '', value });
    lastIndex = tokenPattern.lastIndex;
  }
  if (lastIndex < input.length) segments.push({ t: 'text', v: input.slice(lastIndex) });
  return segments;
}

/** Plain resolved string (for clipboard) — unfilled tokens stay as <NAME>. */
export function resolve(input: string, vars: Vars): string {
  return tokenize(input, vars)
    .map((segment) => (segment.t === 'text' ? segment.v : segment.filled ? segment.value : '<' + segment.name + '>'))
    .join('');
}
