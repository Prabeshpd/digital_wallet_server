import { NextFunction, Request, Response } from 'express';

import config from '../config';
import * as jwt from '../utils/jwt';
import { UserDetail } from '../models/User';
import { ERROR_TYPES } from '../constants/enums';
import ErrorFormatter from '../utils/ErrorHandler';
import { HttpStatusCode } from 'axios';

export interface AuthorizedRequest extends Request {
  user: UserDetail;
}

async function authenticate(request: Request, response: Response, next: NextFunction) {
  const authorizedRequest = request as AuthorizedRequest;
  try {
    const { accessTokenSecret } = config.auth;

    const secret = `${accessTokenSecret}`;
    const token = request.headers.authorization;

    if (!token) {
      const error = new ErrorFormatter({
        code: ERROR_TYPES.BAD_REQUEST,
        message: 'No authorization header set'
      }).construct();

      return next({ statusCode: HttpStatusCode.BadRequest, error });
    }

    if (!token.includes('Bearer')) {
      const error = new ErrorFormatter({
        code: ERROR_TYPES.BAD_REQUEST,
        message: "Authorization header doesn't include a Bearer token"
      }).construct();

      return next({ statusCode: HttpStatusCode.BadRequest, error });
    }

    const bearerToken = token.split(' ')[1];

    try {
      const decodedResult = (await jwt.verifyToken(bearerToken, secret)) as UserDetail;
      authorizedRequest.user = decodedResult;

      next();
    } catch (err) {
      const error = new ErrorFormatter({
        code: ERROR_TYPES.UNAUTHORIZED,
        message: 'INVALID TOKEN'
      }).construct();

      return next({ statusCode: HttpStatusCode.Unauthorized, error });
    }
  } catch (err) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong'
    }).construct();

    return next({ statusCode: HttpStatusCode.InternalServerError, error });
  }
}

export default authenticate;
