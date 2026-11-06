import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

export function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [alg, saltHex, keyHex] = stored.split("$");
  if (alg !== "scrypt" || !saltHex || !keyHex) return false;
  const key = Buffer.from(keyHex, "hex");
  const test = scryptSync(pw, Buffer.from(saltHex, "hex"), key.length, { N: 16384, r: 8, p: 1 });
  return timingSafeEqual(key, test);
}
