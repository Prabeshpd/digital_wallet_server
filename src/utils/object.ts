import snakeize = require('snakeize');
import camelize = require('camelize');

/**
 * Recursively convert the object keys into camelCase.
 *
 * @param {any} object
 * @returns {T}
 */
export function toCamelCase<T>(object: any): T {
  return camelize(object);
}

/**
 * Recursively convert the object keys into snake_case.
 *
 * @param {any} object
 * @returns {T}
 */
export function toSnakeCase<T>(object: any): T {
  return snakeize(object);
}

/**
 * Get the copy of list of objects without attributes.
 *
 * @param {object[]} obj
 * @param {any[]} attrsToExclude
 * @returns {T[]}
 */
export function listWithoutAttrs<T>(obj: object[], attrsToExclude: any[]): T[] {
  return obj.map((item) => withoutAttrs<T>(item, attrsToExclude));
}

/**
 * Get the copy of object without attributes.
 *
 * @param {any} obj
 * @param {any[]} attrsToExclude
 * @returns {T}
 */
export function withoutAttrs<T>(obj: any, attrsToExclude: any[]): T {
  if (Array.isArray(obj)) {
    // It is recommended to use listWithoutAttrs() function instead for arrays.
    throw new TypeError('withoutAttrs() expects first argument to be a plain object, array given.');
  }

  const result: any = {};

  Object.keys(obj).forEach((key: string) => {
    if (!attrsToExclude.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Get the copy of object with only specified attributes.
 *
 * @param {any} obj
 * @param {any[]} attrs
 * @returns {T}
 */
export function withOnlyAttrs<T>(obj: any, attrs: any[]): T {
  const result: any = {};

  Object.keys(obj).forEach((key) => {
    if (attrs.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Parse JSON encoded string and return object with camelized keys.
 *
 * @param {string} encoded
 * @returns {T}
 */
export function fromJson<T>(encoded: string): T {
  const parsedObject = JSON.parse(encoded);

  return toCamelCase<T>(parsedObject);
}

/**
 * Get number of keys from given value.
 *
 * @param {any} value
 * @returns {number}
 */
export function getKeysLength(value: any): number {
  if (!(value instanceof Object)) {
    return 0;
  }

  return Object.keys(value).length;
}
