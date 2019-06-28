const { createServer } = require('net');
const fs = require('fs');
const { join } = require('path');

const getMethodPaths = {
  '/red': {
    'file': 'red.html',
    'Content-Type': 'text/html',
    'status': 200
  },
  '/blue': {
    'file': 'blue.html',
    'Content-Type': 'text/html',
    'status': 200
  },
  '/green': {
    'file': 'green.html',
    'Content-Type': 'text/html',
    'status': 200
  },
  '/': {
    'file': 'hi.txt',
    'Content-Type': 'text/plain',
    'status': 200
  },
  '/dog': {
    'file': 'dog.json',
    'Content-Type': 'application/json',
    'status': 200
  }
};

const makeHTMLResponse = (file, fileInfo) => {
  return `
HTTP/1.1 ${fileInfo.status} OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 25 Jun 2019 15:57:17 GMT
Accept-Ranges: bytes
Content-Type: ${fileInfo['Content-Type']}

${file.toString()}`;
};

const getFile = (fileInfo, callback) => {
  if(!fileInfo) {
    fileInfo = {
      'file': 'not-found.html',
      'Content-Type': 'text/html',
      'status': 404
    };
  }
  
  fs.readFile(join(__dirname, '..', 'public', fileInfo.file), (err, data) => {
    if(err) return callback(err);
    callback(data, fileInfo);
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

    getFile(fileInfo, (file, fileInfo) => {
      sock.write(makeHTMLResponse(file, fileInfo));
      sock.end();
    });
  });
});

module.exports = app;
