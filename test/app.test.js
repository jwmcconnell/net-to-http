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
});
