import { Tip } from './Tip';
import { Icon } from './Icon';

/** Favourite toggle — a star that fills lavender when active. Stops click
 * propagation so it can sit inside (or over) a clickable card/row. */
interface Props {
  active: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

export const StarButton = ({
  active,
  onToggle,
  size = 16,
  className = '',
}: Props) => {
  const label = active ? 'Unpin from favourites' : 'Add to favourites';
  return (
    <Tip label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className={`inline-flex flex-none cursor-pointer items-center justify-center rounded-md p-1 transition-colors hover:bg-surface-2 ${
          active ? 'text-lavender' : 'text-ink-tertiary hover:text-ink-subtle'
        } ${className}`}
      >
        <Icon name="star" size={size} fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 1.5 : 1.75} />
      </button>
    </Tip>
  );
}
