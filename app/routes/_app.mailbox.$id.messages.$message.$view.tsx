import type { Message } from '@prisma/client';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUser } from '~/lib/auth';
import { getUserMessage } from '~/lib/db-actions';
import { toUUID } from '~/lib/utils';
import { Iframe } from '~/mui/components/Iframe';
import { MessageContentView } from '~/mui/components/MessageContentView';
import type { MessageViewType } from '~/types/loader';

const mapFields: { [key in MessageViewType]: keyof Message } = {
  text: 'text',
  html: 'html',
  markup: 'html',
  raw: 'raw',
  session: 'smtpSession',
  parsed: 'body',
};

const iframeFields: MessageViewType[] = ['html', 'raw'];

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser({ request });
  const { message: messageLinkId, view } = params;
  const viewId = view as MessageViewType;

  if (!viewId || !messageLinkId) {
    return json({ field: null });
  }

  const message = await getUserMessage(toUUID(messageLinkId), user.id);
  const viewKey = mapFields[viewId];
  if (!message || !viewKey) {
    return json({ error: 'Message not found', field: null });
  }

  const navbarNavItem = {
    name: message?.subject,
  };

  if (iframeFields.includes(viewId)) {
    return json({
      field: 'iframe',
      messageLinkId,
      viewId,
      navbarNavItem,
    });
  }

  return json({
    field: message[viewKey],
    viewId,
    navbarNavItem,
  });
};

export default function MailboxMessageTextRoute() {
  const {
    field,
    viewId,
    messageLinkId,
  }: {
    field?: string;
    viewId?: MessageViewType;
    error?: string;
    messageLinkId?: string;
  } = useLoaderData();

  if (!field || !viewId) {
    return 'Nothing to display';
  }

  if (viewId === 'html') {
    return (
      <Iframe
        title="Message source HTML"
        src={`/rsc/messages/${messageLinkId}/html`}
      />
    );
  }

  if (viewId === 'raw') {
    return (
      <Iframe
        title="Message raw content"
        src={`/rsc/messages/${messageLinkId}/raw`}
      />
    );
  }

  if (viewId === 'session' || viewId === 'parsed') {
    return (
      <MessageContentView bgcolor="neutral.100" key={viewId}>
        {JSON.stringify(JSON.parse(field), null, 2)}
      </MessageContentView>
    );
  }

  // text, markup
  return (
    <MessageContentView
      key={viewId}
      bgcolor={viewId === 'markup' ? 'neutral.100' : undefined}
    >
      {field}
    </MessageContentView>
  );
}
