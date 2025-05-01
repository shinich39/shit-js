export declare function getMaxValue(arr: number[]): number;
export declare function getMinValue(arr: number[]): number;
export declare function getSumValue(arr: number[]): number;
export declare function getMeanValue(arr: number[]): number;
export declare function getModeValueWithCount(arr: any[]): {
    count: undefined;
    value: undefined;
} | {
    count: number;
    value: any;
};
export declare function getModeCount(arr: any[]): number | undefined;
export declare function getModeValue(arr: any[]): any;
/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export declare function shuffleArray<T>(arr: T[]): T[];
export declare function uniqueBy<T>(arr: T[], func: (item: T, index: number, array: T[]) => any): any[];
export declare function groupBy<T>(arr: T[], func: (item: T, index: number, array: T[]) => string): Record<string, T[]>;
export declare function plotBy(...args: any[][]): number[][];
//# sourceMappingURL=array.d.ts.map