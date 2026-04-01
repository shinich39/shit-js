/**
 * @example
 * mode(["a", "a", "b"]); // { count: 2, value: "a" }
 * mode(["a", "a", "b", "b", "b"]); // { count: 3, value: "b" }
 */
export function mode<T>(arr: T[]): { count: number; value: T | undefined } {
  const seen = new Map<T, number>();

  let maxValue: T | undefined;
  let maxCount: number = 0;

  for (const v of arr) {
    const c = (seen.get(v) || 0) + 1;

    seen.set(v, c);

    if (maxCount < c) {
      maxCount = c;
      maxValue = v;
    }
  }

  return { count: maxCount, value: maxValue };
}

/**
 * @returns min <= n <= max
 *
 * @example
 * clamp(5, 0, 10);  // 5
 * clamp(-1, 0, 10); // 0
 * clamp(11, 0, 10); // 10
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(num, min));
}

/**
 * @returns min <= n < max
 *
 * @example
 * wrap(5, 0, 10);  // 5
 * wrap(-1, 0, 10); // 9
 * wrap(10, 0, 10); // 0
 * wrap(11, 0, 10); // 1
 */
export function wrap(num: number, min: number, max: number): number {
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
 * lerp(0, 100, 0);   // 0
 * lerp(0, 100, 0.5); // 50
 * lerp(0, 100, 1);   // 100
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * @example
 * toRadians(0);   // 0
 * toRadians(90);  // Math.PI / 2
 * toRadians(180); // Math.PI
 * toRadians(360); // Math.PI * 2
 * ctx.rotate(toRadians(45)); // rotate 45 degree in Canvas, WebGL, Three.js...
 */
export function toRadians(degree: number): number {
  return degree * (Math.PI / 180);
}

/**
 * @example
 * fromRadians(0);           // 0
 * fromRadians(Math.PI / 2); // 90
 * fromRadians(Math.PI);     // 180
 * fromRadians(Math.PI * 2); // 360
 */
export function fromRadians(radians: number): number {
  return radians * (180 / Math.PI);
}
