import type { LoaderArgs } from '@remix-run/node';
import { requireUser } from '~/lib/auth';
import { getUserMessage } from '~/lib/db-actions';
import { toUUID } from '~/lib/utils';
import type { MessageViewType } from '~/types/loader';

const allowed: MessageViewType[] = ['html', 'raw'];

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser({ request });
  const { message: messageLinkId, view } = params;

  if (!view || !allowed.includes(view as any) || !messageLinkId) {
    return null;
  }

  const message = await getUserMessage(toUUID(messageLinkId), user.id);
  if (!message) {
    return null;
  }

  const commonHeaders = {
    'Content-Security-Policy': 'sandbox allow-same-origin',
  };

  if (view === 'html') {
    return new Response(message.html, {
      status: 200,
      headers: new Headers({ ...commonHeaders, 'Content-Type': 'text/html' }),
    });
  }
  if (view === 'raw') {
    return new Response(message.raw, {
      status: 200,
      headers: new Headers({ ...commonHeaders, 'Content-Type': 'text/plain' }),
    });
  }
  // should never get here
  return null;
};
