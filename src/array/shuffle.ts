/**
 * Fisher-Yates shuffle
 *
 * @example
 * shuffle([1, 2, 3]);
 * // [2, 1, 3]
 */
export function shuffle<T>(arr: T[]): T[] {
  let i = arr.length;

  while (i > 0) {
    const j = Math.floor(Math.random() * i);

    i--;

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
