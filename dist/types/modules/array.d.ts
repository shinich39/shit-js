/**
 * @example
 * const result = getMaxValue([1,2,3]); // 3
 */
export declare function getMaxValue(arr: number[]): number;
/**
 * @example
 * const result = getMinValue([1,2,3]); // 1
 */
export declare function getMinValue(arr: number[]): number;
/**
 * @example
 * const result = getSumValue([1,2,3]); // 6
 */
export declare function getSumValue(arr: number[]): number;
/**
 * @example
 * const result = getMeanValue([1,2,3]); // 2
 */
export declare function getMeanValue(arr: number[]): number;
/**
 * @example
 * const result = getModeValueWithCount(["a", "a", "b"]); // { count: 2, value: "a" }
 */
export declare function getModeValueWithCount<T>(arr: T[]): {
    count: number;
    value: T | undefined;
} | undefined;
/**
 * @example
 * const result = getModeCount(["a", "a", "b"]); // 2
 */
export declare function getModeCount<T>(arr: T[]): number;
/**
 * @example
 * const result = getModeValue(["a", "a", "b"]); // "a"
 */
export declare function getModeValue<T>(arr: T[]): T | undefined;
/**
 * @example
 * const result = getAllCombinations([1,2]); // [[1], [2], [1,2]]
 */
export declare function getAllCombinations<T>(arr: T[]): T[][];
/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 *
 * @example
 * const result = shuffleArray([1,2,3]); // [2, 1, 3]
 */
export declare function shuffleArray<T>(arr: T[]): T[];
/**
 * @example
 * const result = uniqueBy([1,2,2,3], (item) => item); // [1,2,3]
 */
export declare function uniqueBy<T>(arr: T[], func: (item: T, index: number, array: T[]) => any): T[];
/**
 * @example
 * const result = groupBy([1,2,2,3], (item) => item); // { 1: [1], 2: [2,2], 3: [3,3]}
 */
export declare function groupBy<T>(arr: T[], func: (item: T, index: number, array: T[]) => string): Record<string, T[]>;
/**
 * @example
 * const result = plotBy(["a", "b", "c"], [1]); // [["a", 1],["b", 1],["c", 1]]
 */
export declare function plotBy<T>(...args: T[][]): T[][];
//# sourceMappingURL=array.d.ts.map