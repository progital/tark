import * as nodemailer from 'nodemailer';
import { getRequiredEnvVariable } from '~/lib/utils.server';

// we can't work without the external transactional email service
// so we are initializing it right away
const SMTP_HOST = getRequiredEnvVariable('TRANSACT_SMTP_HOST');
const SMTP_PORT = Number(getRequiredEnvVariable('TRANSACT_SMTP_PORT'));
const SMTP_USER = getRequiredEnvVariable('TRANSACT_SMTP_USER');
const SMTP_PASS = getRequiredEnvVariable('TRANSACT_SMTP_PASS');
const TRANSACT_FROM = getRequiredEnvVariable('TRANSACT_FROM');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  // logger: true,
  // debug: true,
});

/** sends transactional emails vie external service */
async function sendmail(args: {
  /** list of receivers */
  to: string;
  /** Subject line */
  subject: string;
  /** plain text body */
  text: string;
  /** html body */
  html?: string;
}) {
  // from is fixed because external service won't accept an arbitrary "from"
  const { to, subject, text, html } = args;
  const info = await transporter.sendMail({
    from: TRANSACT_FROM,
    to,
    subject,
    text,
    html,
  });

  // info.response - mail response
  console.log('[external] Message sent:', info.messageId);

  return info;
}

export { sendmail };
