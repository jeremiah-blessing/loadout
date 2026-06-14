import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'radix-ui';
import { CORE_VARS } from '@/shared/lib/tokens';
import { useVars } from '@/shared/lib/contexts';
import type { Vars } from '@/shared/types';
import { Icon, Button, IconButton } from '@/shared/ui';

interface VarMeta {
  icon: string;
  hint: string;
  placeholder: string;
}

function varMeta(name: string): VarMeta {
  const M: Record<string, VarMeta> = {
    TARGET: { icon: 'scan', hint: '10.10.10.5 or host.tld', placeholder: 'target host/IP' },
    LHOST: { icon: 'wifi', hint: 'your tun0 / attacker IP', placeholder: 'your IP' },
    LPORT: { icon: 'hash', hint: 'listener port', placeholder: 'port' },
    WORDLIST: { icon: 'list', hint: 'path to a wordlist', placeholder: 'wordlist path' },
  };
  return M[name] || { icon: 'hash', hint: 'custom value', placeholder: 'value' };
}

/* Compact bar — the "Variables N/4" pill. */
export const GlobalVarsBar = () => {
  const { vars, openEditor } = useVars();
  const setCount = CORE_VARS.filter((n) => vars[n]).length;
  return (
    <button
      type="button"
      onClick={() => openEditor()}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-hairline-strong bg-surface-1 px-2.5 py-1.5 font-text text-[13px] text-ink-muted transition-colors hover:bg-surface-2"
    >
      <Icon name="hash" size={14} className="text-ink-subtle" />
      <span>Variables</span>
      <span className="rounded-xs bg-surface-3 px-1.5 py-px font-mono text-[11px] text-ink-subtle">
        {setCount}/{CORE_VARS.length}
      </span>
    </button>
  );
}

interface Props {
  open: boolean;
  focusVar: string | null;
  vars: Vars;
  setVar: (name: string, val: string) => void;
  customVars: string[];
  addCustom: (name: string) => void;
  removeCustom: (name: string) => void;
  onClose: () => void;
}

export const VarsEditorModal = ({ open, focusVar, vars, setVar, customVars, addCustom, removeCustom, onClose }: Props) => {
  const firstRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState('');

  // Focus a specific variable when the modal is opened via a click-to-edit token,
  // including when focusVar changes while the modal is already open.
  useEffect(() => {
    if (open && focusVar && firstRef.current) {
      firstRef.current.focus();
      firstRef.current.select();
    }
  }, [open, focusVar]);

  const names = [...CORE_VARS, ...customVars];

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[rgba(1,1,2,0.6)] backdrop-blur-[2px]" />
        <Dialog.Content
          onOpenAutoFocus={(e) => { if (focusVar) e.preventDefault(); }}
          className="lo-scale-in fixed left-1/2 top-[12vh] z-[60] flex max-h-[76vh] w-[min(94vw,520px)] -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-hairline-strong bg-surface-1 shadow-overlay"
        >
          <div className="flex items-center gap-2.5 border-b border-hairline px-4 py-3.5">
            <Icon name="hash" size={16} className="text-lavender" />
            <div className="flex-1">
              <Dialog.Title className="font-display text-[15px] font-semibold tracking-[-0.2px] text-ink">Engagement variables</Dialog.Title>
              <Dialog.Description className="font-text text-xs text-ink-subtle">Set once — every command fills in live.</Dialog.Description>
            </div>
            <IconButton label="Close" onClick={onClose}>
              <Icon name="x" size={16} />
            </IconButton>
          </div>

        <div className="flex flex-col gap-3.5 overflow-y-auto p-4">
          {names.map((n) => {
            const meta = varMeta(n);
            const isCustom = !(CORE_VARS as readonly string[]).includes(n);
            const focused = focusVar === n;
            return (
              <div key={n} className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-2">
                  <label className="font-mono text-xs font-medium tracking-[0.3px] text-ink">{n}</label>
                  <span className="flex-1 font-text text-[11.5px] text-ink-tertiary">{meta.hint}</span>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => removeCustom(n)}
                      title="Remove variable"
                      className="inline-flex cursor-pointer border-none bg-transparent p-0.5 text-ink-tertiary hover:text-danger"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  )}
                </div>
                <div
                  className={`flex h-9 items-center gap-2 rounded-md border bg-surface-2 px-3 ${
                    focused ? 'border-lavender-focus shadow-focus' : 'border-hairline-strong'
                  }`}
                >
                  <Icon name={meta.icon} size={14} className="text-ink-subtle" />
                  <input
                    ref={focused ? firstRef : null}
                    value={vars[n] || ''}
                    placeholder={meta.placeholder}
                    onChange={(e) => setVar(n, e.target.value)}
                    className="min-w-0 flex-1 border-none bg-transparent font-mono text-[13px] text-ink outline-none"
                  />
                  {vars[n] && (
                    <button
                      type="button"
                      onClick={() => setVar(n, '')}
                      title="Clear"
                      className="inline-flex cursor-pointer border-none bg-transparent p-0.5 text-ink-tertiary"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-2 border-t border-hairline pt-3.5">
            <div className="flex h-[34px] flex-1 items-center rounded-md border border-hairline-strong bg-surface-2 px-3">
              <Icon name="plus" size={13} className="mr-2 text-ink-subtle" />
              <input
                value={newName}
                placeholder="ADD CUSTOM VARIABLE (e.g. DB, USER)"
                onChange={(e) => setNewName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newName) {
                    addCustom(newName);
                    setNewName('');
                  }
                }}
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[12.5px] tracking-[0.3px] text-ink outline-none"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={!newName}
              onClick={() => {
                if (newName) {
                  addCustom(newName);
                  setNewName('');
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
