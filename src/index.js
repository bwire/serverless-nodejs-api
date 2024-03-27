const serverless = require('serverless-http');
const express = require('express');
const { getDbClient } = require('./db/client');

const app = express();

app.get('/', async (req, res, next) => {
  const sql = await getDbClient();
  const now = Date.now();

  const [dbNowResult] = await sql`select now();`;
  const delta = (dbNowResult.now.getTime() - now) / 1000;

  return res.status(200).json({
    message: 'Hello from root!',
    delta,
  });
});

app.get('/leads', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from leads!',
  });
});

app.post('/leads', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from leads post!',
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

module.exports.handler = serverless(app);
