import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { requireUser } from '~/lib/auth';
import { ROUTES } from '~/lib/constants';
import {
  connectMailbox,
  disconnectMailbox,
  getAllUsers,
  getUserMailbox,
  updateMailbox,
} from '~/lib/db-actions';
import { filterValidUsers, toUUID } from '~/lib/utils';
import { ErrorScreen } from '~/mui/components/ErrorScreen';
import { MailboxSettings } from '~/mui/Mailbox';

// *LinkId means short UUID
const renameSchema = z.object({
  mailboxLinkId: z.string(),
  name: z.string(),
});

// *LinkId means short UUID
const shareSchema = z.object({
  mailboxLinkId: z.string(),
  shareWithUserLinkId: z.string(),
});

// *LinkId means short UUID
const disconnectSchema = z.object({
  mailboxLinkId: z.string(),
  userLinkId: z.string(),
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser({ request });
  let mailbox = null;
  if (params.id) {
    mailbox = await getUserMailbox(toUUID(params.id), user.id);
  }
  // TODO review how we fetch users
  const users = filterValidUsers(await getAllUsers());

  return json({ userId: user.id, mailbox, users });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser({ request });
  const { _action, ...formPayload } = Object.fromEntries(
    await request.formData()
  );

  if (!_action) {
    return null;
  }

  let result;
  let submitted;
  switch (_action) {
    case '_rename':
      result = renameSchema.safeParse(formPayload);
      if (!result.success) {
        return json({ error: `Invalid input` });
      }

      submitted = result.data;
      await updateMailbox(toUUID(submitted.mailboxLinkId), user.id, {
        name: submitted.name,
      });
      break;

    case '_share':
      result = shareSchema.safeParse(formPayload);
      if (!result.success) {
        return json({ error: `Invalid input` });
      }

      submitted = result.data;
      await connectMailbox(
        toUUID(submitted.mailboxLinkId),
        toUUID(submitted.shareWithUserLinkId)
      );
      break;

    case '_disconnect':
      result = disconnectSchema.safeParse(formPayload);
      if (!result.success) {
        return json({ error: `Invalid input` });
      }

      submitted = result.data;
      const removedUserId = toUUID(submitted.userLinkId);
      await disconnectMailbox(toUUID(submitted.mailboxLinkId), removedUserId);

      // redirected to dashboard if we remove access for ourselves
      if (user.id === removedUserId) {
        return redirect(ROUTES.dashboard);
      }
      break;
  }

  return null;
};

export default function DashboardMailboxSettingsRoute() {
  const data = useLoaderData<typeof loader>();
  // TODO typing not helpful here
  const actionData: any = useActionData<typeof action>();

  if (!data.mailbox) {
    return <ErrorScreen component="h1">No mailbox found</ErrorScreen>;
  }

  return (
    <MailboxSettings
      mailbox={data.mailbox}
      users={data.users}
      userId={data.userId}
      error={actionData?.error}
    />
  );
}
