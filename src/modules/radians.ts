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
