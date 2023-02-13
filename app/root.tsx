import { withEmotionCache } from '@emotion/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import type { MetaFunction, LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { ClientOnly } from '~/lib/components/ClientOnly';
import { APP_TITLE } from '~/lib/constants';
import { useHydrated } from '~/lib/hooks';
import { removeOldHead } from '~/lib/hydration-fix/utils';
import { ClientStyleContext } from '~/mui/ClientStyleContext';
import { CatchScreen } from '~/mui/components/CatchScreen';
import { NotFound } from '~/mui/page/NotFound';

interface DocumentProps extends React.PropsWithChildren {
  title?: string;
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: APP_TITLE,
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => {
  return [
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      href: '/favicon-32x32.png',
      type: 'image/png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      href: '/favicon-16x16.png',
      type: 'image/png',
      sizes: '16x16',
    },
    {
      rel: 'icon',
      href: '/favicon.ico',
      type: 'image/x-icon',
    },
  ];
};

/**
 *  to work around the hydration issue, we split up the app into two parts. The <Head> part and the rest
 * @see {@link https://github.com/kiliman/remix-hydration-fix}
 * @see {@link https://github.com/remix-run/remix/discussions/5244}
 */
export function Head({ title }: { title?: string }) {
  const [renderHead, setRenderHead] = React.useState(false);
  const hydrated = useHydrated();

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!renderHead) {
      // trigger re-render so we can remove the old head
      setRenderHead(true);
      return;
    }
    removeOldHead(document.head);
  }, [renderHead, hydrated]);

  return (
    <>
      {title ? <title>{title}</title> : null}
      <Meta />
      <Links />
    </>
  );
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <ClientOnly>
          {() => createPortal(<Head title={title} />, document.head)}
        </ClientOnly>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </>
    );
  }
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <Document title={`${APP_TITLE} | ${caught.status}`}>
        <NotFound />
      </Document>
    );
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title={`${APP_TITLE} | Error`}>
      <CatchScreen componentTitle="h1" title={error.message}>
        {process.env.NODE_ENV === 'development' ? (
          <pre>{error.stack}</pre>
        ) : null}
        <p style={{ marginTop: '20px', fontWeight: 600 }}>
          <a href="/">Go back home</a> or open an issue on github
        </p>
      </CatchScreen>
    </Document>
  );
}
