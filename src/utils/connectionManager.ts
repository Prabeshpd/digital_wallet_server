import { Knex } from 'knex';
import { isNil, isEmpty } from 'ramda';

import * as db from './db';
import config from '../config';
import logger from './/logger';
import * as redis from './redis';
import { fromJson } from './object';
import BaseModel from '../models/Model';

const processEnv = config.env;

/**
 * Creates a database instance for database.
 *
 * @returns {Knex}
 */
export function getDatabaseConnection(): Knex {
  const dbConfig = {
    client: 'mssql',
    connection: { ...config.database[processEnv] }
  };

  logger.info('Resolving database connection pool for database');

  return db.createInstance(dbConfig);
}

const env = config.env;

export async function initRedisConnection() {
  try {
    await redis.init();

    logger.info('REDIS: Connection established');
  } catch (err) {
    logger.error('REDIS: Redis could not be initialized:', err);

    process.exit(1);
  }
}

export async function bindAppConnection() {
  try {
    let connection: DatabaseConfig | null;
    connection = await getPersistedConnections();

    if (!connection) {
      const memoizedConnection = await createMemoizedConnections();
      if (!memoizedConnection) throw Error('Something went wrong in establishing the connection with database.');

      connection = memoizedConnection;
    }

    const knexConnection = db.createInstance(connection);
    BaseModel.bindConnection(knexConnection);
  } catch (err) {
    throw Error('Something went wrong in establishing the connection with database.');
  }
}

export async function destroyConnection() {
  const connection = await getPersistedConnections();

  if (!connection) return;

  const knexConnection = db.createInstance(connection);
  await knexConnection.destroy();
}

const CONN_PERSISTENCE_KEY = 'database_connections';

export interface DatabaseConfig {
  client: string;
  connection: {
    user: string;
    host: string;
    port: number;
    database: string;
    password: string;
  };
}

/**
 * Creates connection map for all apps given in common database.
 *
 * @returns {ConnectionMap}
 */
export function createConnection(): DatabaseConfig {
  const dbConfig = {
    client: 'mssql',
    connection: { ...config.database[env] }
  };

  return dbConfig;
}

/**
 * Create memoized connections for all clients. If the connection map doesn't
 * already exist in Redis, then create and return it. Otherwise, create the
 * connections and persist them to Redis.
 *
 * TODO: Add cache invalidation logic, so that when a new client is added, it is counted
 * as a cache miss. Currently, a value that is not consistent with the number of clients
 * in the database will still count as a cache hit.
 *
 * @param {boolean} [forceUpdate=false]
 * @returns {Promise<ConnectionMap>}
 */
export async function createMemoizedConnections(forceUpdate: boolean = false): Promise<DatabaseConfig | null> {
  const connections = await getPersistedConnections();

  const connectionsCacheMiss = isNil(connections) || isEmpty(connections);

  if (!connectionsCacheMiss && !forceUpdate) {
    logger.info(`Client connections and app info are cached; skipping update`);

    return null;
  }

  // The connections are updated if the cache is cold (initial state),
  // or when a force update is to be made
  if (forceUpdate) {
    logger.info(`Updating cached connections (force update).`);
  } else {
    logger.info(`Database connection cache is cold, creating..`);
  }

  const connection = await createConnection();

  await persistConnections(connection);

  return connection;
}

/**
 * Persist connection for any given appId into Redis.
 *
 * @param {DatabaseConfig} connectionMap
 */
export async function persistConnections(connectionMap: DatabaseConfig) {
  const value = marshalToString(connectionMap);

  try {
    await redis.set(CONN_PERSISTENCE_KEY, value);
  } catch (err: any) {
    logger.error(`Could not persist connections: ${err.message}`);
  }
}

/**
 * Retrieve the persisted connection map.
 *
 * @returns {Promise<DatabaseConfig | null>}
 */
export async function getPersistedConnections(): Promise<DatabaseConfig | null> {
  const connString = await redis.get(CONN_PERSISTENCE_KEY);
  if (!connString) return null;

  return unmarshalStringToObject<DatabaseConfig>(connString);
}

/**
 * Marshal a value to string so that it can be stored in Redis,
 * because Redis doesn't support nested keys.
 *
 * @param {any} value
 * @returns {String}
 */
function marshalToString(value: any) {
  return JSON.stringify(value);
}

/**
 * Unmarshal the string received from Redis into a concrete type.
 *
 * @param {string} str
 * @returns {Object}
 */
function unmarshalStringToObject<T>(str: string): T {
  return fromJson<T>(str);
}
