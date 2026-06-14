/* Loadout — static structured content (wordlists, ports, reverse-shell payloads).
 * Loaded via glob so it stays outside src/ without tsconfig rootDir friction. */

import type { WordlistGroup, Port, RevShell, Listener } from '@/shared/types';

function loadOne<T>(modules: Record<string, unknown>): T {
  return Object.values(modules)[0] as T;
}

export const WORDLISTS = loadOne<WordlistGroup[]>(
  import.meta.glob('../../../content/wordlists.json', { import: 'default', eager: true }),
);

export const PORTS = loadOne<Port[]>(
  import.meta.glob('../../../content/ports.json', { import: 'default', eager: true }),
);

const revshells = loadOne<{ payloads: RevShell[]; listeners: Listener[] }>(
  import.meta.glob('../../../content/revshells.json', { import: 'default', eager: true }),
);

export const REVSHELLS: RevShell[] = revshells.payloads;
export const LISTENERS: Listener[] = revshells.listeners;
