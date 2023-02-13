import * as nodemailer from 'nodemailer';
import { getRequiredEnvVariable } from '~/lib/utils.server';

declare global {
  var __test__transporter: nodemailer.Transporter | undefined | null;
}

/**
 * functions used for testing the app itself
 */

/** this function is going to be deprecated */
function getTransporter() {
  if (global.__test__transporter) {
    return global.__test__transporter;
  }

  let SMTP_HOST;
  let SMTP_PORT;
  let SMTP_USER;
  let SMTP_PASS;
  try {
    SMTP_HOST = getRequiredEnvVariable('SMTP_HOST');
    SMTP_PORT = Number(getRequiredEnvVariable('SMTP_HOST_PORT'));
    SMTP_USER = getRequiredEnvVariable('SMTP_USER');
    SMTP_PASS = getRequiredEnvVariable('SMTP_PASS');
  } catch (e) {
    return null;
  }

  const config = {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    // secure: SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // auth: null,
    logger: true,
    debug: true,
    tls: {
      rejectUnauthorized: false,
    },
  };

  global.__test__transporter = nodemailer.createTransport(config);

  return global.__test__transporter;
}

/** this function is going to be deprecated */
async function sendmail(args: {
  /**  sender address */
  from: string;
  /** list of receivers */
  to: string;
  /** Subject line */
  subject: string;
  /** plain text body */
  text: string;
  /** html body */
  html?: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    // silently fails
    return;
  }

  // const { from, to, subject, text, html } = args;
  const info = await transporter.sendMail(args);

  return info;

  // console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // info.response - mail response
}

async function sendmailWithAuth(
  args: {
    /**  sender address */
    from: string;
    /** list of receivers */
    to: string;
    /** Subject line */
    subject: string;
    /** plain text body */
    text: string;
    /** html body */
    html?: string;
  },
  auth: {
    user: string;
    pass: string;
  }
) {
  let SMTP_HOST;
  let SMTP_PORT;
  try {
    SMTP_HOST = getRequiredEnvVariable('SMTP_HOST');
    SMTP_PORT = Number(getRequiredEnvVariable('SMTP_HOST_PORT'));
  } catch (e) {
    // silently fails
    return;
  }

  const transporterWithAuth = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth,
    logger: true,
    debug: true,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporterWithAuth.sendMail(args);

  return info;
}

const sendmailTest = sendmail;
const sendmailTestWithAuth = sendmailWithAuth;

export { sendmailTest, sendmailTestWithAuth };
