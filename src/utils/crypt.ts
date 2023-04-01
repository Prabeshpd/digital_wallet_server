import * as bcrypt from 'bcrypt';

import config from '../config';

export type HmacEncoding = 'hex' | 'base64';

/**
 * Create a bcrypt hash for a string.
 *
 * @param {string} value
 * @returns {Promise<string>}
 */
export async function hash(value: string): Promise<string> {
  const saltRounds = parseInt(config.auth.saltRounds, 10);
  const hashedValue = await bcrypt.hash(value, saltRounds);

  return hashedValue;
}

/**
 * Compare a string with the hash.
 *
 * @param {string} value
 * @param {string} hashedValue
 * @returns {Promise<boolean>}
 */
export async function compare(value: string, hashedValue: string): Promise<boolean> {
  const isSame = await bcrypt.compare(value, hashedValue);

  return isSame;
}
