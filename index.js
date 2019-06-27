const { createServer } = require('net');

const server = createServer(sock => {
  sock.on('data', data => {
    // sock.write(data);
    console.log(data.toString());
    sock.write(`
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 25 Jun 2019 15:57:17 GMT
Accept-Ranges: bytes
Content-Length: 269
Content-Type: text/html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <h1>Example</h1>
</body>
</html>`);

    sock.end();
  });
});

server.listen(7890);
