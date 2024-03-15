const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from root!',
    dburl: process.env.DATABASE_URL,
    debug: process.env.DEBUG === 1,
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
