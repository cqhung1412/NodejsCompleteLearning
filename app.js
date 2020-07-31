const http = require('http');

function reqListener(request, response) {
  console.log(request);
}

const server = http.createServer(reqListener);

server.listen(6900)

