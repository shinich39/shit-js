/**
 * @example
 * scaleToCover(100, 100, 200, 100); // [200, 200]
 * scaleToCover(200, 100, 100, 100); // [200, 100]
 */
export function scaleToCover(
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number,
): [number, number] {
  const srcAspectRatio = srcWidth / srcHeight;
  const dstAspectRatio = dstWidth / dstHeight;

  if (srcAspectRatio < dstAspectRatio) {
    return [dstWidth, dstWidth / srcAspectRatio];
  } else {
    return [dstHeight * srcAspectRatio, dstHeight];
  }
}
