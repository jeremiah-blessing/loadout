import { useEffect, useState } from 'react';
import { Dialog } from 'radix-ui';
import type { ScratchData } from '@/shared/types';
import { Icon, IconButton, PageHeader } from '@/shared/ui';

interface Props {
  data: ScratchData;
  setData: (d: ScratchData) => void;
  embedded?: boolean;
}

export const Scratchpad = ({ data, setData, embedded }: Props) => {
  const [saved, setSaved] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData({ content: e.target.value, updatedAt: Date.now() });
    setSaved(true);
  };

  useEffect(() => {
    if (!saved) return;
    const id = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(id);
  }, [saved, data.updatedAt]);

  const when = data.updatedAt ? new Date(data.updatedAt).toLocaleString() : null;

  return (
    <div
      className={`${embedded ? '' : 'lo-fade-in'} mx-auto flex h-full flex-col`}
      style={embedded ? { padding: 0 } : { maxWidth: 900, padding: '28px 32px 40px' }}
    >
      {!embedded && (
        <PageHeader
          icon="file"
          title="Scratchpad"
          subtitle="Loose working values — IPs, hashes, creds, output. Autosaves locally, survives reload."
          right={
            <span className={`inline-flex items-center gap-1.5 font-text text-xs ${saved ? 'text-success' : 'text-ink-tertiary'}`}>
              <Icon name={saved ? 'check' : 'rotate'} size={13} />
              {saved ? 'Saved' : when ? 'Saved ' + when : 'Empty'}
            </span>
          }
        />
      )}
      <textarea
        value={data.content}
        onChange={onChange}
        spellCheck={false}
        placeholder={'# nmap\n10.10.10.5 — ssh(22) http(80) smb(445)\n\n# creds\nadmin : Summer2024!\n\n# hashes\n…'}
        className="w-full flex-1 resize-none rounded-lg border border-hairline bg-surface-1 px-[18px] py-4 font-mono text-[13.5px] leading-[1.65] text-ink outline-none focus:border-hairline-strong"
        style={{ minHeight: embedded ? 0 : 360 }}
      />
    </div>
  );
}

interface ScratchDrawerProps {
  open: boolean;
  onClose: () => void;
  data: ScratchData;
  setData: (d: ScratchData) => void;
}

export const ScratchDrawer = ({ open, onClose, data, setData }: ScratchDrawerProps) => {
  const saved = data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[65] bg-[rgba(1,1,2,0.45)]" />
        <Dialog.Content className="lo-slide-in fixed right-0 top-0 z-[65] flex h-full w-[min(560px,92vw)] flex-col border-l border-hairline-strong bg-canvas shadow-overlay">
          <div className="flex items-center gap-2.5 border-b border-hairline px-4 py-3.5">
            <Icon name="file" size={16} className="text-lavender" />
            <div className="flex-1">
              <Dialog.Title className="font-display text-[15px] font-semibold tracking-[-0.2px] text-ink">Scratchpad</Dialog.Title>
              <Dialog.Description className="font-text text-[11.5px] text-ink-tertiary">{saved ? 'Saved ' + saved : 'Autosaves locally'}</Dialog.Description>
            </div>
            <span className="mr-1 inline-flex gap-0.5">
              {['⌘', 'J'].map((k, i) => (
                <kbd key={i} className="rounded-[3px] border border-hairline-strong bg-surface-2 px-1 py-px font-mono text-[10px] text-ink-subtle">
                  {k}
                </kbd>
              ))}
            </span>
            <IconButton label="Close" onClick={onClose}>
              <Icon name="x" size={16} />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 p-3.5">
            <Scratchpad data={data} setData={setData} embedded />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ScratchEdgeTabProps {
  onClick: () => void;
  hasNotes: boolean;
}

export const ScratchEdgeTab = ({ onClick, hasNotes }: ScratchEdgeTabProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Scratchpad (⌘J)"
      aria-label="Open scratchpad"
      className="fixed right-0 top-1/2 z-[58] inline-flex -translate-y-1/2 cursor-pointer items-center justify-center gap-2 rounded-l-md border border-r-0 border-hairline-strong bg-tab-bg px-2.25 py-2.5 text-ink-muted shadow-edge-tab transition-colors hover:bg-surface-3 [writing-mode:vertical-rl]"
    >
      <span className="relative inline-flex rotate-180">
        <Icon name="file" size={15} className="text-lavender" />
        {hasNotes && <span className="absolute -right-[3px] -top-0.5 h-[7px] w-[7px] rounded-full bg-placeholder" />}
      </span>
      <span className="font-text text-[12.5px] font-medium tracking-[0.3px]">Scratchpad</span>
    </button>
  );
}
