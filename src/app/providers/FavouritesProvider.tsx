import { useMemo, type ReactNode } from 'react';
import { KEYS, usePersistentState } from '@/shared/lib/persistent-state';
import { FavouritesContext, type FavouritesContextValue } from '@/shared/lib/contexts';

/** Tools starred by default — a sensible starter loadout; the user changes these in real use. */
const DEFAULT_FAVS = ['nmap', 'ffuf', 'gobuster', 'smbclient'];

interface Props {
  children: ReactNode;
}

export const FavouritesProvider = ({ children }: Props) => {
  const [starred, setStarred] = usePersistentState<string[]>(KEYS.starred, DEFAULT_FAVS);

  const value = useMemo<FavouritesContextValue>(
    () => ({
      starred,
      isStarred: (slug: string) => starred.includes(slug),
      toggle: (slug: string) =>
        setStarred((current) =>
          current.includes(slug) ? current.filter((entry) => entry !== slug) : [...current, slug],
        ),
    }),
    [starred, setStarred],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}
