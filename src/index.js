const serverless = require('serverless-http');
const express = require('express');
const { neon, neonConfig } = require('@neondatabase/serverless');

const app = express();

async function dbClient() {
  neonConfig.fetchConnectionCache = true;
  return neon(process.env.DATABASE_URL);
}

app.get('/', async (req, res, next) => {
  const sql = await dbClient();
  const [result] = await sql`select now();`;
  return res.status(200).json({
    message: 'Hello from root!',
    result: result.now,
  });
});

app.get('/path', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from path!',
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

// app.listen(3000, () => {
//   console.log('Server is running at port 3000');
// });

module.exports.handler = serverless(app);
