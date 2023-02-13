const { PrismaClient } = require('@prisma/client');

const QUERY_DURATION_ALARM = 500;

/** @type {import('@prisma/client').PrismaClient} */
let db;

function getPrismaClient() {
  // TODO review logging
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'info', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });
  client.$on('query', async ({ duration, query }) => {
    if (duration < QUERY_DURATION_ALARM) {
      return;
    }

    console.log(`[prisma] long query - ${duration}ms - ${query}`);
  });
  // make the connection eagerly so the first request doesn't have to wait
  client.$connect();
  return client;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  db = getPrismaClient();
} else {
  if (!global.__db) {
    global.__db = getPrismaClient();
  }
  db = global.__db;
}

module.exports = { db };
