import { useMemo, useState } from 'react';
import { WORDLISTS } from '@/shared/content/reference';
import { Icon, PageHeader, SearchField } from '@/shared/ui';
import { CopyButton } from '@/shared/components';

interface PathRowProps {
  path: string;
}

const PathRow = ({ path }: PathRowProps) => {
  return (
    <div className="mt-2.5 flex items-center gap-2 rounded-md border border-hairline bg-canvas py-[7px] pl-[11px] pr-2">
      <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12.5px] text-ink-muted">{path}</code>
      <CopyButton getText={path} />
    </div>
  );
}

interface Props {
  highlight?: string;
}

export const WordlistGuide = ({ highlight }: Props) => {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    WORDLISTS.forEach((w) => w.recommendations.forEach((r) => r.tags.forEach((t) => s.add(t))));
    return [...s];
  }, []);

  const ql = q.toLowerCase();
  const groups = WORDLISTS.map((w) => ({
    ...w,
    recommendations: w.recommendations.filter((r) => {
      const matchesQ = !ql || (r.name + ' ' + r.path + ' ' + r.when + ' ' + w.useCase).toLowerCase().includes(ql);
      const matchesTag = !tag || r.tags.includes(tag);
      return matchesQ && matchesTag;
    }),
  })).filter((w) => w.recommendations.length);

  return (
    <div className="lo-fade-in mx-auto" style={{ maxWidth: 900, padding: '28px 32px 80px' }}>
      <PageHeader
        icon="bookOpen"
        title="Wordlist guide"
        subtitle="Which list for this situation? Browse by use case — every path copies ready to paste."
        right={<SearchField value={q} onChange={setQ} placeholder="Filter wordlists…" />}
      />

      <div className="mb-[22px] flex flex-wrap gap-1.5">
        {[null, ...allTags].map((t) => (
          <button
            key={t || 'all'}
            onClick={() => setTag(t)}
            className={`cursor-pointer rounded-pill border px-[11px] py-1 font-mono text-xs transition-colors ${
              tag === t ? 'border-transparent bg-lavender text-on-primary' : 'border-hairline bg-surface-1 text-ink-subtle'
            }`}
          >
            {t || 'all'}
          </button>
        ))}
      </div>

      {groups.length === 0 && <div className="p-10 text-center font-text text-ink-tertiary">No wordlists match.</div>}

      <div className="flex flex-col gap-[30px]">
        {groups.map((w) => (
          <section key={w.useCase}>
            <div className="mb-3 flex items-baseline gap-2.5">
              <h2 className="m-0 font-display text-base font-semibold tracking-[-0.2px] text-ink">{w.useCase}</h2>
              <span className="font-text text-[12.5px] text-ink-tertiary">{w.note}</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}>
              {w.recommendations.map((r) => (
                <div
                  key={r.name}
                  className={`rounded-lg border border-hairline bg-surface-1 p-[15px] shadow-edge ${highlight === r.name ? 'lo-jump-flash' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="list" size={15} className="flex-none text-ink-subtle" />
                    <code className="min-w-0 font-mono text-[13.5px] font-medium text-ink [overflow-wrap:anywhere]">{r.name}</code>
                  </div>
                  <p className="m-0 mt-[9px] text-pretty font-text text-[13px] leading-[1.5] text-ink-subtle">{r.when}</p>
                  <PathRow path={r.path} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
