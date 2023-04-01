import 'mocha';
import * as Joi from 'joi';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { validate } from '../../src/utils/validator';

// chai-as-promised extends chai with a fluent language for asserting facts about promises.
use(chaiAsPromised);

describe('Utils: validate', () => {
  describe('validate()', () => {
    it('should validate given data with predefined schema', () => {
      const data = {
        firstName: 'Random Mike',
        age: 49
      };

      const schema = Joi.object().keys({
        firstName: Joi.string(),
        age: Joi.number()
      });

      expect(validate(data, schema)).to.eventually.be.fulfilled;
    });

    it('should throw error when given data does not match with schema', () => {
      const data = {
        firstName: 'random',
        age: 'guess'
      };

      const schema = Joi.object().keys({
        firstName: Joi.string(),
        age: Joi.number()
      });

      expect(validate(data, schema)).to.eventually.be.rejected;
    });

    it('should throw error when required field is empty', () => {
      const data = {
        age: 49
      };

      const schema = Joi.object().keys({
        firstName: Joi.string().required(),
        age: Joi.number()
      });

      expect(validate(data, schema)).to.eventually.be.rejected;
    });
  });
});
