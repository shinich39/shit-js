/**
 * @example
 * const result = Brackets["("]; // ")"
 */
export const Brackets = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
  "（": "）",
  "［": "］",
  "｛": "｝",
  "＜": "＞",
  "「": "」",
  "『": "』",
  "【": "】",
  "〔": "〕",
  "〘": "〙",
  "〖": "〗",
  "〈": "〉",
  "《": "》",
  "❨": "❩",
  "❪": "❫",
  "❴": "❵",
  "❬": "❭",
  "❮": "❯",
  "❲": "❳",
  "〚": "〛",
  "｢": "｣",
  "⟨": "⟩",
  "❰": "❱",
} as const;
/**
 * @example
 * const result = Quotes["'"]; // "'"
 */
export const Quotes = {
  "'": "'",
  "\"": "\"",
  "`": "`",
  "‘": "’",
  "“": "”",
  "‛": "‛",
  "‟": "‟",
  "„": "“",
  "«": "»",
} as const;
/**
 * @example
 * const result = toTitleCase("lorem-ipsum"); // "Lorem Ipsum"
 */
export function toTitleCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
/**
 * @example
 * const result = toSentenceCase("lorem ipsum"); // "Lorem ipsum"
 */
export function toSentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * @example
 * const result = toSlug(" Lorem  ipsum "); // "lorem-ipsum"
 */
export function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}
/**
 * @example
 * const result = toCamelCase("Lorem ipsum"); // "loremIpsum"
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toLowerCase()); 
}
/**
 * @example
 * const result = toPascalCase("lorem ipsum"); // "LoremIpsum"
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (m) => m.toUpperCase()); 
}
/**
 * @example
 * const uuid = generateUuid(); // "ce0e915d-0b16-473c-bd89-d3d7492bb1b9"
 */
export function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
/**
 * @example
 * const result = generateString("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", 1); // "a"
 * const result = generateString(); // "a"
 */
export function generateString(
  charset: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-",
  size: number = 1,
): string {
  let result = "";
  
  const charsetSize = charset.length;

  for (let i = 0; i < size; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetSize));
  }

  return result;
}
/**
 * @example
 * const encrypted = generateXor("text", "this is salt!");
 * const decrypted = generateXor(encrypted, "this is salt!"); // "text"
 */
export function generateXor(str: string, salt: string): string {
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
/**
 * @example
 * conss result = getInts("ftp://192.168.0.1"); // [192, 168, 0, 1]
 */
export function getInts(str: string): number[] {
  return str.match(/([0-9]+)/g)?.map((item) => parseInt(item)) || [];
}
/**
 * @example
 * const result = getFloats("ftp://192.168.0.1"); // [192.168, 0.1]
 */
export function getFloats(str: string): number[] {
  return str.match(/[0-9]+(\.[0-9]+)?/g)?.map((item) => parseFloat(item)) || [];
}
/**
 * 1. Change full-width characters to half-width characters
 * 2. Change all type of whitespaces to " "
 * 
 * @example
 * const result = toHalfWidthString("Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"); // "Hello, world!"
 */
export function toHalfWidthString(str: string): string {
  return str
    .replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/[^\S\r\n]/g, " ");
}
/**
 * @example
 * const result = toFullWidthString("Hello, world!"); // "Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"
 */
export function toFullWidthString(str: string): string {
  return str
    .replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0))
    .replace(/ /g, "　");
}
/**
 * @example
 * const result = toRegExp("/abc/gi"); // /abc/gi
 */
export function toRegExp(str: string): RegExp {
  const parts = str.split("/");

  if (parts.length < 3) {
    throw new Error(`Invalid argument: ${str}`);
  }

  const flags = parts.pop();
  const pattern = parts.slice(1).join("/");

  return new RegExp(pattern, flags);
}
/**
 * Myers algorithm
 *
 * \-1: Number of deleted characters
 *
 * 0: Number of matched characters
 *
 * 1: Number of inserted characters
 * 
 * @example
 * const result = getDiffs("Lorem", "ore"); // [[-1, "L"], [0, "ore"], [-1, "m"]]
 */
