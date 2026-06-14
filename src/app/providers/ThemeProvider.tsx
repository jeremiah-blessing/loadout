import { useEffect, useMemo, type ReactNode } from 'react';
import { KEYS, usePersistentState } from '@/shared/lib/persistent-state';
import { ThemeContext } from '@/shared/lib/contexts';
import type { Theme } from '@/shared/types';

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = usePersistentState<Theme>(KEYS.theme, 'dark');

  // Reflect the active theme on <html> so the light-mode token overrides apply.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
