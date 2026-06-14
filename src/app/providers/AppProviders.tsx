import type { ReactNode } from 'react';
import { Tooltip } from 'radix-ui';
import { ThemeProvider } from './ThemeProvider';
import { VarsProvider } from './VarsProvider';
import { FavouritesProvider } from './FavouritesProvider';

interface Props {
  children: ReactNode;
}

/** Composes every app-wide provider in one place so App stays declarative. */
export const AppProviders = ({ children }: Props) => {
  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={300}>
      <ThemeProvider>
        <VarsProvider>
          <FavouritesProvider>{children}</FavouritesProvider>
        </VarsProvider>
      </ThemeProvider>
    </Tooltip.Provider>
  );
}
