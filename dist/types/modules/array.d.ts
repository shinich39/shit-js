export declare function parseNumbers(arr: number[]): {
    max: number;
    min: number;
    sum: number;
    mean: number;
    mode: number;
    modeCount: number;
};
/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export declare function shuffleArray<T>(arr: T[]): T[];
export declare function plotBy(...args: any[][]): number[][];
export declare function groupBy<T>(arr: T[], func: (arg: T) => string): Record<string, T[]>;
//# sourceMappingURL=array.d.ts.map