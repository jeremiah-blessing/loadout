import type { FocusEvent, ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { Tooltip } from 'radix-ui';

type TriggerFocusProps = { onFocusCapture?: (e: FocusEvent<HTMLElement>) => void };

interface Props {
  label: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

/** Accessible hover/focus tooltip (Radix). Wrap any focusable element.
 * Requires a Tooltip.Provider ancestor (mounted once at the app root). */
export const Tip = ({
  label,
  side = 'bottom',
  children,
}: Props) => {
  // Radix opens tooltips on *any* focus, so when a Dialog/Popover/etc. auto-focuses
  // a Tip-wrapped control on open, its tooltip pops open unprompted. Swallow the focus
  // event in the capture phase before Radix's Trigger sees it, *unless* it's genuine
  // keyboard focus (:focus-visible) — so Tab navigation still surfaces tooltips.
  const trigger =
    isValidElement(children) ? (
      cloneElement(children as ReactElement<TriggerFocusProps>, {
        onFocusCapture: (e: FocusEvent<HTMLElement>) => {
          if (!(e.target as HTMLElement).matches?.(':focus-visible')) e.stopPropagation();
          (children as ReactElement<TriggerFocusProps>).props.onFocusCapture?.(e);
        },
      })
    ) : (
      children
    );

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={6}
          className="lo-fade-in z-[90] select-none rounded-md border border-hairline-strong bg-surface-2 px-2 py-1 font-text text-[11.5px] text-ink-muted"
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
