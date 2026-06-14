# CLAUDE.md

Guidance for working in the **Loadout** codebase — an offline-first pentest reference toolkit (HTB-style tools, wordlists, reverse shells, ports). React 19 + TypeScript + Vite + Tailwind CSS v4. All state is local (`localStorage`); there is no backend.

## Architecture — feature-based, three layers

Source is organised by responsibility under `src/`, with a `@/` import alias mapped to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`). Prefer `@/…` imports over deep relative paths.

- **`src/app/`** — the application shell and everything app-wide.
  - `App.tsx` — shell: wraps `AppProviders`, mounts the `Router`, owns the ⌘K palette + ⌘J scratchpad open state and global keyboard shortcuts, and maps the current `Route` to a view in `renderView`.
  - `routes.ts` — URL ⇄ view mapping (`routePath` / `parseRoute`).
  - `layout/` — chrome: `Sidebar`, `GlobalVars` (the engagement-vars bar + `VarsEditorModal`), `CommandPalette`, `SessionTimer`.
  - `providers/` — app-wide state providers, composed in `AppProviders.tsx`: `ThemeProvider` (dark/light), `VarsProvider` (engagement variables + editor modal), `FavouritesProvider` (starred tools). The Radix `Tooltip.Provider` lives here too.
- **`src/features/`** — one folder per view, each with a barrel `index.ts`: `tools/` (`ToolPage`, `ToolsBrowse`), `wordlists/`, `ports/`, `revshell/`, `scratch/`.
- **`src/shared/`** — cross-cutting code consumable by any layer:
  - `ui/` — design-system primitives (`Button`, `IconButton`, `Badge`, `Icon`, `Tip`, `StarButton`, `PageHeader`, `SearchField`), re-exported from `ui/index.ts`.
  - `components/` — richer composite components (`CodeBlock`, `CopyButton`, `CmdTokens`).
  - `content/` — content loading + parsing + search (`tools.ts`, `reference.ts`, `tool-parser.ts`, `search.ts`).
  - `lib/` — `persistent-state.ts` (the store), `tokens.ts` (`<TOKEN>` substitution), `contexts.ts` (context definitions + hooks).
  - `types/index.ts` — all shared TypeScript types (`Tool`, `Route`/`RouteInput`, `Vars`, etc.).

Add a new view: extend `Route`/`RouteInput` in `shared/types`, handle it in `routePath`/`parseRoute` (`app/routes.ts`), build the feature under `src/features/<name>/` with a barrel, and render it in `App.tsx`'s `renderView`.

## UI primitives — use `radix-ui` wherever possible

**Default to the unified `radix-ui` package for any interactive/accessible UI.** Do not hand-roll overlays, focus traps, escape handling, roving-tabindex controls, or tooltips — reach for the Radix primitive first.

- Import from the single package: `import { Dialog, Tooltip, ToggleGroup, Collapsible, Slot } from 'radix-ui';` then use the namespace (`<Dialog.Root>`, `<Slot.Root>`, …). Do **not** add the individual `@radix-ui/react-*` packages.
- Established mappings already in the codebase — follow these patterns:
  - **Modals / drawers** → `Dialog` (`VarsEditorModal`, `ScratchDrawer`). Always include a `Dialog.Title` (use `sr-only` if visually hidden) and either a `Dialog.Description` or `aria-describedby={undefined}` on `Dialog.Content`.
  - **Command palette** → **cmdk** (`Command`) inside a Radix `Dialog` (`app/layout/CommandPalette.tsx`). Keep MiniSearch for ranking via `shouldFilter={false}`; let cmdk own keyboard nav/selection. Style the active row with `data-[selected=true]:` and `group-data-[selected=true]:`.
  - **Segmented / single-select controls** → `ToggleGroup` (`type="single"`, guard `onValueChange` against empty to prevent deselect). Style active state with `data-[state=on]:`. (See the all/favourites filter in `ToolsBrowse`.)
  - **Disclosure / collapse** → `Collapsible` (sidebar Tools group). Rotate chevrons with `group-data-[state=closed]:`.
  - **Tooltips** → `Tooltip`. There is a `Tooltip.Provider` at the app root (`AppProviders`) and a reusable `Tip` wrapper in `shared/ui`. `IconButton` is already tooltip-wrapped via its `label`; for other icon-only controls wrap with `<Tip label="…">`. Don't use the native `title` attribute for new controls.
  - **Link composition** → `Slot` powers the `asChild` prop on `Button`/`IconButton`. Use `asChild` (single child) when a control must render as an anchor.

When a needed primitive isn't already used here, prefer adding it from `radix-ui` over a bespoke implementation or another library.

## Routing — wouter (browser history)

- Path-based routing: deep links are real URLs (`/tool/nmap`, not `#/tool/nmap`). Use `wouter`'s default `<Router>` (no `hook`) — i.e. the browser History API. Base path is the domain root (`/`).
- **Static-host fallback (GitHub Pages target):** GH Pages has no SPA rewrite, so a direct hit / reload on `/tool/nmap` 404s. `public/404.html` (copied to the dist root by Vite) encodes the path into `/?/…` and redirects to root; a decoder snippet in `index.html` restores it via `history.replaceState` before the app boots (rafgraph/spa-github-pages pattern). Both assume root base; for a project page (`user.github.io/loadout/`) set Vite `base: '/loadout/'` and bump `pathSegmentsToKeep` to `1` in `public/404.html`.
- URL ⇄ view mapping lives in `src/app/routes.ts` (`routePath` / `parseRoute`). Transient UI params (`jump`, `highlight`) ride in the query string.
- Navigate with real anchors: wouter `<Link href={routePath(...)}>` (renders `/…`). The `onNavigate(RouteInput)` helper in `App.tsx` is for programmatic navigation (e.g. the command palette).

