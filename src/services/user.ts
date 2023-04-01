import httpStatus from 'http-status-codes';

import * as crypt from '../utils/crypt';
import { ERROR_TYPES } from '../constants/enums';
import ErrorFormatter from '../utils/ErrorHandler';
import User, { UserPayload, UserSchema } from '../models/User';
/**
 * Find user by email.
 *
 * @param {string} email
 * @returns {Promise<UserSchema>}
 */
export async function findUserByEmail(email: string): Promise<UserSchema> {
  const [user] = await User.fetchByEmail(email);

  if (!user) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'username or password does not match'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  if (!user.isActive) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'User is deactivated'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  return user;
}

export async function addUser(userpayload: UserPayload) {
  const password = userpayload.password;
  const cryptedPassword = await crypt.hash(password);
  const payload = { ...userpayload, password: cryptedPassword, is_active: true };

  const [user] = await User.insertData(payload);

  return user;
}
