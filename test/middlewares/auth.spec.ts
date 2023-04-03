import sinon from 'sinon';
import { expect } from 'chai';
import { Response, NextFunction } from 'express';

import * as jwt from '../../src/utils/jwt';
import { UserDetail } from '../../src/models/User';
import { ERROR_TYPES } from '../../src/constants/enums';
import authenticate, { AuthorizedRequest } from '../../src/middlewares/auth';

describe('should verify the auth middleware with correct arguments', () => {
  let mockExpressRequest: Partial<AuthorizedRequest>;
  let mockExpressResponse: Partial<Response>;
  let mockNextFunction: NextFunction;

  let token: string;
  let user: UserDetail;
  before(async () => {
    mockExpressRequest = {};
    mockExpressResponse = {};
    mockNextFunction = () => {};
    user = {
      email: 'faker@gmail.com',
      name: 'fake random',
      createdAt: '2022-10-22',
      isActive: true,
      identificationNumber: 'Nepal@123',
      updatedAt: '2022-10-22',
      id: 1
    };
    token = await jwt.generateAccessToken(user);
  });

  it('should return an error if there is no token sent in header', async () => {
    mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
      return {
        send: sinon.stub().callsFake((replyArg) => {
          return { status: statusArg, body: replyArg };
        })
      };
    });

    authenticate(
      mockExpressRequest as AuthorizedRequest,
      mockExpressResponse as Response,
      mockNextFunction as NextFunction
    ).then((data: any) =>
      expect(data).to.deep.equal({
        status: 400,
        body: {
          code: ERROR_TYPES.BAD_REQUEST,
          msg: 'No authorization header set',
          details: []
        }
      })
    );
  });

  it('should throw an error if there is no bearer token sent in header', async () => {
    mockExpressRequest.headers = { authorization: `random_token ${token}` };
    mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
      return {
        send: sinon.stub().callsFake((replyArg) => {
          return { status: statusArg, body: replyArg };
        })
      };
    });

    authenticate(
      mockExpressRequest as AuthorizedRequest,
      mockExpressResponse as Response,
      mockNextFunction as NextFunction
    ).then((data: any) =>
      expect(data).to.deep.equal({
        status: 400,
        body: {
          code: ERROR_TYPES.BAD_REQUEST,
          msg: "Authorization header doesn't include a Bearer token",
          details: []
        }
      })
    );
  });

  it('should throw an error if the app id on request is different to that of jwt generation app id', async () => {
    mockExpressRequest.headers = { authorization: `random_token ${token}` };
    mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
      return {
        send: sinon.stub().callsFake((replyArg) => {
          return { status: statusArg, body: replyArg };
        })
      };
    });

    authenticate(
      mockExpressRequest as AuthorizedRequest,
      mockExpressResponse as Response,
      mockNextFunction as NextFunction
    ).then((data: any) =>
      expect(data).to.deep.equal({
        status: 401,
        body: {
          code: ERROR_TYPES.UNAUTHORIZED,
          msg: 'Invalid Token',
          details: []
        }
      })
    );
  });

  it('should set the decoded result in user properties of fastify request object', async () => {
    mockExpressRequest.headers = { authorization: `Bearer ${token}` };
    mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
      return {
        send: sinon.stub().callsFake((replyArg) => {
          return { status: statusArg, body: replyArg };
        })
      };
    });

    process.env.accessTokenSecret = 'ENTER_ACCESS_TOKEN_SALT_HERE';

    authenticate(
      mockExpressRequest as AuthorizedRequest,
      mockExpressResponse as Response,
      mockNextFunction as NextFunction
    ).then((data: any) => {
      expect(mockExpressRequest.user).to.deep.equal(user);
    });
  });
});
