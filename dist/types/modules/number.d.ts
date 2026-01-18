/**
 * AND gate
 *
 * @example
 * checkBit(0b1100, 0b1000); // true
 */
export declare function checkBit(a: number, b: number): boolean;
/**
 * OR gate
 *
 * @example
 * setBit(0b1100, 0b1000); // 0b1100
 */
export declare function setBit(a: number, b: number): number;
/**
 * AND-NOT gate
 *
 * @example
 * clearBit(0b1100, 0b1110); // 0b0000
 */
export declare function clearBit(a: number, b: number): number;
/**
 * XOR gate
 *
 * @example
 * toggleBit(0b1100, 0b1110); // 0b0010
 */
export declare function toggleBit(a: number, b: number): number;
/**
 * @example
 * toBitString(0b1100); // "1100"
 * toBitString(0b1111); // "1111"
 * toBitString(0b1111, 4); // "1111"
 * toBitString(0b1111, 8); // "00001111"
 * toBitString(0b10101010); // "10101010"
 */
export declare function toBitString(bit: number, size?: number): string;
/**
 * @returns min <= n < max
 *
 * @example
 * generateFloat(0, 1); // 0.12451251251251
 * generateFloat(0, 1, 0); // 0.26642920868471265
 * generateFloat(0, 1, 10); // 0.5019920116756111
 * generateFloat(0, 1, 100); // 0.2043598669115454
 */
export declare function generateFloat(min: number, max: number, seed?: number | null | undefined): number;
/**
 * @example
 * const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * for (cosnt char of str) {
 *   const delay = generateTypingDelay(char, 1);
 *   process.stdout.write(char);
 *   await sleep(delay);
 * }
 */
export declare function generateTypingDelay(char: string, speed?: number): number;
/**
 * @returns min <= n < max
 *
 * @example
 * generateInt(0, 10); // 5
 * generateInt(0, 10, 0); // 2
 * generateInt(0, 10, 10); // 5
 * generateInt(0, 10, 100); // 2
 */
export declare function generateInt(min: number, max: number, seed?: number | null | undefined): number;
/**
 * @example
 * getBitSize(1); // 1;
 * getBitSize(2); // 2;
 * getBitSize(4); // 3;
 * getBitSize(8); // 4;
 */
export declare function getBitSize(num: number): number;
/**
 * @example
 * getIntSize(10); // 2
 * getIntSize(100); // 3
 */
export declare function getIntSize(num: number): number;
/**
 * @example
 * getFloatSize(1.2); // 2
 * getFloatSize(1.23); // 3
 */
export declare function getFloatSize(num: number): number;
/**
 * @returns min <= n <= max
 *
 * @example
 * getClampedNumber(5, 0, 10); // 5
 * getClampedNumber(10, 0, 10); // 10
 */
export declare function getClampedNumber(num: number, min: number, max: number): number;
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
export declare function getLoopedNumber(num: number, min: number, max: number): number;
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
export declare function getClampedDegree(degree: number): number;
/**
 * Degree → Radian
 *
 * @example
 * toRadian(90); // 1.5708...
 * toRadian(180); // 3.1416...
 * ctx.rotate(toRadian(45)); // Rotate 45 degree in Canvas, WebGL, Three.js...
 */
export declare function toRadian(degree: number): number;
/**
 * Radian → Degree
 *
 * @example
 * toDegree(Math.PI); // 180
 * toDegree(Math.PI * 2); // 360
 */
export declare function toDegree(radian: number): number;
/**
 * @example
 * getContainedSize(100, 100, 200, 100); // [100, 100]
 */
export declare function getContainedSize(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
/**
 * @example
 * getCoveredSize(100, 100, 200, 100); // [200, 200]
 */
export declare function getCoveredSize(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
/**
 * @example
 * getAdjustedSize(175, 175, 200, 200, 100, 100); // [175, 175]
 */
export declare function getAdjustedSize(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number, minWidth: number, minHeight: number): [number, number];
/**
 * @example
 * getLogScore(100, 0); // 0
 * getLogScore(100, 25); // 0.7059613126314263
 * getLogScore(100, 50); // 0.8519443031609923
 * getLogScore(100, 75); // 0.9383792523906672
 * getLogScore(100, 100); // 1
 */
export declare function getLogScore(total: number, current: number): number;
/**
 * @example
 * getPowerScore(100, 0); // 0
 * getPowerScore(100, 25); // 0.5
 * getPowerScore(100, 50); // 0.7071067811865476
 * getPowerScore(100, 75); // 0.8660254037844387
 * getPowerScore(100, 100); // 1
 */
export declare function getPowerScore(total: number, current: number, alpha?: number): number;
/**
 * @example
 * fromKilobyte(1); // Math.pow(1024, 1)
 */
export declare function fromKilobyte(kb: number): number;
/**
 * @example
 * fromMegabyte(1); // Math.pow(1024, 2)
 */
export declare function fromMegabyte(mb: number): number;
/**
 * @example
 * fromGigabyte(1); // Math.pow(1024, 3)
 */
export declare function fromGigabyte(gb: number): number;
/**
 * @example
 * fromTerabyte(1); // Math.pow(1024, 4)
 */
export declare function fromTerabyte(tb: number): number;
/**
 * @example
 * fromPetabyte(1); // Math.pow(1024, 5)
 */
export declare function fromPetabyte(pt: number): number;
/**
 * @example
 * fromExabyte(1); // Math.pow(1024, 6)
 */
export declare function fromExabyte(eb: number): number;
/**
 * @example
 * fromZettabyte(1); // Math.pow(1024, 7)
 */
export declare function fromZettabyte(zb: number): number;
/**
 * @example
 * fromYottabyte(1); // Math.pow(1024, 8)
 */
export declare function fromYottabyte(yb: number): number;
/**
 * @example
 * toKilobyte(Math.pow(1024, 1)); // 1
 */
export declare function toKilobyte(bytes: number): number;
/**
 * @example
 * toMegabyte(Math.pow(1024, 2)); // 1
 */
export declare function toMegabyte(bytes: number): number;
/**
 * @example
 * toGigabyte(Math.pow(1024, 3)); // 1
 */
export declare function toGigabyte(bytes: number): number;
/**
 * @example
 * toTerabyte(Math.pow(1024, 4)); // 1
 */
export declare function toTerabyte(bytes: number): number;
/**
 * @example
 * toPetabyte(Math.pow(1024, 5)); // 1
 */
export declare function toPetabyte(bytes: number): number;
/**
 * @example
 * toExabyte(Math.pow(1024, 6)); // 1
 */
export declare function toExabyte(bytes: number): number;
/**
 * @example
 * toZettabyte(Math.pow(1024, 7)); // 1
 */
export declare function toZettabyte(bytes: number): number;
/**
 * @example
 * toYottabyte(Math.pow(1024, 8)); // 1
 */
export declare function toYottabyte(bytes: number): number;
/**
 * @example
 * toFileSize(1024 * 1024); // "1 MB"
 * toFileSize(1024 * 1024 * 1024); // "1 GB"
 * toFileSize(1024 * 1024 * 1024 + 1024 * 1024 * 512); // "1.5 GB"
 */
export declare function toFileSize(bytes: number): string;
//# sourceMappingURL=number.d.ts.map