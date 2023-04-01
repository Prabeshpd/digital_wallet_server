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
  const appInfo = await homeService.getAppInfo();

  response.status(httpStatusCode.OK).send(appInfo);
}
