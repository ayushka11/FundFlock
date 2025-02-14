import crypto from 'crypto';

export function md5hash(str: string): string {
  return crypto.createHash("md5").update(str, "utf8").digest("hex")
}
