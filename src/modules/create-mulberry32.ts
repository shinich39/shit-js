/**
 * @example
 * const rng = createMulberry32(39);
 * rng.int(10, 100); // 16
 * rng.int(10, 100); // 77
 * rng.int(10, 100); // 58
 * rng.int(10, 100); // 13
 * rng.int(10, 100); // 86
 */
export function createMulberry32(initialSeed: number): {
  /** exclusive (e.g., min <= n < max) */
  float: (min: number, max: number) => number;
  /** exclusive (e.g., min <= n < max) */
  int: (min: number, max: number) => number;
} {
  let seed = initialSeed;

  const next = (): number => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    float: (min, max) => next() * (max - min) + min,
    int: (min, max) => Math.floor(next() * (max - min) + min),
  };
}
