import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';

import * as walletService from '../services/wallet';
import { AuthorizedRequest } from '../middlewares/auth';

/**
 * Creates Wallet.
 *
 * @param {Request} request
 * @param {Response} response
 */
export async function createWallet(request: Request, response: Response, next: NextFunction) {
  const authorizedRequest = request as AuthorizedRequest;
  const userId = authorizedRequest.user.id;
  const payload = { ...request.body, user_id: userId };
  console.log({ payload });
  walletService
    .addWallet(payload)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}

export async function getWallet(request: Request, response: Response, next: NextFunction) {
  const authorizedRequest = request as AuthorizedRequest;
  const userId = authorizedRequest.user.id;

  walletService
    .getWalletWithBalance(userId)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}

export async function verifyWallet(request: Request, response: Response, next: NextFunction) {
  const authorizedRequest = request as AuthorizedRequest;
  const userId = authorizedRequest.user.id;

  walletService
    .verifyWallet(userId)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}

export async function verifyTransaction(request: Request, response: Response, next: NextFunction) {
  const authorizedRequest = request as AuthorizedRequest;
  const userId = authorizedRequest.user.id;
  const payload = { ...request.body, user_id: userId };

  walletService
    .verifyTransaction(payload)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}

export async function transferBalance(request: Request, response: Response, next: NextFunction) {
  const authorizedRequest = request as AuthorizedRequest;
  const userId = authorizedRequest.user.id;
  const payload = { ...request.body, user_id: userId };

  walletService
    .transferMoneyWithWallet(payload)
    .then((data) => response.status(httpStatusCode.OK).json(data))
    .catch((e) => next(e));
}
