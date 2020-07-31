const http = require('http');

const server = http.createServer((req, res) => {
  // console.log(req.url, '\n', req.method, '\n', req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Nodejs Page</title></head>')
  res.write('<body><h1>Hello Nodejs</h1></body>')
  res.write('</html>')
  res.end()
  res.write()
  // process.exit();
});

server.listen(6900)

