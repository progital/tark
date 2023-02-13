import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import type { UserSessionType } from '~/lib/auth';
import { authService } from '~/lib/auth';
import { ROUTES } from '~/lib/constants';
import { getErrorMessage } from '~/lib/utils';

export const loader = async ({ request }: LoaderArgs) => {
  const auth = await authService({ request });
  let userSession: UserSessionType | null;

  try {
    userSession = await auth.signInWithMagicLink({ createNew: true });
    if (!userSession) {
      throw new Error('Failed to sign in');
    }
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    console.error(error);
    auth.session.clean();
    auth.session.setFlashError(
      getErrorMessage(error, 'Sign in link invalid. Please request a new one.')
    );

    return redirect(ROUTES.login, {
      headers: await auth.session.getHeaders(),
    });
  }

  auth.session.clean();
  const headers = new Headers();
  await auth.session.getHeaders(headers);
  await userSession.getHeaders(headers);

  return redirect(ROUTES.dashboard, { headers });
};

export default function MagicRoute() {
  return null;
}
