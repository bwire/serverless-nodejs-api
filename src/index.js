const serverless = require('serverless-http');
const express = require('express');
const { getDbClient } = require('./db/client');
const crud = require('./db/crud');

const app = express();

app.use(express.json());

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

app.get('/leads', async (req, res, next) => {
  const data = await crud.listLeads();
  return res.status(200).json(data);
});

app.post('/leads', async (req, res, next) => {
  const { body: leadsData } = req;
  const result = await crud.newLead(leadsData);
  return res.status(200).json({
    newLead: result,
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
