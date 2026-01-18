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
 * AND gate
 * 
 * @example
 * checkBit(0b1100, 0b1000); // true
 */
export function checkBit(a: number, b: number): boolean {
  return (a & b) !== 0;
}
/**
 * OR gate
 * 
 * @example
 * setBit(0b1100, 0b1000); // 0b1100
 */
export function setBit(a: number, b: number): number {
  return a | b;
}
/**
 * AND-NOT gate
 * 
 * @example
 * clearBit(0b1100, 0b1110); // 0b0000
 */
export function clearBit(a: number, b: number): number {
  return a & ~b;
}
/**
 * XOR gate
 * 
 * @example
 * toggleBit(0b1100, 0b1110); // 0b0010
 */
export function toggleBit(a: number, b: number): number {
  return a ^ b;
}
/**
 * @example
 * toBitString(0b1100); // "1100"
 * toBitString(0b1111); // "1111"
 * toBitString(0b1111, 4); // "1111"
 * toBitString(0b1111, 8); // "00001111"
 * toBitString(0b10101010); // "10101010"
 */
export function toBitString(bit: number, size?: number): string {
  return bit
    .toString(2)
    .padStart(Math.max(bit === 0 ? 1 : Math.floor(Math.log2(bit)) + 1, size || 1), "0");
}
/**
 * @returns min <= n < max
 * 
 * @example
 * generateFloat(0, 1); // 0.12451251251251
 * generateFloat(0, 1, 0); // 0.26642920868471265
 * generateFloat(0, 1, 10); // 0.5019920116756111
 * generateFloat(0, 1, 100); // 0.2043598669115454
 */
export function generateFloat(min: number, max: number, seed?: number | null | undefined): number {
  return typeof seed === "number"
    ? mulberry32(seed) * (max - min) + min
    : Math.random() * (max - min) + min;
}
/**
 * @example
 * const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * for (cosnt char of str) {
 *   const delay = generateTypingDelay(char, 1);
 *   process.stdout.write(char);
 *   await sleep(delay);
 * }
 */
export function generateTypingDelay(
  char: string,
  speed = 1,
): number {
  let velocity = 0;
  let drift = 0;

  return (() => {
    const scale = (v: number) => v / speed;

      let base: number;

      // Sentence
      if (/[.,!?]/.test(char)) {
        base = generateInt(scale(300), scale(480));
      } // Word
      else if (char === " ") {
        base = generateInt(scale(180), scale(300));
      } // Character
      else {
        base = generateInt(scale(85), scale(130));
      }

      velocity += (Math.random() - 0.5) * scale(1.1);
      velocity *= 0.8;

      drift += (Math.random() - 0.5) * scale(0.3);
      drift = Math.max(-scale(4.5), Math.min(drift, scale(4.5)));

      const accel = velocity * scale(4.5) + drift;

      base -= accel;

      // Clamp
      return Math.max(scale(45), Math.min(base, scale(520)));
  })();
}
/**
 * @returns min <= n < max
 * 
 * @example
 * generateInt(0, 10); // 5
 * generateInt(0, 10, 0); // 2
 * generateInt(0, 10, 10); // 5
 * generateInt(0, 10, 100); // 2
 */
export function generateInt(min: number, max: number, seed?: number | null | undefined): number {
  return Math.floor(generateFloat(min, max, seed));
}
/**
 * @example
 * getBitSize(1); // 1;
 * getBitSize(2); // 2;
 * getBitSize(4); // 3;
 * getBitSize(8); // 4;
 */
export function getBitSize(num: number): number {
  return num === 0 ? 1 : Math.floor(Math.log2(num)) + 1;
}
/**
 * @example
 * getIntSize(10); // 2
 * getIntSize(100); // 3
 */
export function getIntSize(num: number): number {
  return Math.log(num) * Math.LOG10E + 1 | 0;
}
/**
 * @example
 * getFloatSize(1.2); // 2
 * getFloatSize(1.23); // 3
 */
export function getFloatSize(num: number): number {
  return ("" + num).replace(".", "").length;
}
/**
 * @returns min <= n <= max
 * 
 * @example
 * getClampedNumber(5, 0, 10); // 5
 * getClampedNumber(10, 0, 10); // 10
 */
export function getClampedNumber(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(num, min));
}
/**
 * @returns min <= n < max
 * 
 * @example
 * getLoopedNumber(-5, 0, 10); // 5
 * getLoopedNumber(-2.5, 0, 10); // 7.5
 * getLoopedNumber(0, 0, 10); // 0
 * getLoopedNumber(5, 0, 10); // 5
 * getLoopedNumber(10, 0, 10); // 0
 * getLoopedNumber(20, 0, 10); // 0
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
 * To 0 - 360
 * 
 * @example
 * getClampedDegree(0); // 0
 * getClampedDegree(180); // 180
 * getClampedDegree(450); // 90
 * getClampedDegree(540); // 180
 * getClampedDegree(-90); // 270
 * getClampedDegree(-360); // 0
 * getClampedDegree(-540); // 180
 */
