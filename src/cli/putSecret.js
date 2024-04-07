require('dotenv').config();
const secrets = require('../lib/secrets');

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Inappropriate usage');
  process.exit(1);
}

if (require.main === module) {
  console.log('Update secrets');
  const [stage, dbUrl] = args;
  secrets
    .putDatabaseUrl(stage, dbUrl)
    .then((v) => {
      console.log(`Secret set`);
      console.log(v);
      process.exit(0);
    })
    .catch((e) => {
      console.log(`Secret not set`);
      process.exit(1);
    });
}
