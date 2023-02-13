import type { User } from '@prisma/client';
import { redirect } from '@remix-run/node';
import {
  decrypt,
  encrypt,
  getLoginSession,
  getUserAndSession,
  getUserSession,
} from '~/lib/auth';
import type { LoginSessionType, UserSessionType } from '~/lib/auth';
import {
  APP_NAME_EMAIL,
  MAGIC_LINK_CALLBACK_ROUTE,
  MAGIC_LINK_EXPIRATION_TIME,
  MAGIC_LINK_SEARCH_PARAM,
  ROUTES,
} from '~/lib/constants';
import { createUser, getUserByEmail } from '~/lib/db-actions';
import { sendmail as sendmailExternal } from '~/lib/sendmail.server';
import { NEW_USER_SIGNUP, USER_LOGIN } from '~/lib/templates';
import { getDomainUrlFromRequest } from '~/lib/utils.server';

type AuthServiceArgs = {
  request: Request;
};

type SendMagicLinkArgs = {
  email: string;
  magicLink: string;
  user?: User | null;
  domain: string;
};

type AuthServiceType = (args: AuthServiceArgs) => Promise<{
  isAuthenticated: (options?: {
    failureCallback?: (session: LoginSessionType) => void | Promise<void>;
    successCallback?: (session: LoginSessionType) => void | Promise<void>;
    /** throws by default to avoid unathenticated users passing check by mistake */
    failureAlwaysThrows?: boolean;
  }) => Promise<User | null | void>;
  /** it's async because we may want to query db or some API */
  validateEmail: (email: string) => Promise<boolean>;
  sendMagicLinkEmail: (email: string) => Promise<void>;
  /** only signs in existing users if `createNew` is false */
  signInWithMagicLink: (args?: {
    createNew?: boolean;
  }) => Promise<UserSessionType | null>;
  session: LoginSessionType;
}>;

type GetMagicLinkArgs = {
  emailAddress: string;
  validateSessionMagicLink: boolean;
  domainUrl: string;
};

type MagicLinkPayload = {
  emailAddress: string;
  creationDate: string;
  validateSessionMagicLink: boolean;
};

export const authService: AuthServiceType = async ({ request }) => {
  const loginSession = await getLoginSession(request);
  const domain = getDomainUrlFromRequest(request);

  return {
    session: loginSession,
    isAuthenticated: async ({
      failureCallback,
      successCallback,
      failureAlwaysThrows = true,
    } = {}) => {
      const [user, userSession] = await getUserAndSession(request);
      if (user) {
        if (successCallback) {
          await successCallback(loginSession);
        }
        return user;
      }

      if (!user) {
        // cleanup
        await userSession.signOut();

        if (failureCallback) {
          await failureCallback(loginSession);
        }
        if (failureAlwaysThrows) {
          throw new Error('User not authorized');
        }
      }

      return user;
    },
    validateEmail: async (email: string) => {
      return /.+@.+/.test(email);
    },
    sendMagicLinkEmail: async (email: string) => {
      if (!domain) {
        throw new Error('Invalid domain');
      }

      const magicLink = generateMagicLink({
        emailAddress: email,
        validateSessionMagicLink: true,
        domainUrl: domain,
      });

      const user = await getUserByEmail(email);
      await sendMagicLinkEmail({ email, magicLink, user, domain });

      loginSession.setMagicLink(magicLink);
      loginSession.setEmail(email);
    },
    signInWithMagicLink: async ({ createNew } = {}) => {
      const email = validateMagicLink(request.url, loginSession.getMagicLink());
      const user = await getUserByEmail(email);

      if (!user && !createNew) {
        return null;
      }

      if (user) {
        const userSession = await getUserSession(request);
        await userSession.signIn(user);

        return userSession;
      }

      // creating new user
      const newUser = await createUser(email);
      const userSession = await getUserSession(request);
      await userSession.signIn(newUser);

      return userSession;
    },
  };
};

