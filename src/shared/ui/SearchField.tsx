import { useState } from 'react';
import { Icon } from './Icon';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}

export const SearchField = ({
  value,
  onChange,
  placeholder,
  width = 260,
}: Props) => {
  const [focus, setFocus] = useState(false);
  return (
    <div
      style={{ width }}
      className={`flex h-9 items-center gap-2 rounded-md border bg-surface-1 px-3 transition-[border-color,box-shadow] ${
        focus ? 'border-lavender-focus shadow-focus' : 'border-hairline-strong'
      }`}
    >
      <Icon name="search" size={15} className="flex-none text-ink-subtle" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="min-w-0 flex-1 border-none bg-transparent font-text text-sm text-ink outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="inline-flex cursor-pointer border-none bg-transparent p-0 text-ink-tertiary"
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
