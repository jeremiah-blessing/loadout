import MiniSearch from 'minisearch';
import { TOOLS } from './tools';
import { WORDLISTS, PORTS } from './reference';

export type HitType = 'tool' | 'wordlist' | 'port';

export interface SearchDoc {
  id: string;
  type: HitType;
  // tool
  slug?: string;
  name?: string;
  category?: string;
  oneLiner?: string;
  body?: string;
  // wordlist
  useCase?: string;
  when?: string;
  path?: string;
  // port
  port?: number;
  service?: string;
  proto?: string;
  notes?: string;
  // index-only
  tags?: string;
}

export type SearchHit = SearchDoc & { score: number };

function buildDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const tool of TOOLS) {
    docs.push({
      id: 't:' + tool.slug,
      type: 'tool',
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
      oneLiner: tool.oneLiner,
      body: tool.body,
      tags: tool.tags.join(' '),
    });
  }

  for (const group of WORDLISTS) {
    for (const recommendation of group.recommendations) {
      docs.push({
        id: 'w:' + recommendation.name,
        type: 'wordlist',
        name: recommendation.name,
        useCase: group.useCase,
        when: recommendation.when,
        path: recommendation.path,
        tags: recommendation.tags.join(' '),
      });
    }
  }

  for (const port of PORTS) {
    docs.push({
      id: 'p:' + port.port,
      type: 'port',
      name: port.port + ' ' + port.service,
      port: port.port,
      service: port.service,
      proto: port.proto,
      notes: port.notes,
      tags: [port.port, port.service, port.proto].join(' '),
    });
  }

  return docs;
}

let mini: MiniSearch<SearchDoc> | null = null;

function index(): MiniSearch<SearchDoc> {
  if (mini) return mini;
  const miniSearch = new MiniSearch<SearchDoc>({
    idField: 'id',
    fields: ['name', 'tags', 'category', 'oneLiner', 'body', 'useCase', 'when', 'path', 'service', 'proto', 'notes'],
    storeFields: [
      'type', 'slug', 'name', 'category', 'oneLiner', 'body',
      'useCase', 'when', 'path', 'port', 'service', 'proto', 'notes',
    ],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'AND',
      boost: { name: 4, tags: 2, oneLiner: 1.5 },
    },
  });
  miniSearch.addAll(buildDocs());
  mini = miniSearch;
  return miniSearch;
}

export function search(query: string): SearchHit[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];
  return index().search(trimmedQuery) as unknown as SearchHit[];
}
