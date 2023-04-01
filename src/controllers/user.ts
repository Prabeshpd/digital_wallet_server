import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';

import * as userService from '../services/user';

/**
 * Creates user.
 *
 * @param {Request} request
 * @param {Response} response
 */
export async function createUser(request: Request, response: Response) {
  try {
    const payload = request.body;
    const data = await userService.addUser(payload);

    await response.status(httpStatusCode.OK).send(data);
  } catch (err: any) {
    const statusCode = err.code ? err.code : httpStatusCode.INTERNAL_SERVER_ERROR;
    response.status(statusCode).send(err);
  }
}
