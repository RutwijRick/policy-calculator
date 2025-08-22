import crypto from 'crypto';
import dotenv from "dotenv";

dotenv.config();

const key = Buffer.from(process.env.CRYPTO_KEY_HEX, 'hex'); // 32 bytes
const nonce = Buffer.from(process.env.CRYPTO_NONCE_HEX, 'hex'); // 12 bytes (GCM)

export const encrypt = (plain) => {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
    const enc = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${enc.toString('base64')}::${tag.toString('base64')}`;
};

export const decrypt = (payload) => {
    const [encB64, tagB64] = String(payload).split('::');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    const dec = Buffer.concat([decipher.update(Buffer.from(encB64, 'base64')), decipher.final()]);
    return dec.toString('utf8');
};

export const mask = (s, keep = 3) => {
    if (!s) return '';
    const x = String(s);
    if (x.length <= keep) return '*'.repeat(x.length);
    return x.slice(0, keep) + '*'.repeat(x.length - keep);
};
