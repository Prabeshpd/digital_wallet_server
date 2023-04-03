import Wallet, { WalletDetail } from '../models/Wallet';
import TransactionRecord, { TransactionRecordPayload, TransactionRecordSchema } from '../models/TransactionRecord';
import { extractPaginationParams, PaginationParams, constructPaginationResult } from '../utils/pagination';

export async function addTransactionRecord(payload: TransactionRecordPayload) {
  const transactionRecord = await TransactionRecord.insertData(payload);

  return transactionRecord;
}

export async function fetchTransactionRecords(userId: number, params: PaginationParams) {
  const wallet = (await Wallet.getByUserId(userId)) as WalletDetail;
  if (!wallet) return { data: [], metadata: { totalCount: 0, limit: 10, currentPage: 0, href: null } };

  const href = '/api/v1/wallets/transactions';
  const { currentPage = 1 } = params;

  const totalEmployees = await TransactionRecord.count(wallet.id);

  const { limit, offset } = extractPaginationParams(params);
  const transactionRecords = await TransactionRecord.fetch(wallet.id, { limit, offset });

  const paginationResult = constructPaginationResult({
    totalCount: totalEmployees,
    limit,
    currentPage,
    href
  });

  return { data: transactionRecords, metadata: paginationResult };
}

export async function updateTransactionRecord(id: number, params: Object) {
  const [transactionRecord] = await TransactionRecord.updateById(id, params);

  return transactionRecord;
}

export async function getTransactionById(id: number) {
  return TransactionRecord.getById<TransactionRecordSchema>(id);
}
