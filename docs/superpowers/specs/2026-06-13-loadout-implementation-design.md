# Loadout — Implementation Design

Date: 2026-06-13
Status: Approved — implementing
Builds on: [2026-06-11 PRD](./2026-06-11-loadout-pentest-toolkit-design.md) + the Claude Design handoff bundle.

## Decisions (brainstormed 2026-06-13)

- **Locked UI variants (tweaks panel does NOT ship):** compact variables bar · split
  reverse-shell layout · terminal code blocks · centered ⌘K palette · edge-tab scratchpad.
- **Tools authoring:** each tool is `content/tools/<slug>.md` — YAML frontmatter (metadata) +
  a markdown body following the §3.2 template. A single parser turns the body into a structured
  `Tool`; a single `ToolPage` renders it (pixel-perfect styled sections, not raw prose).
- **Styling:** rewrite the prototype's inline styles as idiomatic Tailwind v4 utilities backed by
  `@theme` design tokens; hover via `hover:` variants; light mode by redeclaring `--color-*`.
- **Search:** MiniSearch (PRD §7), one index at load, grouped palette results.
- **Design-system primitives:** recreate Badge / IconButton / Button as typed TSX (match the
  bundle's exact styles). No `window` namespace, no UMD bundle.

## Stack & dependencies

React 19 + TS + Vite + Tailwind v4 (existing scaffold). Added deps: `js-yaml` (frontmatter),
`marked` (body lexer), `minisearch` (search). `localStorage` is the only writable store.

## Tool pipeline

1. `import.meta.glob('/content/tools/*.md', { query: '?raw', eager: true })`.
2. `lib/tool-parser.ts`: split frontmatter (`js-yaml`); `marked.lexer(body)`; group tokens by `##`
   heading. Common usage = label paragraph + following fenced cmd. Key parameters / More flags =
   GFM tables → `{flag, desc}`. Gotchas = list items. Emits `Tool` + raw body (for search).
3. `ToolPage.tsx`: the one renderer. Unknown headings fall back to a generic section.

Placeholders `<TARGET>`/`<LHOST>`/`<LPORT>`/`<WORDLIST>`/custom flow through `CodeBlock` →
`CmdTokens` for live substitution + click-to-edit + copy.

## Theming

`@theme` registers `--color-*`, `--font-*`, `--radius-*`, `--shadow-*` → utilities like
`bg-canvas text-ink border-hairline font-mono rounded-md shadow-edge`. `:root[data-theme="light"]`
redeclares the color/shadow vars so utilities re-resolve at runtime. Token-highlight (`.lo-tok`)
and entrance/jump animations stay as CSS in `styles/theme.css`.

## Phases (per user's 1→5 list)

1. Layout skeleton — App routing/providers, Sidebar, compact top strip, theme toggle.
   1.1 Global variables (compact bar + editor modal + substitution via `VarsContext`).
   1.2 Search window (centered ⌘K palette, MiniSearch, grouped, jump-to-match).
   1.3 Scratchpad (edge tab → slide-over drawer + full view, shared autosaved state, ⌘J).
2. Tools — md pipeline + single `ToolPage` + `CodeBlock`/`CmdTokens`/`CopyButton`; 4 seed tools.
3. Wordlist guide — use-case groups, tag filter, search, copy-able paths.
4. Reverse shell — split layout, payload picker (brand icons, OS filter, search), encoding,
   listener helper, LHOST/LPORT synced to global vars.
5. Ports & services — searchable table, jump-highlight.

Verify: `tsc -b && vite build`.
```
