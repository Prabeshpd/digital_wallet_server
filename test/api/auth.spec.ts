import { expect } from 'chai';
import request from 'supertest';

import app, { server } from '../../src/server';
import { insert } from '../../src/utils/db';
import { USER_DATA } from '../fixtures/user';
import { getTestDatabaseConnection } from '../../src/utils/testConnection';

describe('User login test', () => {
  if (!process.env.CI) {
    let connection: any;
    before(async () => {
      connection = getTestDatabaseConnection();
      await insert(connection, 'users', USER_DATA);
    });

    it('should return token with correct credentials', (done) => {
      request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'random_jude@gmail.com', password: 'random@123' })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.data).to.haveOwnProperty('accessToken');
          expect(res.body.data).to.haveOwnProperty('refreshToken');
          expect(res.body.data.user.email).to.be.equal('random_jude@gmail.com');
          done();
        });
    });

    after(async () => {
      await connection.delete().from('users');

      server.close();
    });
  }
});
