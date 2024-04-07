const serverless = require('serverless-http');
const express = require('express');
const { getDbClient } = require('./db/client');
const crud = require('./db/crud');
const validators = require('./db/validators');

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
    stage: process.env.STAGE,
  });
});

app.get('/leads', async (req, res, next) => {
  const result = await crud.listLeads();
  return res.status(200).json({
    leads: result,
  });
});

app.get('/leads/:id', async (req, res, next) => {
  const result = await crud.getLead(req.params.id);
  return res.status(200).json({
    item: result,
  });
});

app.post('/leads', async (req, res, next) => {
  const { body: postData } = req;
  const { data, hasError, message } = validators.validateLead(postData);

  if (hasError) {
    return res.status(400).json({
      message: message || 'Invalid request, please try again!',
    });
  }

  const result = await crud.newLead(data);
  return res.status(201).json({
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
