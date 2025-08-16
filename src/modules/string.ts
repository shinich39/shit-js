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
 * analyze diff between two strings
 *
 * \-1: Number of deleted characters
 *
 * 0: Number of matched characters
 *
 * 1: Number of inserted characters
 */
export function compareString(from: string, to: string) {
    // create a dynamic programming table
  const dp: number[][] = Array.from({ length: from.length + 1 }, () =>
    Array(to.length + 1).fill(0)
  );

  // fill dp with LCS
  for (let i = 1; i <= from.length; i++) {
    for (let j = 1; j <= to.length; j++) {
      if (from[i - 1] === to[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // backtrack to get diffs
  const result: [-1 | 0 | 1, string][] = [];
  let score = 0;
  let i = from.length,
    j = to.length;

  while (i > 0 || j > 0) {
    const prev = result[result.length - 1];
    const a = from[i - 1];
    const b = to[j - 1];

    if (i > 0 && j > 0 && a === b) {
      // match
      if (prev && prev[0] === 0) {
        prev[1] = a + prev[1];
      } else {
        result.push([0, a]);
      }
      score++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // insertion
      if (prev && prev[0] === 1) {
        prev[1] = b + prev[1];
      } else {
        result.push([1, b]);
      }
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      // deletion
      if (prev && prev[0] === -1) {
        prev[1] = a + prev[1];
      } else {
        result.push([-1, a]);
      }
      i--;
    }
  }

  return {
    accuracy: score * 2 / (from.length + to.length),
    score,
    match: result.reverse(),
  }
}
