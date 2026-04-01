/**
 * @example
 * scaleToContain(100, 100, 200, 100); // [100, 100]
 * scaleToContain(200, 100, 100, 100); // [100, 50]
 */
export function scaleToContain(
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number,
): [number, number] {
  const srcAspectRatio = srcWidth / srcHeight;
  const dstAspectRatio = dstWidth / dstHeight;

  if (srcAspectRatio < dstAspectRatio) {
    return [dstHeight * srcAspectRatio, dstHeight];
  } else {
    return [dstWidth, dstWidth / srcAspectRatio];
  }
}
