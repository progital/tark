import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { requireUser } from '~/lib/auth';
import { ROUTES } from '~/lib/constants';
import { updateUserData } from '~/lib/db-actions';
import { UserProfile } from '~/mui/page/Profile';

const updateUserSchema = z.object({
  userId: z.string(),
  userName: z.string(),
});

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser({ request });

  return json({ userId: user.id, userName: user.name, userEmail: user.email });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser({ request });
  const formPayload = Object.fromEntries(await request.formData());

  const result = updateUserSchema.safeParse(formPayload);
  if (!result.success) {
    return json({ error: 'Invalid form data' });
  }

  const submitted = result.data;
  if (user.id !== submitted.userId) {
    return json({ error: 'Invalid user id' });
  }
  try {
    await updateUserData(submitted.userId, { name: submitted.userName });

    return redirect(ROUTES.dashboard);
  } catch (e) {
    console.error('[update-user] failed', e);
    if (e instanceof Error) {
      return json({ error: e.message });
    }
    return json({ error: 'Updating user failed' });
  }
};

export default function ProfileRoute() {
  const userdata = useLoaderData<typeof loader>();
  const errordata = useActionData<typeof action>();

  return <UserProfile user={userdata} error={errordata?.error} />;
}
