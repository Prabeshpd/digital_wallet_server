import 'mocha';
import { expect, assert } from 'chai';

import { hash, compare } from '../../src/utils/crypt';

describe('Crypt: string', () => {
  describe('hash()', () => {
    it('should generate hash for the string', async () => {
      const str = 'test';
      const result = await hash(str);

      assert.isNotNull(result);
    });

    it('should not match with another hash', async () => {
      const str1 = 'test';
      const result1 = await hash(str1);

      const str2 = 'testing';
      const result2 = await hash(str2);

      assert.notEqual(result1, result2);
    });
  });

  describe('compare()', () => {
    it('should match given string with hashed password', async () => {
      const str = 'test';
      const expectedHashString = await hash(str);

      const result = await compare(str, expectedHashString);

      expect(result).to.be.equal(true);
    });

    it('should not match a different string for the hash', async () => {
      const str = 'test';
      const randomString = 'testing';
      const expectedHashString = await hash(str);

      const result = await compare(randomString, expectedHashString);

      expect(result).to.equal(false);
    });
  });
});
