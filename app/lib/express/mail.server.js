const parser = require('mailparser').simpleParser;
const SMTPServer = require('smtp-server').SMTPServer;
const { createMessage, getMailboxWithUsername } = require('./db-actions');

let server;

async function streamToString(stream, onEndCallback) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      resolve(Buffer.concat(chunks) /* .toString('utf8') */);
      onEndCallback();
    });
  });
}

const serverOptions = {
  allowInsecureAuth: true, // allows authentication even if connection is not secured first
  authOptional: false, // allow authentication, but do not require it
  logger: true, // If set to true then logs to console
  // disables authentication
  // disabledCommands: ['AUTH'],

  // handler for authentication calls
  async onAuth(auth, session, callback) {
    const { username, password } = auth;
    if (!username || !password) {
      console.error('[smtp-server] auth failed: invalid username or password');
      return callback(new Error('Invalid username or password'));
    }

    const mailbox = await getMailboxWithUsername(username);
    if (!mailbox || mailbox.password !== password) {
      console.error('[smtp-server] auth failed: invalid username or password');
      return callback(new Error('Invalid username or password'));
    }

    callback(null, { user: { mailboxId: mailbox.id } });
  },
  // gets the stream for the incoming message
  async onData(stream, session, callback) {
    const { user } = session;
    let onEndCallback = callback;
    const mailboxId = user?.mailboxId;
    console.log('[smtp-server] session', JSON.stringify(session));

    if (!mailboxId) {
      onEndCallback = () => {
        console.error(
          '[smtp-server] received mail but have no valid mailbox id. Aborted'
        );
        callback(new Error('Invalid mailbox'));
      };
    }

    // stream.on('end', onEndCallback);
    let rawMessage;
    let parsed;
    try {
      rawMessage = await streamToString(stream, onEndCallback);
      parsed = await parser(rawMessage, {});
    } catch (err) {
      console.error('[smtp-server] >>> onData error:', err);
      return;
    }

    if (!mailboxId) {
      return;
    }

    console.log('[smtp-server] parsed successfully', parsed);
    console.log('[smtp-server] saving...');
    const post = await createMessage(
      user.mailboxId,
      parsed,
      JSON.stringify(session),
      rawMessage
    );
    console.log('[smtp-server] db post', post);
  },
};

if (process.env.NODE_ENV === 'production') {
  server = new SMTPServer(serverOptions);
} else {
  if (!global.__server) {
    global.__server = new SMTPServer(serverOptions);
  }
  server = global.__server;
}

server.on('error', (err) => {
  console.log('[smtp-server] Error %s', err.message);
});

module.exports = { server };
