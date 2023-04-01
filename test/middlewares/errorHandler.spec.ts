import sinon from 'sinon';
import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

import { ERROR_TYPES } from '../../src/constants/enums';
import { emptyBody, notFoundHandler } from '../../src/middlewares/errorHandler';

describe('handleErrorMiddleware: ', () => {
  let mockExpressRequest: Partial<Request>;
  let mockExpressResponse: Partial<Response>;
  let mockNextFunction: NextFunction;
  let err: any;

  before(async () => {
    mockExpressRequest = {};
    mockExpressResponse = {};
    mockNextFunction = () => {};
    err = {};
  });

  describe('emptyBody:', () => {
    it('should return an error if there is no payload sent for post method', async () => {
      mockExpressRequest.method = 'POST';
      mockExpressRequest.body = {};
      mockExpressRequest.is = (arg: string) => {
        return 'true';
      };
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          json: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });

      const data = emptyBody(
        mockExpressRequest as Request,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(data).to.deep.equal({
        status: 400,
        body: {
          error: {
            code: ERROR_TYPES.INVALID_PAYLOAD,
            message: 'Payload is invalid.',
            details: []
          }
        }
      });
    });
  });

  describe('notFoundHandler:', () => {
    it('should return an error if there is not found Error', async () => {
      err = { type: ERROR_TYPES.NOT_FOUND };
      mockExpressResponse.status = sinon.stub().callsFake((statusArg) => {
        return {
          json: sinon.stub().callsFake((replyArg) => {
            return { status: statusArg, body: replyArg };
          })
        };
      });

      const data = notFoundHandler(
        err as any,
        mockExpressRequest as Request,
        mockExpressResponse as Response,
        mockNextFunction as NextFunction
      );

      expect(data).to.deep.equal({
        status: 404,
        body: {
          error: {
            code: ERROR_TYPES.NOT_FOUND,
            message: 'Requested resource is not found'
          }
        }
      });
    });
  });
});
