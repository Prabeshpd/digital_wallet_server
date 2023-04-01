import { isEmpty } from 'ramda';
import httpStatusCode from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import logger from '../utils/logger';
import ErrorFormatter from '../utils/ErrorHandler';
import { ERROR_TYPES, ERROR_CODES } from '../constants/enums';

/**
 * Error response middleware for 404 not found. This middleware function should be at the very bottom of the stack.
 *
 * @param {any} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function notFoundHandler(err: any, req: Request, res: Response, next: NextFunction) {
  return res.status(httpStatusCode.NOT_FOUND).json({
    error: {
      code: ERROR_TYPES.NOT_FOUND,
      message: 'Requested resource is not found'
    }
  });
}

/**
 * Middleware to handle empty JSON body requests. Message is hard-coded
 * as middleware (bindIntl.bindCoreIntl) to bind i18n of core/api
 * to request runs after this middleware.
 *
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export function emptyBody(request: Request, response: Response, next: NextFunction) {
  const { body, method } = request;
  const disallowedHttpHeaders: any = ['PUT', 'POST', 'PATCH'];

  if (request.is('application/json') && disallowedHttpHeaders.includes(method) && isEmpty(body)) {
    logger.error('JSON: Empty JSON body');

    const error = new ErrorFormatter({
      code: ERROR_TYPES.INVALID_PAYLOAD,
      message: 'Payload is invalid.'
    }).construct();

    return response.status(httpStatusCode.BAD_REQUEST).json(error);
  }

  next();
}

/**
 * To handle errors from body parser for cases such as invalid JSON sent through
 * the body (https://github.com/expressjs/body-parser#errors).
 *
 * @param  {any}   err
 * @param  {Request}   req
 * @param  {Response}   res
 * @param  {NextFunction} next
 */
export function bodyParser(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err.message);

  res.status(err.status).json({
    error: {
      code: err.status,
      message: httpStatusCode.getStatusText(err.status)
    }
  });
}

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param {any} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function genericErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.stack) {
    logger.error('Error stack trace: ', err.stack);
  }

  if (!err.type) {
    logger.error(err);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(err);
  }

  logger.error(err);
  const statusCode = ERROR_CODES.get(err.type) || httpStatusCode.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json(err);
}
