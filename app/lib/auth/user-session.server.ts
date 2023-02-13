import type { User } from '@prisma/client';
import { createCookieSessionStorage } from '@remix-run/node';
import {
  USER_SESSION_COOKIE_NAME,
  USER_SESSION_EXPIRATION_TIME,
} from '~/lib/constants';
import {
  createUserSession,
  deleteUserSession,
  getUserById,
  getUserFromSessionId,
  updateUserData,
} from '~/lib/db-actions';
import { getRequiredEnvVariable } from '~/lib/utils.server';

const sessionIdKey = '__magic_user_session_id__';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: USER_SESSION_COOKIE_NAME,
    secure: true,
    secrets: [getRequiredEnvVariable('SESSION_SECRET')],
    sameSite: 'lax',
    path: '/',
    maxAge: USER_SESSION_EXPIRATION_TIME / 1000,
    httpOnly: true,
  },
});

async function getUserSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  const getSessionId = () => session.get(sessionIdKey) as string | undefined;
  const unsetSessionId = () => session.unset(sessionIdKey);

  const commit = async () => {
    return await sessionStorage.commitSession(session);
  };

  return {
    getSessionId,

    signIn: async ({ id: userId }: { id: User['id'] }) => {
      const user = await getUserById(userId);
      if (!user || user.status === 'DISABLED') {
        throw new Error('User not found');
      }
      if (user.status === 'INVITED') {
        await updateUserData(userId, { status: 'ACTIVE' });
      }
      const userSession = await createUserSession(userId);
      session.set(sessionIdKey, userSession.id);
    },
    signOut: async () => {
      const sessionId = getSessionId();
      if (!sessionId) {
        return;
      }

      unsetSessionId();
      await deleteUserSession(sessionId).catch((error) => {
        console.error(`Failure deleting user session: `, error);
      });
    },

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

async function getUserAndSession(request: Request) {
  const session = await getUserSession(request);
  const token = session.getSessionId();

  if (!token) {
    return [null, session] as const;
  }

  const user = await getUserFromSessionId(token);

  if (!user) {
    console.error('Failure getting user from session ID');
  }

  return [user, session] as const;
}

type UserSessionType = Awaited<ReturnType<typeof getUserSession>>;

export type { UserSessionType };
export { getUserSession, getUserAndSession };