function generateMagicLink({
  emailAddress,
  validateSessionMagicLink = true,
  domainUrl,
}: GetMagicLinkArgs) {
  const payload: MagicLinkPayload = {
    emailAddress,
    validateSessionMagicLink,
    creationDate: new Date().toISOString(),
  };

  const stringToEncrypt = JSON.stringify(payload);
  const encryptedString = encrypt(stringToEncrypt);
  const url = new URL(domainUrl);
  url.pathname = MAGIC_LINK_CALLBACK_ROUTE;
  url.searchParams.set(MAGIC_LINK_SEARCH_PARAM, encryptedString);

  return url.toString();
}

function getMagicLinkCode(link: string) {
  try {
    const url = new URL(link);
    return url.searchParams.get(MAGIC_LINK_SEARCH_PARAM) ?? '';
  } catch {
    return '';
  }
}

function validateMagicLink(link: string, sessionMagicLink?: string) {
  const linkCode = getMagicLinkCode(link);
  const sessionLinkCode = sessionMagicLink
    ? getMagicLinkCode(sessionMagicLink)
    : null;

  let emailAddress, linkCreationDateString, validateSessionMagicLink;

  try {
    const decryptedString = decrypt(linkCode);
    const payload = JSON.parse(decryptedString) as MagicLinkPayload;
    emailAddress = payload.emailAddress;
    linkCreationDateString = payload.creationDate;
    validateSessionMagicLink = payload.validateSessionMagicLink;
  } catch (error) {
    console.error(error);
    throw new Error('Sign in link invalid. Please request a new one.');
  }

  if (typeof emailAddress !== 'string') {
    console.error(`Email is not a string. Maybe wasn't set in the session?`);
    throw new Error('Sign in link invalid. Please request a new one.');
  }

  if (validateSessionMagicLink) {
    if (!sessionLinkCode) {
      console.error(
        'Must validate session magic link but no session link provided'
      );
      throw new Error('Sign in link invalid. Please request a new one.');
    }
    if (linkCode !== sessionLinkCode) {
      console.error(`Magic link does not match sessionMagicLink`);
      throw new Error(
        `You must open the magic link on the same device it was created from for security reasons. Please request a new link.`
      );
    }
  }

  if (typeof linkCreationDateString !== 'string') {
    console.error('Link expiration is not a string.');
    throw new Error('Sign in link invalid. Please request a new one.');
  }

  const linkCreationDate = new Date(linkCreationDateString);
  const expirationTime =
    linkCreationDate.getTime() + MAGIC_LINK_EXPIRATION_TIME;
  if (Date.now() > expirationTime) {
    throw new Error('Magic link expired. Please request a new one.');
  }

  return emailAddress;
}

async function sendMagicLinkEmail({
  email,
  magicLink,
  user = null,
  domain,
}: SendMagicLinkArgs) {
  const { hostname } = new URL(domain);
  const userExists = !!user;

  await sendmailExternal({
    subject: userExists
      ? USER_LOGIN.subject({ appName: APP_NAME_EMAIL })
      : NEW_USER_SIGNUP.subject({ appName: APP_NAME_EMAIL }),
    to: email,
    text: userExists
      ? USER_LOGIN.text({ link: magicLink })
      : NEW_USER_SIGNUP.text({ link: magicLink, hostname }),
    html: userExists
      ? USER_LOGIN.html({ link: magicLink })
      : NEW_USER_SIGNUP.html({ link: magicLink, hostname }),
  });
}

async function requireUser(args: AuthServiceArgs) {
  const auth = await authService(args);

  const user = await auth.isAuthenticated({
    failureCallback: async () => {
      const userSession = await getUserSession(args.request);
      const headers = new Headers();
      await auth.session.getHeaders(headers);
      await userSession.getHeaders(headers);
      throw redirect(ROUTES.login, { headers });
    },
  });

  // sanity check
  if (!user) {
    throw redirect(ROUTES.login);
  }

  return user;
}

async function requireAdmin(args: AuthServiceArgs) {
  const user = await requireUser(args);

  if (user.role !== 'ADMIN') {
    throw redirect(ROUTES.dashboard);
  }

  return user;
}

export { requireUser, requireAdmin };
