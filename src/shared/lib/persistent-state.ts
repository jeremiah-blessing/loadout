/* Loadout — persisted state. localStorage is the only writable store (PRD §2). */

import { useEffect, useState } from 'react';

export const KEYS = {
  vars: 'loadout.vars.v1',
  scratch: 'loadout.scratch.v1',
  theme: 'loadout.theme.v1',
  starred: 'loadout.starred.v1',
  revShell: 'loadout.revshell.v1',
  revListener: 'loadout.revlistener.v1',
  session: 'loadout.session.v1',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — ignore */
  }
}

/** Generic persisted state hook. */
export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => read(key, initial));
  useEffect(() => {
    write(key, state);
  }, [key, state]);
  return [state, setState] as const;
}
