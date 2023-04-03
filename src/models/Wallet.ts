import BaseModel from './Model';
import { CamelCaseKeys } from '../types/utils';
import { listWithoutAttrs } from '../utils/object';

export interface WalletModel {
  id: number;
  user_id: number;
  transaction_password: string;
  is_verified: boolean;
  created_at: string;
  is_active: boolean;
  updated_at: string;
}

export type WalletSchema = CamelCaseKeys<WalletModel>;
export type WalletDetail = Omit<WalletSchema, 'transactionPassword'>;
export type WalletPayload = Omit<WalletModel, 'id' | 'created_at' | 'updated_at' | 'is_verified'>;

class Wallet extends BaseModel {
  public static table = 'wallets';

  public static async insertData(data: WalletPayload | WalletPayload[]) {
    console.log({ data });
    const wallet = await this.insert<WalletPayload | WalletPayload[]>(data);

    const [walletDetail] = listWithoutAttrs(wallet, ['transactionPassword']);

    return walletDetail;
  }

  public static async getByEmail(email: string, returnPassword?: boolean) {
    const wallet = await this.buildQuery<WalletSchema>((qb) =>
      qb.select('*').from('wallets').where('is_active', 1).andWhere('email', email)
    );

    if (!wallet.length) return null;

    if (returnPassword) return wallet[0];

    const [walletDetail] = listWithoutAttrs(wallet, ['transactionPassword']);

    return walletDetail;
  }

  public static async getByUserId(userId: number, returnPassword?: boolean) {
    const wallet = await this.buildQuery<WalletSchema>((qb) =>
      qb.select('*').from('wallets').where('is_active', 1).andWhere('user_id', userId)
    );

    console.log({ wallet });

    if (!wallet.length) return null;

    if (returnPassword) return wallet[0];

    const [walletDetail] = listWithoutAttrs(wallet, ['transactionPassword']);
    console.log({ walletDetail });
    return walletDetail;
  }
}

export default Wallet;
