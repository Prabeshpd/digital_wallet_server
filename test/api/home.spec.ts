import { expect } from 'chai';
import request from 'supertest';

import app, { server } from '../../src/server';

describe('Base API Test', () => {
  it('should return API version and title for the app', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.app).to.be.equal(app.locals.title);
        expect(res.body.apiVersion).to.be.equal(app.locals.version);

        done();
      });
  });

  after(() => {
    server.close();
  });
});
