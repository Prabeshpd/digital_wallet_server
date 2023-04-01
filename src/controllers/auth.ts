import { Request, Response, NextFunction } from 'express';
import httpStatusCode from 'http-status-codes';

import * as authService from '../services/auth';

/**
 * Get app information.
 *
 * @param {Request} request
 * @param {Response} response
 */
export async function login(request: Request, response: Response, next: NextFunction) {
  authService
    .login(request.body)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}

/**
 * Refresh access token.
 *
 * @param {Request} req
 * @param {Response} response
 */
export async function refresh(request: Request, response: Response, next: NextFunction) {
  authService
    .refresh(request.body)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}
