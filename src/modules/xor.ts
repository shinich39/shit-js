/**
 * @param salt salt.length must be greater than 0
 * @example
 * const original = "text";
 * const encrypted = xor(original, "this is salt!");
 * const decrypted = xor(encrypted, "this is salt!"); // "text"
 */
export function xor(str: string, salt: string): string {
  const saltSize = salt.length;

  if (saltSize === 0) {
    throw new Error(`Invalid argument: salt.length === 0`);
  }

  let result = "";

  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i % saltSize));
  }

  return result;
}
