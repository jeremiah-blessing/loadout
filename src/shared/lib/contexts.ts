/* Shared React context definitions + hooks. These live in shared/ so any layer
 * may consume them; the matching providers (which own the state) live in
 * app/providers/. */

import { createContext, useContext } from 'react';
import type { Theme, Vars } from '@/shared/types';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

export interface VarsContextValue {
  vars: Vars;
  setVar: (name: string, val: string) => void;
  openEditor: (name?: string) => void;
}

export const VarsContext = createContext<VarsContextValue | null>(null);

export function useVars(): VarsContextValue {
  const context = useContext(VarsContext);
  return context ?? { vars: {}, setVar: () => {}, openEditor: () => {} };
}

export interface FavouritesContextValue {
  starred: string[];
  isStarred: (slug: string) => boolean;
  toggle: (slug: string) => void;
}

export const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function useFavourites(): FavouritesContextValue {
  const context = useContext(FavouritesContext);
  return context ?? { starred: [], isStarred: () => false, toggle: () => {} };
}
