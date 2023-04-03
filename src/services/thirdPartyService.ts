import { HttpStatusCode } from 'axios';
import { WalletDetail } from '../models/Wallet';

export async function verifyWallet(walletPayload: WalletDetail) {
  const number = await Math.floor(Math.random() * 10);
  if (number < 4) return { isVerified: false };

  return { isVerified: true };
}

export async function transferMoneyToWallet(transactionPayload: any) {
  const randomNumber = Math.floor(Math.random() * 10);

  if (randomNumber <= 2) return null;

  if (randomNumber > 2 && randomNumber < 5)
    return { status: HttpStatusCode.InternalServerError, message: 'Internal Server Error' };

  return { balance: 1435, currency: 'dollar' };
}

export async function getWalletMoney(id: number) {
  const randomNumber = Math.floor(Math.random() * 10);
  if (randomNumber > 8) return { balance: 0, currency: 'dollar' };

  return { balance: Math.floor(Math.random() * 100001), currency: 'dollar' };
}
