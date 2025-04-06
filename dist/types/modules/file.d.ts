type FileSize = "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB";
/**
 * @returns bytes
 */
export declare function calcStringSize(str: string): number;
export declare function convertFileSize(num: number, from: FileSize, to: FileSize): number;
export declare function humanizeFileSize(num: number, format: FileSize): string;
export {};
//# sourceMappingURL=file.d.ts.map