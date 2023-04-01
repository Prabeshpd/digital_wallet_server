import 'mocha';
import { expect } from 'chai';

import ErrorHandler from '../../src/utils/ErrorHandler';
import { ERROR_TYPES } from '../../src/constants/enums';

describe('ErrorHandler', () => {
  it('should return error object with property code and message if code and message is passed', () => {
    const error = new ErrorHandler({ code: ERROR_TYPES.UNAUTHORIZED, message: 'Incorrect Credentials' }).construct();
    expect(error).to.deep.equal({
      error: { code: ERROR_TYPES.UNAUTHORIZED, message: 'Incorrect Credentials', details: [] }
    });
  });

  it('should return error object with nested innerError property set through addInnerError method.', () => {
    const error = new ErrorHandler({ code: ERROR_TYPES.BAD_REQUEST, message: 'Previous Password may not be used' })
      .addInnerError({ code: ERROR_TYPES.BAD_REQUEST, message: 'Password does not match' })
      .addInnerError({ code: ERROR_TYPES.BAD_REQUEST, message: 'Password does not meet policy' })
      .addInnerError({ code: ERROR_TYPES.BAD_REQUEST, message: 'Previous Password may not be used' })
      .construct();

    expect(error).to.deep.equal({
      error: {
        code: ERROR_TYPES.BAD_REQUEST,
        message: 'Previous Password may not be used',
        innerError: {
          code: ERROR_TYPES.BAD_REQUEST,
          message: 'Password does not match',
          innerError: {
            code: ERROR_TYPES.BAD_REQUEST,
            message: 'Password does not meet policy',
            innerError: { code: ERROR_TYPES.BAD_REQUEST, message: 'Previous Password may not be used' }
          }
        },
        details: []
      }
    });
  });

  it('should return error object with details of error set through the addDetails method.', () => {
    const error = new ErrorHandler({ code: ERROR_TYPES.BAD_REQUEST, message: 'Errors in contact information data' })
      .addDetails({
        code: ERROR_TYPES.BAD_REQUEST,
        target: 'PhoneNumber',
        message: 'Phone number must not be null'
      })
      .addDetails({
        code: ERROR_TYPES.BAD_REQUEST,
        target: 'LastName',
        message: 'Last name must not be null'
      })
      .construct();

    expect(error).to.deep.equal({
      error: {
        code: ERROR_TYPES.BAD_REQUEST,
        message: 'Errors in contact information data',
        details: [
          {
            code: ERROR_TYPES.BAD_REQUEST,
            target: 'PhoneNumber',
            message: 'Phone number must not be null'
          },
          {
            code: ERROR_TYPES.BAD_REQUEST,
            target: 'LastName',
            message: 'Last name must not be null'
          }
        ]
      }
    });
  });
});
