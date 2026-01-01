/**
 * @example
 * const compressed = toLzw("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
 * // [
 * //    76, 111, 114, 101, 109,  32, 105, 112, 115,
 * //   117, 260, 100, 111, 108, 257,  32, 115, 105,
 * //   116,  32,  97, 109, 101, 116,  44,  32,  99,
 * //   111, 110, 115, 101,  99, 116, 278, 117, 114,
 * //   275, 100, 262, 105, 115,  99, 105, 110, 103,
 * //    32, 101, 108, 273,  46
 * // ]
 */
export function toLzw(input: string): number[] {
  const dict: Record<string, number> = {};
  const result: number[] = [];
  let dictSize: number = 256;

  // Initialization (ASCII)
  for (let i = 0; i < dictSize; i++) {
    dict[String.fromCharCode(i)] = i;
  }

  let w = "";

  for (const c of input) {
    const wc = w + c;
    if (dict[wc] !== undefined) {
      w = wc;
    } else {
      result.push(dict[w]);
      dict[wc] = dictSize++;
      w = c;
    }
  }

  if (w !== "") {
    result.push(dict[w]);
  }

  return result;
}
/**
 * @example
 * const decompressed = fromLzw([76, 111, 114, 101, 109, ...]);
 * // "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
 */
export function fromLzw(compressed: number[]): string {
  const dict: string[] = [];
  let dictSize: number = 256;

  // Initialization (ASCII)
  for (let i = 0; i < dictSize; i++) {
    dict[i] = String.fromCharCode(i);
  }

  let w: string = String.fromCharCode(compressed[0]);
  let result: string = w;

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