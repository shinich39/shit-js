/**
 * @example
 * scaleToContain(100, 100, 200, 100); // [100, 100]
 * scaleToContain(200, 100, 100, 100); // [100, 50]
 */
export declare function scaleToContain(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
/**
 * @example
 * scaleToCover(100, 100, 200, 100); // [200, 200]
 * scaleToCover(200, 100, 100, 100); // [200, 100]
 */
export declare function scaleToCover(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
/**
 * @example
 * scaleToFit(150, 150, 200, 200, 100, 100); // [150, 150]
 * scaleToFit(300, 300, 200, 200, 100, 100); // [200, 200]
 * scaleToFit(50, 50, 200, 200, 100, 100);   // [100, 100]
 * scaleToFit(400, 200, 200, 200, 100, 100); // [200, 100]
 */
export declare function scaleToFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number, minWidth: number, minHeight: number): [number, number];
//# sourceMappingURL=scale.d.ts.map