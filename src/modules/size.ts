export function getContainedSize(
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): [number, number] {
  const ar = sourceWidth / sourceHeight; // aspect ratio
  return ar < destinationWidth / destinationHeight
    ? [destinationHeight * ar, destinationHeight]
    : [destinationWidth, destinationWidth / ar];
}

export function getCoveredSize(
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): [number, number] {
  const ar = sourceWidth / sourceHeight; // aspect ratio
  return ar < destinationWidth / destinationHeight
    ? [destinationWidth, destinationWidth / ar]
    : [destinationHeight * ar, destinationHeight];
}

export function getAdjustedSize(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number
): [number, number] {
  const ar = sourceWidth / sourceHeight; // aspect ratio

  let w = sourceWidth;
  let h = sourceHeight;

  if (h > maxHeight) {
    h = maxHeight;
    w = maxHeight * ar;
  }

  if (w < minWidth) {
    w = minWidth;
    h = minWidth / ar;
  }

  if (h < minHeight) {
    h = minHeight;
    w = minHeight * ar;
  }

  return [w, h];
}
