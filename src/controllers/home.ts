import { Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';

import * as homeService from '../services/home';

/**
 * Get app information.
 *
 * @param {Request} request
 * @param {Response} reply
 */
export async function getAppInfo(request: Request, response: Response) {
  homeService.getAppInfo().then((data) => response.status(httpStatusCode.OK).send(data));
}
