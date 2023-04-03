import httpStatus from 'http-status-codes';

import * as crypt from '../utils/crypt';
import { ERROR_TYPES } from '../constants/enums';
import ErrorFormatter from '../utils/ErrorHandler';
import * as thirdPartyService from './thirdPartyService';
import * as transactionRecordService from './transactionRecord';
import { findUserByEmail } from './user';
import Wallet, { WalletDetail, WalletPayload, WalletSchema } from '../models/Wallet';

export interface WalletTransactionPayloadForVerification {
  user_id: number;
  to_wallet: string;
  balance: number;
}

export interface TransferPayload extends WalletTransactionPayloadForVerification {
  uniqueIdentifier: string;
  transactionPassword: string;
}

export async function addWallet(walletPayload: WalletPayload) {
  //ToDo: generate a random number and send it to client for changing the transaction password
  const password = '326768';
  const cryptedPassword = await crypt.hash(password);
  const payload = { ...walletPayload, transaction_password: cryptedPassword };

  const wallet = (await Wallet.insertData(payload)) as WalletDetail;

  return { wallet: { ...wallet, balance: 0, currency: 'dollar' } };
}

export async function verifyWallet(userId: number) {
  const wallet = (await Wallet.getByUserId(userId)) as WalletDetail;
  const verifiedInformation = await thirdPartyService.verifyWallet(wallet);
  const [updateWallet] = (await Wallet.updateById(wallet.id, {
    is_verified: verifiedInformation.isVerified
  })) as WalletDetail[];
  const balanceInformation = await thirdPartyService.getWalletMoney(wallet.id);

  return { wallet: { ...updateWallet, balance: balanceInformation.balance, currency: balanceInformation.currency } };
}

export async function getWalletWithBalance(userId: number) {
  const wallet = (await Wallet.getByUserId(userId)) as WalletDetail;
  if (!wallet) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.NOT_FOUND,
      message: 'Wallet does not exist'
    }).construct();

    throw { statusCode: httpStatus.NOT_FOUND, error };
  }

  const balanceInformation = await thirdPartyService.getWalletMoney(wallet.id);

  return { wallet: { ...wallet, balance: balanceInformation.balance, currency: balanceInformation.currency } };
}

export async function verifyTransaction(walletTransactionPayload: WalletTransactionPayloadForVerification) {
  const { to_wallet, user_id, balance } = walletTransactionPayload;

  const user = await findUserByEmail(to_wallet);

  const senderWallet = (await Wallet.getByUserId(user_id)) as WalletDetail;
  const receiverWallet = (await Wallet.getByUserId(user.id)) as WalletDetail;

  if (!senderWallet || !receiverWallet) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.NOT_FOUND,
      message: 'Wallet does not exist'
    }).construct();

    throw { statusCode: httpStatus.NOT_FOUND, error };
  }

  if (!receiverWallet.isVerified) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'Receiver is not a verified user'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  const balanceInformation = await thirdPartyService.getWalletMoney(senderWallet.id);

  if (balanceInformation.balance <= balance) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'Insufficient Balance'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  const transactionRecord = await transactionRecordService.addTransactionRecord({
    from_wallet_id: senderWallet.id,
    to_wallet_id: receiverWallet.id,
    amount: balance,
    status: 'pending'
  });

  return { isVerified: true, uniqueIdForTransaction: transactionRecord.id };
}

export async function verifyTransactionPassword(transactionPassword: string, storedPassword: string) {
  const passwordMatches = await crypt.compare(transactionPassword, storedPassword);

  return passwordMatches;
}

export async function transferMoneyWithWallet(transactionPayload: TransferPayload) {
  const { user_id, transactionPassword } = transactionPayload;

  const senderWallet = (await Wallet.getByUserId(user_id, true)) as WalletSchema;
  const isVerifiedTransactionPassword = await verifyTransactionPassword(
    transactionPassword,
    senderWallet.transactionPassword
  );

  if (!isVerifiedTransactionPassword) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'Wrong Password'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  const transactionId = +transactionPayload.uniqueIdentifier;
  const transactionRecord = await transactionRecordService.getTransactionById(transactionId);
  if (!transactionRecord) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'Bad Request'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  if (transactionRecord.status === 'success') {
    return { message: 'Already transferred' };
  }

  let data: any;

  try {
    data = await thirdPartyService.transferMoneyToWallet(transactionPayload);
  } catch (err) {
    await transactionRecordService.updateTransactionRecord(transactionId, {
      status: 'failed'
    });
  }

  await transactionRecordService.updateTransactionRecord(transactionId, {
    status: 'success'
  });

  return { wallet: { ...senderWallet, balance: data.balance, currency: data.currency } };
}