export function getClampedDegree(degree: number): number {
  return ((degree % 360) + 360) % 360;
}
/**
 * Degree → Radian
 * 
 * @example
 * toRadian(90); // 1.5708...
 * toRadian(180); // 3.1416...
 * ctx.rotate(toRadian(45)); // Rotate 45 degree in Canvas, WebGL, Three.js...
 */
export function toRadian(degree: number): number {
  return degree * (Math.PI / 180);
}
/**
 * Radian → Degree
 * 
 * @example
 * toDegree(Math.PI); // 180
 * toDegree(Math.PI * 2); // 360
 */
export function toDegree(radian: number): number {
  return radian * (180 / Math.PI);
}
/**
 * @example
 * getContainedSize(100, 100, 200, 100); // [100, 100]
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
 * getCoveredSize(100, 100, 200, 100); // [200, 200]
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
 * getAdjustedSize(175, 175, 200, 200, 100, 100); // [175, 175]
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
/**
 * @example
 * fromKilobyte(1); // Math.pow(1024, 1)
 */
export function fromKilobyte(kb: number): number {
  return kb * Math.pow(1024, 1);
}
/**
 * @example
 * fromMegabyte(1); // Math.pow(1024, 2)
 */
export function fromMegabyte(mb: number): number {
  return mb * Math.pow(1024, 2);
}
/**
 * @example
 * fromGigabyte(1); // Math.pow(1024, 3)
 */
export function fromGigabyte(gb: number): number {
  return gb * Math.pow(1024, 3);
}
/**
 * @example
 * fromTerabyte(1); // Math.pow(1024, 4)
 */
export function fromTerabyte(tb: number): number {
  return tb * Math.pow(1024, 4);
}
/**
 * @example
 * fromPetabyte(1); // Math.pow(1024, 5)
 */
export function fromPetabyte(pt: number): number {
  return pt * Math.pow(1024, 5);
}
/**
 * @example
 * fromExabyte(1); // Math.pow(1024, 6)
 */
export function fromExabyte(eb: number): number {
  return eb * Math.pow(1024, 6);
}
/**
 * @example
 * fromZettabyte(1); // Math.pow(1024, 7)
 */
export function fromZettabyte(zb: number): number {
  return zb * Math.pow(1024, 7);
}
/**
 * @example
 * fromYottabyte(1); // Math.pow(1024, 8)
 */
export function fromYottabyte(yb: number): number {
  return yb * Math.pow(1024, 8);
}
/**
 * @example
 * toKilobyte(Math.pow(1024, 1)); // 1
 */
export function toKilobyte(bytes: number): number {
  return bytes * Math.pow(1024, -1);
}
/**
 * @example
 * toMegabyte(Math.pow(1024, 2)); // 1
 */
export function toMegabyte(bytes: number): number {
  return bytes * Math.pow(1024, -2);
}
/**
 * @example
 * toGigabyte(Math.pow(1024, 3)); // 1
 */
export function toGigabyte(bytes: number): number {
  return bytes * Math.pow(1024, -3);
}
/**
 * @example
 * toTerabyte(Math.pow(1024, 4)); // 1
 */
export function toTerabyte(bytes: number): number {
  return bytes * Math.pow(1024, -4);
}
/**
 * @example
 * toPetabyte(Math.pow(1024, 5)); // 1
 */
export function toPetabyte(bytes: number): number {
  return bytes * Math.pow(1024, -5);
}
/**
 * @example
 * toExabyte(Math.pow(1024, 6)); // 1
 */
export function toExabyte(bytes: number): number {
  return bytes * Math.pow(1024, -6);
}
/**
 * @example
 * toZettabyte(Math.pow(1024, 7)); // 1
 */
export function toZettabyte(bytes: number): number {
  return bytes * Math.pow(1024, -7);
}
/**
 * @example
 * toYottabyte(Math.pow(1024, 8)); // 1
 */
export function toYottabyte(bytes: number): number {
  return bytes * Math.pow(1024, -8);
}
/**
 * @example
 * toFileSize(1024 * 1024); // "1 MB"
 * toFileSize(1024 * 1024 * 1024); // "1 GB"
 * toFileSize(1024 * 1024 * 1024 + 1024 * 1024 * 512); // "1.5 GB"
 */
export function toFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB",
  ];

  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  let formatted: number;

  if (value >= 100) {
    formatted = Math.round(value); // 123 MB
  } else if (value >= 10) {
    formatted = Math.round(value * 10) / 10; // 12.3 MB
  } else {
    formatted = Math.round(value * 100) / 100; // 1.23 MB
  }

  return `${formatted} ${units[unitIndex]}`;
}