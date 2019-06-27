const { createServer } = require('net');

const makeHTMLResponse = () => {
  return `
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 25 Jun 2019 15:57:17 GMT
Accept-Ranges: bytes
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
  <h1>red</h1>
</body>
</html>`;
};

const app = createServer(sock => {
  sock.on('data', data => {
    console.log(data.toString());

    sock.write(makeHTMLResponse());
    sock.end();
  });
});

module.exports = app;
