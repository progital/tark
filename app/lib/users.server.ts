import { createUser, getUserByEmail } from '~/lib/db-actions';
import { sendmail as sendmailExternal } from '~/lib/sendmail.server';

async function inviteUser({
  to,
  subject,
  text,
  html,
}: Parameters<typeof sendmailExternal>[0]) {
  // check if we already have this user
  const haveUser = await getUserByEmail(to);
  if (haveUser) {
    throw new Error('User with this email already exists');
  }

  await sendmailExternal({
    to,
    subject,
    text,
    html,
  });
  await createUser(to, { status: 'INVITED' });
}

export { inviteUser };
