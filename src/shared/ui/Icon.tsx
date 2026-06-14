import type { CSSProperties } from 'react';

const PATHS: Record<string, string> = {
  // --- core ---
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M21 21l-4.3-4.3',
  plus: 'M5 12h14 M12 5v14',
  x: 'M18 6 6 18 M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  chevronRight: 'm9 18 6-6-6-6',
  chevronDown: 'm6 9 6 6 6-6',
  chevronLeft: 'm15 18-6-6 6-6',
  settings:
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  star:
    'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
  zap: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
  // --- loadout additions ---
  terminal: 'm4 17 6-6-6-6 M12 19h8',
  copy: 'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  server:
    'M4 4h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M4 14h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z M6.5 7h.01 M6.5 17h.01',
  key: 'm15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L21 4 M21 2l-9.6 9.6 M15.5 7.5 3 20a2.12 2.12 0 1 0 3 3L18.5 10.5',
  globe:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  hash: 'M4 9h16 M4 15h16 M10 3 8 21 M16 3l-2 18',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h6 M9 9h1',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10 M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4',
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  pencil: 'M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z',
  rotate: 'M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5',
  play: 'M6 3l14 9-14 9V3z',
  pause: 'M9 4v16 M15 4v16',
  flag: 'M4 22V4 M4 4h13l-1.8 4 1.8 4H4',
  flagOff: 'M4 22V4 M4 4h13l-1.8 4 1.8 4h-7',
  list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  code: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  bookOpen:
    'M12 7v14 M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
  enter: 'M20 4v7a4 4 0 0 1-4 4H4 M9 10l-5 5 5 5',
  wifi: 'M5 12.55a11 11 0 0 1 14 0 M8.5 16.4a6 6 0 0 1 7 0 M2 8.82a15 15 0 0 1 20 0 M12 20h.01',
  scan: 'M3 7V5a2 2 0 0 1 2-2h2 M17 3h2a2 2 0 0 1 2 2v2 M21 17v2a2 2 0 0 1-2 2h-2 M7 21H5a2 2 0 0 1-2-2v-2 M7 12h10',
  sliders: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M2 14h4 M10 8h4 M18 16h4',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 16v-4 M12 8h.01',
  // --- shell-picker glyphs ---
  bash: 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M7 9l3 3-3 3 M12.5 15H16',
  powershell:
    'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M7.5 8.5 11 12l-3.5 3.5 M11.5 15.5H16',
  plug: 'M9 2v5 M15 2v5 M7 7h10v4a5 5 0 0 1-10 0z M12 16v6',
  gem: 'M6 3h12l3 6-9 12L3 9z M3 9h18 M8 3l-2 6 6 12 M16 3l2 6-6 12',
  python:
    'M8 5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3a2 2 0 0 1-2 2H8a3 3 0 0 0-3 3 M16 19a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-3a2 2 0 0 1 2-2h6a3 3 0 0 0 3-3 M10.5 6h.01 M13.5 18h.01',
  perl: 'M20 13a6 6 0 0 0-8.49-8.49L4 12v7h7z M16 9 4 21 M16 13H9',
  php: 'M8 4H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1 M16 20h1a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2 2 2 0 0 1-2-2V6a2 2 0 0 0-2-2h-1 M9 12h.5 M14.5 12h.5',
  // --- tool / category glyphs ---
  network:
    'M9 2h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M2 17h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z M16 17h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z M12 7v8 M5 17v-2h14v2',
  lock: 'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z M8 11V7a4 4 0 0 1 8 0v4',
  database:
    'M12 3a9 3 0 1 0 0 6 9 3 0 0 0 0-6 M3 6v6a9 3 0 0 0 18 0V6 M3 12v6a9 3 0 0 0 18 0v-6',
  shield: 'M12 22c4.5-1.5 8-5 8-10V5l-8-3-8 3v7c0 5 3.5 8.5 8 10z',
};

export interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  /** Fill colour for the path — set to "currentColor" for solid glyphs (e.g. an active star). */
  fill?: string;
  className?: string;
  style?: CSSProperties;
}

export const Icon = ({ name, size = 16, strokeWidth = 1.75, fill = 'none', className, style }: IconProps) => {
  const d = PATHS[name] || '';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: '0 0 auto', display: 'block', ...style }}
      aria-hidden
    >
      {d.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : 'M' + seg} />
      ))}
    </svg>
  );
}