## Content & data

- **Tools** are markdown-with-frontmatter in `content/tools/*.md`. One parser (`shared/content/tool-parser.ts`) → one renderer (`features/tools/ToolPage.tsx`). To add a tool, drop a `.md` file with the standard frontmatter (`slug`, `name`, `category`, `tags`, `oneLiner`, optional `icon`) + four `##` sections (`Common usage`, `Key parameters`, `More flags`, `Gotchas & tips`); it auto-loads via `import.meta.glob` in `shared/content/tools.ts`. Any extra `##` sections are preserved as `extraSections`, so authored content is never dropped. No code changes needed.
- **Reference data** (`content/wordlists.json`, `ports.json`, `revshells.json`) loads via `import.meta.glob` in `shared/content/reference.ts`. Keep wordlist/port paths valid on both **Kali and Parrot** (anchor on `/usr/share/seclists/…`; note gzipped/quirky files).
- Tool categories and their sidebar/browse order come from `CATEGORY_ORDER` in `shared/content/tools.ts`; per-category fallback glyphs (used when a tool has no `icon:`) come from `CATEGORY_ICON` there.
- **Search** (`shared/content/search.ts`) builds one MiniSearch index over tools (incl. full markdown body), wordlists, and ports — this powers the ⌘K palette.

## Styling

- Tailwind v4 with `@theme` design tokens in `src/index.css` (canvas/surface ladder, lavender accent, hairlines, mono/text fonts). Light mode redeclares the color/shadow vars under `:root[data-theme="light"]`; `ThemeProvider` reflects the active theme onto `<html data-theme>`.
- Use the semantic token utilities (`bg-canvas`, `text-ink`, `border-hairline`, `shadow-edge`, `rounded-md`, `font-mono`) rather than raw hex. Command-token styles and animations live in `src/styles/theme.css`.

## State

- `usePersistentState<T>(key, initial)` (in `shared/lib/persistent-state.ts`) is the only writable store; all keys are registered in `KEYS` (vars, scratch, theme, starred, revShell, revListener, session).
- App-wide state is exposed through context: `useVars`, `useTheme`, `useFavourites` (hooks + context definitions in `shared/lib/contexts.ts`; the owning providers live in `app/providers/`).
- Engagement variables (`TARGET`/`LHOST`/`LPORT`/`WORDLIST` + custom, defined in `shared/lib/tokens.ts`) drive live `<TOKEN>` substitution via `VarsProvider` / `resolve` / `tokenize`. Click a token anywhere to open the editor (`openEditor` on the vars context).

## Verify

- `npm run build` runs `tsc -b && vite build` — keep both clean. `npm run lint` for ESLint. The Vite build enables the React Compiler (`babel-plugin-react-compiler`); avoid patterns that opt components out of it.
- There is no test suite; verify changes by building and, for behaviour, `npm run dev`.
