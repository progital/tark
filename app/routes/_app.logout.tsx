import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getUserSession } from '~/lib/auth';
import { ROUTES } from '~/lib/constants';

// not to be accessed directly
export const loader = async () => {
  return redirect(ROUTES.landing);
};

export const action = async ({ request }: ActionArgs) => {
  const session = await getUserSession(request);
  await session.signOut();

  return redirect(ROUTES.landing, {
    headers: await session.getHeaders(),
  });
};
