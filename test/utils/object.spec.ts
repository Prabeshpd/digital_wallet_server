import 'mocha';
import { expect } from 'chai';

import {
  toCamelCase,
  toSnakeCase,
  withoutAttrs,
  withOnlyAttrs,
  getKeysLength,
  listWithoutAttrs
} from '../../src/utils/object';

describe('Utils: object', () => {
  describe('withoutAttrs()', () => {
    const obj = {
      a: 1,
      b: 2
    };

    it('should omit correct key, when only 1 is supplied.', () => {
      expect(withoutAttrs(obj, ['a'])).to.deep.equal({ b: 2 });
    });

    it('should omit correct keys, when more than 1 are supplied.', () => {
      expect(withoutAttrs(obj, ['a', 'b'])).to.deep.equal({});
    });

    it('should omit no keys when attrsToExclude is empty', () => {
      expect(withoutAttrs(obj, [])).to.deep.equal({ a: 1, b: 2 });
    });

    it('should omit no keys when attrsToExclude has no matches ', () => {
      expect(withoutAttrs(obj, ['c', 'd'])).to.deep.equal({ a: 1, b: 2 });
    });
  });

  describe('listWithoutAttrs()', () => {
    it('should recursively omit keys from nested array of objects', () => {
      const list = [
        {
          a: 1,
          b: 2
        },
        {
          c: 3,
          d: 4
        }
      ];

      expect(listWithoutAttrs(list, ['a', 'c'])).to.deep.equal([{ b: 2 }, { d: 4 }]);
    });
  });

  describe('withOnlyAttrs()', () => {
    const obj = {
      a: 1,
      b: 2
    };

    it('should only retain the single key specified in attrs', () => {
      expect(withOnlyAttrs(obj, ['a'])).to.deep.equal({ a: 1 });
    });

    it('should only retain the keys specified in attrs', () => {
      expect(withOnlyAttrs(obj, ['a', 'b'])).to.deep.equal(obj);
    });

    it('should return an empty object if none of the keys in attrs are on the object', () => {
      expect(withOnlyAttrs(obj, ['c', 'd'])).to.deep.equal({});
    });

    it('should retain the whatever keys are available and ignore unavailable keys', () => {
      expect(withOnlyAttrs(obj, ['a', 'c'])).to.deep.equal({ a: 1 });
    });

    it('should return an empty object if attrs is an empty list', () => {
      expect(withOnlyAttrs(obj, [])).to.deep.equal({});
    });
  });

  describe('toCamelCase()', () => {
    it('should recursively toCamelCase the object', () => {
      const obj = {
        key_1: {
          key_2: 1,
          key_3: 2
        },
        key_4: 3
      };

      const expectedObj = {
        key1: {
          key2: 1,
          key3: 2
        },
        key4: 3
      };

      expect(toCamelCase(obj)).to.deep.equal(expectedObj);
    });

    it('should recursively toCamelCase objects inside arrays', () => {
      const obj = {
        key_1: [
          {
            key_1: {
              key_2: 1,
              key_3: 2
            }
          }
        ]
      };

      const expectedObj = {
        key1: [
          {
            key1: {
              key2: 1,
              key3: 2
            }
          }
        ]
      };

      expect(toCamelCase(obj)).to.deep.equal(expectedObj);
    });

    it('should do nothing and return as-is if non-object (eg: string) is passed.', () => {
      const obj = '{"just": "test"}';
      const expected = '{"just": "test"}';

      expect(toCamelCase(obj)).to.deep.equal(expected);
    });
  });

  describe('toSnakeCase()', () => {
    it('should recursively uncamelize the object', () => {
      const obj = {
        keyOne: {
          keyTwo: 1,
          keyThree: 2
        },
        key4: 3
      };

      const expectedObj = {
        key_one: {
          key_two: 1,
          key_three: 2
        },
        key4: 3
      };

      expect(toSnakeCase(obj)).to.deep.equal(expectedObj);
    });

    it('should recursively uncamelize objects inside arrays', () => {
      const obj = {
        keyOne: [
          {
            keyOne: {
              keyTwo: 1,
              keyThree: 2
            }
          }
        ]
      };

      const expectedObj = {
        key_one: [
          {
            key_one: {
              key_two: 1,
              key_three: 2
            }
          }
        ]
      };

      expect(toSnakeCase(obj)).to.deep.equal(expectedObj);
    });
  });

  describe('UTILS: getKeysLength()', () => {
    it('should return length of given object', () => {
      const dummyObj = { a: 1, b: 2 };

      expect(getKeysLength({})).to.equal(0);
      expect(getKeysLength(dummyObj)).to.equal(2);
    });

    it('should return length of given array', () => {
      const dummyArr = [1, 2];

      expect(getKeysLength([])).to.equal(0);
      expect(getKeysLength(dummyArr)).to.equal(2);
    });

    it('should return 0 for non-object value', () => {
      expect(getKeysLength(1)).to.equal(0);
      expect(getKeysLength(1.1)).to.equal(0);
      expect(getKeysLength(true)).to.equal(0);
      expect(getKeysLength(null)).to.equal(0);
      expect(getKeysLength(false)).to.equal(0);
      expect(getKeysLength('string')).to.equal(0);
      expect(getKeysLength(undefined)).to.equal(0);
    });
  });
});
