/* Loadout — app shell: routing, ⌘K palette, scratchpad. App-wide state lives in
 * providers (see app/providers/AppProviders). The five design variants are locked
 * (compact vars · split reverse shell · terminal code blocks · centered ⌘K ·
 * edge-tab scratchpad). */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Router, useLocation, useSearch } from 'wouter';
import { KEYS, usePersistentState } from '@/shared/lib/persistent-state';
import { useVars } from '@/shared/lib/contexts';
import { parseRoute, routePath } from '@/app/routes';
import type { RouteInput, ScratchData } from '@/shared/types';
import { AppProviders } from '@/app/providers/AppProviders';
import { Sidebar } from '@/app/layout/Sidebar';
import { GlobalVarsBar } from '@/app/layout/GlobalVars';
import { CommandPalette } from '@/app/layout/CommandPalette';
import { ToolPage, ToolsBrowse } from '@/features/tools';
import { WordlistGuide } from '@/features/wordlists';
import { PortsReference } from '@/features/ports';
import { RevShell } from '@/features/revshell';
import { Scratchpad, ScratchDrawer, ScratchEdgeTab } from '@/features/scratch';

const App = () => {
  return (
    <Router>
      <AppProviders>
        <AppInner />
      </AppProviders>
    </Router>
  );
}

const AppInner = () => {
  // routing — derived from the URL path; navigation just rewrites the location
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const route = useMemo(() => parseRoute(location, search), [location, search]);
  const onNavigate = useCallback((target: RouteInput) => setLocation(routePath(target)), [setLocation]);

  const { openEditor } = useVars();

  // scratchpad (lifted so the full view + drawer share one store)
  const [scratch, setScratch] = usePersistentState<ScratchData>(KEYS.scratch, { content: '', updatedAt: null });
  const [scratchOpen, setScratchOpen] = useState(false);

  // overlays
  const [cmdOpen, setCmdOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // keyboard: ⌘K palette, ⌘J scratch, Esc closes palette
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCmdOpen((open) => !open);
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        setScratchOpen((open) => !open);
      } else if (event.key === 'Escape') {
        setCmdOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // scroll to top on path change — but not when a jump is pending (ToolPage
  // scrolls to the matched command itself, so resetting would fight it)
  const pendingJump = route.view === 'tool' ? route.jump : undefined;
  useEffect(() => {
    if (pendingJump) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [location, pendingJump]);

  const renderView = () => {
    switch (route.view) {
      case 'tool':
        return <ToolPage slug={route.slug} jump={route.jump} scrollRef={scrollRef} />;
      case 'tools':
        return <ToolsBrowse />;
      case 'wordlists':
        return <WordlistGuide highlight={route.highlight} />;
      case 'revshell':
        return <RevShell />;
      case 'ports':
        return <PortsReference highlight={route.highlight} />;
      case 'scratch':
        return <Scratchpad data={scratch} setData={setScratch} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-canvas text-ink">
      <Sidebar route={route} onNavigate={onNavigate} onOpenCommand={() => setCmdOpen(true)} />

      <main className="flex h-full min-w-0 flex-1 flex-col bg-canvas">
        <div className="flex items-center justify-end gap-2 border-b border-hairline px-5 py-2.5">
          <GlobalVarsBar />
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderView()}
        </div>
      </main>

      <ScratchDrawer open={scratchOpen} onClose={() => setScratchOpen(false)} data={scratch} setData={setScratch} />
      <ScratchEdgeTab onClick={() => setScratchOpen(true)} hasNotes={!!scratch.content} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={onNavigate} onOpenVars={() => openEditor()} />
    </div>
  );
}

export default App;
