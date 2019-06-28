const request = require('supertest');
const app = require('../lib/app');

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
