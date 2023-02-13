import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Response } from '@remix-run/node';
import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { switchRootComponent } from '~/lib/hydration-fix/utils';
import { createEmotionCache } from '~/mui/createEmotionCache';
import { theme } from '~/mui/theme';
import { Head } from '~/root';

function MuiRemixServer({
  context,
  request,
  cache,
}: {
  context: EntryContext;
  request: Request;
  cache: EmotionCache;
}) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RemixServer context={context} url={request.url} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // create new context renders only <Head> and does not render errors
  const headContext = switchRootComponent(remixContext, Head);
  const head = renderToString(
    <MuiRemixServer context={headContext} request={request} cache={cache} />
  );

  // Render the component to a string.
  const html = renderToString(
    <MuiRemixServer context={remixContext} request={request} cache={cache} />
  );

  // Grab the CSS from emotion
  const { styles } = extractCriticalToChunks(html);

  let stylesHTML = '';

  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`;
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
    stylesHTML = `${stylesHTML}${newStyleTag}`;
  });

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
      ${stylesHTML}
      <!--start head-->
        ${head}
      <!--end head-->
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>`,
    {
      status: responseStatusCode,
      headers: responseHeaders,
    }
  );
}
