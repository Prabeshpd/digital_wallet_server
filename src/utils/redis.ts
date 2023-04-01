import Redis from 'ioredis';

import logger from './logger';
import config from '../config';

export const REVOKED = 'REVOKED';
export const SESSION_PREFIX = 'session_id_';

let redis: Redis;
const env = config.env;

/**
 * Initialize redis.
 *
 * @returns {Promise<string>}
 */
export function init(): Promise<string> {
  const redisConfig = config.redis[env];

  // Check for namespace - it is required.
  if (!redisConfig.namespace) {
    logger.error('REDIS: Application namespace for redis cannot be empty.');

    throw new Error('App namespace is not set for redis.');
  }

  // Check for redis's password - it is required.
  if (!redisConfig.password) {
    logger.error('REDIS: password cannot be empty.');

    throw new Error('Password is not set for redis.');
  }

  redis = new Redis(redisConfig);

  logger.debug(`REDIS: Running "ping"..`);

  logger.info(`REDIS: connecting to redis: ${redisConfig.host}`);

  return new Promise((resolve, reject) => {
    redis.ping((err, res) => {
      if (err) {
        logger.error(`REDIS: Could not ping the server: ${err.message}`);

        return reject(err);
      }

      if (!res) {
        logger.error('Something went wrong');

        return reject('Something went wrong');
      }

      return resolve(res);
    });
  });
}

export function disconnect() {
  redis.disconnect();
}

/**
 * Create session key name.
 *
 * @param {number | string} sessionId
 * @param {number | string} appId
 * @returns {string}
 */
export function createSessionKeyName(sessionId: number | string) {
  return `${SESSION_PREFIX}${sessionId}`;
}

/**
 * Set the string value of the key. Optionally, can give key's expire time (ms).
 *
 * @param {string} key
 * @param {string} value
 * @param {number} expireTime
 * @returns {Promise<string>}
 */
export function set(key: string, value: string, expireTime?: number): Promise<string> {
  const namespacedKey = withNamespace(key);

  if (expireTime) {
    logger.debug(`Redis: Setting '${namespacedKey}' with expiration`);

    return redis.set(namespacedKey, value, 'EX', expireTime / 1000);
  }

  logger.debug(`Redis: Setting '${namespacedKey}'`);

  return redis.set(namespacedKey, value);
}

/**
 * Get the value of given key.
 *
 * @param {string} key
 * @returns {Promise<string>}
 */
export async function get(key: string): Promise<string | null> {
  const namespacedKey = withNamespace(key);

  logger.debug(`$Redis: Retrieving '${namespacedKey}'`);

  return redis.get(namespacedKey);
}

/**
 * Get the key prefixed with a namespace for storing/retrieving in redis.
 *
 * @param {string} key
 * @returns {string}
 */
function withNamespace(key: string): string {
  const { namespace } = config.redis[env];

  return `${namespace}:${key}`;
}

/**
 * Delete keys matching a given pattern.
 *
 * @param {string} pattern
 * @returns {Promise<any>}
 */
export async function del(pattern: string): Promise<any> {
  if (!pattern) {
    throw new Error('Pattern argument cannot be empty.');
  }

  const { namespace } = config.redis[env];
  const keys = await redis.keys(`${namespace}:${pattern}`);
  const pipeline = redis.pipeline();

  logger.debug(`Deleting keys of pattern: ${namespace}:${pattern}`);

  keys.forEach((key: string) => {
    pipeline.del(key);

    logger.debug(`Key Deleted: ${key}`);
  });

  logger.info(`Deleted ${keys.length} keys`);

  return pipeline.exec();
}
