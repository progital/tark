import { createCookieSessionStorage } from '@remix-run/node';
import { decrypt, encrypt } from './encryption.server';
import { LOGIN_COOKIE_NAME, MAGIC_LINK_EXPIRATION_TIME } from '~/lib/constants';
import { getRequiredEnvVariable } from '~/lib/utils.server';

const loginInfoStorage = createCookieSessionStorage({
  cookie: {
    name: LOGIN_COOKIE_NAME,
    secure: true,
    secrets: [getRequiredEnvVariable('SESSION_SECRET')],
    sameSite: 'lax',
    path: '/',
    maxAge: MAGIC_LINK_EXPIRATION_TIME / 1000,
    httpOnly: true,
  },
});

async function getLoginSession(request: Request) {
  const session = await loginInfoStorage.getSession(
    request.headers.get('Cookie')
  );

  const commit = async () => {
    return await loginInfoStorage.commitSession(session);
  };

  return {
    getEmail: () => session.get('email') as string | undefined,
    setEmail: (email: string) => session.set('email', email),

    // NOTE: the magic link needs to be encrypted in the session because the
    // end user can access the cookie and see the plaintext magic link which
    // would allow them to login as any user 😬
    getMagicLink: () => {
      const link = session.get('magicLink') as string | undefined;
      if (!link) {
        return;
      }

      return decrypt(link);
    },
    hasMagicLink: () => {
      return session.has('magicLink');
    },
    setMagicLink: (magicLink: string) =>
      session.set('magicLink', encrypt(magicLink)),
    unsetMagicLink: () => session.unset('magicLink'),

    getError: () => session.get('error') as string | undefined,
    setFlashError: (error: string) => session.flash('error', error),

    clean: () => {
      session.unset('email');
      session.unset('magicLink');
      session.unset('error');
    },
    destroy: () => loginInfoStorage.destroySession(session),
    /**
     * This will initialize a Headers object if one is not provided.
     * It will convert input to the Headers instance
     * It will append the 'Set-Cookie' header value on that headers object.
     * It will then return that Headers object.
     */
    getHeaders: async (
      headersInit: ResponseInit['headers'] = new Headers()
    ) => {
      const value = await commit();
      let headers = headersInit;

      if (!(headers instanceof Headers)) {
        headers = new Headers(headersInit);
      }

      headers.append('Set-Cookie', value);

      return headers;
    },
  };
}

type LoginSessionType = Awaited<ReturnType<typeof getLoginSession>>;

export type { LoginSessionType };
export { getLoginSession };
