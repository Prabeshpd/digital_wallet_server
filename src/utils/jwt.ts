import * as jwt from 'jsonwebtoken';

import config from '../config';
import * as object from '../utils/object';
import { UserDetail } from '../models/User';

export interface AccessTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate tokens.
 *
 * @param {UserDetail} data
 * @returns {AccessTokens}
 */
export function generateTokens(data: UserDetail): AccessTokens {
  return {
    accessToken: generateAccessToken(data),
    refreshToken: generateRefreshToken(data)
  };
}

/**
 * Generate Access Token for the provided user detail.
 *
 * @param {UserDetail} data
 * @param {string} [extraSalt='']
 * @returns {string}
 */
export function generateAccessToken(data: UserDetail, extraSalt: string = ''): string {
  const { accessTokenSecret, accessTokenDuration } = config.auth;
  const secret = accessTokenSecret + extraSalt;
  const payload = object.withoutAttrs<UserDetail>({ ...data }, ['exp', 'iat']);

  return generateToken(payload, secret, {
    expiresIn: accessTokenDuration
  });
}

/**
 * Generate refresh token for the user.
 *
 * @param {UserDetail} data
 * @param {string} [extraSalt='']
 * @returns {string}
 */
export function generateRefreshToken(data: UserDetail, extraSalt: string = ''): string {
  const { refreshTokenSecret, refreshTokenDuration } = config.auth;
  const secret = refreshTokenSecret + extraSalt;

  return generateToken(data, secret, {
    expiresIn: refreshTokenDuration
  });
}

/**
 * Verify refresh token.
 *
 * @param {string} token
 * @param {string} [extraSalt='']
 * @returns
 */
export function verifyRefreshToken(token: string, extraSalt: string = '') {
  const { refreshTokenSecret } = config.auth;
  const secret = refreshTokenSecret + extraSalt;

  return verifyToken(token, secret);
}

/**
 * Verify JWT token against a secret
 *
 * @param {string} token
 * @param {string} secret
 * @returns {jwt.DecodeOptions | jwt.JsonWebTokenError}
 */
export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}

/**
 * Decode token.
 *
 * @param token
 */
export function decode(token: string): null | object | string {
  return jwt.decode(token);
}

/**
 * Generates a signed jwt token.
 *
 * @param {string | object | Buffer} payload
 * @param {string} secret
 * @param {jwt.SignOptions} options
 * @returns {string}
 */
export function generateToken(payload: string | object | Buffer, secret: string, options?: jwt.SignOptions): string {
  return jwt.sign(payload, secret, options);
}
