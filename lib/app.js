const { createServer } = require('net');
const fs = require('fs');
const { join } = require('path');

const getMethodPaths = {
  '/red': {
    'file': 'red.html',
    'content-type': 'text/html',
    'status': 200
  },
  '/blue': {
    'file': 'blue.html',
    'content-type': 'text/html',
    'status': 200
  }
};

const makeHTMLResponse = (file) => {
  return `
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 25 Jun 2019 15:57:17 GMT
Accept-Ranges: bytes
Content-Type: text/html

${file.toString()}`;
};

const getFile = (fileInfo, callback) => {
  const file = fileInfo ? fileInfo.file : 'not-found.html';

  fs.readFile(join(__dirname, '..', 'public', file), (err, data) => {
    if(err) return callback(err);
    callback(data);
  });
};

const getFileInfo = (path) => {
  return getMethodPaths[path];
};

const parseReq = (req) => {
  const lines = req.toString().split('\n');
  const method = lines[0].split(' ')[0];
  const path = lines[0].split(' ')[1];
  return { method, path };
};

const app = createServer(sock => {
  sock.on('data', req => {
    const { path } = parseReq(req);

    const fileInfo = getFileInfo(path);

    getFile(fileInfo, (file) => {
      sock.write(makeHTMLResponse(file));
      sock.end();
    });
  });
});

module.exports = app;
