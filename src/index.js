const serverless = require('serverless-http');
const express = require('express');
const { neon, neonConfig } = require('@neondatabase/serverless');
const AWS = require('aws-sdk');

const app = express();

const AWS_REGION = 'us-east-1';
const STAGE = process.env.STAGE || 'prod';
const DB_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;

const ssm = new AWS.SSM({ region: AWS_REGION });

async function dbClient() {
  const paramStored = await ssm
    .getParameter({
      Name: DB_URL_SSM_PARAM,
      WithDecryption: true,
    })
    .promise();

  return neon(paramStored.Parameter.Value);
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
