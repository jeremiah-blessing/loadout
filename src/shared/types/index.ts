export interface CommonUsage {
  label: string;
  cmd: string;
}

export interface FlagRow {
  flag: string;
  desc: string;
}

export interface ExtraSection {
  title: string;
  text: string;
}

/** A tool's full structured content: metadata from frontmatter, sections
 * parsed from the §3.2 markdown body by a single parser, rendered by one page. */
export interface Tool {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  oneLiner: string;
  /** Optional glyph name (frontmatter `icon:`); falls back to the category icon when absent. */
  icon?: string;
  commonUsage: CommonUsage[];
  keyParams: FlagRow[];
  moreFlags: FlagRow[];
  gotchas: string[];
  /** Any non-template `##` sections, so authored content is never silently dropped. */
  extraSections: ExtraSection[];
  /** Raw markdown body — full-text indexed for ⌘K search. */
  body: string;
}

export interface WordlistRec {
  name: string;
  path: string;
  when: string;
  tags: string[];
}

export interface WordlistGroup {
  useCase: string;
  note: string;
  recommendations: WordlistRec[];
}

export interface Port {
  port: number;
  proto: string;
  service: string;
  notes: string;
  tools: string[];
}

export interface RevShell {
  id: string;
  name: string;
  icon: string;
  os: string[];
  template: string;
}

export interface Listener {
  id: string;
  name: string;
  template: string;
}

export type Vars = Record<string, string>;

export interface VarsState {
  values: Vars;
  custom: string[];
}

export interface ScratchData {
  content: string;
  updatedAt: number | null;
}

export type Theme = 'dark' | 'light';

export type Route =
  | { view: 'tool'; slug: string; jump?: string; _n?: number }
  | { view: 'tools'; _n?: number }
  | { view: 'wordlists'; highlight?: string; _n?: number }
  | { view: 'revshell'; _n?: number }
  | { view: 'ports'; highlight?: number; _n?: number }
  | { view: 'scratch'; _n?: number };

export type RouteInput =
  | { view: 'tool'; slug: string; jump?: string }
  | { view: 'tools' }
  | { view: 'wordlists'; highlight?: string }
  | { view: 'revshell' }
  | { view: 'ports'; highlight?: number }
  | { view: 'scratch' };
