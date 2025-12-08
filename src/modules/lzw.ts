/**
 * @example
 * const compressed = compressLZW("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
 * // [
 * //    76, 111, 114, 101, 109,  32, 105, 112, 115,
 * //   117, 260, 100, 111, 108, 257,  32, 115, 105,
 * //   116,  32,  97, 109, 101, 116,  44,  32,  99,
 * //   111, 110, 115, 101,  99, 116, 278, 117, 114,
 * //   275, 100, 262, 105, 115,  99, 105, 110, 103,
 * //    32, 101, 108, 273,  46
 * // ]
 */
export function compressLzw(input: string): number[] {
  const dict: Record<string, number> = {};
  const data = input.split("");
  const result: number[] = [];
  let dictSize = 256;

  // Initialization (ASCII)
  for (let i = 0; i < 256; i++) {
    dict[String.fromCharCode(i)] = i;
  }

  let w = "";
  for (const c of data) {
    const wc = w + c;
    if (dict[wc]) {
      w = wc;
    } else {
      result.push(dict[w]);
      dict[wc] = dictSize++;
      w = String(c);
    }
  }

  if (w !== "") result.push(dict[w]);
  return result;
}
/**
 * @example
 * const decompressed = decompressLZW([76, 111, 114, 101, 109, ...]);
 * // "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
 */
export function decompressLzw(compressed: number[]): string {
  const dict: string[] = [];
  let dictSize = 256;

  // Initialization (ASCII)
  for (let i = 0; i < 256; i++) {
    dict[i] = String.fromCharCode(i);
  }

  let w = String.fromCharCode(compressed[0]);
  let result = w;

  for (let i = 1; i < compressed.length; i++) {
    const k = compressed[i];
    let entry: string;

    if (dict[k]) {
      entry = dict[k];
    } else if (k === dictSize) {
      entry = w + w[0];
    } else {
      throw new Error("Invalid LZW code: " + k);
    }

    result += entry;
    dict[dictSize++] = w + entry[0];
    w = entry;
  }

  return result;
}