import { Knex } from 'knex';

import * as db from '../utils/db';
import logger from '../utils/logger';
import * as object from '../utils/object';
import * as connectionManager from '../utils/connectionManager';

export type ConnectionResolver = () => Knex;

/* tslint:disable:max-classes-per-file */
class Model {
  public static table: string;
  public static connection?: Knex;

  /**
   * Binds a database connection to the model.
   *
   * @param {Knex} connection
   * @returns {void}
   */
  public static bindConnection(connection: Knex): void {
    logger.info('Binding database connection to the model (Lazy)');

    this.connection = connection;
  }

  /**
   * Binds a database connection to the model (chainable version of bindConnection()).
   *
   * @param {Knex} connection
   * @returns {any}
   */
  public static bind(connection: Knex): any {
    this.bindConnection(connection);

    return this;
  }

  /**
   * Resolves a database connection.
   *
   * Note: It would throw an Error on the run time if it couldn't resolve the
   * connection by the time any DB methods are invoked on it.
   * @returns {Knex}
   */
  public static getConnection(resolver?: ConnectionResolver): Knex {
    if (this.connection) {
      return this.connection;
    }

    /**
     * Note: We need to resolve db connection everytime.
     *
     * Since, all database connection info is cached in Redis.
     */
    if (resolver) {
      return resolver();
    }

    throw new Error('Cannot resolve the database connection.');
  }

  /**
   * Generic query builder.
   *
   * @param {(qb: Knex | Transaction) => QueryBuilder} callback
   * @param {Transaction} [trx]
   * @returns {Promise<T[]>}
   */
  public static async buildQuery<T>(
    callback: (qb: Knex | Knex.Transaction) => Knex.QueryBuilder,
    trx?: Knex.Transaction
  ): Promise<T[]> {
    const qb = db.queryBuilder(this.getConnection(), trx);
    const result = await callback(qb);

    return object.toCamelCase<T[]>(result);
  }

  /**
   * Finds a record based on the params.
   * Returns null if no results were found.
   *
   * @param {object} [params={}]
   * @param {Knex.Transaction} trx
   * @returns {Promise<T | null>}
   */
  public static get<T>(params: object = {}, trx?: Knex.Transaction): Promise<T | null> {
    return db.get<T>(this.getConnection(), this.table, params, trx);
  }

  /**
   * Find record by it's id.
   * Returns null if not found.
   *
   * @param {number} id
   * @param {Knex.Transaction} trx
   * @returns {Promise<T | null>}
   */
  public static getById<T>(id: number, trx?: Knex.Transaction): Promise<T | null> {
    return db.getById<T>(this.getConnection(), this.table, id, trx);
  }

  /**
   * Insert all records sent in data object.
   *
   * @param {(object | object[])} data
   * @param {Transaction} [trx]
   * @returns {Promise<T[]>}
   */
  public static insert<T>(data: object | object[], trx?: Knex.Transaction): Promise<T[]> {
    return db.insert<T>(this.getConnection(), this.table, data, trx);
  }

  /**
   * Update records by id.
   *
   * @param {number} id
   * @param {object} params
   * @param {Transaction} transaction
   * @returns {Promise<object>}
   */
  public static updateById<T>(id: number | number[], params: object, trx?: Knex.Transaction): Promise<T[]> {
    return db.updateById<T>(this.getConnection(), this.table, id, params, trx);
  }

  /**
   * Delete row in table.
   *
   * @param {object} params
   * @param {Transaction} trx
   * @returns {Promise<T[]>}
   */
  public static delete<T>(params: object, trx?: Knex.Transaction): Promise<T[]> {
    return db.remove<T>(this.getConnection(), this.table, params, trx);
  }
}

/**
 * Base model with injected connection resolver.
 *
 */
class BaseModel extends Model {
  /**
   * Resolves a database connection.
   *
   * Note: It would throw an Error on the run time if it couldn't resolve the
   * connection by the time any DB methods are invoked on it.
   * @returns {Knex}
   */
  public static getConnection(): Knex {
    return super.getConnection(connectionManager.getDatabaseConnection);
  }
}

logger.info('Initializing base model');
logger.info('Bind connection resolver for the base Model');

export default BaseModel;
