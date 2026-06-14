# Tools reference page + Favourites — Design

Date: 2026-06-13
Status: Approved

## Problem

The sidebar currently carries a grouped **Tools** tree (categories → tools). Per the
Claude Design handoff (chat 3), this should become:

- One **Tools** reference page listed under **Reference** (the grouped tree leaves the sidebar).
- A flat **Favourites** section in the sidebar — user-starred tools, no category grouping.
- Per-tool icons shown wherever present, on the Tools page and in Favourites.

The mockup locked the **cards** layout (list/gallery dropped). The real app has ~28 tools
across 7 categories (vs 4 in the mockup), so the Tools page adds a **filter bar** to stay scannable.

## Decisions

- **Listing layout:** Cards grouped by category + a filter bar (live text filter + category
  quick-jump chips + All/Favourites toggle).
- **Icons:** optional `icon:` frontmatter per tool; tools without one fall back to a
  per-category icon (`toolIcon(tool) = tool.icon ?? categoryIcon(tool.category)`).
- **Default favourites:** `nmap`, `ffuf`, `gobuster`, `smbclient` (seeded; user changes in real use).

## Changes by file

- **`src/components/Icon.tsx`** — add a `fill` prop (default `"none"`) so the star can fill;
  add glyphs `network`, `lock`, `database`, `shield`.
- **`src/lib/types.ts`** — `Tool` gains optional `icon?: string`.
- **`src/lib/tool-parser.ts`** — read `icon` from frontmatter into the `Tool`.
- **`src/data/tools.ts`** — add `categoryIcon(cat)` (moved/shared) and `toolIcon(tool)` helpers.
- **`src/lib/store.ts`** — `FavouritesContext` + `useFavourites()` (mirrors `VarsContext`),
  backed by the existing `KEYS.starred`; `DEFAULT_FAVS`.
- **`src/components/ds.tsx`** — `StarButton` (icon-only, `Tip`-wrapped, fills lavender when active).
- **`src/App.tsx`** — provide `FavouritesContext`.
- **`src/components/Sidebar.tsx`** — remove the `Collapsible` Tools tree; add a flat
  **Favourites** section (row = `<Link>` + always-mounted `StarButton` that fades in on hover,
  so no nested interactive element and no layout shift); add a **Tools** entry under Reference.
- **`src/components/ToolsBrowse.tsx`** — cards with icon tile + `StarButton`; All/Favourites
  `ToggleGroup`; text filter input + category quick-jump chips; favourites empty state.
- **`src/components/ToolPage.tsx`** — `StarButton` in the header (star only, no label).
- **`content/tools/*.md`** — add `icon:` frontmatter to tools with a distinct glyph; rest fall back.

## Verify

`npm run build` (tsc -b && vite build) and `npm run lint` both clean.
