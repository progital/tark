import type { Mailbox, Message, User } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/node';

export type MailboxesLoaderType = SerializeFrom<
  (Mailbox & {
    _count: {
      messages: number;
    };
  })[]
>;

/** we need to stay lean and omit message body and other heavy stuff */
export type LimitedMessage = Pick<
  Message,
  'from' | 'to' | 'createdAt' | 'subject' | 'id'
>;

export type LimitedUser = Pick<
  User,
  'id' | 'createdAt' | 'email' | 'name' | 'role' | 'status'
>;

export type MailboxLoaderType = SerializeFrom<
  Mailbox & {
    messages: LimitedMessage[];
    users: User[];
  }
>;

export type MessageViewType =
  | 'text'
  | 'html'
  // HTML markup
  | 'markup'
  // raw SMTP message
  | 'raw'
  // smtp-server session
  | 'session'
  // parsed smtp message
  | 'parsed';
