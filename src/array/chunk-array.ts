/**
 * @example
 * chunk([1,2,3,4,5], 3); // [[1,2,3],[4,5]]
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  return arr.reduce<T[][]>((acc, curr) => {
    if (!acc[acc.length - 1] || acc[acc.length - 1].length >= size) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, []);
}
