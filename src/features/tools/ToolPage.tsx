import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { toolBySlug } from '@/shared/content/tools';
import { useFavourites } from '@/shared/lib/contexts';
import { Icon, Badge, StarButton } from '@/shared/ui';
import { CodeBlock } from '@/shared/components';

interface ToolSectionProps {
  icon: string;
  title: string;
  kicker?: string;
  accent?: boolean;
  children: ReactNode;
}

const ToolSection = ({
  icon,
  title,
  kicker,
  accent,
  children,
}: ToolSectionProps) => {
  return (
    <section className="mt-[30px]">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className={`inline-flex ${accent ? 'text-lavender' : 'text-ink-subtle'}`}>
          <Icon name={icon} size={16} />
        </span>
        <h2 className="m-0 font-display text-base font-semibold tracking-[-0.2px] text-ink">{title}</h2>
        {kicker && <span className="font-text text-xs text-ink-tertiary">{kicker}</span>}
      </div>
      {children}
    </section>
  );
}

interface Props {
  slug: string;
  jump?: string;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export const ToolPage = ({ slug, jump, scrollRef }: Props) => {
  const tool = toolBySlug(slug);
  const pageRef = useRef<HTMLDivElement>(null);
  const { isStarred, toggle } = useFavourites();

  useEffect(() => {
    if (!jump || !pageRef.current || !scrollRef?.current) return;
    const term = jump.toLowerCase().split(/\s+/).filter(Boolean)[0];
    if (!term) return;
    const nodes = pageRef.current.querySelectorAll<HTMLElement>('[data-snip]');
    let target: HTMLElement | null = null;
    for (const n of nodes) {
      if (n.textContent?.toLowerCase().includes(term)) {
        target = n;
        break;
      }
    }
    if (target) {
      const c = scrollRef.current;
      const top = target.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop;
      c.scrollTo({ top: Math.max(0, top - 90), behavior: 'smooth' });
      target.classList.add('lo-jump-flash');
      const id = setTimeout(() => target!.classList.remove('lo-jump-flash'), 1400);
      return () => clearTimeout(id);
    }
  }, [jump, slug, scrollRef]);

  if (!tool) return <div className="p-10 text-ink-subtle">Tool not found.</div>;

  return (
    <div ref={pageRef} className="lo-fade-in mx-auto" style={{ maxWidth: 820, padding: '28px 32px 80px' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="m-0 font-mono text-[30px] font-semibold tracking-[-0.5px] text-ink">{tool.name}</h1>
        <Badge tone="accent">{tool.category}</Badge>
        <StarButton active={isStarred(tool.slug)} onToggle={() => toggle(tool.slug)} size={20} className="ml-auto" />
      </div>
      <p className="m-0 mt-3 max-w-[660px] text-pretty font-text text-base leading-[1.55] text-ink-muted">{tool.oneLiner}</p>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {tool.tags.map((tg) => (
          <span key={tg} className="rounded-pill border border-hairline bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-ink-subtle">
            {tg}
          </span>
        ))}
      </div>

      {/* Common usage */}
      {tool.commonUsage.length > 0 && (
        <ToolSection icon="zap" title="Common usage" kicker="copy-ready" accent>
          <div className="flex flex-col gap-3">
            {tool.commonUsage.map((c, i) => (
              <div key={i} data-snip="">
                {c.label && (
                  <div className="mb-1.5 flex items-center gap-[7px] font-text text-[12.5px] text-ink-subtle">
                    <span className="inline-block h-1 w-1 rounded-full bg-lavender" />
                    {c.label}
                  </div>
                )}
                <CodeBlock cmd={c.cmd} label={c.label} variant="terminal" />
              </div>
            ))}
          </div>
        </ToolSection>
      )}

      {/* Key parameters */}
      {tool.keyParams.length > 0 && (
        <ToolSection icon="star" title="Key parameters" kicker="the must-knows" accent>
          <div className="overflow-hidden rounded-lg border border-hairline bg-surface-1">
            {tool.keyParams.map((k, i) => (
              <div key={i} data-snip="" className={`relative flex gap-3.5 px-3.5 py-3 ${i ? 'border-t border-hairline' : ''}`}>
                <span className="absolute bottom-2.5 left-0 top-2.5 w-0.5 rounded-[2px] bg-lavender" />
                <code className="flex-none basis-[168px] break-words font-mono text-[13px] font-medium text-lavender">{k.flag}</code>
                <span className="text-pretty font-text text-[13.5px] leading-[1.5] text-ink-muted">{k.desc}</span>
              </div>
            ))}
          </div>
        </ToolSection>
      )}

      {/* More flags */}
      {tool.moreFlags.length > 0 && (
        <ToolSection icon="sliders" title="More flags" kicker="fuller reference">
          <div className="overflow-hidden rounded-lg border border-hairline">
            {tool.moreFlags.map((k, i) => (
              <div
                key={i}
                data-snip=""
                className={`flex gap-3.5 px-3.5 py-[9px] ${i ? 'border-t border-hairline' : ''} ${i % 2 ? 'bg-transparent' : 'bg-surface-1'}`}
              >
                <code className="flex-none basis-[168px] break-words font-mono text-[12.5px] text-ink">{k.flag}</code>
                <span className="font-text text-[13px] leading-[1.45] text-ink-subtle">{k.desc}</span>
              </div>
            ))}
          </div>
        </ToolSection>
      )}

      {/* Gotchas */}
      {tool.gotchas.length > 0 && (
        <ToolSection icon="info" title="Gotchas & tips">
          <div className="flex flex-col gap-2">
            {tool.gotchas.map((g, i) => (
              <div key={i} data-snip="" className="flex gap-2.5 rounded-md border border-hairline bg-surface-1 px-3 py-[11px]">
                <span className="mt-px flex-none text-placeholder">
                  <Icon name="zap" size={14} />
                </span>
                <span className="text-pretty font-text text-[13.5px] leading-[1.5] text-ink-muted">{g}</span>
              </div>
            ))}
          </div>
        </ToolSection>
      )}

      {/* Any non-template sections, so authored content is never dropped */}
      {tool.extraSections.map((s) => (
        <ToolSection key={s.title} icon="bookOpen" title={s.title}>
          <p className="m-0 whitespace-pre-wrap text-pretty font-text text-[13.5px] leading-[1.6] text-ink-muted">{s.text}</p>
        </ToolSection>
      ))}
    </div>
  );
}
