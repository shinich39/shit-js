/**
 * find top level string
 *
 * skip inside of bracket and quotes
 */
export function findString(str: string, target: string, fromIndex?: number) {
  if (!fromIndex) {
    fromIndex = 0;
  } else if (fromIndex < 0) {
    fromIndex = str.length - 1 + fromIndex;
  }

  const len = target.length;

  let i = fromIndex,
    closing: string | null = null;

  const match =
    len === 1
      ? () => str[i] === target
      : () => {
          for (let j = 0; j < len; j++) {
            if (str[i + j] !== target[j]) {
              return false;
            }
          }
          return true;
        };

  while (i < str.length) {
    // pass escaped character
    if (str[i] === "\\") {
      i++;
    } else if (!closing) {
      if (match()) {
        return i;
      }

      if (str[i] === '"' || str[i] === "'") {
        closing = str[i];
      } else if (str[i] === "(") {
        closing = ")";
      } else if (str[i] === "{") {
        closing = "}";
      } else if (str[i] === "[") {
        closing = "]";
      } else if (str[i] === "<") {
        closing = ">";
      }
    } // find closing
    else {
      if (str[i] === closing) {
        closing = null;
      }
    }

    i++;
  }

  return -1;
}

export function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getRandomChar(charset: string) {
  return charset.charAt(Math.floor(Math.random() * charset.length));
}

export function getRandomString(charset: string, size: number) {
  let result = "";
  for (let i = 0; i < size; i++) {
    result += getRandomChar(charset);
  }
  return result;
}

export function getInts(str: string) {
  return str.match(/([0-9]+)/g)?.map((item) => parseInt(item)) || [];
}

export function getFloats(str: string) {
  return str.match(/[0-9]+(\.[0-9]+)?/g)?.map((item) => parseFloat(item)) || [];
}

export function getXORString(str: string, salt: string) {
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
/**
 * change full-width characters to half-width characters
 */
export function normalizeString(str: string) {
  return str
    .replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/[^\S\r\n]/g, " ");
}
/**
 * @param str "/abc/gi"
 */
export function toRegExp(str: string) {
  const parts = str.split("/");
  if (parts.length < 3) {
    throw new Error(`Invalid argument: ${str}`);
  }
  const flags = parts.pop();
  const pattern = parts.slice(1).join("/");
  return new RegExp(pattern, flags);
}
/**
 * myers Algorithm
 *
 * \-1: number of deleted characters
 *
 * 0: number of matched characters
 *
 * 1: number of inserted characters
 * 
 * @example
 * const result = compareString("Lorem", "ore"); // [[-1, "L"], [0, "ore"], [-1, "m"]]
 */
export function compareString(from: string, to: string) {

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
    
    // current operation being accumulated
    let currentOp: -1 | 0 | 1 | null = null;
    let currentStr = '';
    
    const push = (op: -1 | 0 | 1, char: string) => {
      if (currentOp === op) {
        // if same operation, prepend character
        currentStr = char + currentStr;
      } else {
        // if different operation, push previous to result and start new
        if (currentOp !== null && currentStr) {
          result.push([currentOp, currentStr]);
        }
        currentOp = op;
        currentStr = char;
      }
    };
    
    // trace path in reverse
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
      
      // diagonal move (match)
      while (x > prevX && y > prevY) {
        x--;
        y--;
        push(0, from[x]);
      }
      
      if (depth === 0) break;
      
      // vertical move (insertion)
      if (x === prevX) {
        y--;
        push(1, to[y]);
      }
      // horizontal move (deletion)
      else {
        x--;
        push(-1, from[x]);
      }
    }
    
    // add last accumulated operation
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
  
  // array for path tracing
  const trace: number[][] = [];
  
  // find shortest edit path
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
  
  // in theory, does not reach here.
  return [];
}

export function matchStrings(from: string, to: string) {
  const diff = compareString(from, to);
  
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
  
  // various similarity metrics
  return {
    // proportion of matching characters
    matchRate: totalOperations > 0 ? matches / totalOperations : 1,
    
    // similarity based on longer string
    similarity: Math.max(from.length, to.length) > 0 
      ? matches / Math.max(from.length, to.length) 
      : 1,

    // sørensen-dice similarity coefficient
    diceSimilarity: (from.length + to.length) > 0
      ? (2 * matches) / (from.length + to.length)
      : 1,
    
    // jaccard similarity coefficient
    jaccardSimilarity: (from.length + to.length - matches) > 0
      ? matches / (from.length + to.length - matches)
      : 1,
    
    // levenshtein distance (edit distance)
    distance: insertions + deletions,
    
    // Normalized edit distance (0 = identical, 1 = completely different)
    normalizedDistance: Math.max(from.length, to.length) > 0
      ? (insertions + deletions) / Math.max(from.length, to.length)
      : 0,
    
    // detailed counts
    matches,
    insertions,
    deletions,
  };
}