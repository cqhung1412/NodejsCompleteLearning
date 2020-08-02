const http = require('http');

const express = require('express');

// const routes = require('./routes');

const app = express()

app.use((req, res, next) => {
  console.log('Inside middleware 1');
  res.write(`
    <html>
      <head></head>
  `);
  next(); // Allows the req come to below middleware
});

app.use((req, res, next) => {
  console.log('Inside middleware 2');
  res.write(`
      <body>
        <h1>Hello Expressjs</h1>
      </body>
    </html>
  `);
});

const server = http.createServer(app);

server.listen(6900);
