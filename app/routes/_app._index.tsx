import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUser } from '~/lib/auth';
import {
  createMailbox,
  deleteMailbox,
  getUserMailboxes,
} from '~/lib/db-actions';
import { toUUID } from '~/lib/utils';
import { Mailboxes } from '~/mui/Mailboxes';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser({ request });
  const mailboxes = await getUserMailboxes(user.id);

  return json({ userId: user.id, name: user.name, mailboxes });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser({ request });
  const { _action, ...formPayload } = Object.fromEntries(
    await request.formData()
  );

  if (!_action) {
    return null;
  }

  switch (_action) {
    case '_delete':
      if (typeof formPayload?.mailboxLinkId === 'string') {
        await deleteMailbox(toUUID(formPayload.mailboxLinkId), user.id);
      }
      break;

    case '_create-new':
      await createMailbox(user.id);
      break;
  }

  return null;
};

export default function DashboardIndexRoute() {
  const { mailboxes, userId } = useLoaderData<typeof loader>();

  return <Mailboxes mailboxes={mailboxes} userId={userId} />;
}
