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

/**
 * @example
 * scaleToFit(150, 150, 200, 200, 100, 100); // [150, 150]
 * scaleToFit(300, 300, 200, 200, 100, 100); // [200, 200]
 * scaleToFit(50, 50, 200, 200, 100, 100);   // [100, 100]
 * scaleToFit(400, 200, 200, 200, 100, 100); // [200, 100]
 */
export function scaleToFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number,
): [number, number] {
  const aspectRatio = srcWidth / srcHeight;

  let w = srcWidth;
  let h = srcHeight;

  if (w > maxWidth) {
    w = maxWidth;
    h = maxWidth / aspectRatio;
  }

  if (h > maxHeight) {
    h = maxHeight;
    w = maxHeight * aspectRatio;
  }

  if (w < minWidth) {
    w = minWidth;
    h = minWidth / aspectRatio;
  }

  if (h < minHeight) {
    h = minHeight;
    w = minHeight * aspectRatio;
  }

  return [w, h];
}
