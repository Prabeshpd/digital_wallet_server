import { Knex } from 'knex';

import BaseModel from './Model';
import { CamelCaseKeys } from '../types/utils';
import { PaginationQueryParams } from '../utils/pagination';

export interface TransactionRecordModel {
  id: number;
  from_wallet_id: number;
  to_wallet_id: number;
  amount: number;
  created_at: string;
  updated_at: string;
  status: string;
}

export type TransactionRecordSchema = CamelCaseKeys<TransactionRecordModel>;
export type TransactionRecordPayload = Omit<TransactionRecordModel, 'id' | 'created_at' | 'updated_at'>;

class TransactionRecord extends BaseModel {
  public static table = 'transaction_records';

  public static async insertData(data: TransactionRecordPayload): Promise<TransactionRecordSchema> {
    const [transactionRecord] = await this.insert<TransactionRecordSchema>(data);

    return transactionRecord;
  }

  public static async count(wallet_id: number): Promise<number> {
    const [{ count }] = await this.buildQuery<{ count: number }>((qb: Knex) =>
      qb.count('id as count').from(this.table).where('from_wallet_id', wallet_id).orWhere('to_wallet_id', wallet_id)
    );

    return count;
  }

  public static async fetch(wallet_id: number, paginationParams: PaginationQueryParams) {
    const { limit, offset } = paginationParams;

    return this.buildQuery<TransactionRecordSchema>((qb) =>
      qb
        .select()
        .from(this.table)
        .limit(limit)
        .offset(offset)
        .where('from_wallet_id', wallet_id)
        .orWhere('to_wallet_id', wallet_id)
    );
  }
}

export default TransactionRecord;
