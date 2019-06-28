const request = require('supertest');
const app = require('../lib/app');

describe('application routes', () => {
  it('returns the red page on a "/red" get request', () => {
    return request(app)
      .get('/red')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('<h1>red</h1>'));
      });
  });

  it('returns the blue page on a "/blue" get request', () => {
    return request(app)
      .get('/blue')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('<h1>blue</h1>'));
      });
  });

  it('returns the green page on a "/green" get request', () => {
    return request(app)
      .get('/green')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('<h1>green</h1>'));
      });
  });

  it('returns the not-found page on a bad path request', () => {
    return request(app)
      .get('/badpath')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(expect.stringContaining('<h1>Not Found</h1>'));
      });
  });
});
