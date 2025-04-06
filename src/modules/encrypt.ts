/**
 * encrypt string using XOR encryption
 */
export function xor(str: string, salt: string) {
  const l = salt.length;
  if (l === 0) {
    throw new Error(`Invalid argument: salt.length === 0`);
  }

  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i % l));
  }
  return result;
}
