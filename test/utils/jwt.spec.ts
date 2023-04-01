import 'mocha';
import { expect } from 'chai';

import { decode, generateAccessToken, generateRefreshToken } from '../../src/utils/jwt';
import { UserDetail } from '../../src/models/User';

describe('Utils: jwt', () => {
  const userDetail: UserDetail = {
    isActive: true,
    id: 1,
    name: 'fake random',
    email: 'fake_data@gmail.com',
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString()
  };

  describe('generateAccessToken()', () => {
    it('should generate access token string', () => {
      expect(typeof generateAccessToken(userDetail)).to.equal('string');
    });
  });

  describe('generateRefreshToken()', () => {
    it('should generate refresh token string', () => {
      expect(typeof generateRefreshToken(userDetail)).to.equal('string');
    });
  });

  describe('decode()', () => {
    interface DecodedUserDetail extends UserDetail {
      iat: number;
      exp: number;
    }

    it('should return initial data after decoding access_token', () => {
      const decodedData = decode(generateAccessToken(userDetail)) as DecodedUserDetail;
      const { iat, exp, ...decodedUserDetail } = decodedData;

      expect(decodedUserDetail).to.deep.equals(userDetail);
      expect(decodedData).to.haveOwnProperty('exp');
      expect(decodedData).to.haveOwnProperty('iat');
    });

    it('should return initial data after decoding refresh_token', () => {
      const decodedData = decode(generateRefreshToken(userDetail)) as DecodedUserDetail;
      const { iat, exp, ...decodedUserDetail } = decodedData;

      expect(decodedUserDetail).to.deep.equals(userDetail);
      expect(decodedData).to.haveOwnProperty('exp');
      expect(decodedData).to.haveOwnProperty('iat');
    });
  });
});
