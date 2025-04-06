/**
 *
 * @param sw source width
 * @param sh source height
 * @param dw destination width
 * @param dh destination height
 */
export function getContainedSize(
  sw: number,
  sh: number,
  dw: number,
  dh: number
) {
  const ar = sw / sh; // aspect ratio
  return ar < dw / dh ? [dh * ar, dh] : [dw, dw / ar];
}
/**
 *
 * @param sw source width
 * @param sh source height
 * @param dw destination width
 * @param dh destination height
 */
export function getCoveredSize(sw: number, sh: number, dw: number, dh: number) {
  const ar = sw / sh; // aspect ratio
  return ar < dw / dh ? [dw, dw / ar] : [dh * ar, dh];
}
