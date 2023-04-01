import httpStatus from 'http-status-codes';

import * as jwt from '../utils/jwt';
import * as userService from './user';
import * as crypt from '../utils/crypt';
import * as object from '../utils/object';
import { ERROR_TYPES } from '../constants/enums';
import ErrorFormatter from '../utils/ErrorHandler';
import { UserDetail, UserSchema } from '../models/User';

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    user: UserDetail;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshResponse {
  code: number;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface RefreshPayload {
  refreshToken: string;
}

/**
 * Login user.
 *
 * @param {LoginPayload} payload
 * @param {any} params
 * @return {Promise<LoginResponse>}
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const user: UserSchema = await userService.findUserByEmail(payload.email);
  if (!user) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'username or password does not match'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  if (!user.password) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'username or password does not match'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  const passwordMatches = await crypt.compare(payload.password, user.password);

  if (!passwordMatches) {
    const error = new ErrorFormatter({
      code: ERROR_TYPES.BAD_REQUEST,
      message: 'username or password does not match'
    }).construct();

    throw { statusCode: httpStatus.BAD_REQUEST, error };
  }

  const UserDetail = object.withoutAttrs<UserDetail>(user, ['password']);
  const refreshToken = jwt.generateRefreshToken(user);
  const accessToken = jwt.generateAccessToken(user);

  return {
    code: httpStatus.OK,
    message: 'Login is successful.',
    data: {
      user: UserDetail,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  };
}

/**
 * Return new access token based on the refresh token.
 *
 * @param {RefreshPayload} payload
 * @returns {Promise<RefreshResponse>}
 */
export async function refresh(payload: RefreshPayload): Promise<RefreshResponse> {
  const refreshPayload = (await verifyRefreshToken(payload.refreshToken)) as UserDetail;

  let user = object.withoutAttrs<UserDetail>(refreshPayload, ['iat', 'exp']);

  const accessToken = await jwt.generateAccessToken(user);

  return {
    code: httpStatus.OK,
    message: 'Access Token generated successfully',
    data: {
      accessToken
    }
  };
}

/**
 * Verify the given refresh token is valid, active and has not expired yet.
 *
 * @param {string} token
 * @param {string} encodedAppId
 */
export async function verifyRefreshToken(token: string) {
  try {
    return jwt.verifyRefreshToken(token);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      const error = new ErrorFormatter({
        code: ERROR_TYPES.UNAUTHORIZED,
        message: 'Refresh token expired'
      }).construct();

      throw { statusCode: httpStatus.UNAUTHORIZED, error };
    }

    const error = new ErrorFormatter({
      code: ERROR_TYPES.UNAUTHORIZED,
      message: 'Refresh token expired'
    }).construct();

    throw { statusCode: httpStatus.UNAUTHORIZED, error };
  }
}
