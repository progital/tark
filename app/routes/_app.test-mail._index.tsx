import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { requireAdmin } from '~/lib/auth';
import { getUserMailboxes } from '~/lib/db-actions';
import { sendmailTestWithAuth } from '~/lib/test-mail/sendmailTest.server';
import { TestMailView } from '~/mui/page/TestMail';

const testEmailSchema = z.object({
  email: z.string(),
  subject: z.string(),
  from: z.string().email(),
  to: z.string().email(),
  mailbox: z.string(),
  html: z.string(),
});

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAdmin({ request });
  const mailboxes = await getUserMailboxes(user.id);

  return json({ mailboxes, email: user.email });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAdmin({ request });
  const mailboxes = await getUserMailboxes(user.id);
  const formPayload = Object.fromEntries(await request.formData());

  const result = testEmailSchema.safeParse(formPayload);
  if (!result.success) {
    return json({ error: 'Invalid test email data' });
  }

  const { email, from, to, mailbox: mailboxName, subject, html } = result.data;
  const wrongUsername = 'wrong-username';
  const wrongPassword = 'wrong-password';

  let password: string | null = null;
  let username: string | null = null;

  if (mailboxName === 'no-mailbox' || !mailboxes.length) {
    password = wrongPassword;
    username = wrongUsername;
  }

  if (mailboxName === 'wrong-password') {
    password = wrongPassword;
    username = mailboxes?.[0]?.username ?? wrongUsername;
  }

  if (!username || !password) {
    const mailbox = mailboxes.find((elem) => elem.username === mailboxName);
    password = mailbox?.password ?? wrongPassword;
    username = mailbox?.username ?? wrongUsername;
  }

  await sendmailTestWithAuth(
    {
      to,
      from,
      subject: subject,
      text: email,
      html,
    },
    { pass: password, user: username }
  ).catch((err) => {
    console.error('[test-mail] sendmail exception', err);
    return json({ error: `sendmail failed with ${err.message}` });
  });

  return null;
};

export default function TestMailIndex() {
  const data = useLoaderData<typeof loader>();
  // TODO have some typing issue here
  const actionData: any = useActionData<typeof action>();

  return <TestMailView {...data} error={actionData?.error} />;
}
