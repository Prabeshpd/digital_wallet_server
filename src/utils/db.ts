import { knex, Knex } from 'knex';

import logger from '../utils/logger';
import * as object from '../utils/object';

/**
 * Check if the provided object is a knex connection instance.
 *
 * @param {any} obj
 * @returns {boolean}
 */
export function isKnexInstance(obj: any): obj is Knex {
  return !!(obj.prototype && obj.prototype.constructor && obj.prototype.constructor.name === 'knex');
}

/**
 * Creates a knex database connection instance from
 * the provided database configuration.
 *
 * @param {Knex.Config} dbConfig
 * @returns {knex}
 */
export function createInstance(dbConfig: Knex.Config): Knex {
  return knex(dbConfig);
}

/**
 * Check database connection from provided knex params.
 *
 * @param {Knex.Config | Knex | Knex.Transaction} connection
 * @returns {Promise<boolean>}
 */
export async function isValidConnection(connection: Knex.Config | Knex | Knex.Transaction): Promise<boolean> {
  const conn = isKnexInstance(connection) ? connection : createInstance(connection);

  try {
    await conn.raw('SELECT 1');

    return true;
  } catch (err) {
    logger.error('Cannot connect to database', err);

    return false;
  }
}

/**
 * Returns a query builder instance depending on the provided transaction.
 *
 * @param {Knex} connection
 * @param {Knex.Transaction} [trx]
 * @returns {(Knex.Transaction | Knex)}
 */
export function queryBuilder(connection: Knex, trx?: Knex.Transaction): Knex.Transaction | Knex {
  return trx || connection;
}

/**
 * Push 'updated_at' key to params if the column exists in the table being updated.
 *
 * @param {Knex} connection
 * @param {string} table
 * @param {any} [params={}]
 * @returns {Promise<any>}
 */
async function withTimestamp(connection: Knex, table: string, params: any = {}): Promise<any> {
  const exists = await connection.schema.hasColumn(table, 'updated_at');

  if (!exists || (exists && params.updatedAt)) {
    return object.toSnakeCase(params);
  }

  return { ...object.toSnakeCase(params), updated_at: connection.fn.now() };
}

/**
 * Finds a record based on the params.
 * Returns null if no results were found.
 *
 * @param {Knex} connection
 * @param {string} table
 * @param {object} [params={}]
 * @param {Knex.Transaction} [trx]
 * @returns {(Promise<T | null>)}
 */
export async function get<T>(
  connection: Knex,
  table: string,
  params: object = {},
  trx?: Knex.Transaction
): Promise<T | null> {
  const [result] = await queryBuilder(connection, trx)
    .select('*')
    .from(table)
    .where(object.toSnakeCase(params))
    .limit(1);

  if (!result) {
    return null;
  }

  return object.toCamelCase(result);
}

/**
 * Find record by it's id.
 * Returns null if not found.
 *
 * @param {Knex} connection
 * @param {string} table
 * @param {number} id
 * @returns {(Promise<T | null>)}
 */
export function getById<T>(connection: Knex, table: string, id: number, trx?: Knex.Transaction): Promise<T | null> {
  return get<T>(connection, table, { id }, trx);
}

/**
 * Insert all records sent in data object.
 *
 * @param {Knex} connection
 * @param {string} table
 * @param {(object | object[])} data
 * @param {Knex.Transaction} [trx]
 * @returns {Promise<T[]>}
 */
export async function insert<T>(
  connection: Knex,
  table: string,
  data: object | object[],
  trx?: Knex.Transaction
): Promise<T[]> {
  const qb = queryBuilder(connection, trx);
  const result = await qb.insert(object.toSnakeCase(data)).into(table).returning('*');

  return object.toCamelCase(result);
}

/**
 * Update records by id.
 *
 * @param {Knex} connection
 * @param {string} table
 * @param {(number | number[])} id
 * @param {object} params
 * @param {Knex.Transaction} [trx]
 * @returns {Promise<T[]>}
 */
export async function updateById<T>(
  connection: Knex,
  table: string,
  id: number | number[],
  params: object,
  trx?: Knex.Transaction
): Promise<T[]> {
  const qb = queryBuilder(connection, trx);
  const updateParams = await withTimestamp(connection, table, params);

  const result = await qb
    .table(table)
    .update(updateParams)
    .whereIn('id', Array.isArray(id) ? id : [id])
    .returning('*');

  return object.toCamelCase(result);
}

/**
 * Delete row in table.
 *
 * @param {Knex} connection
 * @param {string} table
 * @param {object} params
 * @param {Transaction} trx
 * @returns {Promise<T[]>}
 */
export async function remove<T>(connection: Knex, table: string, params: object, trx?: Knex.Transaction): Promise<T[]> {
  const qb = queryBuilder(connection, trx);
  const result = await qb.from(table).where(object.toSnakeCase(params)).del().returning('*');

  return object.toCamelCase(result);
}
