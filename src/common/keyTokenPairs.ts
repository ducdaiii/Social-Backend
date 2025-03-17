import * as jwt from 'jsonwebtoken';

export const keyTokenPairs = async (
  payload: object,
  publicKey: string,
  privateKey: string,
) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};