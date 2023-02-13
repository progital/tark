import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { RemixBrowser } from '@remix-run/react';
import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ClientStyleContext } from '~/mui/ClientStyleContext';
import { createEmotionCache } from '~/mui/createEmotionCache';
import { theme } from '~/mui/theme';

interface ClientCacheProviderProps {
  children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = React.useState(createEmotionCache());

  const clientStyleContextValue = React.useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    []
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document.getElementById('root')!,
      <ClientCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RemixBrowser />
        </ThemeProvider>
      </ClientCacheProvider>
    );
  });
}

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
