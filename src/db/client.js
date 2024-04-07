const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { getDatabaseUrl } = require('../lib/secrets');
const schema = require('./schema');

async function getDbClient() {
  const dbUrl = await getDatabaseUrl();
  console.log('DB url result', dbUrl);
  return neon(dbUrl);
}

async function getDrizzleDbClient() {
  const dbClient = await getDbClient();
  return drizzle(dbClient, schema);
}

module.exports.getDbClient = getDbClient;
module.exports.getDrizzleDbClient = getDrizzleDbClient;
