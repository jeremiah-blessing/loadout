import { useState } from 'react';
import { PORTS } from '@/shared/content/reference';
import { PageHeader, SearchField } from '@/shared/ui';

interface Props {
  highlight?: number;
}

export const PortsReference = ({ highlight }: Props) => {
  const [q, setQ] = useState('');
  const ql = q.toLowerCase();
  const rows = PORTS.filter(
    (p) => !ql || (p.port + ' ' + p.service + ' ' + p.proto + ' ' + p.notes + ' ' + p.tools.join(' ')).toLowerCase().includes(ql),
  );

  const head = 'sticky top-0 border-b border-hairline bg-canvas px-3.5 py-2.5 text-left font-text text-[11px] font-medium uppercase tracking-[0.4px] text-ink-tertiary';
  const cell = 'px-3.5 py-[11px] align-top font-text text-[13px] leading-[1.45] text-ink-muted';

  return (
    <div className="lo-fade-in mx-auto" style={{ maxWidth: 1000, padding: '28px 32px 80px' }}>
      <PageHeader
        icon="server"
        title="Ports & services"
        subtitle="Unfamiliar port? Find the service and what to try next."
        right={<SearchField value={q} onChange={setQ} placeholder="Search port, service, tool…" />}
      />

      <div className="overflow-hidden rounded-lg border border-hairline bg-surface-1">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={head} style={{ width: 70 }}>Port</th>
              <th className={head} style={{ width: 70 }}>Proto</th>
              <th className={head} style={{ width: 130 }}>Service</th>
              <th className={head}>What to try next</th>
              <th className={head} style={{ width: 180 }}>Tools</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr
                key={p.port + p.service}
                className={`${i ? 'border-t border-hairline' : ''} ${highlight === p.port ? 'lo-jump-flash bg-surface-2' : ''}`}
              >
                <td className={`${cell} font-mono text-[13.5px] font-medium text-lavender`}>{p.port}</td>
                <td className={`${cell} font-mono text-xs text-ink-tertiary`}>{p.proto}</td>
                <td className={`${cell} font-medium text-ink`}>{p.service}</td>
                <td className={`${cell} text-pretty`}>{p.notes}</td>
                <td className={cell}>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tools.map((t) => (
                      <span key={t} className="rounded-xs bg-surface-3 px-1.5 py-0.5 font-mono text-[11px] text-ink-subtle">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="p-10 text-center font-text text-ink-tertiary">No ports match.</div>}
      </div>
    </div>
  );
}
