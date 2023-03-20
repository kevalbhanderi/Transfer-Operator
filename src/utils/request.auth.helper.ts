import { GeneralAuthRequestDto } from '../dto/auth.request.dto';
import * as crypto from 'crypto';
import { publicKey } from '../config/constants';

export const generalAuth = async (
  authRequestDto: GeneralAuthRequestDto,
  xSignature: string,
) => {
  const sha256 = (content) => {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  };

  const checksum = sha256(JSON.stringify(authRequestDto.data));
  if (authRequestDto.dataHash !== checksum) {
    throw new Error('Cannot compare dataHash and checksum!');
  }

  const key = crypto.createPublicKey({
    key: publicKey,
    format: 'pem',
    type: 'spki',
  });

  const verify = crypto.createVerify('SHA256');
  verify.write(authRequestDto.dataHash);
  verify.end();

  return verify.verify({ key }, xSignature, 'base64');
};