export function getDiffs(from: string, to: string): [number, string][] {
  const backtrack = function(
    from: string,
    to: string,
    trace: number[][],
    d: number
  ): [-1 | 0 | 1, string][] {
    const result: [-1 | 0 | 1, string][] = [];
    
    let x = from.length;
    let y = to.length;
    const max = from.length + to.length;
    
    // Current operation being accumulated
    let currentOp: -1 | 0 | 1 | null = null;
    let currentStr = '';
    
    const push = (op: -1 | 0 | 1, char: string) => {
      if (currentOp === op) {
        // If same operation, prepend character
        currentStr = char + currentStr;
      } else {
        // If different operation, push previous to result and start new
        if (currentOp !== null && currentStr) {
          result.push([currentOp, currentStr]);
        }
        currentOp = op;
        currentStr = char;
      }
    };
    
    // Trace path in reverse
    for (let depth = d; depth >= 0; depth--) {
      const v = trace[depth];
      const k = x - y;
      
      let prevK: number;
      
      if (k === -depth || (k !== depth && v[k - 1 + max] < v[k + 1 + max])) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      
      const prevX = v[prevK + max];
      const prevY = prevX - prevK;
      
      // Diagonal move (match)
      while (x > prevX && y > prevY) {
        x--;
        y--;
        push(0, from[x]);
      }
      
      if (depth === 0) break;
      
      // Vertical move (insertion)
      if (x === prevX) {
        y--;
        push(1, to[y]);
      } // Horizontal move (deletion)
      else {
        x--;
        push(-1, from[x]);
      }
    }
    
    // Add last accumulated operation
    if (currentOp !== null && currentStr) {
      result.push([currentOp, currentStr]);
    }
    
    return result.reverse();
  }

  const n = from.length;
  const m = to.length;
  const max = n + m;
  
  // V array: maximum x coordinate reachable on each k-line
  const v: number[] = Array(2 * max + 1).fill(0);
  
  // Array for path tracing
  const trace: number[][] = [];
  
  // Find shortest edit path
  for (let d = 0; d <= max; d++) {
    trace.push([...v]);
    
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      
      if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
        x = v[k + 1 + max];
      } else {
        x = v[k - 1 + max] + 1;
      }
      
      let y = x - k;
      
      while (x < n && y < m && from[x] === to[y]) {
        x++;
        y++;
      }
      
      v[k + max] = x;
      
      if (x >= n && y >= m) {
        return backtrack(from, to, trace, d);
      }
    }
  }
  
  // In theory, does not reach here.
  return [];
}
/**
 * @example
 * const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * const b = "sit amet, adipiscing";
 * const result = matchStrings(a, b);
 * // {
 * //   matchRate: 0.35714285714285715,
 * //   similarity: 0.35714285714285715,
 * //   diceSimilarity: 0.5263157894736842,
 * //   jaccardSimilarity: 0.35714285714285715,
 * //   distance: 36,
 * //   normalizedDistance: 0.6428571428571429,
 * //   matches: 20,
 * //   insertions: 0,
 * //   deletions: 36
 * // }
 */
export function matchStrings(from: string, to: string): {
  matchRate: number,
  similarity: number,
  diceSimilarity: number,
  jaccardSimilarity: number,
  distance: number,
  normalizedDistance: number,
  matches: number,
  insertions: number,
  deletions: number,
} {
  const diff = getDiffs(from, to);
  
  let matches = 0;
  let insertions = 0;
  let deletions = 0;
  
  for (const [op, str] of diff) {
    const len = str.length;
    if (op === 0) {
      matches += len;
    } else if (op === 1) {
      insertions += len;
    } else {
      deletions += len;
    }
  }
  
  const totalOperations = matches + insertions + deletions;
  
  // Various similarity metrics
  return {
    // Proportion of matching characters
    matchRate: totalOperations > 0 
      ? matches / totalOperations 
      : 1,
    
    // Similarity based on longer string
    similarity: Math.max(from.length, to.length) > 0 
      ? matches / Math.max(from.length, to.length) 
      : 1,

    // Sørensen-dice similarity coefficient
    diceSimilarity: (from.length + to.length) > 0
      ? (2 * matches) / (from.length + to.length)
      : 1,
    
    // Jaccard similarity coefficient
    jaccardSimilarity: (from.length + to.length - matches) > 0
      ? matches / (from.length + to.length - matches)
      : 1,
    
    // Levenshtein distance (edit distance)
    distance: insertions + deletions,
    
    // Normalized edit distance (0 = identical, 1 = completely different)
    normalizedDistance: Math.max(from.length, to.length) > 0
      ? (insertions + deletions) / Math.max(from.length, to.length)
      : 0,
    
    // Detailed counts
    matches,
    insertions,
    deletions,
  };
}
/**
 * @returns bytes
 * @example
 * const bytes = getStringSize("abc"); // 3
 * const bytes = getStringSize("ㄱㄴㄷ"); // 9
 */
export function getStringSize(str: string): number {
  let result = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x7f) {
      // 1 byte for ASCII
      result += 1;
    } else if (code <= 0x7ff) {
      // 2 bytes for characters in range U+0080 to U+07FF
      result += 2;
    } else if (code <= 0xffff) {
      // 3 bytes for characters in range U+0800 to U+FFFF
      result += 3;
    } else {
      // 4 bytes for characters in range U+10000 to U+10FFFF
      result += 4;
    }
  }
  
  return result;
}