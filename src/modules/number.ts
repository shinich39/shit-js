/**
 * Mulberry32 PRNG (Pseudo Random Number Generator)
 * 
 * https://github.com/cprosche/mulberry32
 */
function mulberry32(seed: number) {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
/**
 * @returns min <= n < max
 */
export function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
/**
 * Mulberry32 PRNG (Pseudo Random Number Generator)
 * 
 * @returns min <= n < max
 */
export function getRandomFloatWithSeed(min: number, max: number, seed: number) {
  return mulberry32(seed) * (max - min) + min;
}
/**
 * @returns min <= n < max
 */
export function getRandomInt(min: number, max: number) {
  return Math.floor(getRandomFloat(min, max));
}
/**
 * Mulberry32 PRNG (Pseudo Random Number Generator)
 * 
 * @returns min <= n < max
 */
export function getRandomIntWithSeed(min: number, max: number, seed: number) {
  return Math.floor(getRandomFloatWithSeed(min, max, seed));
}

export function getLengthFromInt(num: number) {
  return Math.log(num) * Math.LOG10E + 1 | 0;
}

export function getLengthFromFloat(num: number) {
  return ("" + num).replace(".", "").length;
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

export function toBytes(
  bytes: number,
  format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB",
) {
  if (format === "Bytes") {
    return bytes;
  }

  const i = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"].indexOf(format);

  if (i === -1) {
    throw new Error(`Invalid argument: ${format} is not supported format`);
  }

  return bytes * Math.pow(1024, i + 1);
}

export function toFileSize(
  bytes: number,
  format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB",
) {
  if (format === "Bytes") {
    return bytes;
  }

  const i = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"].indexOf(format);

  if (i === -1) {
    throw new Error(`Invalid argument: ${format} is not supported format`);
  }

  return bytes * Math.pow(1024, -(i + 1));
}

export function humanizeFileSize(
  num: number,
  format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB",
) {
  const bytes = toBytes(num, format);

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
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number
): [number, number] {
  const aspectRatio = srcWidth / srcHeight;
  return aspectRatio < dstWidth / dstHeight
    ? [dstHeight * aspectRatio, dstHeight]
    : [dstWidth, dstWidth / aspectRatio];
}

export function getCoveredSize(
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number
): [number, number] {
  const aspectRatio = srcWidth / srcHeight;
  return aspectRatio < dstWidth / dstHeight
    ? [dstWidth, dstWidth / aspectRatio]
    : [dstHeight * aspectRatio, dstHeight];
}

export function getAdjustedSize(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number
): [number, number] {
  const aspectRatio = srcWidth / srcHeight;

  let w = srcWidth;
  let h = srcHeight;

  if (w > maxWidth) {
    w = maxWidth;
    h = maxWidth / aspectRatio;
  }

  if (h > maxHeight) {
    h = maxHeight;
    w = maxHeight * aspectRatio;
  }

  if (w < minWidth) {
    w = minWidth;
    h = minWidth / aspectRatio;
  }

  if (h < minHeight) {
    h = minHeight;
    w = minHeight * aspectRatio;
  }

  return [w, h];
}
