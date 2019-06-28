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

const postMethodPaths = {
  '/': {
    'file': 'sorry.txt',
    'Content-Type': 'text/plain',
    'status': 400
  }
};

const makeHTMLResponse = (file, fileInfo) => {
  const date = new Date();
  return `
HTTP/1.1 ${fileInfo.status} OK
Date: ${date}
Server: Apache
Last-Modified: ${date}
Accept-Ranges: bytes
Content-Length: ${file.length}
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

const getFileInfo = (path, method) => {
  if(method === 'GET') {
    return getMethodPaths[path];
  } else if(method === 'POST') {
    return postMethodPaths[path];
  } else {
    return null;
  }
};

const parseReq = (req) => {
  const lines = req.toString().split('\n');
  const method = lines[0].split(' ')[0];
  const path = lines[0].split(' ')[1];
  return { method, path };
};

const parsePath = (path) => {
  let query = null;
  if(path.indexOf('?') !== -1) {
    const params = path.split('?')[1];
    path = path.split('?')[0];
    const searchParams = new URLSearchParams(params);
    query = {
      name: searchParams.get('name'),
      age: parseInt(searchParams.get('age')),
      weight: searchParams.get('weight')
    };
  }
  return { shortPath: path, query };
};

const app = createServer(sock => {
  sock.on('data', req => {
    let { path, method } = parseReq(req);

    const { shortPath, query } = parsePath(path);

    if(shortPath !== path) path = shortPath;

    const fileInfo = getFileInfo(path, method);

    getFile(fileInfo, (file, fileInfo) => {
      console.log(fileInfo.path);
      if(query && fileInfo.status !== 404 && fileInfo.file === 'dog.json') {
        file = JSON.stringify(query);
      }
      sock.write(makeHTMLResponse(file, fileInfo));
      sock.end();
    });
  });
});

module.exports = app;
