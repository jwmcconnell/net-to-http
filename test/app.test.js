const request = require('supertest');
const { app, parseReq, getFileInfo, parsePath } = require('../lib/app');

describe('application routes', () => {
  it('returns a plain text "hi" on a "/" get request', () => {
    return request(app)
      .get('/')
      .then(res => {
        expect(res.type).toEqual('text/plain');
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('hi'));
      });
  });

  it('returns a plain text "Sorry!" on a "/" post request', () => {
    return request(app)
      .post('/')
      .then(res => {
        expect(res.type).toEqual('text/plain');
        expect(res.status).toEqual(400);
        expect(res.text).toEqual(expect.stringContaining('Sorry!'));
      });
  });
  
  it('returns the red page on a "/red" get request', () => {
    return request(app)
      .get('/red')
      .then(res => {
        expect(res.type).toEqual('text/html');
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('<h1>red</h1>'));
      });
  });

  it('returns the blue page on a "/blue" get request', () => {
    return request(app)
      .get('/blue')
      .then(res => {
        expect(res.type).toEqual('text/html');
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('<h1>blue</h1>'));
      });
  });

  it('returns the green page on a "/green" get request', () => {
    return request(app)
      .get('/green')
      .then(res => {
        expect(res.type).toEqual('text/html');
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('<h1>green</h1>'));
      });
  });

  it('returns dog json object on a "/dog" req', () => {
    return request(app)
      .get('/dog')
      .then(res => {
        expect(res.type).toEqual('application/json');
        expect(res.status).toEqual(200);
        expect(JSON.parse(res.text)).toMatchObject({ 'name': 'rover', 'age': 2, 'weight': '15lbs' });
      });
  });

  it('returns custom dog object on a "/dog?..." request', () => {
    return request(app)
      .get('/dog?name=spot&age=5&weight=20lbs')
      .then(res => {
        expect(res.type).toEqual('application/json');
        expect(res.status).toEqual(200);
        expect(JSON.parse(res.text)).toMatchObject({ 'name': 'spot', 'age': 5, 'weight': '20lbs' });
      });
  });

  it('returns the not-found page on a bad path request', () => {
    return request(app)
      .get('/badpath')
      .then(res => {
        expect(res.type).toEqual('text/html');
        expect(res.status).toEqual(404);
        expect(res.text).toEqual(expect.stringContaining('<h1>Not Found</h1>'));
      });
  });
});

describe('Utility functions', () => {
  it('returns the path and method for the given request', () => {
    const req = `GET /dog HTTP/1.1
    Host: 127.0.0.1:50084
    Accept-Encoding: gzip, deflate
    User-Agent: node-superagent/3.8.3
    Connection: close`;

    const { path, method } = parseReq(req);
    expect(path).toEqual('/dog');
    expect(method).toEqual('GET');
  });

  it('returns an object with the file information for a GET /red request', () => {
    const path = '/red';
    const method = 'GET';

    const fileInfo = getFileInfo(path, method);
    expect(fileInfo).toEqual({
      'file': 'red.html',
      'Content-Type': 'text/html',
      'status': 200
    });
  });

  it('returns an object with the file information for a POST / request', () => {
    const path = '/';
    const method = 'POST';

    const fileInfo = getFileInfo(path, method);
    expect(fileInfo).toEqual({
      'file': 'sorry.txt',
      'Content-Type': 'text/plain',
      'status': 400
    });
  });

  it('returns the query object and the begining of the path for a given path', () => {
    const path = '/dog?name=spot&age=5&weight=20lbs';
    const { shortPath, query } = parsePath(path);
    expect(shortPath).toBe('/dog');
    expect(query).toEqual({ 'age': 5, 'name': 'spot', 'weight': '20lbs' });
  });

  it('returns the path for a path with no query string', () => {
    const path = '/dog';
    const { shortPath, query } = parsePath(path);
    expect(shortPath).toBe('/dog');
    expect(query).toEqual(null);
  });
});
