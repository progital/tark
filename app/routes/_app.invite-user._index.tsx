import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { requireUser } from '~/lib/auth';
import { ROUTES } from '~/lib/constants';
import { inviteUser } from '~/lib/users.server';
import { InviteUserView } from '~/mui/InviteUser';

const inviteSchema = z.object({
  subject: z.string(),
  to: z.string().email(),
  text: z.string(),
  html: z.string(),
});

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser({ request });

  return json({ userId: user.id, userName: user.name, userEmail: user.email });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser({ request });
  const formPayload = Object.fromEntries(await request.formData());

  const result = inviteSchema.safeParse(formPayload);
  if (!result.success) {
    return json({ error: 'Invalid form data' });
  }

  const submitted = result.data;
  try {
    await inviteUser({
      to: submitted.to,
      subject: submitted.subject,
      text: submitted.text,
      html: submitted.html,
    });

    console.log('[invite-user] sent invite from', user.email);

    return redirect(ROUTES.dashboard);
  } catch (e) {
    console.error('[invite-user] failed', e);
    if (e instanceof Error) {
      return json({ error: e.message });
    }
    return json({ error: 'Sending the invite email failed' });
  }
};

export default function InviteUserIndexRoute() {
  const userdata = useLoaderData<typeof loader>();
  const errordata = useActionData<typeof action>();

  return <InviteUserView user={userdata} error={errordata?.error} />;
}
