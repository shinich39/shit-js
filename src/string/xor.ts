/**
 * @param salt salt.length must be greater than 0
 * @example
 * const encrypted = xor("Hello, world!", "this is salt!");  // "OESW"
 * const decrypted = xor(encrypted, "this is salt!"); // "Hello, world!"
 */
export function xor(str: string, salt: string): string {
  const saltSize = salt.length;

  if (saltSize === 0) {
    throw new Error(`The salt must be at least 1.`);
  }

  let result = "";

  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i % saltSize));
  }

  return result;
}
