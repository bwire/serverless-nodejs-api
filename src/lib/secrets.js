const { GetParameterCommand, SSMClient } = require('@aws-sdk/client-ssm');

const AWS_REGION = 'us-east-1';
const STAGE = process.env.STAGE || 'prod';
const DB_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;

async function getDatabaseUrl() {
  const client = new SSMClient({ region: AWS_REGION });
  const command = new GetParameterCommand({
    Name: DB_URL_SSM_PARAM,
    WithDecryption: true,
  });
  const result = await client.send(command);
  return result.Parameter.Value;
}

module.exports.getDatabaseUrl = getDatabaseUrl;
