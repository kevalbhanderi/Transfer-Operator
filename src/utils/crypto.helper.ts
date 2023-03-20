import * as crypto from 'crypto';

export const hmacSHA256 = (content, key) => {
  return crypto.createHmac('sha256', key).update(content, 'utf8').digest('hex');
};
