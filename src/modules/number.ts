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
 * @example
 * const result = toBytes(1, "MB"); // 1024 * 1024
 */
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
/**
 * @example
 * const result = toFileSize(1024 * 1024, "MB"); // 1
 */
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
/**
 * @example
 * const result = humanizeFileSize(1024 * 1024, "Bytes"); // "1.00 MB"
 */
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
/**
 * @example
 * const result = getContainedSize(100, 100, 200, 100); // [100, 100]
 */
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
/**
 * @example
 * const result = getCoveredSize(100, 100, 200, 100); // [200, 200]
 */
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
/**
 * @example
 * const result = getAdjustedSize(175, 175, 200, 200, 100, 100); // [175, 175]
 */
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
