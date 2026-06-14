import { parseTool } from './tool-parser';
import type { Tool } from '@/shared/types';

const files = import.meta.glob<string>('../../../content/tools/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Preferred sidebar/browse category order (PRD §4.8); extras appended. */
const CATEGORY_ORDER = ['Recon', 'Web', 'Databases', 'Windows & AD', 'Access & Shells', 'Passwords', 'Privesc'];

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '');
}

export const TOOLS: Tool[] = Object.entries(files)
  .map(([path, raw]) => parseTool(raw, slugFromPath(path)))
  .sort((first, second) => first.name.localeCompare(second.name));

export const CATEGORIES: string[] = (() => {
  const present = Array.from(new Set(TOOLS.map((tool) => tool.category)));
  const ordered = CATEGORY_ORDER.filter((category) => present.includes(category));
  const rest = present.filter((category) => !ordered.includes(category)).sort();
  return [...ordered, ...rest];
})();

export function toolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

/** Fallback glyph for a category, used when a tool has no `icon:` of its own. */
const CATEGORY_ICON: Record<string, string> = {
  Recon: 'scan',
  Web: 'globe',
  Databases: 'database',
  'Windows & AD': 'server',
  'Access & Shells': 'terminal',
  Passwords: 'key',
  Privesc: 'shield',
};

export function categoryIcon(cat: string): string {
  return CATEGORY_ICON[cat] ?? 'hash';
}

/** Resolved glyph for a tool: its own `icon:` if present, else the category fallback. */
export function toolIcon(tool: Tool): string {
  return tool.icon ?? categoryIcon(tool.category);
}
