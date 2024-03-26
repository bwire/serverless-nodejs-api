const { Pool, neonConfig } = require('@neondatabase/serverless');
const schema = require('../../db/schema');
const { migrate } = require('drizzle-orm/postgres-js/migrator');

const ws = require('ws');
require('dotenv').config();
const { getDatabaseUrl } = require('../../lib/secrets');
const { drizzle } = require('drizzle-orm/neon-serverless');

async function runMigration() {
  const dbUrl = await getDatabaseUrl();
  neonConfig.webSocketConstructor = ws; // <-- this is the key bit

  const pool = new Pool({ connectionString: dbUrl });
  pool.on('error', (err) => console.error(err)); // deal with e.g. re-connect

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const db = await drizzle(client, { schema });
    await migrate(db, { migrationsFolder: 'src/migrations' });

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  await pool.end();
}

if (require.main === module) {
  console.log('Run migrations');
  runMigration()
    .then(() => console.log('Migration has finished'))
    .catch((e) => console.log('Migration error', e));
}
