const { db } = require('./db.server');
/**
 * @typedef { import('mailparser').ParsedMail } ParsedMail
 * @typedef { import('@prisma/client').Message } Message
 * @typedef { import('@prisma/client').Mailbox } Mailbox
 */

/**
 * @param {string} mailboxId
 * @param {ParsedMail} parsedBody
 * @param {Message['smtpSession']} smtpSession
 * @param {Buffer} rawMessage
 * @returns Promise<Message>
 */
async function createMessage(mailboxId, parsedBody, smtpSession, rawMessage) {
  const rcpt = Array.isArray(parsedBody?.to)
    ? parsedBody.to.map((item) => item.text).join(', ')
    : parsedBody?.to?.text ?? 'no-to';

  return db.message.create({
    data: {
      /**
       * sqlite doesn't support JSON field type
       * MongoDB or PostgreSQL do
       * @see {@link https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#json}
       */
      body: JSON.stringify(parsedBody),
      raw: rawMessage,
      from: parsedBody?.from?.text ?? 'no-from',
      to: rcpt,
      subject: parsedBody?.subject ?? 'no-subject',
      text: parsedBody?.text,
      html: parsedBody?.html || null,
      mailboxId: mailboxId,
      smtpSession: smtpSession || null,
    },
  });
}

/**
 * @param {string} username
 * @returns Promise<Mailbox>
 */
async function getMailboxWithUsername(username) {
  return await db.mailbox.findUnique({ where: { username } }).catch(() => {
    return null;
  });
}

module.exports = { createMessage, getMailboxWithUsername };
