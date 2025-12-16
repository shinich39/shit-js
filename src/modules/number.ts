/**
 * Mulberry32 PRNG (Pseudo Random Number Generator)
 * 
 * https://github.com/cprosche/mulberry32
 */
function mulberry32(seed: number): number {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
/**
 * @returns min <= n < max
 * 
 * @example
 * const result = generateFloat(0, 1); // 0.12451251251251
 * const result = generateFloat(0, 1, 0); // 0.26642920868471265
 * const result = generateFloat(0, 1, 10); // 0.5019920116756111
 * const result = generateFloat(0, 1, 100); // 0.2043598669115454
 */
export function generateFloat(min: number, max: number, seed?: number | null | undefined): number {
  return typeof seed === "number"
    ? mulberry32(seed) * (max - min) + min
    : Math.random() * (max - min) + min;
}
/**
 * @returns min <= n < max
 * 
 * @example
 * const result = generateInt(0, 10); // 5
 * const result = generateInt(0, 10, 0); // 2
 * const result = generateInt(0, 10, 10); // 5
 * const result = generateInt(0, 10, 100); // 2
 */
export function generateInt(min: number, max: number, seed?: number | null | undefined): number {
  return Math.floor(generateFloat(min, max, seed));
}
/**
 * @example
 * const result = getLengthFromInt(10); // 2
 * const result = getLengthFromInt(100); // 3
 */
export function getLengthFromInt(num: number): number {
  return Math.log(num) * Math.LOG10E + 1 | 0;
}
/**
 * @example
 * const result = getLengthFromFloat(1.2); // 2
 * const result = getLengthFromFloat(1.23); // 3
 */
export function getLengthFromFloat(num: number): number {
  return ("" + num).replace(".", "").length;
}
/**
 * @returns min <= n <= max
 * 
 * @example
 * const result = getClampedNumber(5, 0, 10); // 5
 * const result = getClampedNumber(10, 0, 10), 1; // 10
 */
export function getClampedNumber(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(num, min));
}
/**
 * @returns min <= n < max
 * 
 * @example
 * const result = getLoopedNumber(-5, 0, 10); // 5
 * const result = getLoopedNumber(-2.5, 0, 10); // 7.5
 * const result = getLoopedNumber(0, 0, 10); // 0
 * const result = getLoopedNumber(5, 0, 10); // 5
 * const result = getLoopedNumber(10, 0, 10); // 0
 * const result = getLoopedNumber(20, 0, 10); // 0
 */
export function getLoopedNumber(num: number, min: number, max: number): number {
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
 * const result = toBytes(1, "MB"); // 1048576
 */
export function toBytes(
  bytes: number,
  format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB",
): number {
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
): number {
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
): string {
  const bytes = toBytes(num, format);

  if (bytes === 0) {
    return "0 Bytes";
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  // Keep 2 decimal places
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  return size + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i];
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
/**
 * @example
 * getLogScore(100, 0); // 0
 * getLogScore(100, 25); // 0.7059613126314263
 * getLogScore(100, 50); // 0.8519443031609923
 * getLogScore(100, 75); // 0.9383792523906672
 * getLogScore(100, 100); // 1
 */
export function getLogScore(total: number, current: number): number {
  return Math.log(current + 1) / Math.log(total + 1);
}
/**
 * @example
 * getPowerScore(100, 0); // 0
 * getPowerScore(100, 25); // 0.5
 * getPowerScore(100, 50); // 0.7071067811865476
 * getPowerScore(100, 75); // 0.8660254037844387
 * getPowerScore(100, 100); // 1
 */
export function getPowerScore(total: number, current: number, alpha: number = 0.5): number {
  return Math.pow(current, alpha) / Math.pow(total, alpha);
}