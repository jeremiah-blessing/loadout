import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { TOOLS, toolIcon } from '@/shared/content/tools';
import { routePath } from '@/app/routes';
import type { Route, RouteInput } from '@/shared/types';
import { useFavourites, useTheme } from '@/shared/lib/contexts';
import { Icon, StarButton, Tip } from '@/shared/ui';
import { SessionTimer } from './SessionTimer';

interface NavItemProps {
  icon?: string;
  label: string;
  active?: boolean;
  href: string;
  mono?: boolean;
}

const NavItem = ({
  icon,
  label,
  active,
  href,
  mono,
}: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left no-underline transition-colors ${
        active ? 'bg-surface-2 font-medium text-ink' : 'bg-transparent font-normal text-ink-subtle hover:bg-surface-1'
      } ${mono ? 'font-mono text-[12.5px]' : 'font-text text-[13.5px]'}`}
    >
      {icon && <Icon name={icon} size={16} className={active ? 'text-lavender' : 'text-ink-subtle'} />}
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
    </Link>
  );
}

/** A favourite tool row — its own nav link plus an unstar control that fades in
 * on hover. The star sits over the link (not nested inside) so there's no invalid
 * interactive nesting and the row height never shifts. */
interface FavItemProps {
  slug: string;
  label: string;
  icon: string;
  active: boolean;
  href: string;
  onUnstar: () => void;
}

const FavItem = ({ slug, label, icon, active, href, onUnstar }: FavItemProps) => {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={`flex w-full items-center gap-2.5 rounded-md py-1.5 pl-2 pr-8 text-left no-underline transition-colors ${
          active ? 'bg-surface-2 font-medium text-ink' : 'bg-transparent font-normal text-ink-subtle hover:bg-surface-1'
        } font-mono text-[12.5px]`}
      >
        <Icon name={icon} size={16} className={active ? 'text-lavender' : 'text-ink-subtle'} />
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
      </Link>
      <StarButton
        active
        size={13}
        onToggle={onUnstar}
        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      />
      <span className="sr-only">{slug}</span>
    </div>
  );
}

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

const SectionLabel = ({ children, className = '' }: SectionLabelProps) => {
  return (
    <div className={`px-2 pb-1 pt-3.5 font-text text-[11px] font-medium uppercase tracking-[0.4px] text-ink-tertiary ${className}`}>
      {children}
    </div>
  );
}

interface Props {
  route: Route;
  onNavigate: (r: RouteInput) => void;
  onOpenCommand: () => void;
}

export const Sidebar = ({ route, onNavigate, onOpenCommand }: Props) => {
  const v = route.view;
  const { starred, toggle } = useFavourites();
  const { theme, setTheme } = useTheme();
  const favTools = TOOLS.filter((t) => starred.includes(t.slug));

  return (
    <aside className="flex h-full w-[248px] flex-none flex-col border-r border-hairline bg-canvas px-2 py-2.5">
      {/* Brand */}
      <button
        onClick={() => onNavigate({ view: 'tools' })}
        className="mb-1.5 flex w-full cursor-pointer items-center gap-2.5 rounded-md border-none bg-transparent px-2 py-1.5"
      >
        <span className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[7px] bg-lavender shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 16 5-5-5-5" />
            <path d="M13 17h6" />
          </svg>
        </span>
        <span className="flex flex-1 flex-col text-left">
          <span className="font-display text-[15px] font-semibold leading-[1.1] tracking-[-0.3px] text-ink">Loadout</span>
          <span className="font-text text-[10.5px] tracking-[0.2px] text-ink-tertiary">pentest reference</span>
        </span>
      </button>

      {/* ⌘K trigger */}
      <button
        onClick={onOpenCommand}
        className="mb-1 flex w-full cursor-pointer items-center gap-2 rounded-md border border-hairline bg-surface-1 px-[9px] py-[7px] font-text text-[13px] text-ink-subtle transition-colors hover:border-hairline-strong"
      >
        <Icon name="search" size={15} />
        <span className="flex-1 text-left">Search</span>
        <span className="inline-flex gap-0.5">
          {['⌘', 'K'].map((k, i) => (
            <kbd key={i} className="rounded-[3px] border border-hairline-strong bg-surface-2 px-1 py-px font-mono text-[10px] leading-[1.3] text-ink-subtle">
              {k}
            </kbd>
          ))}
        </span>
      </button>

      <div className="mx-[-4px] mt-1 flex-1 overflow-y-auto overflow-x-hidden px-1">
        {/* Favourites — flat, no category grouping */}
        <SectionLabel className="pt-1">Favourites</SectionLabel>
        {favTools.length === 0 ? (
          <div className="px-2 pb-1.5 pt-0.5 font-text text-[12px] leading-[1.45] text-ink-tertiary">
            Star a tool to pin it here.
          </div>
        ) : (
          favTools.map((t) => (
            <FavItem
              key={t.slug}
              slug={t.slug}
              label={t.name}
              icon={toolIcon(t)}
              active={v === 'tool' && route.slug === t.slug}
              href={routePath({ view: 'tool', slug: t.slug })}
              onUnstar={() => toggle(t.slug)}
            />
          ))
        )}

        {/* Reference */}
        <SectionLabel>Reference</SectionLabel>
        <NavItem icon="terminal" label="Tools" active={v === 'tools' || v === 'tool'} href={routePath({ view: 'tools' })} />
        <NavItem icon="bookOpen" label="Wordlist guide" active={v === 'wordlists'} href={routePath({ view: 'wordlists' })} />
        <NavItem icon="code" label="Reverse shell" active={v === 'revshell'} href={routePath({ view: 'revshell' })} />
        <NavItem icon="server" label="Ports & services" active={v === 'ports'} href={routePath({ view: 'ports' })} />
      </div>

      {/* Session timer — sits directly above the footer */}
      <SessionTimer />

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-hairline p-2">
        <div className="flex flex-1 items-center gap-[7px] font-mono text-[11px] text-ink-tertiary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
          offline · local
        </div>
        <Tip label={theme === 'light' ? 'Switch to dark' : 'Switch to light'} side="top">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
            className="inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border border-hairline bg-transparent text-ink-subtle transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={15} />
          </button>
        </Tip>
      </div>
    </aside>
  );
}
