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
//# sourceMappingURL=radians.d.ts.map