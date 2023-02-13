import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUser } from '~/lib/auth';
import { getUserMailbox } from '~/lib/db-actions';
import { toUUID } from '~/lib/utils';
import { ErrorScreen } from '~/mui/components/ErrorScreen';
import { MailboxInfo } from '~/mui/Mailbox';

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser({ request });
  let mailbox = null;
  if (params.id) {
    mailbox = await getUserMailbox(toUUID(params.id), user.id);
  }

  return json({ userId: user.id, mailbox });
};

export default function DashboardMailboxInfoRoute() {
  const data = useLoaderData<typeof loader>();

  if (!data.mailbox) {
    return <ErrorScreen component="h1">No mailbox found</ErrorScreen>;
  }

  return <MailboxInfo mailbox={data.mailbox} />;
}
