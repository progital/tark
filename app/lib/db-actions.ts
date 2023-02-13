import type { Mailbox, Message, Session, User } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import {
  USER_SESSION_EXPIRATION_TIME,
  USER_SESSION_AUTO_EXTEND_TIME,
} from '~/lib/constants';
import { db } from '~/lib/express/db.server';
import type { UserStatusType } from '~/types/db';

const notsafeId = customAlphabet(
  'seandm26T198340PX75pxJACKVERYMINDBSHWLFGQZbfghjklqvwyzrict',
  10
);

const safeId = customAlphabet(
  'seandm26T198340PX75pxJACKVERYMINDBSHWLFGQZbfghjklqvwyzrict',
  14
);

// some reasonable limits are set for the number of items that is fetched
// TODO work on paging solution
const MAX_FETCH_MESSAGES = 500;
const MAX_FETCH_MAILBOXES = 100;
const MAX_FETCH_USERS = 500;

// create and delete do not await result

async function createUserSession(userId: Session['userId']) {
  return db.session.create({
    data: {
      userId,
      expirationDate: new Date(Date.now() + USER_SESSION_EXPIRATION_TIME),
    },
  });
}

async function createUser(
  email: string,
  args: { name?: string; status?: UserStatusType } = {}
) {
  const { name = `user_${notsafeId()}`, ...rest } = args;

  return db.user.create({
    data: {
      email,
      name: name,
      ...rest,
    },
  });
}

async function createMailbox(userId: User['id'], name?: string) {
  return db.mailbox.create({
    data: {
      name: name || `mailbox mb_${notsafeId()}`,
      username: safeId(),
      password: safeId(),
      ownerId: userId,
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

/** this function is safe. it makes sure the user owns the message */
async function deleteUserMessage(messageId: Message['id'], userId: User['id']) {
  return db.message.deleteMany({
    where: {
      id: messageId,
      mailbox: {
        users: {
          some: { id: userId },
        },
      },
    },
  });
}

async function deleteUserSession(sessionId: Session['id']) {
  return db.session.delete({ where: { id: sessionId } }).catch(() => {
    // simply ignoring any errors here
  });
}

/** this function is safe. it makes sure the user owns the mailbox */
async function deleteMailbox(mailboxId: Mailbox['id'], userId: User['id']) {
  // seems to be easier to use deleteMany than verifying ownership in some other way
  return db.mailbox.deleteMany({ where: { id: mailboxId, ownerId: userId } });
}

async function getUserFromSessionId(sessionId: string) {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || !session.user) {
    return null;
  }

  if (Date.now() > session.expirationDate.getTime()) {
    await db.session.delete({ where: { id: sessionId } });
    return null;
  }

  // essentially user needs to log in at least once in USER_SESSION_EXTEND_TIME
  // to be logged in permanently
  if (
    Date.now() + USER_SESSION_AUTO_EXTEND_TIME >
    session.expirationDate.getTime()
  ) {
    const newExpirationDate = new Date(
      Date.now() + USER_SESSION_EXPIRATION_TIME
    );
    await db.session.update({
      data: { expirationDate: newExpirationDate },
      where: { id: sessionId },
    });
  }

  return session.user;
}

async function getUserByEmail(email: User['email']) {
  return await db.user.findUnique({ where: { email } });
}

async function getUserById(userId: User['id']) {
  return await db.user.findUnique({ where: { id: userId } });
}

/** this function is not safe */
async function getAllUsers() {
  return await db.user.findMany({
    take: MAX_FETCH_USERS,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function getUserMailboxes(userId: User['id']) {
  // TODO to handle large number of mailboxes
  return await db.mailbox.findMany({
    take: MAX_FETCH_MAILBOXES,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: { messages: true },
      },
    },
    where: {
      users: {
        some: { id: userId },
      },
    },
  });
}

/**
 * This function verifies that a user has access to this mailbox
 * messages have only meta data and not contents
 * gets max 100 last messages
 */
async function getUserMailbox(mailboxId: Mailbox['id'], userId: User['id']) {
  const found = await db.mailbox.findMany({
    where: {
      id: mailboxId,
      users: {
        some: { id: userId },
      },
    },
    include: {
      messages: {
        take: MAX_FETCH_MESSAGES,
        select: {
          from: true,
          to: true,
          createdAt: true,
          subject: true,
          id: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      users: true,
      _count: {
        select: { messages: true },
      },
    },
  });
  if (!found.length) {
    return null;
  }
  // sanity check
  if (found.length > 1) {
    console.log(
      `We are supposed to get a unique result given a user ID and mailbox ID but got ${found.length} results`
    );
    return null;
  }

  return found[0];
}

/** this function verifies that user has access to the message  */
async function getUserMessage(messageId: Message['id'], userId: User['id']) {
  const found = await db.message.findMany({
    where: {
      id: messageId,
      mailbox: {
        users: {
          some: { id: userId },
        },
      },
    },
  });

  if (!found.length) {
    return null;
  }
  // sanity check
  if (found.length > 1) {
    console.log(
      `We are supposed to get a unique result given a user ID and message ID but got ${found.length} results`
    );
    return null;
  }

  return found[0];
}

/**
 * This function is UNSAFE because it doesn't verify if a user is allowed to access the mailbox.
 * Use `getUserMailbox`
 */
async function getMailboxById(mailboxId: Mailbox['id']) {
  return await db.mailbox.findUnique({
    where: { id: mailboxId },
    include: {
      messages: {
        take: MAX_FETCH_MESSAGES,
      },
      _count: {
        select: { messages: true },
      },
    },
  });
}

async function connectMailbox(mailboxId: Mailbox['id'], userId: User['id']) {
  return await db.mailbox.update({
    where: { id: mailboxId },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

/** owners do not get disconnected */
async function disconnectMailbox(mailboxId: Mailbox['id'], userId: User['id']) {
  const mailbox = await db.mailbox.findUnique({
    where: { id: mailboxId },
  });
  // cannot disconnect owner
  if (!mailbox || mailbox.ownerId === userId) {
    return null;
  }

  return await db.mailbox.update({
    where: { id: mailboxId },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
}

/** this function is safe to use because it verifies the owner's id */
async function updateMailbox(
  mailboxId: Mailbox['id'],
  userId: User['id'],
  data: { name?: string } = {}
) {
  if (!Object.entries(data).length) {
    throw new Error('No data provided');
  }
  // seems to be easier to use updateMany than verifying ownership in some other way
  return await db.mailbox.updateMany({
    where: { id: mailboxId, ownerId: userId },
    data,
  });
}

async function updateUserData(
  userId: User['id'],
  data: { name?: string; status?: UserStatusType } = {}
) {
  if (!Object.entries(data).length) {
    throw new Error('No data provided');
  }
  return await db.user.update({ where: { id: userId }, data });
}

export {
  connectMailbox,
  createMailbox,
  createUser,
  createUserSession,
  deleteMailbox,
  deleteUserMessage,
  deleteUserSession,
  disconnectMailbox,
  getAllUsers,
  getMailboxById,
  getUserByEmail,
  getUserById,
  getUserFromSessionId,
  getUserMailbox,
  getUserMailboxes,
  getUserMessage,
  updateMailbox,
  updateUserData,
};
