/**
 * @example
 * getMaxValue([1,2,3]); // 3
 */
export declare function getMaxValue(arr: number[]): number;
/**
 * @example
 * getMinValue([1,2,3]); // 1
 */
export declare function getMinValue(arr: number[]): number;
/**
 * @example
 * getSumValue([1,2,3]); // 6
 */
export declare function getSumValue(arr: number[]): number;
/**
 * @example
 * getMeanValue([1,2,3]); // 2
 */
export declare function getMeanValue(arr: number[]): number;
/**
 * @example
 * getModeValueWithCount(["a", "a", "b"]); // { count: 2, value: "a" }
 */
export declare function getModeValueWithCount<T>(arr: T[]): {
    count: number;
    value: T | undefined;
};
/**
 * @example
 * getModeCount(["a", "a", "b"]); // 2
 */
export declare function getModeCount<T>(arr: T[]): number;
/**
 * @example
 * getModeValue(["a", "a", "b"]); // "a"
 */
export declare function getModeValue<T>(arr: T[]): T | undefined;
/**
 * @see https://lodash.com/docs/4.17.21#chunk
 *
 * @example
 * splitArray([1,2,3,4,5], 3); // [[1,2,3],[4,5]]
 */
export declare function splitArray<T>(arr: T[], size: number): T[][];
/**
 * @see https://lodash.com/docs/4.17.21#flatten
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 *
 * @example
 * joinArray([1,2,3,[4,5]]); // [1,2,3,4,5]
 */
export declare function joinArray<T>(arr: (T | T[])[], depth?: number): T[];
/**
 * Cartesian product
 *
 * @example
 * getCombinations(["a", "b", "c"], [1]); // [["a", 1],["b", 1],["c", 1]]
 * getCombinations(); // []
 */
export declare function getCombinations<T>(...arrays: T[][]): T[][];
/**
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 *
 * @example
 * shuffleArray([1, 2, 3]); // [2, 1, 3]
 */
export declare function shuffleArray<T>(arr: T[]): T[];
/**
 * @example
 * uniqueBy([1, 2, 2, 3], (item) => item); // [1, 2, 3]
 */
export declare function uniqueBy<T>(arr: T[], fn: (item: T, index: number, array: T[]) => any): T[];
/**
 * @example
 * groupBy([1, 2, 2, 3], (item) => item); // { 1: [1], 2: [2, 2], 3: [3]}
 */
export declare function groupBy<T>(arr: T[], fn: (item: T, index: number, array: T[]) => string): Record<string, T[]>;
//# sourceMappingURL=array.d.ts.map