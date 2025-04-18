/**
 * include
 */
export function hasBits(a: number, b: number) {
  return !!(a & b);
}
/**
 * or
 */
export function addBits(a: number, b: number) {
  return a | b;
}
/**
 * and-not
 */
export function clearBits(a: number, b: number) {
  return a & ~b;
}
/**
 * xor
 */
export function invertBits(a: number, b: number) {
  return a ^ b;
}
/**
 * @returns min <= n < max
 */
export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
/**
 * @returns min <= n <= max
 */
export function getClampedNumber(num: number, min: number, max: number) {
  return Math.min(max, Math.max(num, min));
}
/**
 * @returns min <= n < max
 */
export function getLoopedNumber(num: number, min: number, max: number) {
  num -= min;
  max -= min;

  if (num < 0) {
    num = (num % max) + max;
  }

  if (num >= max) {
    num = num % max;
  }

  return num + min;
}
/**
 * @returns bytes
 */
export function calcStringSize(str: string) {
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

export function convertFileSize(
  num: number,
  from: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB",
  to: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = units.indexOf(from);
  if (i === -1) {
    throw new Error(`Invalid source unit: ${from}`);
  }

  const j = units.indexOf(to);
  if (j === -1) {
    throw new Error(`Invalid destination unit: ${to}`);
  }

  return num * Math.pow(1024, i - j);
}

export function humanizeFileSize(
  num: number,
  format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) {
  const bytes = convertFileSize(num, format, "Bytes");
  if (bytes === 0) {
    return "0 Bytes";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  // keep 2 decimal places
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  return (
    size + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i]
  );
}

export function getContainedSize(
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): [number, number] {
  const ar = sourceWidth / sourceHeight; // aspect ratio
  return ar < destinationWidth / destinationHeight
    ? [destinationHeight * ar, destinationHeight]
    : [destinationWidth, destinationWidth / ar];
}

export function getCoveredSize(
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): [number, number] {
  const ar = sourceWidth / sourceHeight; // aspect ratio
  return ar < destinationWidth / destinationHeight
    ? [destinationWidth, destinationWidth / ar]
    : [destinationHeight * ar, destinationHeight];
}

export function getAdjustedSize(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number
): [number, number] {
  const ar = sourceWidth / sourceHeight; // aspect ratio

  let w = sourceWidth;
  let h = sourceHeight;

  if (w > maxWidth) {
    w = maxWidth;
    h = maxWidth / ar;
  }

  if (h > maxHeight) {
    h = maxHeight;
    w = maxHeight * ar;
  }

  if (w < minWidth) {
    w = minWidth;
    h = minWidth / ar;
  }

  if (h < minHeight) {
    h = minHeight;
    w = minHeight * ar;
  }

  return [w, h];
}
