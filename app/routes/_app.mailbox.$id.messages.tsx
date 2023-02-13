import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { requireUser } from '~/lib/auth';
import { ROUTES } from '~/lib/constants';
import { deleteUserMessage, getUserMailbox } from '~/lib/db-actions';
import { toUUID } from '~/lib/utils';
import { ErrorScreen } from '~/mui/components/ErrorScreen';
import { MailboxView } from '~/mui/Mailbox';

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser({ request });
  let mailbox = null;
  if (params.id) {
    mailbox = await getUserMailbox(toUUID(params.id), user.id);
  }

  return json({
    userId: user.id,
    mailbox,
    ...(mailbox
      ? {
          navbarAction: {
            action: 'back',
            args: { to: ROUTES.dashboard, label: mailbox?.name ?? '' },
          },
          navbarNavItem: {
            name: mailbox.name,
          },
        }
      : undefined),
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  console.log('params', params);
  const user = await requireUser({ request });
  const { _action, messageLinkId } = Object.fromEntries(
    await request.formData()
  );

  if (_action !== '_delete' || typeof messageLinkId !== 'string') {
    return null;
  }

  try {
    await deleteUserMessage(toUUID(messageLinkId), user.id);
    return redirect(`/mailbox/${params.id}/messages`);
  } catch (err) {
    return json({
      error: err instanceof Error ? err.message : 'Failed to delete message',
    });
  }
};

export default function DashboardMailboxLayoutRoute() {
  const data = useLoaderData<typeof loader>();

  if (!data.mailbox) {
    return <ErrorScreen component="h1">No mailbox found</ErrorScreen>;
  }

  return (
    <MailboxView mailbox={data.mailbox}>
      <Outlet />
    </MailboxView>
  );
}
