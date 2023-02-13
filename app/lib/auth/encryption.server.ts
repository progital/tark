import crypto from 'crypto';
import { getRequiredEnvVariable } from '~/lib/utils.server';

const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;
const secret = getRequiredEnvVariable('MAGIC_LINK_SECRET');
const ENCRYPTION_KEY = crypto.scryptSync(secret, 'salt', 32);

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text: string) {
  const [ivPart, encryptedPart] = text.split(':');
  if (!ivPart || !encryptedPart) {
    throw new Error('Invalid text.');
  }

  const iv = Buffer.from(ivPart, 'hex');
  const encryptedText = Buffer.from(encryptedPart, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
}

export { encrypt, decrypt };
