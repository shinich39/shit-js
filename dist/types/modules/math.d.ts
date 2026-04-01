/**
 * @example
 * mode(["a", "a", "b"]); // { count: 2, value: "a" }
 * mode(["a", "a", "b", "b", "b"]); // { count: 3, value: "b" }
 */
export declare function mode<T>(arr: T[]): {
    count: number;
    value: T | undefined;
};
/**
 * @returns min <= n <= max
 *
 * @example
 * clamp(5, 0, 10);  // 5
 * clamp(-1, 0, 10); // 0
 * clamp(11, 0, 10); // 10
 */
export declare function clamp(num: number, min: number, max: number): number;
/**
 * @returns min <= n < max
 *
 * @example
 * wrap(5, 0, 10);  // 5
 * wrap(-1, 0, 10); // 9
 * wrap(10, 0, 10); // 0
 * wrap(11, 0, 10); // 1
 */
export declare function wrap(num: number, min: number, max: number): number;
/**
 * @example
 * lerp(0, 100, 0);   // 0
 * lerp(0, 100, 0.5); // 50
 * lerp(0, 100, 1);   // 100
 */
export declare function lerp(a: number, b: number, t: number): number;
/**
 * @example
 * toRadians(0);   // 0
 * toRadians(90);  // Math.PI / 2
 * toRadians(180); // Math.PI
 * toRadians(360); // Math.PI * 2
 * ctx.rotate(toRadians(45)); // rotate 45 degree in Canvas, WebGL, Three.js...
 */
export declare function toRadians(degree: number): number;
/**
 * @example
 * fromRadians(0);           // 0
 * fromRadians(Math.PI / 2); // 90
 * fromRadians(Math.PI);     // 180
 * fromRadians(Math.PI * 2); // 360
 */
export declare function fromRadians(radians: number): number;
//# sourceMappingURL=math.d.ts.map