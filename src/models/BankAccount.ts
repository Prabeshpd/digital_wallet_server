import BaseModel from './Model';
import { CamelCaseKeys } from '../types/utils';
import { listWithoutAttrs } from '../utils/object';

export interface BankAccountModel {
  id: number;
  user_id: number;
  transaction_password: string;
  is_verified: boolean;
  created_at: string;
  is_active: boolean;
  updated_at: string;
}

export type BankAccountSchema = CamelCaseKeys<BankAccountModel>;
export type BankAccountDetail = Omit<BankAccountSchema, 'transactionPassword'>;
export type BankAccountPayload = Omit<BankAccountModel, 'id' | 'created_at' | 'updated_at' | 'is_verified'>;

class BankAccount extends BaseModel {
  public static table = 'BankAccounts';

  public static async insertData(data: BankAccountPayload | BankAccountPayload[]): Promise<BankAccountDetail[]> {
    const bankAccount = await this.insert<BankAccountPayload | BankAccountPayload[]>(data);

    return listWithoutAttrs(bankAccount, ['transactionPassword']);
  }

  public static async getByEmail(email: string): Promise<BankAccountDetail[] | null> {
    const bankAccount = await this.buildQuery<BankAccountSchema>((qb) =>
      qb.select('*').from('BankAccounts').where('is_active', 1).andWhere('email', email)
    );

    if (!BankAccount.length) return null;

    return listWithoutAttrs(bankAccount, ['transactionPassword']);
  }

  public static async getByUserId(userId: number): Promise<BankAccountDetail[] | null> {
    const bankAccount = await this.buildQuery<BankAccountSchema>((qb) =>
      qb.select('*').from('BankAccounts').where('is_active', 1).andWhere('is_verified', 1).andWhere('user_id', userId)
    );

    if (!BankAccount.length) return null;

    return listWithoutAttrs(bankAccount, ['transactionPassword']);
  }
}

export default BankAccount;
