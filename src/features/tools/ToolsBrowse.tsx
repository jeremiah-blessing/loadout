import { useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ToggleGroup } from 'radix-ui';
import { TOOLS, CATEGORIES, categoryIcon, toolIcon } from '@/shared/content/tools';
import { routePath } from '@/app/routes';
import { useFavourites } from '@/shared/lib/contexts';
import type { Tool } from '@/shared/types';
import { Icon, StarButton, PageHeader, SearchField } from '@/shared/ui';

type Filter = 'all' | 'fav';

interface FilterToggleProps {
  value: Filter;
  onChange: (v: Filter) => void;
  favCount: number;
}

const FilterToggle = ({ value, onChange, favCount }: FilterToggleProps) => {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as Filter)}
      className="inline-flex gap-0.5 rounded-md border border-hairline bg-surface-1 p-0.5"
    >
      {(['all', 'fav'] as const).map((opt) => (
        <ToggleGroup.Item
          key={opt}
          value={opt}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border-none bg-transparent px-[11px] py-[5px] font-text text-[12.5px] font-medium text-ink-subtle transition-colors data-[state=on]:bg-surface-3 data-[state=on]:text-ink"
        >
          {opt === 'fav' && (
            <Icon
              name="star"
              size={13}
              fill={value === 'fav' ? 'currentColor' : 'none'}
              className={value === 'fav' ? 'text-lavender' : ''}
            />
          )}
          {opt === 'all' ? 'All' : `Favourites${favCount ? ' · ' + favCount : ''}`}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

interface ToolGlyphProps {
  icon: string;
}

const ToolGlyph = ({ icon }: ToolGlyphProps) => {
  return (
    <span className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-md border border-hairline bg-surface-2 text-lavender shadow-edge">
      <Icon name={icon} size={17} />
    </span>
  );
}

interface ToolCardProps {
  tool: Tool;
  starred: boolean;
  onToggle: () => void;
}

const ToolCard = ({ tool, starred, onToggle }: ToolCardProps) => {
  return (
    <div className="group relative">
      <Link
        href={routePath({ view: 'tool', slug: tool.slug })}
        className="block cursor-pointer rounded-lg border border-hairline bg-surface-1 p-4 pr-11 text-left no-underline shadow-edge transition-colors hover:border-hairline-strong hover:bg-surface-2"
      >
        <div className="mb-2.5 flex items-center gap-2.5">
          <ToolGlyph icon={toolIcon(tool)} />
          <code className="min-w-0 flex-1 truncate font-mono text-[15.5px] font-semibold text-ink">{tool.name}</code>
        </div>
        <p className="m-0 text-pretty font-text text-[13px] leading-[1.5] text-ink-subtle">{tool.oneLiner}</p>
      </Link>
      <StarButton active={starred} onToggle={onToggle} className="absolute right-2.5 top-2.5" />
    </div>
  );
}

const EmptyFavourites = () => {
  return (
    <div className="rounded-lg border border-dashed border-hairline-strong px-6 py-12 text-center font-text text-[13.5px] text-ink-tertiary">
      <div className="mb-2.5 inline-flex text-ink-tertiary">
        <Icon name="star" size={22} />
      </div>
      <div>No favourites yet — tap the ☆ on any tool to pin it here and to your sidebar.</div>
    </div>
  );
}

export const ToolsBrowse = () => {
  const { starred, isStarred, toggle } = useFavourites();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      TOOLS.filter((t) => filter === 'all' || isStarred(t.slug)).filter(
        (t) =>
          !q ||
          t.name.toLowerCase().includes(q) ||
          t.oneLiner.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      ),
    [filter, q, isStarred],
  );

  const activeCategories = CATEGORIES.filter((cat) => visible.some((t) => t.category === cat));

  const jumpTo = (cat: string) => {
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="lo-fade-in mx-auto" style={{ maxWidth: 980, padding: '28px 32px 80px' }}>
      <PageHeader
        icon="terminal"
        title="Tools"
        subtitle="Every tool in your reference. Star the ones you reach for — they pin to the sidebar. Hit ⌘K to jump straight to a command."
        right={<FilterToggle value={filter} onChange={setFilter} favCount={starred.length} />}
      />

      {/* Filter bar — text filter + category quick-jump */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SearchField value={query} onChange={setQuery} placeholder="Filter tools…" width={240} />
        {activeCategories.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {activeCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => jumpTo(cat)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-pill border border-hairline bg-surface-1 px-2.5 py-1 font-text text-[12px] text-ink-subtle transition-colors hover:border-hairline-strong hover:text-ink"
              >
                <Icon name={categoryIcon(cat)} size={12} className="text-ink-tertiary" />
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        filter === 'fav' && !q ? (
          <EmptyFavourites />
        ) : (
          <div className="rounded-lg border border-dashed border-hairline-strong px-6 py-12 text-center font-text text-[13.5px] text-ink-tertiary">
            No tools match “{query}”.
          </div>
        )
      ) : (
        activeCategories.map((cat) => (
          <section
            key={cat}
            ref={(el) => {
              sectionRefs.current[cat] = el;
            }}
            className="mb-7 scroll-mt-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <Icon name={categoryIcon(cat)} size={15} className="text-ink-subtle" />
              <h2 className="m-0 font-display text-[15px] font-semibold tracking-[-0.2px] text-ink">{cat}</h2>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
              {visible
                .filter((t) => t.category === cat)
                .map((t) => (
                  <ToolCard key={t.slug} tool={t} starred={isStarred(t.slug)} onToggle={() => toggle(t.slug)} />
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
