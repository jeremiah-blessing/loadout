import yaml from 'js-yaml';
import { marked, type Token, type Tokens } from 'marked';
import type { CommonUsage, FlagRow, Tool, ExtraSection } from '@/shared/types';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Strip inline markdown (backticks/emphasis) from a table cell. */
function cell(text: string): string {
  return text.replace(/`/g, '').replace(/\*\*/g, '').trim();
}

const SECTION = {
  COMMON: 'common usage',
  KEY: 'key parameters',
  MORE: 'more flags',
  GOTCHAS: 'gotchas & tips',
} as const;

interface Meta {
  slug?: string;
  name?: string;
  category?: string;
  tags?: string[];
  oneLiner?: string;
  icon?: string;
}

function tableRows(token: Tokens.Table): FlagRow[] {
  return token.rows.map((row) => ({
    flag: cell(row[0]?.text ?? ''),
    desc: cell(row[1]?.text ?? ''),
  }));
}

/** Parse one tool's raw `.md` file into a structured Tool. */
export function parseTool(raw: string, fallbackSlug: string): Tool {
  const frontmatterMatch = raw.match(FRONTMATTER);
  const meta = (frontmatterMatch ? (yaml.load(frontmatterMatch[1]) as Meta) : {}) ?? {};
  const body = (frontmatterMatch ? frontmatterMatch[2] : raw).trim();

  const commonUsage: CommonUsage[] = [];
  const keyParams: FlagRow[] = [];
  const moreFlags: FlagRow[] = [];
  const gotchas: string[] = [];
  const extraSections: ExtraSection[] = [];

  const tokens = marked.lexer(body);
  let section = '';
  let pendingLabel = ''; // last paragraph seen — labels the next code block
  let currentExtra: ExtraSection | null = null;

  const flushExtraText = (token: Token) => {
    if (!currentExtra) return;
    const text = (token as { text?: string }).text;
    if (text) currentExtra.text += (currentExtra.text ? '\n\n' : '') + text;
  };

  for (const token of tokens as Token[]) {
    if (token.type === 'heading' && (token as Tokens.Heading).depth === 2) {
      const title = (token as Tokens.Heading).text.trim();
      const key = title.toLowerCase();
      pendingLabel = '';
      if (key === SECTION.COMMON || key === SECTION.KEY || key === SECTION.MORE || key === SECTION.GOTCHAS) {
        currentExtra = null;
        section = key;
      } else {
        currentExtra = { title, text: '' };
        extraSections.push(currentExtra);
        section = 'extra';
      }
      continue;
    }

    switch (section) {
      case SECTION.COMMON:
        if (token.type === 'paragraph') pendingLabel = (token as Tokens.Paragraph).text.trim();
        else if (token.type === 'code') {
          commonUsage.push({ label: pendingLabel, cmd: (token as Tokens.Code).text });
          pendingLabel = '';
        }
        break;
      case SECTION.KEY:
        if (token.type === 'table') keyParams.push(...tableRows(token as Tokens.Table));
        break;
      case SECTION.MORE:
        if (token.type === 'table') moreFlags.push(...tableRows(token as Tokens.Table));
        break;
      case SECTION.GOTCHAS:
        if (token.type === 'list') {
          for (const item of (token as Tokens.List).items) gotchas.push(item.text.trim());
        }
        break;
      case 'extra':
        flushExtraText(token);
        break;
    }
  }

  return {
    slug: meta.slug || fallbackSlug,
    name: meta.name || meta.slug || fallbackSlug,
    category: meta.category || 'Other',
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    oneLiner: meta.oneLiner || '',
    icon: meta.icon || undefined,
    commonUsage,
    keyParams,
    moreFlags,
    gotchas,
    extraSections,
    body,
  };
}
