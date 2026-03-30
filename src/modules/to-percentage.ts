/**
 * @example
 * toPercentage(0, 100); // "0%"
 * toPercentage(50, 100); // "50%"
 * toPercentage(100, 100); // "100%"
 * toPercentage(100, 100, 2); // "100.00%"
 */
export function toPercentage(current: number, total: number = 1, digits: number = 0): string {
  return `${(total === 0 ? 0 : (current / total) * 100).toFixed(digits)}%`;
}
