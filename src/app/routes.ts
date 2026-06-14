/* Loadout — URL <-> Route mapping for the wouter browser-history router.
 * Paths like /tool/nmap are real URLs. Because the app is served statically
 * (GitHub Pages target), deep links / reloads rely on the SPA 404 fallback in
 * public/404.html + the decoder snippet in index.html to reach index.html.
 * Transient UI params (jump = search term to scroll to, highlight = row to
 * flash) ride in the query. */

import type { Route, RouteInput } from '@/shared/types';

/** Build the hash path (with query) for a navigation target. */
export function routePath(route: RouteInput): string {
  switch (route.view) {
    case 'tool':
      return `/tool/${route.slug}${route.jump ? `?jump=${encodeURIComponent(route.jump)}` : ''}`;
    case 'tools':
      return '/tools';
    case 'wordlists':
      return `/wordlists${route.highlight ? `?highlight=${encodeURIComponent(route.highlight)}` : ''}`;
    case 'revshell':
      return '/revshell';
    case 'ports':
      return `/ports${route.highlight != null ? `?highlight=${route.highlight}` : ''}`;
    case 'scratch':
      return '/scratch';
  }
}

/** Derive the current Route from the location path + raw query string.
 * Tolerates the query living either in location.search (the normal case) or
 * inline in the path (a hand-built "/ports?highlight=1"). */
export function parseRoute(path: string, search: string): Route {
  let pathname = path;
  if (pathname.includes('?')) {
    const [basePath, inlineSearch] = pathname.split('?');
    pathname = basePath;
    if (!search) search = inlineSearch;
  }
  const searchParams = new URLSearchParams(search);
  const segments = pathname.split('/').filter(Boolean);
  switch (segments[0]) {
    case 'tools':
      return { view: 'tools' };
    case 'wordlists':
      return { view: 'wordlists', highlight: searchParams.get('highlight') || undefined };
    case 'revshell':
      return { view: 'revshell' };
    case 'ports': {
      const highlightParam = searchParams.get('highlight');
      return { view: 'ports', highlight: highlightParam ? Number(highlightParam) : undefined };
    }
    case 'scratch':
      return { view: 'scratch' };
    case 'tool':
      return { view: 'tool', slug: segments[1] || 'nmap', jump: searchParams.get('jump') || undefined };
    default:
      // Bare "/" (and any unknown path) lands on the tools browse view.
      return { view: 'tools' };
  }
}
