import * as Joi from 'joi';

import logger from './logger';

/**
 * Validates a given data against predefined schema.
 *
 * @param {object} data
 * @param {object} schema
 * @returns {Promise<object>}
 */
export function validate(data: object, schema: Joi.Schema): Promise<object> {
  return new Promise((resolve, reject) => {
    const options = { abortEarly: false };
    const { error, value } = schema.validate(data, options);

    if (error) {
      logger.error('Validation error: ', error);
      reject(error);

      return;
    }

    resolve(value);
  });
}
