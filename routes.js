const fs = require('fs');
 
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write(`
      <html>
        <head>
          <title>Enter Your Username</title>
        </head>
        <body>
          <h1>Greeting from Nodejs</h1>
          <ul>
            <li>User1</li>
            <li>User2</li>
            <li>User3</li>
          </ul>
          <form action='/create-user' method='POST'>
            <input type='text' name='username'/>
            <button type='submit'>Submit</button>
          </form>
        </body>
      </html>
    `)
    return res.end();
  }
  
  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split('=')[1];
      console.log(username)
      fs.writeFile('username.txt', username, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  } 
  
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Nodejs Page</title></head>');
  res.write(`<body><h1>Hello Nodejs, Welcome to \"${url}\"</h1></body>`);
  res.write('</html>');
  res.end();
};

module.exports = {
  handler: requestHandler,
  purpose: 'To handle req & res'
};
