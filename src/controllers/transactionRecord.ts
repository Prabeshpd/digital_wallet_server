import { Response, NextFunction, Request } from 'express';
import httpStatusCode from 'http-status-codes';
import { AuthorizedRequest } from '../middlewares/auth';
import * as transactionRecordService from '../services/transactionRecord';

export async function fetch(request: Request, response: Response, next: NextFunction) {
  const authorizedRequest = request as AuthorizedRequest;
  const userId = authorizedRequest.user.id;
  const paginationParams = request.query;

  transactionRecordService
    .fetchTransactionRecords(userId, paginationParams)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}
