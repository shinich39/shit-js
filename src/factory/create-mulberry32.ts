/**
 * @example
 * const rng = createMulberry32(39);
 *
 * rng(10, 100); // 16.73...
 * rng(10, 100); // 77.76...
 * rng(10, 100); // 58.69...
 */
export function createMulberry32(initialSeed: number): (min: number, max: number) => number {
  let seed = initialSeed;

  const next = (): number => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return (min, max) => next() * (max - min) + min;
}
