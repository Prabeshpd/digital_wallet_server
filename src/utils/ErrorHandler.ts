import { ERROR_TYPES } from '../constants/enums';

interface ErrorHandler {
  code: ERROR_TYPES;
  message?: string;
  innerError?: ErrorHandler[];
  details?: ErrorConstructor[];
  addDetails?: (details: ErrorConstructor) => ErrorHandler;
  addInnerError?: (innerError: ErrorHandler) => ErrorHandler;
}

interface ErrorConstructor {
  code: ERROR_TYPES;
  message: string;
  target?: string;
}

/**
 * Formats the error in proper structure. Needs message and code as compulsory constructor argument.
 * One can add inner error and details of error with function addInnerError and addDetails.
 *
 * @example
 * const error = new ErrorFormatter({ code: 'BAD_ARGUMENT', message: 'Token is not set in header' })
 *   .addInnerError({ code: 'NO_TOKEN' })
 *   .addDetails({ code: 'NO_TOKEN', message: 'Token is required to authenticate the request' }).construct()
 *
 * The resulting error object:
 *
 * {
 *   error: {
 *     code: 'BAD_ARGUMENT',
 *     message: 'Token is not set in header',
 *     innerError: {
 *       code: 'NO_TOKEN'
 *     },
 *     details: [{
 *       code: 'NO_TOKEN',
 *       message: 'Token is required to authenticate the request'
 *     }]
 *   }
 * }
 */
class ErrorFormatter implements ErrorHandler {
  public code: ERROR_TYPES;
  public message: string;
  private _details: ErrorConstructor[];
  private _innerError: ErrorHandler[];

  constructor(error: ErrorConstructor) {
    this.code = error.code;
    this.message = error.message;
    this._innerError = [];
    this._details = [];
  }

  /**
   * Construct the message as per the properties set in the errorFormatter class.
   *
   * @returns {[key: string]: any} errorObject
   */
  construct() {
    const mainError: { [key: string]: any } = { code: this.code, message: this.message };
    let refObj = mainError;

    this._innerError.forEach((error) => {
      refObj = refObj['innerError'] || refObj;
      refObj['innerError'] = error;
    });

    const errorObject = { error: { ...mainError, details: this._details } };

    return errorObject;
  }

  /**
   * Add the passed argument to details array.
   *
   * @param {ErrorConstructor} details
   * @returns {ErrorHandler}
   */
  addDetails(details: ErrorConstructor) {
    this._details.push(details);

    return this;
  }

  /**
   * Add the inner error in the error formatted message.
   *
   * @param {ErrorHandler} innerError
   * @returns {ErrorHandler}
   */
  addInnerError(innerError: ErrorHandler) {
    this._innerError.push(innerError);

    return this;
  }
}

export default ErrorFormatter;
